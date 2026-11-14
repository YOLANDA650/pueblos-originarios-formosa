/* ==========================================================================
   QUIZ.JS
   Preguntas de repaso:
   - En cada partida se eligen 10 preguntas al azar del banco (PREGUNTAS, en
     datos.js), tratando de no repetir las de la partida anterior.
   - Al responder aparece "¡Correcto!" o "Incorrecto" con la respuesta correcta.
   - Al final se muestra el puntaje y un repaso de las respuestas incorrectas.
   ========================================================================== */

"use strict";

(function () {
  const caja = document.getElementById("quiz-caja");
  if (!caja) return;

  const barra = document.getElementById("quizBarra");
  const contador = document.getElementById("quizContador");
  const pregunta = document.getElementById("quizPregunta");
  const opciones = document.getElementById("quizOpciones");
  const explicacion = document.getElementById("quizExplicacion");
  const siguiente = document.getElementById("quizSiguiente");
  const final = document.getElementById("quizFinal");

  const POR_PARTIDA = Math.min(10, PREGUNTAS.length);
  const CLAVE_ULTIMAS = "quizUltimas";

  let partida = [];      // las preguntas de esta partida
  let actual = 0;
  let aciertos = 0;
  let errores = [];      // para el repaso final
  let respondida = false;

  function mezclar(arreglo) {
    const a = arreglo.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* Elige 10 preguntas: primero las que no salieron en la partida anterior */
  function nuevaPartida() {
    let ultimas = [];
    try { ultimas = JSON.parse(localStorage.getItem(CLAVE_ULTIMAS)) || []; } catch (e) { /* sin memoria */ }
    const indices = PREGUNTAS.map((_, i) => i);
    const nuevas = mezclar(indices.filter((i) => ultimas.indexOf(i) < 0));
    const repetidas = mezclar(indices.filter((i) => ultimas.indexOf(i) >= 0));
    const elegidas = nuevas.concat(repetidas).slice(0, POR_PARTIDA);
    try { localStorage.setItem(CLAVE_ULTIMAS, JSON.stringify(elegidas)); } catch (e) { /* sin memoria */ }

    partida = elegidas.map((i) => PREGUNTAS[i]);
    actual = 0;
    aciertos = 0;
    errores = [];
    mostrarPregunta();
  }

  function mostrarPregunta() {
    const q = partida[actual];
    respondida = false;

    barra.style.width = (actual / partida.length) * 100 + "%";
    contador.textContent = "Pregunta " + (actual + 1) + " de " + partida.length + " · Aciertos: " + aciertos;
    pregunta.textContent = q.p;

    explicacion.hidden = true;
    siguiente.hidden = true;
    final.hidden = true;
    opciones.hidden = false;
    pregunta.hidden = false;
    opciones.innerHTML = "";

    // mezclamos las opciones pero recordamos cuál es la correcta
    const mezcladas = mezclar(q.o.map((texto, i) => ({ texto: texto, correcta: i === q.c })));
    mezcladas.forEach((op, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opcion";
      b.innerHTML = '<span class="opcion__letra">' + "ABCD"[i] + '</span><span class="opcion__texto"></span>';
      b.querySelector(".opcion__texto").textContent = op.texto;
      b._correcta = op.correcta;
      b.addEventListener("click", () => responder(b));
      opciones.appendChild(b);
    });
  }

  function marca(boton, texto, clase) {
    const m = document.createElement("span");
    m.className = "opcion__marca " + clase;
    m.textContent = texto;
    boton.appendChild(m);
  }

  function responder(boton) {
    if (respondida) return;
    respondida = true;
    const q = partida[actual];
    const correcta = boton._correcta;
    const textoCorrecto = q.o[q.c];

    Array.from(opciones.children).forEach((b) => { b.disabled = true; });

    if (correcta) {
      aciertos++;
      boton.classList.add("es-correcta");
      marca(boton, "✔ Correcto", "marca--bien");
    } else {
      boton.classList.add("es-incorrecta");
      marca(boton, "✘ Incorrecto", "marca--mal");
      Array.from(opciones.children).forEach((b) => {
        if (b._correcta) {
          b.classList.add("es-correcta");
          marca(b, "Respuesta correcta", "marca--bien");
        }
      });
      errores.push({ p: q.p, elegida: boton.querySelector(".opcion__texto").textContent, correcta: textoCorrecto });
    }
    contador.textContent = "Pregunta " + (actual + 1) + " de " + partida.length + " · Aciertos: " + aciertos;

    /* Cartel de resultado */
    explicacion.hidden = false;
    explicacion.className = "quiz__explicacion " + (correcta ? "bien" : "mal");
    explicacion.innerHTML = "";
    const titulo = document.createElement("p");
    titulo.className = "quiz__resultado";
    titulo.textContent = correcta ? "✔ ¡Correcto!" : "✘ Incorrecto";
    explicacion.appendChild(titulo);
    if (!correcta) {
      const resp = document.createElement("p");
      resp.className = "quiz__respuesta";
      resp.innerHTML = "La respuesta correcta es: <b></b>";
      resp.querySelector("b").textContent = textoCorrecto;
      explicacion.appendChild(resp);
    }
    const ex = document.createElement("p");
    ex.textContent = q.e;
    explicacion.appendChild(ex);

    siguiente.hidden = false;
    siguiente.textContent = actual === partida.length - 1 ? "Ver mi resultado" : "Siguiente pregunta";
    siguiente.focus({ preventScroll: true });
  }

  siguiente.addEventListener("click", () => {
    if (actual < partida.length - 1) {
      actual++;
      mostrarPregunta();
      pregunta.focus({ preventScroll: true });
    } else {
      mostrarFinal();
    }
  });

  function mostrarFinal() {
    barra.style.width = "100%";
    contador.textContent = "¡Terminaste!";
    pregunta.hidden = true;
    opciones.hidden = true;
    explicacion.hidden = true;
    siguiente.hidden = true;
    final.hidden = false;

    const total = partida.length;
    let mensaje;
    if (aciertos === total) mensaje = "¡Perfecto! Conocés muy bien a los pueblos originarios de Formosa.";
    else if (aciertos >= total * 0.7) mensaje = "¡Muy bien! Ya sabés bastante sobre los pueblos Qom, Wichí y Pilagá.";
    else if (aciertos >= total * 0.4) mensaje = "Vas por buen camino. Volvé a recorrer las secciones y probá de nuevo.";
    else mensaje = "Es un buen comienzo. Explorá el mapa y los pueblos, y volvé a intentarlo.";

    final.innerHTML =
      '<div class="quiz__puntaje"><strong>' + aciertos + "</strong><span>de " + total + "</span></div>" +
      '<p class="quiz__mensaje"></p>' +
      '<div class="quiz__repaso"></div>' +
      '<div class="quiz__botones"><button class="boton" id="quizReiniciar">Jugar con otras preguntas</button>' +
      '<a class="boton boton--borde-oscuro" href="#pueblos">Repasar los pueblos</a></div>' +
      '<p class="quiz__nota">Hay ' + PREGUNTAS.length + " preguntas en total: cada partida trae " + total + " distintas.</p>";
    final.querySelector(".quiz__mensaje").textContent = mensaje;

    /* Repaso de lo que salió mal */
    const repaso = final.querySelector(".quiz__repaso");
    if (errores.length) {
      const h = document.createElement("h4");
      h.textContent = "Para repasar: las que te equivocaste";
      repaso.appendChild(h);
      const ul = document.createElement("ul");
      errores.forEach((er) => {
        const li = document.createElement("li");
        li.innerHTML = "<b></b><span class=\"repaso__mal\"></span><span class=\"repaso__bien\"></span>";
        li.querySelector("b").textContent = er.p;
        li.querySelector(".repaso__mal").textContent = "✘ Respondiste: " + er.elegida;
        li.querySelector(".repaso__bien").textContent = "✔ Correcta: " + er.correcta;
        ul.appendChild(li);
      });
      repaso.appendChild(ul);
    }

    document.getElementById("quizReiniciar").addEventListener("click", () => {
      nuevaPartida();
      caja.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  nuevaPartida();
})();
