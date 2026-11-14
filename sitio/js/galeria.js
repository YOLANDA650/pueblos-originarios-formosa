/* ==========================================================================
   GALERIA.JS
   Galería de materiales con flechas:
   - Una tarjeta por material (ilustración, usos y proceso paso a paso).
   - Flechas, puntos, teclado y deslizar con el dedo.
   - Filtro por pueblo.
   Las ilustraciones son SVG dibujados con código.
   ========================================================================== */

"use strict";

(function () {
  const tarjeta = document.getElementById("galeriaTarjeta");
  if (!tarjeta) return;

  const btnPrev = document.getElementById("galeriaPrev");
  const btnNext = document.getElementById("galeriaNext");
  const contPuntos = document.getElementById("galeriaPuntos");
  const contador = document.getElementById("galeriaContador");
  const filtros = document.getElementById("galeriaFiltros");
  const caja = document.getElementById("galeria");

  contador.setAttribute("aria-live", "polite");
  tarjeta.removeAttribute("aria-live");

  let lista = MATERIALES.slice();
  let indice = 0;

  /* ---------- Ilustraciones (SVG) ---------- */
  const ILUSTRACIONES = {
    chaguar: function () {
      let hojas = "";
      for (let i = 0; i < 11; i++) {
        const ang = -80 + i * 16;
        const largo = 0.85 + ((i * 37) % 10) / 40;
        hojas +=
          '<g transform="translate(160 150) rotate(' + ang + ') scale(' + largo.toFixed(2) + ')">' +
          '<path d="M0 0C16 -28 13 -72 0 -108C-13 -72 -16 -28 0 0Z" fill="' + (i % 2 ? "#7f9f68" : "#6f8f5a") + '"/>' +
          '<path d="M0 0C16 -28 13 -72 0 -108C-13 -72 -16 -28 0 0Z" fill="none" stroke="#3f5a2f" stroke-width="2.4" stroke-dasharray="2 7"/>' +
          '<path d="M0 -6V-95" stroke="#9ab883" stroke-width="1.6"/>' +
          "</g>";
      }
      return (
        hojas +
        '<ellipse cx="160" cy="152" rx="16" ry="8" fill="#4d6a3b"/>' +
        /* madeja de fibra */
        '<g fill="none" stroke="#ead7a8" stroke-width="3" stroke-linecap="round">' +
        '<ellipse cx="62" cy="178" rx="34" ry="12"/><ellipse cx="62" cy="178" rx="30" ry="10"/>' +
        '<ellipse cx="62" cy="178" rx="26" ry="8"/><ellipse cx="62" cy="178" rx="22" ry="6"/>' +
        '</g><path d="M32 178q30 -16 60 0" fill="none" stroke="#c9ac6a" stroke-width="3"/>'
      );
    },

    palosanto: function () {
      let anillos = "";
      for (let r = 40; r > 4; r -= 7) {
        anillos += '<ellipse cx="86" cy="130" rx="' + (r * 0.55).toFixed(1) + '" ry="' + r + '" fill="none" stroke="#a9733f" stroke-width="1.6"/>';
      }
      return (
        '<path d="M86 90H196a14 40 0 0 1 0 80H86Z" fill="#8a5a2b"/>' +
        '<path d="M96 100H190M96 118H196M96 140H190M96 158H186" stroke="#744a22" stroke-width="2" opacity=".6"/>' +
        '<ellipse cx="86" cy="130" rx="22" ry="40" fill="#d6a56b"/>' + anillos +
        /* cuenco tallado */
        '<path d="M206 150h64q-4 34 -32 34t-32 -34Z" fill="#9c6a35"/>' +
        '<ellipse cx="238" cy="150" rx="32" ry="8" fill="#6d4420"/>' +
        '<ellipse cx="238" cy="150" rx="26" ry="5.5" fill="#4d2e14"/>' +
        '<path d="M214 160q8 12 22 14" stroke="#c78f55" stroke-width="2.4" fill="none" stroke-linecap="round"/>'
      );
    },

    ceramica: function () {
      return (
        '<ellipse cx="150" cy="188" rx="58" ry="9" fill="#000" opacity=".12"/>' +
        '<path d="M118 62q-34 34 -26 80q8 40 58 40t58 -40q8 -46 -26 -80Z" fill="#c4673a"/>' +
        '<path d="M118 62q-34 34 -26 80q8 40 58 40" fill="none" stroke="#e08a58" stroke-width="5" opacity=".55"/>' +
        '<ellipse cx="150" cy="62" rx="32" ry="9" fill="#a6502b"/>' +
        '<ellipse cx="150" cy="62" rx="25" ry="6" fill="#6b2f17"/>' +
        '<path d="M98 108Q150 126 202 108V128Q150 146 98 128Z" fill="#f1dcb3"/>' +
        '<path d="M104 114l9 10 9 -9 9 10 9 -9 9 10 9 -9 9 10 9 -9 9 10 9 -9 9 10 9 -9" fill="none" stroke="#8a3b12" stroke-width="3" stroke-linejoin="round" transform="translate(0 2)"/>'
      );
    },

    lana: function () {
      let urdimbre = "";
      for (let i = 0; i < 9; i++) urdimbre += '<path d="M' + (166 + i * 11) + ' 40V176" stroke="#d9c79b" stroke-width="2.4"/>';
      let trama = "";
      const colores = ["#b5482a", "#d9a441", "#2b5fae", "#b5482a", "#f1e7d0"];
      colores.forEach((c, i) => {
        trama += '<path d="M164 ' + (150 - i * 9) + "H" + (254 - (i % 2) * 6) + '" stroke="' + c + '" stroke-width="7" stroke-linecap="round"/>';
      });
      return (
        '<rect x="156" y="32" width="108" height="152" rx="6" fill="none" stroke="#7a4a22" stroke-width="7"/>' +
        urdimbre + trama +
        /* ovillos */
        '<g><circle cx="78" cy="138" r="38" fill="#e9dfc8"/>' +
        '<path d="M46 126q32 -22 64 6M42 140q36 -14 72 8M48 154q30 -2 58 -4M56 112q22 8 44 -4" fill="none" stroke="#c8b78e" stroke-width="3"/></g>' +
        '<g><circle cx="108" cy="168" r="24" fill="#b5482a"/>' +
        '<path d="M88 160q22 -10 40 4M86 172q24 -4 42 6" fill="none" stroke="#8a3320" stroke-width="2.6"/></g>'
      );
    },

    semillas: function () {
      const colores = ["#7a4a22", "#b5482a", "#2a2018", "#e9d9b5", "#d9a441", "#3f6b3a"];
      let cuentas = "";
      for (let i = 0; i <= 26; i++) {
        const t = i / 26;
        const x = 36 + 228 * t;
        const y = 54 + 112 * Math.sin(Math.PI * t);
        const r = 6.5 + ((i * 7) % 4) * 0.9;
        cuentas += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="' + colores[(i * 5) % colores.length] + '" stroke="#00000022" stroke-width="1"/>';
        cuentas += '<circle cx="' + (x - 2).toFixed(1) + '" cy="' + (y - 2.4).toFixed(1) + '" r="1.8" fill="#ffffff66"/>';
      }
      return (
        '<path d="M36 54Q150 220 264 54" fill="none" stroke="#c9ac6a" stroke-width="2"/>' + cuentas +
        '<g transform="translate(150 186)"><ellipse rx="22" ry="12" fill="#7a4a22"/><path d="M-14 0Q0 -9 14 0" stroke="#a9733f" stroke-width="2.4" fill="none"/></g>'
      );
    },

    palma: function () {
      let hojas = "";
      for (let i = 0; i < 13; i++) {
        const ang = -78 + i * 13;
        hojas +=
          '<g transform="translate(150 168) rotate(' + ang + ')">' +
          '<path d="M0 0C10 -40 8 -90 0 -122C-8 -90 -10 -40 0 0Z" fill="' + (i % 2 ? "#5d9a50" : "#4a8644") + '"/>' +
          '<path d="M0 -4V-112" stroke="#a6cf93" stroke-width="1.4"/></g>';
      }
      return (
        hojas +
        '<path d="M144 168h12l4 40h-20Z" fill="#8a5a2b"/>' +
        '<path d="M52 196Q150 176 248 196" fill="none" stroke="#c9ac6a" stroke-width="3" stroke-linecap="round" opacity=".6"/>'
      );
    },

    totora: function () {
      let tallos = "";
      for (let i = 0; i < 15; i++) {
        const x = 52 + i * 14 + ((i * 13) % 7);
        const alto = 60 + ((i * 29) % 70);
        const inclin = ((i * 17) % 11) - 5;
        tallos +=
          '<path d="M' + x + " 186Q" + (x + inclin) + " " + (186 - alto / 2) + " " + (x + inclin * 1.6) + " " + (186 - alto) + '" fill="none" stroke="' + (i % 2 ? "#6f9a4a" : "#5b8a3d") + '" stroke-width="4.4" stroke-linecap="round"/>';
        if (i % 3 === 0) {
          tallos += '<rect x="' + (x + inclin * 1.6 - 3.4).toFixed(1) + '" y="' + (186 - alto - 12) + '" width="6.8" height="22" rx="3.4" fill="#7a4a22"/>';
        }
      }
      return (
        '<rect x="20" y="168" width="260" height="44" fill="#bfe0ee" opacity=".7"/>' +
        tallos +
        '<path d="M20 172q18 -9 36 0t36 0t36 0t36 0t36 0t36 0t36 0" fill="none" stroke="#7fb0cc" stroke-width="3"/>' +
        '<path d="M20 190q18 -9 36 0t36 0t36 0t36 0t36 0t36 0t36 0" fill="none" stroke="#7fb0cc" stroke-width="3" opacity=".7"/>'
      );
    },

    carandillo: function () {
      let bandas = "";
      for (let i = 0; i < 7; i++) {
        const y = 96 + i * 12;
        bandas += '<path d="M' + (86 + i * 2.5) + " " + y + "Q150 " + (y + 12) + " " + (214 - i * 2.5) + " " + y + '" fill="none" stroke="' + (i % 2 ? "#c89b52" : "#e4c58a") + '" stroke-width="6.5"/>';
      }
      let rombos = "";
      for (let i = 0; i < 6; i++) {
        const x = 98 + i * 20;
        rombos += '<path d="M' + x + ' 138l9 -11 9 11 -9 11z" fill="#8a3b12"/>';
      }
      return (
        '<ellipse cx="150" cy="190" rx="72" ry="9" fill="#000" opacity=".12"/>' +
        '<path d="M80 86H220Q226 150 190 178Q150 192 110 178Q74 150 80 86Z" fill="#dcb775"/>' +
        bandas +
        '<path d="M92 124Q150 140 208 124" fill="none" stroke="#8a3b12" stroke-width="3"/>' + rombos +
        '<ellipse cx="150" cy="86" rx="70" ry="14" fill="#b88c4b"/>' +
        '<ellipse cx="150" cy="86" rx="62" ry="9.5" fill="#6d4a22"/>' +
        '<path d="M104 70Q150 28 196 70" fill="none" stroke="#2b5fae" stroke-width="4" stroke-linecap="round" opacity=".0"/>'
      );
    },

    algarroba: function () {
      const vainas = [
        { d: "M70 168Q120 150 176 78", c: "#e1b45a" },
        { d: "M92 186Q164 176 230 98", c: "#d9a441" },
        { d: "M60 140Q96 120 126 64", c: "#ebc673" }
      ];
      let html = '<path d="M30 52Q90 36 150 62T270 56" fill="none" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/>';
      for (let i = 0; i < 14; i++) {
        const x = 40 + i * 17;
        const y = 52 + Math.sin(i * 0.9) * 8;
        html += '<ellipse cx="' + x + '" cy="' + (y - 10) + '" rx="3.6" ry="11" fill="#5f9a47" transform="rotate(' + (i % 2 ? 22 : -22) + " " + x + " " + y + ')"/>';
        html += '<ellipse cx="' + x + '" cy="' + (y + 10) + '" rx="3.6" ry="11" fill="#4a8638" transform="rotate(' + (i % 2 ? -22 : 22) + " " + x + " " + y + ')"/>';
      }
      vainas.forEach((v) => {
        html += '<path d="' + v.d + '" fill="none" stroke="' + v.c + '" stroke-width="20" stroke-linecap="round"/>';
        html += '<path d="' + v.d + '" fill="none" stroke="#fff6" stroke-width="3" stroke-linecap="round" transform="translate(-3 -3)"/>';
        html += '<path d="' + v.d + '" fill="none" stroke="#a97a2a" stroke-width="1.6" stroke-dasharray="1 9" stroke-linecap="round"/>';
      });
      return html;
    },

    plumas: function () {
      const colores = ["#b5482a", "#d9a441", "#2f7d4f", "#2b5fae", "#5b2a10"];
      let html = "";
      colores.forEach((c, i) => {
        const ang = -48 + i * 24;
        html +=
          '<g transform="translate(150 190) rotate(' + ang + ')">' +
          '<path d="M0 0C26 -30 24 -92 0 -150C-24 -92 -26 -30 0 0Z" fill="' + c + '"/>' +
          '<path d="M0 0V-142" stroke="#ffffffaa" stroke-width="2.4"/>' +
          '<path d="M0 -30l14 -14M0 -50l17 -17M0 -72l15 -15M0 -94l11 -11M0 -30l-14 -14M0 -50l-17 -17M0 -72l-15 -15M0 -94l-11 -11" stroke="#00000030" stroke-width="1.6"/>' +
          "</g>";
      });
      return html + '<circle cx="150" cy="190" r="9" fill="#5b2a10"/>';
    },

    arpon: function () {
      return (
        '<rect x="20" y="150" width="260" height="62" fill="#bfe0ee" opacity=".75"/>' +
        '<path d="M20 152q18 -9 36 0t36 0t36 0t36 0t36 0t36 0t36 0" fill="none" stroke="#7fb0cc" stroke-width="3"/>' +
        /* pez */
        '<g transform="translate(196 178)"><ellipse rx="38" ry="14" fill="#7f95a6"/><path d="M36 0l24 -14v28z" fill="#6a8091"/>' +
        '<circle cx="-24" cy="-3" r="3" fill="#13222d"/><path d="M-10 -12q10 -8 22 0" stroke="#9fb4c4" stroke-width="3" fill="none"/></g>' +
        /* vara */
        '<path d="M30 40L190 168" stroke="#7a4a22" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M30 40L190 168" stroke="#a9733f" stroke-width="2" stroke-linecap="round" transform="translate(-1.5 -1.5)"/>' +
        /* punta de hueso */
        '<path d="M176 156l22 24 -30 -8z" fill="#f1e7d0" stroke="#bda97c" stroke-width="2" stroke-linejoin="round"/>' +
        /* cuerda */
        '<path d="M46 52q40 -26 60 8t40 6q22 -4 36 38" fill="none" stroke="#b5482a" stroke-width="3" stroke-dasharray="6 4" stroke-linecap="round"/>' +
        '<circle cx="34" cy="43" r="6" fill="#c9ac6a"/>'
      );
    },

    /* ----- materiales agregados ----- */
    algarrobo: function () {
      // mortero de tronco con su mano y granos
      let granos = "";
      for (let i = 0; i < 9; i++) {
        granos += '<ellipse cx="' + (210 + (i % 3) * 14) + '" cy="' + (186 + Math.floor(i / 3) * 6) + '" rx="6" ry="3.4" fill="#c58b3c" transform="rotate(' + (i * 23) + " " + (210 + (i % 3) * 14) + " " + (186 + Math.floor(i / 3) * 6) + ')"/>';
      }
      return (
        '<ellipse cx="120" cy="196" rx="70" ry="12" fill="#00000018"/>' +
        '<path d="M66 78h108l-10 116h-88z" fill="#7a4a22"/>' +
        '<path d="M80 92v94M98 88v104M118 88v104M138 88v104M158 92v94" stroke="#5e3716" stroke-width="2" opacity=".55"/>' +
        '<ellipse cx="120" cy="78" rx="54" ry="15" fill="#a9733f"/>' +
        '<ellipse cx="120" cy="80" rx="38" ry="9" fill="#4a2a10"/>' +
        '<path d="M120 80L196 22" stroke="#8a5a2b" stroke-width="13" stroke-linecap="round"/>' +
        '<path d="M120 80L196 22" stroke="#b07d48" stroke-width="3" stroke-linecap="round" transform="translate(-3 -3)"/>' +
        granos
      );
    },

    calabaza: function () {
      return (
        '<ellipse cx="150" cy="200" rx="110" ry="10" fill="#00000016"/>' +
        /* calabaza entera con cuello */
        '<path d="M92 196c-44 0-58-44-38-74 12-18 22-22 26-44 2-12 4-30 12-30s10 18 12 30c4 22 14 26 26 44 20 30 6 74-38 74z" fill="#d9a441"/>' +
        '<path d="M70 150q22 12 44 0M64 172q28 14 56 0" fill="none" stroke="#8a5a2b" stroke-width="2.4" stroke-dasharray="4 4"/>' +
        '<rect x="88" y="40" width="8" height="12" rx="2" fill="#7a4a22"/>' +
        /* media calabaza (cuenco) */
        '<path d="M160 150h112c0 34-26 50-56 50s-56-16-56-50z" fill="#c98f35"/>' +
        '<ellipse cx="216" cy="150" rx="56" ry="12" fill="#f3dfae"/>' +
        '<ellipse cx="216" cy="150" rx="48" ry="8" fill="#e7c98a"/>' +
        '<path d="M176 170l12 10 12-10 12 10 12-10 12 10 12-10" fill="none" stroke="#7a4a22" stroke-width="2.4"/>'
      );
    },

    vivienda: function () {
      let ramas = "";
      for (let i = 0; i < 11; i++) {
        const x = 70 + i * 16;
        ramas += '<path d="M' + x + ' 190V' + (112 - Math.abs(5 - i) * 2) + '" stroke="#7a5230" stroke-width="4" stroke-linecap="round"/>';
      }
      return (
        '<ellipse cx="150" cy="194" rx="120" ry="10" fill="#00000016"/>' +
        '<path d="M62 190h176V118H62z" fill="#b98a5a"/>' + ramas +
        '<path d="M62 150q44 -8 88 0t88 0M62 172q44 -8 88 0t88 0" fill="none" stroke="#8d6238" stroke-width="3.4"/>' +
        '<path d="M64 128h172v46H64z" fill="#a8774a" opacity=".35"/>' +
        /* techo de paja */
        '<path d="M40 122L150 50l110 72z" fill="#e2c37a"/>' +
        '<path d="M60 116L150 58M80 118L150 66M100 120L150 74M240 116L150 58M220 118L150 66M200 120L150 74" stroke="#c49a4a" stroke-width="2"/>' +
        '<path d="M40 122h220" stroke="#b58a3c" stroke-width="4" stroke-linecap="round"/>' +
        /* puerta */
        '<path d="M134 190v-40a16 16 0 0 1 32 0v40z" fill="#4a2e18"/>'
      );
    },

    chanar: function () {
      let frutos = "";
      const chanar = [[70, 96], [92, 112], [62, 128], [104, 86], [84, 140]];
      const mistol = [[200, 92], [214, 108], [228, 94], [192, 116], [236, 120], [210, 132]];
      chanar.forEach((p) => {
        frutos += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="13" fill="#e08a2c"/><circle cx="' + (p[0] - 4) + '" cy="' + (p[1] - 4) + '" r="4" fill="#ffffff55"/>';
      });
      mistol.forEach((p) => {
        frutos += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="9" fill="#8b2f1c"/><circle cx="' + (p[0] - 3) + '" cy="' + (p[1] - 3) + '" r="2.6" fill="#ffffff44"/>';
      });
      return (
        '<path d="M30 70q50 -20 100 6M170 70q50 -22 100 4" fill="none" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/>' +
        '<ellipse cx="60" cy="66" rx="16" ry="6" fill="#5f9a47"/><ellipse cx="116" cy="70" rx="16" ry="6" fill="#4a8638"/>' +
        '<ellipse cx="196" cy="64" rx="14" ry="6" fill="#5f9a47"/><ellipse cx="252" cy="68" rx="14" ry="6" fill="#4a8638"/>' +
        frutos +
        /* olla de arrope */
        '<ellipse cx="150" cy="204" rx="64" ry="8" fill="#00000018"/>' +
        '<path d="M104 160h92l-8 40h-76z" fill="#5b4a3a"/>' +
        '<ellipse cx="150" cy="160" rx="46" ry="10" fill="#7a2a14"/>' +
        '<path d="M140 150q4 -16 -4 -26M158 150q6 -14 0 -26" fill="none" stroke="#ffffffaa" stroke-width="2.4" stroke-linecap="round"/>'
      );
    },

    tintes: function () {
      const colores = [["#a2361f", 62], ["#3b2a20", 124], ["#d9a441", 186], ["#5f8a3a", 248]];
      let html = "";
      colores.forEach(([c, x], i) => {
        html +=
          /* madeja teñida */
          '<g transform="translate(' + x + ' 92)">' +
          '<ellipse rx="22" ry="40" fill="' + c + '"/>' +
          '<path d="M-14 -30q14 30 0 60M0 -38q12 38 0 76M14 -30q-10 30 0 60" fill="none" stroke="#ffffff40" stroke-width="2"/>' +
          '<rect x="-24" y="-6" width="48" height="10" rx="4" fill="#f1e7d0"/>' +
          "</g>" +
          /* cuenco de tinte */
          '<path d="M' + (x - 24) + ' 168h48c0 18-12 28-24 28s-24-10-24-28z" fill="#8a5a2b"/>' +
          '<ellipse cx="' + x + '" cy="168" rx="24" ry="6" fill="' + c + '"/>' +
          "";
      });
      return html;
    }
  };

  function ilustracion(m) {
    if (m.imagen) {
      return '<img class="material__foto" src="' + m.imagen + '" alt="' + (m.imagenAlt || m.nombre) + '">';
    }
    const dibujar = ILUSTRACIONES[m.id];
    const fondo = PUEBLOS[m.pueblos[0]].color;
    return (
      '<svg class="material__dibujo" viewBox="0 0 300 220" role="img" aria-label="Ilustración de ' + m.nombre + '">' +
      '<defs><linearGradient id="fondoMat" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + fondo + '" stop-opacity=".24"/><stop offset="1" stop-color="#f1e3c8" stop-opacity=".9"/></linearGradient></defs>' +
      '<rect width="300" height="220" rx="22" fill="url(#fondoMat)"/>' +
      (dibujar ? dibujar() : "") +
      "</svg>"
    );
  }

  /* ---------- Dibujar la tarjeta actual ---------- */
  function etiquetaPueblo(id) {
    return '<span class="etiqueta-pueblo" style="--c:' + PUEBLOS[id].color + '">' + PUEBLOS[id].nombre + "</span>";
  }

  function dibujarTarjeta(direccion) {
    const m = lista[indice];

    let usos = "";
    m.usos.forEach((u) => {
      usos += '<li><b>' + u[0] + "</b><span>" + u[1] + "</span></li>";
    });

    let pasos = "";
    m.pasos.forEach((p, i) => {
      pasos +=
        '<li class="paso" style="--i:' + i + '">' +
        '<span class="paso__num">' + (i + 1) + "</span>" +
        '<div class="paso__caja"><b>' + p[0] + "</b><span>" + p[1] + "</span></div>" +
        "</li>";
      if (i < m.pasos.length - 1) {
        pasos += '<li class="paso-flecha" aria-hidden="true" style="--i:' + i + '"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 4v15M6 13l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></li>';
      }
    });

    tarjeta.innerHTML =
      '<div class="material__izq">' +
      ilustracion(m) +
      '<div class="material__cabecera">' +
      '<div class="material__pueblos">' + m.pueblos.map(etiquetaPueblo).join("") +
      (m.ampliado ? '<span class="etiqueta-ampliado" title="Este material no estaba en el informe: es información agregada">Información ampliada</span>' : "") +
      "</div>" +
      "<h3>" + m.nombre + "</h3>" +
      '<p class="material__origen">' + m.origen + "</p>" +
      "<p>" + m.intro + "</p>" +
      "</div>" +
      "</div>" +
      '<div class="material__der">' +
      '<h4 class="material__sub">¿Qué se puede hacer?</h4>' +
      '<ul class="usos">' + usos + "</ul>" +
      '<h4 class="material__sub">Proceso, paso a paso</h4>' +
      '<ol class="pasos">' + pasos + "</ol>" +
      "</div>" +
      '<p class="material__dato"><b>Para saber más:</b> ' + m.dato + "</p>";

    tarjeta.classList.remove("entra-der", "entra-izq");
    void tarjeta.offsetWidth;
    tarjeta.classList.add(direccion === "izq" ? "entra-izq" : "entra-der");

    // puntos y contador
    contPuntos.querySelectorAll("button").forEach((b, i) => {
      b.classList.toggle("es-activo", i === indice);
      b.setAttribute("aria-selected", i === indice);
    });
    contador.textContent = "Material " + (indice + 1) + " de " + lista.length + ": " + m.nombre;
  }

  function armarPuntos() {
    contPuntos.innerHTML = "";
    lista.forEach((m, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", m.nombre);
      b.title = m.nombre;
      b.addEventListener("click", () => {
        const dir = i < indice ? "izq" : "der";
        indice = i;
        dibujarTarjeta(dir);
      });
      contPuntos.appendChild(b);
    });
  }

  function ir(delta) {
    indice = (indice + delta + lista.length) % lista.length;
    dibujarTarjeta(delta < 0 ? "izq" : "der");
  }

  btnPrev.addEventListener("click", () => ir(-1));
  btnNext.addEventListener("click", () => ir(1));

  /* Teclado: flechas izquierda y derecha cuando el foco está dentro de la galería */
  caja.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea")) return;
    if (e.key === "ArrowLeft") { ir(-1); }
    if (e.key === "ArrowRight") { ir(1); }
  });

  /* Deslizar con el dedo */
  let toqueX = null;
  tarjeta.addEventListener("touchstart", (e) => { toqueX = e.touches[0].clientX; }, { passive: true });
  tarjeta.addEventListener("touchend", (e) => {
    if (toqueX === null) return;
    const dx = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(dx) > 60) ir(dx < 0 ? 1 : -1);
    toqueX = null;
  });

  /* Filtro por pueblo */
  function filtrar(pueblo, idQueSeMantiene) {
    filtros.querySelectorAll(".filtro").forEach((b) => {
      const activo = b.getAttribute("data-pueblo") === pueblo;
      b.classList.toggle("es-activo", activo);
      b.setAttribute("aria-pressed", activo);
    });
    lista = pueblo === "todos" ? MATERIALES.slice() : MATERIALES.filter((m) => m.pueblos.includes(pueblo));
    const pos = lista.findIndex((m) => m.id === idQueSeMantiene);
    indice = pos >= 0 ? pos : 0;
    armarPuntos();
    dibujarTarjeta("der");
  }

  filtros.addEventListener("click", (e) => {
    const b = e.target.closest(".filtro");
    if (b) filtrar(b.getAttribute("data-pueblo"));
  });

  /* Función global: abre un material desde otra sección */
  window.irAMaterial = function (id) {
    filtrar("todos", id);
    document.getElementById("materiales").scrollIntoView({ behavior: "smooth", block: "start" });
  };
  document.querySelectorAll("[data-ir-material]").forEach((a) => {
    a.addEventListener("click", () => window.irAMaterial(a.getAttribute("data-ir-material")));
  });

  armarPuntos();
  dibujarTarjeta("der");
})();
