/* ==========================================================================
   MAPA.JS
   Mapa interactivo de Formosa.
   - De fondo usa el mapa del proyecto ("Provincia multiétnica y pluricultural",
     img/mapa-formosa.jpg).
   - Encima dibuja los puntos con ficha (SVG): se pueden tocar, filtrar por
     pueblo, hacer zoom y arrastrar.
   ========================================================================== */

"use strict";

(function () {
  const svg = document.getElementById("mapaSvg");
  if (!svg) return;

  const NS = "http://www.w3.org/2000/svg";
  const IMG = { src: "img/mapa-formosa.jpg", w: 837, h: 848 };
  const VB = { x: 0, y: 0, w: IMG.w, h: IMG.h };   // zona del dibujo que se muestra

  /* Ubica longitud/latitud sobre la imagen del mapa (ajuste calculado con
     tres esquinas de la provincia: noroeste, sudoeste y Clorinda). */
  function proj(lon, lat) {
    return [
      172.15 * lon - 3.365 * lat + 10686.5,
      18.10 * lon - 154.79 * lat - 2263.4
    ];
  }

  function el(nombre, attrs, padre) {
    const nodo = document.createElementNS(NS, nombre);
    for (const k in attrs) nodo.setAttribute(k, attrs[k]);
    if (padre) padre.appendChild(nodo);
    return nodo;
  }

  /* ---------- 1. Capas ---------- */
  svg.setAttribute("viewBox", [VB.x, VB.y, VB.w, VB.h].join(" "));
  const mundo = el("g", { id: "mapaMundo" }, svg);
  el("image", {
    href: IMG.src, x: 0, y: 0, width: IMG.w, height: IMG.h,
    preserveAspectRatio: "xMidYMid meet", class: "mapa-imagen"
  }, mundo);
  const capaPuntos = el("g", {}, mundo);

  /* ---------- 2. Puntos con ficha ---------- */
  const mundoPuntos = [];     // para filtrar y resaltar
  PUNTOS_MAPA.forEach((p) => {
    const [x, y] = proj(p.lon, p.lat);
    const g = el("g", {
      class: "mapa-poi", transform: "translate(" + x.toFixed(1) + " " + y.toFixed(1) + ") scale(1.45)",
      "data-pueblo": p.pueblo, "data-ficha": p.id,
      tabindex: 0, role: "button", "aria-label": p.titulo + ". Pueblo " + PUEBLOS[p.pueblo].nombre
    }, capaPuntos);
    el("circle", { r: 15, class: "mapa-poi__onda", fill: PUEBLOS[p.pueblo].color }, g);
    el("circle", { r: 10.5, class: "mapa-poi__aro" }, g);
    el("circle", { r: 7, class: "mapa-poi__centro", fill: PUEBLOS[p.pueblo].color }, g);
    mundoPuntos.push(g);
  });

  /* ---------- 3. Panel de información ---------- */
  const panelVacio = document.getElementById("panelVacio");
  const panelFicha = document.getElementById("panelFicha");
  const panelPueblo = document.getElementById("panelPueblo");
  const panelTitulo = document.getElementById("panelTitulo");
  const panelTexto = document.getElementById("panelTexto");
  const panelDato = document.getElementById("panelDato");
  const panelBoton = document.getElementById("panelVerPueblo");
  let puntoActivo = null;
  let puebloActivo = null;

  function buscarFicha(id) {
    const p = PUNTOS_MAPA.find((x) => x.id === id);
    if (p) return { pueblo: p.pueblo, titulo: p.titulo, texto: p.texto, dato: p.dato };
    return null;
  }

  function seleccionar(id) {
    const ficha = buscarFicha(id);
    if (!ficha) return;
    puebloActivo = ficha.pueblo;

    mundoPuntos.forEach((n) => n.classList.remove("es-activo"));
    mundoPuntos
      .filter((n) => n.getAttribute("data-ficha") === id)
      .forEach((n) => n.classList.add("es-activo"));
    puntoActivo = id;
    document.dispatchEvent(new CustomEvent("mapa:seleccion", { detail: id }));

    const info = PUEBLOS[ficha.pueblo];
    panelVacio.hidden = true;
    panelFicha.hidden = false;
    panelFicha.style.setProperty("--c", info.color);
    panelPueblo.textContent = info.nombre;
    panelPueblo.style.background = info.color;
    panelTitulo.textContent = ficha.titulo;
    panelTexto.textContent = ficha.texto;
    panelDato.textContent = ficha.dato;
    panelFicha.classList.remove("entra");
    void panelFicha.offsetWidth;          // reinicia la animación
    panelFicha.classList.add("entra");
  }

  panelBoton.addEventListener("click", () => {
    if (puebloActivo && window.irAPueblo) window.irAPueblo(puebloActivo);
  });

  /* ---------- 5. Mensaje flotante (tooltip) ---------- */
  const lienzo = document.getElementById("mapaLienzo");
  const tip = document.createElement("div");
  tip.className = "mapa-tip";
  tip.hidden = true;
  lienzo.appendChild(tip);

  function mostrarTip(evento, id) {
    const ficha = buscarFicha(id);
    if (!ficha) return;
    tip.innerHTML = "<b></b><span></span>";
    tip.firstChild.textContent = ficha.titulo;
    tip.lastChild.textContent = PUEBLOS[ficha.pueblo].nombre;
    tip.style.setProperty("--c", PUEBLOS[ficha.pueblo].color);
    tip.hidden = false;
    moverTip(evento);
  }
  function moverTip(evento) {
    const r = lienzo.getBoundingClientRect();
    let x = evento.clientX - r.left + 14;
    let y = evento.clientY - r.top + 14;
    const anchoTip = tip.offsetWidth;
    if (x + anchoTip > r.width - 8) x = evento.clientX - r.left - anchoTip - 14;
    tip.style.left = Math.max(6, x) + "px";
    tip.style.top = y + "px";
  }

  /* ---------- 6. Eventos de los puntos ---------- */
  let arrastro = false;

  capaPuntos.addEventListener("click", (e) => {
    if (arrastro) return;
    const objetivo = e.target.closest("[data-ficha]");
    if (objetivo) seleccionar(objetivo.getAttribute("data-ficha"));
  });
  capaPuntos.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const objetivo = e.target.closest("[data-ficha]");
    if (objetivo) {
      e.preventDefault();
      seleccionar(objetivo.getAttribute("data-ficha"));
    }
  });
  capaPuntos.addEventListener("pointermove", (e) => {
    const objetivo = e.target.closest("[data-ficha]");
    if (objetivo && !drag) mostrarTip(e, objetivo.getAttribute("data-ficha"));
    else tip.hidden = true;
  });
  capaPuntos.addEventListener("pointerleave", () => { tip.hidden = true; });

  /* ---------- 7. Filtro por pueblo ---------- */
  const filtros = document.getElementById("mapaFiltros");
  function filtrar(pueblo) {
    filtros.querySelectorAll(".filtro").forEach((b) => {
      const activo = b.getAttribute("data-pueblo") === pueblo;
      b.classList.toggle("es-activo", activo);
      b.setAttribute("aria-pressed", activo);
    });
    svg.setAttribute("data-filtro", pueblo);
    document.dispatchEvent(new CustomEvent("mapa:filtro", { detail: pueblo }));
    mundoPuntos.forEach((n) => {
      const visible = pueblo === "todos" || n.getAttribute("data-pueblo") === pueblo;
      n.classList.toggle("es-atenuado", !visible);
    });
  }
  filtros.addEventListener("click", (e) => {
    const b = e.target.closest(".filtro");
    if (b) filtrar(b.getAttribute("data-pueblo"));
  });
  filtrar("todos");

  /* ---------- 8. Zoom y arrastre ---------- */
  const vista = { x: VB.x, y: VB.y, w: VB.w, h: VB.h };
  const ZOOM_MAX = 3.2;

  function aplicarVista() {
    // que el mapa no se pueda arrastrar fuera de la pantalla
    vista.w = Math.min(VB.w, Math.max(VB.w / ZOOM_MAX, vista.w));
    vista.h = vista.w * (VB.h / VB.w);
    vista.x = Math.min(VB.x + VB.w - vista.w, Math.max(VB.x, vista.x));
    vista.y = Math.min(VB.y + VB.h - vista.h, Math.max(VB.y, vista.y));
    svg.setAttribute("viewBox", [vista.x, vista.y, vista.w, vista.h].map((n) => n.toFixed(1)).join(" "));
    lienzo.classList.toggle("es-ampliado", vista.w < VB.w - 1);
  }

  function hacerZoom(factor) {
    const cx = vista.x + vista.w / 2;
    const cy = vista.y + vista.h / 2;
    vista.w = vista.w / factor;
    vista.w = Math.min(VB.w, Math.max(VB.w / ZOOM_MAX, vista.w));
    vista.h = vista.w * (VB.h / VB.w);
    vista.x = cx - vista.w / 2;
    vista.y = cy - vista.h / 2;
    aplicarVista();
  }

  document.getElementById("zoomMas").addEventListener("click", () => hacerZoom(1.4));
  document.getElementById("zoomMenos").addEventListener("click", () => hacerZoom(1 / 1.4));
  document.getElementById("zoomReset").addEventListener("click", () => {
    vista.x = VB.x; vista.y = VB.y; vista.w = VB.w; vista.h = VB.h;
    aplicarVista();
  });

  let drag = null;
  svg.addEventListener("pointerdown", (e) => {
    if (vista.w >= VB.w - 1) return;                 // solo se arrastra si hay zoom
    drag = { x: e.clientX, y: e.clientY, vx: vista.x, vy: vista.y, movido: false };
    arrastro = false;
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const r = svg.getBoundingClientRect();
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) > 4) { drag.movido = true; arrastro = true; lienzo.classList.add("esta-arrastrando"); }
    if (!drag.movido) return;
    vista.x = drag.vx - dx * (vista.w / r.width);
    vista.y = drag.vy - dy * (vista.h / r.height);
    aplicarVista();
  });
  window.addEventListener("pointerup", () => {
    if (!drag) return;
    drag = null;
    lienzo.classList.remove("esta-arrastrando");
    setTimeout(() => { arrastro = false; }, 0);
  });

  aplicarVista();

  /* Exponer una función para que otras secciones puedan abrir un punto */
  window.mapaSeleccionar = seleccionar;
})();
