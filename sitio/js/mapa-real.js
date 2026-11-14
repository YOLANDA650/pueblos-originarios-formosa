/* ==========================================================================
   MAPA-REAL.JS
   Mapa real de Formosa (con zoom, como Google Maps) hecho con Leaflet.
   - Funciona SIN INTERNET: los límites, ríos, territorios y comunidades
     están guardados en js/mapa-real-datos.js y la librería en lib/leaflet.
   - Con internet se pueden elegir los fondos "Calles" o "Satélite" (Esri): cada parte del mapa que
     se mira queda guardada en la memoria del navegador (IndexedDB) y después
     se puede volver a ver sin conexión.
   ========================================================================== */

"use strict";

(function () {
  const caja = document.getElementById("mapaReal");
  if (!caja || typeof L === "undefined" || typeof MAPA_REAL === "undefined") return;

  const COLOR = {
    qom: PUEBLOS.qom.color,
    wichi: PUEBLOS.wichi.color,
    pilaga: PUEBLOS.pilaga.color
  };

  let mapa = null;
  const capasPorPueblo = { qom: [], wichi: [], pilaga: [] };
  const marcadoresFicha = {};

  /* ---------- Memoria de partes del mapa (IndexedDB) ---------- */
  const memoria = (function () {
    let promesa = null;
    function abrir() {
      if (!promesa) {
        promesa = new Promise((ok, mal) => {
          if (!("indexedDB" in window)) { mal(new Error("sin IndexedDB")); return; }
          try { indexedDB.deleteDatabase("mapaFormosa"); } catch (e) { /* no estaba */ }
          const pedido = indexedDB.open("mapaFormosa2", 1);
          pedido.onupgradeneeded = () => pedido.result.createObjectStore("partes");
          pedido.onsuccess = () => ok(pedido.result);
          pedido.onerror = () => mal(pedido.error);
        });
      }
      return promesa;
    }
    function operar(modo, fn) {
      return abrir().then((db) => new Promise((ok, mal) => {
        const tx = db.transaction("partes", modo);
        const pedido = fn(tx.objectStore("partes"));
        pedido.onsuccess = () => ok(pedido.result);
        pedido.onerror = () => mal(pedido.error);
      }));
    }
    return {
      leer: (clave) => operar("readonly", (s) => s.get(clave)).catch(() => null),
      guardar: (clave, blob) => operar("readwrite", (s) => s.put(blob, clave)).catch(() => null),
      contar: () => operar("readonly", (s) => s.count()).catch(() => 0)
    };
  })();

  /* Capa de calles que primero busca en la memoria y, si no está, la descarga y la guarda */
  const CapaConMemoria = L.TileLayer.extend({
    createTile: function (coords, listo) {
      const img = document.createElement("img");
      img.alt = "";
      const url = this.getTileUrl(coords);
      const clave = (this.options.memoria || "fondo") + "/" + coords.z + "/" + coords.x + "/" + coords.y;

      function mostrar(blob) {
        const dir = URL.createObjectURL(blob);
        img.onload = () => { URL.revokeObjectURL(dir); listo(null, img); };
        img.onerror = () => { URL.revokeObjectURL(dir); listo(new Error("parte dañada"), img); };
        img.src = dir;
      }
      /* Se carga como imagen común y, ya cargada, se copia a la memoria */
      function descargar() {
        img.crossOrigin = "anonymous";
        img.onload = () => {
          listo(null, img);
          try {
            const lienzo = document.createElement("canvas");
            lienzo.width = img.naturalWidth;
            lienzo.height = img.naturalHeight;
            lienzo.getContext("2d").drawImage(img, 0, 0);
            lienzo.toBlob((b) => { if (b) memoria.guardar(clave, b).then(actualizarContador); }, "image/jpeg", 0.88);
          } catch (e) { /* no se pudo copiar: se ve igual, pero no queda guardada */ }
        };
        img.onerror = () => listo(new Error("sin conexión"), img);
        img.src = url;
      }

      memoria.leer(clave).then((blob) => {
        if (blob) { mostrar(blob); return; }
        if (!navigator.onLine) { listo(new Error("sin conexión"), img); return; }
        descargar();
      });
      return img;
    }
  });

  /* ---------- utilidades ---------- */
  /* Recorta un anillo [lat, lon] para quedarse con lo que está entre dos longitudes */
  function recortarPorLongitud(anillo, lonMin, lonMax) {
    function corte(puntos, dentro, interseca) {
      const salida = [];
      for (let i = 0; i < puntos.length; i++) {
        const a = puntos[i];
        const b = puntos[(i + 1) % puntos.length];
        const da = dentro(a), db = dentro(b);
        if (da) salida.push(a);
        if (da !== db) salida.push(interseca(a, b));
      }
      return salida;
    }
    function enLon(lon) {
      return (a, b) => {
        const t = (lon - a[1]) / (b[1] - a[1]);
        return [a[0] + t * (b[0] - a[0]), lon];
      };
    }
    let r = anillo;
    if (lonMin !== undefined) r = corte(r, (p) => p[1] >= lonMin, enLon(lonMin));
    if (lonMax !== undefined && r.length) r = corte(r, (p) => p[1] <= lonMax, enLon(lonMax));
    return r;
  }

  function etiqueta(texto, lat, lon, clase) {
    return L.marker([lat, lon], {
      interactive: false,
      keyboard: false,
      icon: L.divIcon({ className: "mreal-etiqueta " + (clase || ""), html: texto, iconSize: null })
    });
  }

  function textoSeguro(t) {
    const d = document.createElement("div");
    d.textContent = t;
    return d.innerHTML;
  }

  let contador = null;
  function actualizarContador() {
    if (!contador) return;
    memoria.contar().then((n) => {
      contador.textContent = n
        ? "Guardadas en memoria: " + n + " partes del mapa (se ven sin internet)."
        : "Lo que mires con internet queda guardado para verlo sin conexión.";
    });
  }

  /* ---------- Armar el mapa (la primera vez que se muestra) ---------- */
  function crear() {
    mapa = L.map(caja, {
      zoomControl: true,
      minZoom: 5,
      maxZoom: 13,
      zoomSnap: 0.5,
      maxBounds: [[-30.5, -67], [-19, -54]],
      attributionControl: true
    });
    mapa.attributionControl.setPrefix(false);
    mapa.attributionControl.addAttribution("Límites y ríos: Natural Earth · Ubicaciones aproximadas");

    /* Fondo sin internet: países y provincias vecinas + Formosa */
    const fondoDibujo = L.layerGroup();
    L.rectangle([[-30.5, -67], [-19, -54]], { stroke: false, fillColor: "#dcebf2", fillOpacity: 1, interactive: false }).addTo(fondoDibujo);
    MAPA_REAL.vecinos.forEach((v) => {
      const relleno = v.pais === "Argentina" ? "#f1e6cf" : v.pais === "Paraguay" ? "#e7e2d6" : "#e9e4da";
      L.polygon(v.anillos, { color: "#b9a37f", weight: 1, fillColor: relleno, fillOpacity: 1, interactive: false }).addTo(fondoDibujo);
    });
    L.polygon(MAPA_REAL.formosa, { color: "#8a3b12", weight: 2.5, fillColor: "#fffaf0", fillOpacity: 1, interactive: false }).addTo(fondoDibujo);
    [
      ["SALTA", -23.9, -63.2], ["CHACO", -26.6, -60.6], ["PARAGUAY", -23.3, -59.6],
      ["BOLIVIA", -21.75, -63.4], ["CORRIENTES", -27.75, -58.3]
    ].forEach((e) => etiqueta(e[0], e[1], e[2], "mreal-etiqueta--vecino").addTo(fondoDibujo));
    fondoDibujo.addTo(mapa);

    /* Fondos de calles y satélite de Esri (necesitan internet la primera vez).
       OpenStreetMap no se usa porque bloquea los mapas abiertos como archivo
       (sin sitio web), y muestra el cartel "Access blocked". */
    const fondoCalles = new CapaConMemoria("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 13,
      memoria: "calles",
      attribution: "Calles: © Esri y sus colaboradores"
    });
    const fondoSatelite = new CapaConMemoria("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
      maxZoom: 13,
      memoria: "satelite",
      attribution: "Satélite: © Esri, Maxar, Earthstar Geographics"
    });

    /* Territorios de cada pueblo (zonas de predominio, aproximadas) */
    const territorios = L.layerGroup().addTo(mapa);
    const bordeFormosa = L.polygon(MAPA_REAL.formosa, { color: "#8a3b12", weight: 2.5, fill: false, interactive: false });
    [["wichi", undefined, ZONAS_MAPA.wichi.lonMax],
     ["pilaga", ZONAS_MAPA.pilaga.lonMin, ZONAS_MAPA.pilaga.lonMax],
     ["qom", ZONAS_MAPA.qom.lonMin, undefined]].forEach(([p, min, max]) => {
      const zonas = MAPA_REAL.formosa.map((a) => recortarPorLongitud(a, min, max)).filter((a) => a.length > 2);
      const capa = L.polygon(zonas, { stroke: false, fillColor: COLOR[p], fillOpacity: 0.22 })
        .bindTooltip("Territorio " + PUEBLOS[p].nombre + "<br><small>" + textoSeguro(PUEBLOS[p].zona) + "</small>", { sticky: true });
      capa.addTo(territorios);
      capa._pueblo = p;
      capa._tipo = "zona";
      capasPorPueblo[p].push(capa);
    });
    bordeFormosa.addTo(territorios);

    /* Ríos y bañado */
    const agua = L.layerGroup().addTo(mapa);
    MAPA_REAL.rios.forEach((r) => {
      L.polyline(r.linea, { color: "#4a90b8", weight: r.nombre === "Río Paraguay" || r.nombre === "Río Paraná" ? 3.5 : 2.6, opacity: 0.9 })
        .bindTooltip(r.nombre, { sticky: true })
        .addTo(agua);
    });
    L.polygon(elipse(-24.2, -61.15, 0.16, 0.55, -28), { color: "#4a90b8", weight: 1.2, dashArray: "4 4", fillColor: "#9cc7de", fillOpacity: 0.55 })
      .bindTooltip("Bañado La Estrella (aprox.)", { sticky: true })
      .addTo(agua);
    etiqueta("Río Pilcomayo", -23.55, -60.6, "mreal-etiqueta--agua").addTo(agua);
    etiqueta("Río Bermejo", -25.95, -60.2, "mreal-etiqueta--agua").addTo(agua);
    etiqueta("Río Paraguay", -26.55, -57.75, "mreal-etiqueta--agua").addTo(agua);

    /* Ciudades de referencia */
    const ciudades = L.layerGroup().addTo(mapa);
    [
      ["Formosa", -26.185, -58.175, true], ["Clorinda", -25.284, -57.718], ["Pirané", -25.732, -59.108],
      ["El Colorado", -26.308, -59.373], ["Las Lomitas", -24.709, -60.593], ["Ing. Juárez", -23.897, -61.853],
      ["Ibarreta", -25.214, -59.857], ["Comandante Fontana", -25.334, -59.682], ["Laguna Blanca", -25.128, -58.251],
      ["Pozo del Tigre", -24.897, -60.324], ["Laguna Yema", -24.254, -61.244], ["Asunción (Paraguay)", -25.282, -57.635, false, true]
    ].forEach(([nombre, lat, lon, grande, sinRotulo]) => {
      L.circleMarker([lat, lon], { radius: grande ? 5 : 3.5, color: "#fffaf0", weight: 1.5, fillColor: "#5b4a3a", fillOpacity: 1 })
        .bindTooltip(nombre)
        .addTo(ciudades);
      if (!sinRotulo) etiqueta(nombre, lat, lon, "mreal-etiqueta--ciudad" + (grande ? " es-grande" : "")).addTo(ciudades);
    });

    /* Comunidades (puntitos del mapa del proyecto) */
    const comunidades = L.layerGroup().addTo(mapa);
    MAPA_REAL.comunidades.forEach(([p, lat, lon]) => {
      const m = L.circleMarker([lat, lon], { radius: 4.5, color: "#fff", weight: 1, fillColor: COLOR[p], fillOpacity: 0.95 })
        .bindTooltip("Comunidad " + PUEBLOS[p].nombre + " (ubicación aproximada)");
      m.addTo(comunidades);
      m._pueblo = p;
      m._tipo = "punto";
      capasPorPueblo[p].push(m);
    });

    /* Puntos con ficha: al tocarlos se abre la información en el panel */
    const fichas = L.layerGroup().addTo(mapa);
    PUNTOS_MAPA.forEach((p) => {
      const icono = L.divIcon({
        className: "mreal-poi",
        html: "<span style=\"--c:" + COLOR[p.pueblo] + "\"></span>",
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      const m = L.marker([p.lat, p.lon], { icon: icono, title: p.titulo, riseOnHover: true })
        .bindTooltip(textoSeguro(p.titulo) + "<br><small>" + PUEBLOS[p.pueblo].nombre + "</small>", { direction: "top", offset: [0, -12] })
        .on("click", () => { if (window.mapaSeleccionar) window.mapaSeleccionar(p.id); });
      m.addTo(fichas);
      m._pueblo = p.pueblo;
      m._tipo = "ficha";
      capasPorPueblo[p.pueblo].push(m);
      marcadoresFicha[p.id] = m;
    });

    /* Selector de fondo y capas */
    L.control.layers(
      { "Dibujo (sin internet)": fondoDibujo, "Calles (se guarda)": fondoCalles, "Satélite (se guarda)": fondoSatelite },
      { "Territorios": territorios, "Comunidades": comunidades, "Ríos y bañado": agua, "Ciudades": ciudades, "Puntos con información": fichas },
      { collapsed: true, position: "topright" }
    ).addTo(mapa);

    /* Aviso de memoria */
    const Aviso = L.Control.extend({
      onAdd: function () {
        const d = L.DomUtil.create("div", "mreal-aviso");
        contador = d;
        L.DomEvent.disableClickPropagation(d);
        return d;
      }
    });
    new Aviso({ position: "bottomleft" }).addTo(mapa);
    let volviendoAlDibujo = false;
    mapa.on("baselayerchange", (e) => {
      if (volviendoAlDibujo) return;
      const conMemoria = e.layer === fondoCalles || e.layer === fondoSatelite;
      if (contador) contador.hidden = !conMemoria;
      if (conMemoria && !navigator.onLine) {
        /* Sin internet: si no hay nada guardado, se vuelve al dibujo para no dejar el mapa en blanco */
        memoria.contar().then((n) => {
          if (n > 0) {
            contador.textContent = "Sin conexión: se ven solo las partes del mapa que ya están guardadas.";
            return;
          }
          volviendoAlDibujo = true;
          mapa.removeLayer(e.layer);
          fondoDibujo.addTo(mapa);
          volviendoAlDibujo = false;
          fondoDibujo.eachLayer((l) => { if (l.bringToBack) l.bringToBack(); });
          contador.hidden = false;
          contador.textContent = "Sin conexión: este fondo necesita internet la primera vez. Se muestra el dibujo del mapa, que funciona sin internet.";
          setTimeout(() => { if (mapa.hasLayer(fondoDibujo)) contador.hidden = true; }, 7000);
        });
      } else {
        actualizarContador();
      }
    });
    contador.hidden = true;

    mapa.fitBounds(L.polygon(MAPA_REAL.formosa).getBounds(), { padding: [10, 10] });
    aplicarFiltro(filtroActual);
  }

  function elipse(lat, lon, rLat, rLon, grados) {
    const pts = [];
    const g = (grados * Math.PI) / 180;
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * 2 * Math.PI;
      const x = rLon * Math.cos(a), y = rLat * Math.sin(a);
      pts.push([lat + x * Math.sin(g) + y * Math.cos(g), lon + x * Math.cos(g) - y * Math.sin(g)]);
    }
    return pts;
  }

  /* ---------- Filtro por pueblo (lo comparte con el mapa del proyecto) ---------- */
  let filtroActual = "todos";
  function aplicarFiltro(pueblo) {
    filtroActual = pueblo;
    if (!mapa) return;
    Object.keys(capasPorPueblo).forEach((p) => {
      const visible = pueblo === "todos" || pueblo === p;
      capasPorPueblo[p].forEach((c) => {
        if (c._tipo === "zona") c.setStyle({ fillOpacity: visible ? (pueblo === p ? 0.38 : 0.22) : 0.04 });
        else if (c._tipo === "punto") c.setStyle({ opacity: visible ? 1 : 0.1, fillOpacity: visible ? 0.95 : 0.1 });
        else if (c.getElement()) c.getElement().style.opacity = visible ? 1 : 0.15;
      });
    });
  }
  document.addEventListener("mapa:filtro", (e) => aplicarFiltro(e.detail));

  /* Resaltar el punto elegido */
  document.addEventListener("mapa:seleccion", (e) => {
    Object.keys(marcadoresFicha).forEach((id) => {
      const el = marcadoresFicha[id].getElement();
      if (el) el.classList.toggle("es-activo", id === e.detail);
    });
  });

  /* ---------- Cambiar entre el mapa del proyecto y el mapa real ---------- */
  const botones = document.querySelectorAll("[data-vista-mapa]");
  const lienzo = document.getElementById("mapaLienzo");
  function verVista(vista) {
    botones.forEach((b) => {
      const activo = b.getAttribute("data-vista-mapa") === vista;
      b.classList.toggle("es-activo", activo);
      b.setAttribute("aria-pressed", activo);
    });
    lienzo.classList.toggle("ver-real", vista === "real");
    document.getElementById("mapaCaja").classList.toggle("ver-real", vista === "real");
    caja.hidden = vista !== "real";
    if (vista === "real") {
      if (!mapa) crear();
      setTimeout(() => mapa.invalidateSize(), 0);
    }
  }
  botones.forEach((b) => b.addEventListener("click", () => verVista(b.getAttribute("data-vista-mapa"))));
})();
