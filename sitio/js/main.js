/* ==========================================================================
   MAIN.JS
   Comportamientos generales de la página:
   menú, barra de progreso, animaciones al hacer scroll, contadores,
   acordeones, botón "volver arriba" y visor de fotos.
   ========================================================================== */

"use strict";

(function () {
  const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menú en el celular ---------- */
  const menuBoton = document.getElementById("menuBoton");
  const menu = document.getElementById("menuNav");

  function cerrarMenu() {
    menu.classList.remove("es-abierto");
    menuBoton.setAttribute("aria-expanded", "false");
    menuBoton.setAttribute("aria-label", "Abrir menú");
  }
  menuBoton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("es-abierto");
    menuBoton.setAttribute("aria-expanded", abierto);
    menuBoton.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) cerrarMenu(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });

  /* ---------- Barra de progreso, cabecera y botón de subir ---------- */
  const progreso = document.getElementById("progreso");
  const cabecera = document.getElementById("cabecera");
  const subir = document.getElementById("subir");

  function alScroll() {
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    const pct = alto > 0 ? (window.scrollY / alto) * 100 : 0;
    progreso.style.width = pct + "%";
    cabecera.classList.toggle("con-sombra", window.scrollY > 10);
    subir.hidden = window.scrollY < 700;
  }
  window.addEventListener("scroll", alScroll, { passive: true });
  alScroll();

  subir.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducir ? "auto" : "smooth" }));

  /* ---------- Resaltar la sección actual en el menú ---------- */
  const enlaces = Array.from(menu.querySelectorAll("a"));
  const secciones = enlaces
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    // Se recuerdan todas las partes visibles en el centro de la pantalla y se marca la más específica
    // (por ejemplo, "Galería cultural" está dentro de "Realidad sociocultural": si se ve, gana ella)
    const visibles = new Set();
    const espia = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (en.isIntersecting) visibles.add(en.target);
        else visibles.delete(en.target);
      });
      const candidatas = secciones.filter((s) => visibles.has(s));
      const actual = candidatas.find((s) => !candidatas.some((o) => o !== s && s.contains(o)));
      if (!actual) return;   // entre dos partes: queda marcada la anterior
      enlaces.forEach((a) => a.classList.toggle("es-actual", a.getAttribute("href") === "#" + actual.id));
    }, { rootMargin: "-45% 0px -50% 0px" });
    secciones.forEach((s) => espia.observe(s));
  }

  /* ---------- Aparecer al hacer scroll ---------- */
  const aparecer = document.querySelectorAll("[data-aparecer]");
  if ("IntersectionObserver" in window && !reducir) {
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("ya-aparecio");
          obs.unobserve(en.target);
        }
      });
    // threshold 0 + margen: así también aparecen los bloques muy largos (como el diccionario),
    // que nunca llegan a verse en un 12 % dentro de la pantalla
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px" });
    aparecer.forEach((n) => { n.classList.add("antes-de-aparecer"); obs.observe(n); });
  }

  /* ---------- Contadores animados ---------- */
  function formatear(n, decimales, miles) {
    let texto = n.toFixed(decimales).replace(".", ",");
    if (miles) texto = texto.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return texto;
  }

  function contar(nodo) {
    const meta = parseFloat(nodo.getAttribute("data-contar"));
    const dec = parseInt(nodo.getAttribute("data-decimales") || "0", 10);
    const miles = nodo.hasAttribute("data-miles");
    const sufijo = nodo.getAttribute("data-sufijo") || "";
    if (reducir) { nodo.textContent = formatear(meta, dec, miles) + sufijo; return; }

    const dur = 1600;
    const t0 = performance.now();
    function paso(t) {
      const k = Math.min(1, (t - t0) / dur);
      const suave = 1 - Math.pow(1 - k, 3);
      nodo.textContent = formatear(meta * suave, dec, miles) + sufijo;
      if (k < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  const contadores = document.querySelectorAll("[data-contar]");
  if ("IntersectionObserver" in window) {
    const obsC = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (en.isIntersecting) { contar(en.target); obsC.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    contadores.forEach((c) => obsC.observe(c));
  } else {
    contadores.forEach(contar);
  }

  /* ---------- Barras de comunidades ---------- */
  const barras = document.querySelectorAll(".barra");
  if ("IntersectionObserver" in window) {
    const obsB = new IntersectionObserver((entradas) => {
      entradas.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("llena"); obsB.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    barras.forEach((b) => obsB.observe(b));
  } else {
    barras.forEach((b) => b.classList.add("llena"));
  }

  /* ---------- Acordeones ---------- */
  document.querySelectorAll(".acordeon").forEach((ac) => {
    ac.addEventListener("click", (e) => {
      const boton = e.target.closest(".acordeon__item > h3 > button");
      if (!boton) return;
      const cuerpo = boton.parentElement.nextElementSibling;
      const abrir = boton.getAttribute("aria-expanded") !== "true";
      boton.setAttribute("aria-expanded", abrir);
      cuerpo.hidden = !abrir;
    });
  });

  /* ---------- Visor de fotos ---------- */
  const visor = document.getElementById("visor");
  const visorImg = document.getElementById("visorImg");
  const visorLeyenda = document.getElementById("visorLeyenda");
  const visorCerrar = document.getElementById("visorCerrar");
  let focoPrevio = null;

  function abrirVisor(boton) {
    focoPrevio = boton;
    const img = boton.querySelector("img");
    visorImg.src = boton.getAttribute("data-foto");
    visorImg.alt = img ? img.alt : "";
    visorLeyenda.textContent = boton.getAttribute("data-leyenda") || "";
    visor.hidden = false;
    document.body.classList.add("sin-scroll");
    visorCerrar.focus();
  }
  function cerrarVisor() {
    visor.hidden = true;
    visorImg.src = "";
    document.body.classList.remove("sin-scroll");
    if (focoPrevio) focoPrevio.focus();
  }
  document.querySelectorAll(".foto-boton").forEach((b) => b.addEventListener("click", () => abrirVisor(b)));
  visorCerrar.addEventListener("click", cerrarVisor);
  visor.addEventListener("click", (e) => { if (e.target === visor) cerrarVisor(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !visor.hidden) cerrarVisor(); });
})();
