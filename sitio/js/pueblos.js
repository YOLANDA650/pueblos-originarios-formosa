/* ==========================================================================
   PUEBLOS.JS
   Todo lo interactivo de la sección "Los pueblos":
   - Pestañas (Qom / Wichí / Pilagá)
   - Explorador de alimentos qom
   - Rueda de las cuatro estaciones wichí
   - Tarjetas de condiciones y calendario del Pilcomayo (pilagá)
   - Relato animado "El origen de las familias"
   ========================================================================== */

"use strict";

(function () {
  /* ---------- 1. Pestañas ---------- */
  const pestanas = Array.from(document.querySelectorAll(".pestana"));
  const paneles = Array.from(document.querySelectorAll(".panel-pueblo"));

  function activar(id, enfocar) {
    pestanas.forEach((t) => {
      const activa = t.getAttribute("data-pueblo") === id;
      t.classList.toggle("es-activa", activa);
      t.setAttribute("aria-selected", activa);
      t.tabIndex = activa ? 0 : -1;
      if (activa && enfocar) t.focus();
    });
    paneles.forEach((p) => {
      const activo = p.id === "panel-" + id;
      p.hidden = !activo;
      p.classList.toggle("es-activo", activo);
    });
  }

  pestanas.forEach((t, i) => {
    t.addEventListener("click", () => activar(t.getAttribute("data-pueblo")));
    t.addEventListener("keydown", (e) => {
      let nuevo = null;
      if (e.key === "ArrowRight") nuevo = pestanas[(i + 1) % pestanas.length];
      if (e.key === "ArrowLeft") nuevo = pestanas[(i - 1 + pestanas.length) % pestanas.length];
      if (nuevo) {
        e.preventDefault();
        activar(nuevo.getAttribute("data-pueblo"), true);
      }
    });
  });
  activar("qom");

  /* Función global: la usan el mapa y los botones del inicio */
  window.irAPueblo = function (id) {
    activar(id);
    const destino = document.getElementById("pueblos");
    destino.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  document.querySelectorAll("[data-ir-pueblo]").forEach((a) => {
    a.addEventListener("click", () => activar(a.getAttribute("data-ir-pueblo")));
  });

  /* ---------- 2. Alimentos qom ---------- */
  const ALIMENTOS = [
    {
      icono: "🎣", fuente: "Pesca",
      lista: ["Dorado", "Surubí", "Pacú", "Sábalo", "Palometa", "Bagre"],
      detalle: "Los ríos Bermejo y Pilcomayo eran su principal despensa. Pescaban con arpones, redes tejidas y trampas de ramas."
    },
    {
      icono: "🏹", fuente: "Caza mayor",
      lista: ["Pecaríes", "Carpinchos", "Tapires", "Ciervos de los pantanos"],
      detalle: "Cazaban en grupo con arcos, flechas y lanzas. La carne se compartía entre todas las familias."
    },
    {
      icono: "🐾", fuente: "Caza menor",
      lista: ["Tatúes", "Iguanas", "Vizcachas", "Comadrejas", "Cuises"],
      detalle: "Presas más accesibles para la caza individual o en pequeños grupos."
    },
    {
      icono: "🐦", fuente: "Aves",
      lista: ["Ñandúes", "Patos", "Perdices", "Charatas", "Garzas"],
      detalle: "Además de la carne, aprovechaban las plumas para adornos ceremoniales."
    },
    {
      icono: "🌿", fuente: "Frutos",
      lista: ["Algarroba", "Chañar", "Mistol", "Tuna", "Poroto del monte"],
      detalle: "Con la algarroba hacían harina, patay (una especie de pan) y aloja (bebida fermentada)."
    },
    {
      icono: "🍯", fuente: "Miel",
      lista: ["Miel silvestre de diversas especies de abejas"],
      detalle: "Identificaban las colmenas observando el vuelo de las abejas. Era un alimento muy preciado."
    },
    {
      icono: "🌱", fuente: "Otros vegetales",
      lista: ["Raíces", "Corazón de palma", "Cogollos", "Hongos"],
      detalle: "Complementaban la dieta cuando escaseaban la caza o la pesca."
    }
  ];

  const contAlimentos = document.getElementById("alimentos");
  const detAlimento = document.getElementById("alimentoDetalle");

  function mostrarAlimento(i) {
    const a = ALIMENTOS[i];
    contAlimentos.querySelectorAll("button").forEach((b, k) => {
      b.classList.toggle("es-activo", k === i);
      b.setAttribute("aria-pressed", k === i);
    });
    detAlimento.innerHTML =
      "<h4>" + a.icono + " " + a.fuente + "</h4>" +
      '<ul class="etiquetas">' + a.lista.map((x) => "<li>" + x + "</li>").join("") + "</ul>" +
      "<p>" + a.detalle + "</p>";
  }

  ALIMENTOS.forEach((a, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "alimento";
    b.innerHTML = '<span class="alimento__icono" aria-hidden="true">' + a.icono + "</span><span>" + a.fuente + "</span>";
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", () => mostrarAlimento(i));
    contAlimentos.appendChild(b);
  });
  mostrarAlimento(4);

  /* ---------- 3. Estaciones wichí ---------- */
  const ESTACIONES = [
    {
      id: "lup", nombre: "Lup", color: "#4f86b3", ini: 4, fin: 7,
      significado: "Época de frío", estacion: "Invierno", meses: "Mayo a julio",
      texto: "Es la época fría del año, en la que bajan las temperaturas del monte."
    },
    {
      id: "nawop", nombre: "Nawop", color: "#d0689a", ini: 7, fin: 9,
      significado: "Época de la flor", estacion: "Primavera", meses: "Agosto y septiembre",
      texto: "El monte florece y empieza a renovarse después del frío."
    },
    {
      id: "yachep", nombre: "Yachep", color: "#5f9e45", ini: 9, fin: 14,
      significado: "Época del cultivo", estacion: "Verano", meses: "Octubre a febrero",
      texto: "Es la estación más larga. Se relaciona con el cultivo y con las fiestas de la aloja, que celebran la maduración de la algarroba."
    },
    {
      id: "chelchep", nombre: "Chelchep", color: "#b5482a", ini: 2, fin: 4,
      significado: "Época del quebracho colorado", estacion: "Otoño", meses: "Marzo y abril",
      texto: "Lleva el nombre del quebracho colorado, un árbol muy duro y característico del Gran Chaco."
    }
  ];

  const rueda = document.getElementById("estacionesRueda");
  const detalleEst = document.getElementById("estacionesDetalle");
  const MESES = ["E", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const NOMBRES_MES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  function polar(cx, cy, r, grados) {
    const a = (grados * Math.PI) / 180;
    return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  }

  function arco(cx, cy, rExt, rInt, a1, a2) {
    const [x1, y1] = polar(cx, cy, rExt, a1);
    const [x2, y2] = polar(cx, cy, rExt, a2);
    const [x3, y3] = polar(cx, cy, rInt, a2);
    const [x4, y4] = polar(cx, cy, rInt, a1);
    const grande = a2 - a1 > 180 ? 1 : 0;
    return (
      "M" + x1.toFixed(2) + " " + y1.toFixed(2) +
      "A" + rExt + " " + rExt + " 0 " + grande + " 1 " + x2.toFixed(2) + " " + y2.toFixed(2) +
      "L" + x3.toFixed(2) + " " + y3.toFixed(2) +
      "A" + rInt + " " + rInt + " 0 " + grande + " 0 " + x4.toFixed(2) + " " + y4.toFixed(2) + "Z"
    );
  }

  (function dibujarRueda() {
    const C = 190;
    let html = '<svg viewBox="0 0 380 380" role="group" aria-label="Rueda del año wichí, de enero a diciembre">';
    ESTACIONES.forEach((e) => {
      const a1 = e.ini * 30 + 1.2;
      const a2 = e.fin * 30 - 1.2;
      html += '<path class="arco" data-id="' + e.id + '" d="' + arco(C, C, 140, 86, a1, a2) + '" fill="' + e.color + '" tabindex="0" role="button" aria-label="' + e.nombre + ", " + e.meses + '"/>';
    });
    // letras de los meses
    MESES.forEach((m, i) => {
      const [x, y] = polar(C, C, 160, i * 30 + 15);
      html += '<text class="mes" x="' + x.toFixed(1) + '" y="' + (y + 5).toFixed(1) + '" text-anchor="middle"><title>' + NOMBRES_MES[i] + "</title>" + m + "</text>";
    });
    html += '<text class="centro-titulo" x="190" y="186" text-anchor="middle" id="centroTitulo"></text>';
    html += '<text class="centro-sub" x="190" y="212" text-anchor="middle" id="centroSub"></text>';
    html += "</svg>";
    rueda.innerHTML = html;
  })();

  function mostrarEstacion(id) {
    const e = ESTACIONES.find((x) => x.id === id);
    rueda.querySelectorAll(".arco").forEach((p) => p.classList.toggle("es-activo", p.getAttribute("data-id") === id));
    document.getElementById("centroTitulo").textContent = e.nombre;
    document.getElementById("centroSub").textContent = e.estacion;
    detalleEst.style.setProperty("--c", e.color);
    detalleEst.innerHTML =
      "<h4>" + e.nombre + "</h4>" +
      '<p class="detalle-meta"><b>' + e.significado + "</b> · " + e.estacion + " · " + e.meses + "</p>" +
      "<p>" + e.texto + "</p>";
  }

  rueda.addEventListener("click", (ev) => {
    const p = ev.target.closest(".arco");
    if (p) mostrarEstacion(p.getAttribute("data-id"));
  });
  rueda.addEventListener("keydown", (ev) => {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    const p = ev.target.closest(".arco");
    if (p) { ev.preventDefault(); mostrarEstacion(p.getAttribute("data-id")); }
  });
  mostrarEstacion("lup");

  /* ---------- 4. Condiciones pilagá (tarjetas que se dan vuelta) ---------- */
  const CONDICIONES = [
    {
      n: "1º", titulo: "Agua potable",
      texto: "Lo primero era la cercanía de agua potable. Por eso una buena aguada podía pesar más que cualquier otra ventaja del lugar."
    },
    {
      n: "2º", titulo: "Pesca o caza",
      texto: "El lugar tenía que ofrecer abundancia de pesca o de caza para alimentar a la familia extensa."
    },
    {
      n: "3º", titulo: "Seguridad",
      texto: "Buscaban sitios de poca visibilidad, como las cejas de monte. Pero esa ubicación se descartaba con frecuencia si no había buenas aguadas cerca."
    }
  ];

  const contCond = document.getElementById("condiciones");
  CONDICIONES.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "condicion";
    b.setAttribute("aria-pressed", "false");
    b.innerHTML =
      '<span class="condicion__cara condicion__frente"><b>' + c.n + "</b><span>" + c.titulo + "</span><small>Tocá para leer más</small></span>" +
      '<span class="condicion__cara condicion__dorso"><b>' + c.titulo + "</b><span>" + c.texto + "</span></span>";
    b.addEventListener("click", () => {
      const vuelta = b.classList.toggle("es-vuelta");
      b.setAttribute("aria-pressed", vuelta);
    });
    contCond.appendChild(b);
  });

  /* ---------- 5. Calendario del Pilcomayo ---------- */
  const PISTAS = [
    {
      id: "pesca", nombre: "Pesca con arpón", ini: 4, fin: 7, color: "#2b5fae",
      texto: "La pesca era una actividad masculina que se hacía entre abril y junio o julio, cuando el río baja y los peces se concentran."
    },
    {
      id: "regreso", nombre: "Regreso a las orillas", ini: 4, fin: 6, color: "#3c9aa3",
      texto: "A partir de abril, los grupos del Pilcomayo volvían a las orillas del río y los del interior empezaban su traslado hacia la costa, negociando muchas veces con los ribereños su instalación en ciertos sitios de caza."
    },
    {
      id: "crecida", nombre: "Crecida del Pilcomayo", ini: 7, fin: 10, color: "#7a5bb0",
      texto: "Cuando el río crecía (de julio a septiembre) e inundaba los terrenos cercanos, se retiraban a sitios más altos, a unos días de caminata. Los pilagá de los bañados también se trasladaban al monte en busca de frutos."
    }
  ];

  const cal = document.getElementById("calendario");
  const calDet = document.getElementById("calendarioDetalle");

  (function dibujarCalendario() {
    let html = '<div class="cal__meses">';
    NOMBRES_MES.forEach((m) => { html += "<span>" + m.slice(0, 3) + "</span>"; });
    html += "</div>";
    PISTAS.forEach((p) => {
      html +=
        '<div class="cal__fila"><button type="button" class="cal__barra" data-id="' + p.id + '" ' +
        'style="grid-column:' + p.ini + " / " + p.fin + "; --c:" + p.color + '" aria-pressed="false">' +
        p.nombre + "</button></div>";
    });
    cal.innerHTML = html;
  })();

  function mostrarPista(id) {
    const p = PISTAS.find((x) => x.id === id);
    cal.querySelectorAll(".cal__barra").forEach((b) => {
      const act = b.getAttribute("data-id") === id;
      b.classList.toggle("es-activo", act);
      b.setAttribute("aria-pressed", act);
    });
    calDet.style.setProperty("--c", p.color);
    calDet.innerHTML = "<h4>" + p.nombre + "</h4><p>" + p.texto + "</p>";
  }
  cal.addEventListener("click", (e) => {
    const b = e.target.closest(".cal__barra");
    if (b) mostrarPista(b.getAttribute("data-id"));
  });
  mostrarPista("crecida");

  /* ---------- 6. Relato: el origen de las familias ---------- */
  const cielo = document.getElementById("relatoCielo");
  const botonRelato = document.getElementById("relatoBoton");

  if (cielo && botonRelato) {
    const rand = (function (a) {
      return function () {
        a |= 0; a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    })(77);

    let html = "";
    for (let i = 0; i < 55; i++) {
      const x = (rand() * 100).toFixed(1);
      const y = (rand() * 62).toFixed(1);
      const t = (rand() * 2.2 + 1).toFixed(1);
      const r = (rand() * 2 + 1).toFixed(1);
      html += '<i class="fondo-estrella" style="left:' + x + "%;top:" + y + "%;width:" + r + "px;height:" + r + "px;animation-delay:" + t + 's"></i>';
    }
    // soga y mujeres que bajan
    html += '<div class="soga"><span class="soga__alta"></span><span class="soga__baja"></span></div>';
    const posiciones = [10, 20, 30, 40, 52, 63, 74];
    posiciones.forEach((top, i) => {
      html += '<i class="mujer" data-i="' + i + '" style="top:' + top + '%"></i>';
    });
    html += '<span class="corte" aria-hidden="true">✂</span>';
    html += '<div class="suelo"></div><div class="aldea" aria-hidden="true"></div>';
    cielo.innerHTML = html;

    const CORTE = 45; // por encima de este porcentaje serán estrellas
    botonRelato.addEventListener("click", () => {
      const cortada = cielo.classList.toggle("es-cortada");
      botonRelato.textContent = cortada ? "Volver a empezar" : "Cortar la soga";
      cielo.querySelectorAll(".mujer").forEach((m) => {
        const top = parseFloat(m.style.top);
        m.classList.toggle("es-estrella", cortada && top < CORTE);
        m.classList.toggle("es-familia", cortada && top >= CORTE);
      });
    });
  }
})();
