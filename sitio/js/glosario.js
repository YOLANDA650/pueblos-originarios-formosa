/* ==========================================================================
   GLOSARIO.JS
   Diccionario cultural con buscador:
   1) Filtra al instante las palabras del glosario local (sin importar tildes ni mayúsculas).
   2) Si la palabra no está, busca su significado en internet
      (diccionario + Wikipedia) y lo muestra en la misma página.
   ========================================================================== */

"use strict";

(function () {
  const input = document.getElementById("glosarioBuscar");
  if (!input) return;

  const form = document.getElementById("glosarioForm");
  const botonLimpiar = document.getElementById("glosarioLimpiar");
  const contCategorias = document.getElementById("glosarioCategorias");
  const contAbc = document.getElementById("glosarioAbc");
  const estado = document.getElementById("glosarioEstado");
  const lista = document.getElementById("glosarioLista");
  const bloqueInternet = document.getElementById("glosarioInternet");
  const textoInternet = document.getElementById("internetPalabra");
  const botonInternet = document.getElementById("internetBoton");
  const resultadoInternet = document.getElementById("internetResultado");

  const CAT_GENERAL = "Diccionario general";
  const CAT_GUARDADAS = "Guardadas de internet";
  const CLAVE_GUARDADAS = "diccionarioGuardadas";

  function nuevaEntrada(palabra, cat, definicion, pueblo, general) {
    const norm = normalizar(palabra);
    return {
      palabra: palabra,
      categoria: cat,
      definicion: definicion,
      pueblo: pueblo || null,
      general: !!general,
      norm: norm,
      raiz: raiz(norm),
      normDef: normalizar(definicion)
    };
  }

  /* 1) diccionario cultural  2) diccionario general (sin repetir palabras) */
  const ENTRADAS = GLOSARIO.map((g) => nuevaEntrada(g[0], g[1], g[2], g[3]));
  const yaEsta = new Set(ENTRADAS.map((e) => e.norm));
  (typeof DICCIONARIO !== "undefined" ? DICCIONARIO : []).forEach((d) => {
    const n = normalizar(d[0]);
    if (yaEsta.has(n)) return;
    yaEsta.add(n);
    ENTRADAS.push(nuevaEntrada(d[0], CAT_GENERAL, d[1], null, true));
  });

  /* 3) palabras buscadas en internet y guardadas en este navegador */
  function leerGuardadas() {
    try { return JSON.parse(localStorage.getItem(CLAVE_GUARDADAS)) || []; } catch (e) { return []; }
  }
  function agregarGuardada(palabra, definicion) {
    const n = normalizar(palabra);
    if (yaEsta.has(n)) return;
    yaEsta.add(n);
    ENTRADAS.push(nuevaEntrada(palabra, CAT_GUARDADAS, definicion, null, true));
    ordenar();
  }
  leerGuardadas().forEach((g) => { if (g && g.p && g.d) agregarGuardada(g.p, g.d); });

  function guardarDeInternet(palabra, definicion) {
    if (!palabra || !definicion) return;
    agregarGuardada(palabra, definicion);
    try {
      const lista = leerGuardadas().filter((g) => normalizar(g.p) !== normalizar(palabra));
      lista.push({ p: palabra, d: definicion });
      localStorage.setItem(CLAVE_GUARDADAS, JSON.stringify(lista.slice(-300)));
    } catch (e) { /* sin almacenamiento: queda solo para esta visita */ }
    if (CATEGORIAS.indexOf(CAT_GUARDADAS) < 0) { CATEGORIAS.push(CAT_GUARDADAS); armarCategorias(); }
    armarAbc();
  }

  function ordenar() { ENTRADAS.sort((a, b) => a.norm.localeCompare(b.norm, "es")); }
  ordenar();

  const CATEGORIAS = Array.from(new Set(ENTRADAS.map((e) => e.categoria)));
  let categoria = "todas";
  let letra = "";

  /* Raíz aproximada de una palabra, para encontrar formas conjugadas o en plural
     (ej.: "pescaban" → "pesc" → Pescar; "canastos" → "canast" → Canasto) */
  function raiz(texto) {
    if (texto.indexOf(" ") >= 0) return texto;
    const finales = ["amientos", "imientos", "aciones", "iciones", "amiento", "imiento", "abamos", "ieron",
      "iendo", "aban", "aron", "ando", "ados", "adas", "idos", "idas", "acion", "icion", "ales", "ares",
      "ado", "ada", "ido", "ida", "ian", "ces", "ar", "er", "ir", "an", "en", "es", "as", "os", "ia",
      "a", "o", "e", "s"];
    for (const f of finales) {
      if (texto.length - f.length >= 3 && texto.endsWith(f)) return texto.slice(0, -f.length);
    }
    return texto;
  }

  function coincideRaiz(e, raizQ) {
    return raizQ.length >= 3 && (e.raiz === raizQ || (raizQ.length >= 4 && e.raiz.startsWith(raizQ)));
  }

  /* ---------- utilidades ---------- */
  function normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")     // saca las tildes
      .replace(/[’'`´]/g, "")              // saca apóstrofes
      .replace(/\s+/g, " ")
      .trim();
  }

  function crear(etiqueta, clase, texto) {
    const n = document.createElement(etiqueta);
    if (clase) n.className = clase;
    if (texto !== undefined) n.textContent = texto;
    return n;
  }

  /* Devuelve el texto con la parte buscada resaltada (sin usar innerHTML) */
  function resaltar(texto, consulta) {
    const frag = document.createDocumentFragment();
    if (!consulta) { frag.appendChild(document.createTextNode(texto)); return frag; }
    const normTexto = normalizar(texto);
    // si normalizar cambió el largo (apóstrofes), no resaltamos para no desalinear
    if (normTexto.length !== texto.toLowerCase().length) {
      frag.appendChild(document.createTextNode(texto));
      return frag;
    }
    const i = normTexto.indexOf(consulta);
    if (i < 0) { frag.appendChild(document.createTextNode(texto)); return frag; }
    frag.appendChild(document.createTextNode(texto.slice(0, i)));
    frag.appendChild(crear("mark", "", texto.slice(i, i + consulta.length)));
    frag.appendChild(document.createTextNode(texto.slice(i + consulta.length)));
    return frag;
  }

  /* ---------- categorías y letras ---------- */
  function armarCategorias() {
    contCategorias.innerHTML = "";
    ["todas"].concat(CATEGORIAS).forEach((c) => {
      const b = crear("button", "chip" + (c === categoria ? " es-activo" : ""), c === "todas" ? "Todas" : c);
      b.type = "button";
      b.setAttribute("aria-pressed", c === categoria);
      b.addEventListener("click", () => {
        categoria = c;
        armarCategorias();
        mostrar();
      });
      contCategorias.appendChild(b);
    });
  }

  function armarAbc() {
    contAbc.innerHTML = "";
    const presentes = new Set(ENTRADAS.map((e) => e.norm.charAt(0).toUpperCase()));
    const todas = crear("button", "letra" + (letra === "" ? " es-activo" : ""), "A–Z");
    todas.type = "button";
    todas.addEventListener("click", () => { letra = ""; armarAbc(); mostrar(); });
    contAbc.appendChild(todas);
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((l) => {
      const b = crear("button", "letra" + (letra === l ? " es-activo" : ""), l);
      b.type = "button";
      b.disabled = !presentes.has(l);
      b.addEventListener("click", () => { letra = l; armarAbc(); mostrar(); });
      contAbc.appendChild(b);
    });
  }

  /* ---------- búsqueda local ---------- */
  function filtrarLocal(consulta) {
    const raizQ = raiz(consulta);
    // sin búsqueda ni filtros no se muestra ninguna palabra
    if (!consulta && !letra && categoria === "todas") return [];
    let resultados = ENTRADAS.filter((e) => {
      if (categoria !== "todas" && e.categoria !== categoria) return false;
      if (letra && e.norm.charAt(0).toUpperCase() !== letra) return false;
      if (!consulta) return true;
      return e.norm.includes(consulta) || coincideRaiz(e, raizQ) || e.normDef.includes(consulta);
    });

    if (consulta) {
      // primero la palabra exacta, después las que empiezan igual o son la misma palabra conjugada,
      // después las que la contienen y al final las que la nombran en la definición
      const puntaje = (e) => (e.norm === consulta ? -1 : e.norm.startsWith(consulta) || coincideRaiz(e, raizQ) ? 0 : e.norm.includes(consulta) ? 1 : 2);
      resultados = resultados.slice().sort((a, b) => puntaje(a) - puntaje(b) || a.norm.localeCompare(b.norm, "es"));
    }
    return resultados;
  }

  function mostrar() {
    const consulta = normalizar(input.value);
    botonLimpiar.hidden = input.value === "";
    const resultados = filtrarLocal(consulta);

    lista.innerHTML = "";

    /* Sin búsqueda (solo letra o categoría): se muestran los nombres, sin significado.
       Al tocar una palabra se busca y aparece su significado. */
    if (!consulta && resultados.length) {
      const nombres = crear("div", "glosario__nombres");
      resultados.forEach((e) => {
        const b = crear("button", "chip", e.palabra);
        b.type = "button";
        b.addEventListener("click", () => {
          input.value = e.palabra;
          mostrar();
          input.focus();
        });
        nombres.appendChild(b);
      });
      lista.appendChild(nombres);
      estado.textContent = resultados.length + (resultados.length === 1 ? " palabra" : " palabras") + ". Tocá una para ver su significado.";
      bloqueInternet.hidden = true;
      return;
    }

    const MAXIMO = 20;
    resultados.slice(0, MAXIMO).forEach((e) => {
      const tarjeta = crear("article", "termino");
      if (e.pueblo) tarjeta.style.setProperty("--c", PUEBLOS[e.pueblo].color);
      else tarjeta.style.setProperty("--c", "#8a3b12");

      const cabecera = crear("header", "termino__cabecera");
      const titulo = crear("h3");
      titulo.appendChild(resaltar(e.palabra, consulta));
      cabecera.appendChild(titulo);
      const etiquetas = crear("div", "termino__etiquetas");
      etiquetas.appendChild(crear("span", "termino__categoria", e.categoria));
      if (e.pueblo) {
        const p = crear("span", "termino__pueblo", PUEBLOS[e.pueblo].nombre);
        etiquetas.appendChild(p);
      }
      cabecera.appendChild(etiquetas);
      tarjeta.appendChild(cabecera);
      tarjeta.appendChild(crear("p", "", e.definicion));
      lista.appendChild(tarjeta);
    });

    /* mensajes de estado */
    if (!consulta && !letra && categoria === "todas") {
      estado.textContent = "Escribí una palabra para ver su significado. Hay " + ENTRADAS.length + " palabras y funciona sin internet.";
    } else if (resultados.length === 0) {
      estado.textContent = consulta
        ? "No encontramos “" + input.value.trim() + "” en el diccionario. " +
          (navigator.onLine ? "Presioná Enter para buscarla en internet." : "Probá escribirla de otra forma (en singular o sin conjugar).")
        : "No hay palabras con esos filtros.";
    } else if (consulta) {
      estado.textContent = resultados.length + (resultados.length === 1 ? " resultado" : " resultados") + " en el diccionario." +
        (resultados.length > MAXIMO ? " Te mostramos los " + MAXIMO + " más parecidos: escribí la palabra completa para encontrarla más rápido." : "");
    } else {
      estado.textContent = "Escribí una palabra para ver su significado. Hay " + ENTRADAS.length + " palabras y funciona sin internet.";
    }

    /* bloque de internet */
    const mostrarInternet = consulta.length >= 2;
    bloqueInternet.hidden = !mostrarInternet;
    if (mostrarInternet) {
      textoInternet.textContent = "“" + input.value.trim() + "”";
      if (resultadoInternet.getAttribute("data-palabra") !== consulta) {
        resultadoInternet.innerHTML = "";
        resultadoInternet.removeAttribute("data-palabra");
      }
    }
  }

  /* ---------- búsqueda en internet ---------- */
  function conTiempo(url, ms) {
    const control = new AbortController();
    const reloj = setTimeout(() => control.abort(), ms || 8000);
    return fetch(url, { signal: control.signal, headers: { Accept: "application/json" } })
      .finally(() => clearTimeout(reloj));
  }

  async function buscarDiccionario(palabra) {
    const r = await conTiempo("https://api.dictionaryapi.dev/v2/entries/es/" + encodeURIComponent(palabra));
    if (!r.ok) return null;
    const datos = await r.json();
    if (!Array.isArray(datos) || !datos.length) return null;

    const grupos = [];
    datos.forEach((entrada) => {
      (entrada.meanings || []).forEach((m) => {
        const defs = (m.definitions || []).map((d) => d.definition).filter(Boolean).slice(0, 3);
        if (defs.length) grupos.push({ tipo: m.partOfSpeech || "", defs: defs });
      });
    });
    if (!grupos.length) return null;
    return { palabra: datos[0].word || palabra, grupos: grupos.slice(0, 4) };
  }

  async function resumenWikipedia(titulo) {
    const r = await conTiempo("https://es.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(titulo) + "?redirect=true");
    if (!r.ok) return null;
    const d = await r.json();
    if (!d.extract) return null;
    return {
      titulo: d.title,
      texto: d.extract,
      descripcion: d.description || "",
      enlace: d.content_urls && d.content_urls.desktop ? d.content_urls.desktop.page : "https://es.wikipedia.org/wiki/" + encodeURIComponent(titulo),
      ambigua: d.type === "disambiguation"
    };
  }

  async function buscarWikipedia(palabra) {
    // 1) intento directo con el título
    let directo = null;
    try { directo = await resumenWikipedia(palabra); } catch (e) { /* seguimos */ }
    if (directo && !directo.ambigua) return Object.assign(directo, { exacto: true });

    // 2) búsqueda por texto: tomamos el resultado más cercano
    const url = "https://es.wikipedia.org/w/api.php?action=query&list=search&srlimit=1&format=json&origin=*&srsearch=" + encodeURIComponent(palabra);
    const r = await conTiempo(url);
    if (!r.ok) return directo;
    const d = await r.json();
    const primero = d && d.query && d.query.search && d.query.search[0];
    if (!primero) return directo;
    const resumen = await resumenWikipedia(primero.title);
    return resumen ? Object.assign(resumen, { exacto: normalizar(primero.title) === normalizar(palabra) }) : directo;
  }

  async function buscarWikcionario(palabra) {
    const url = "https://es.wiktionary.org/w/api.php?action=query&prop=extracts&explaintext=1&exsectionformat=plain&redirects=1&format=json&origin=*&titles=" + encodeURIComponent(palabra);
    const r = await conTiempo(url);
    if (!r.ok) return null;
    const d = await r.json();
    const paginas = d && d.query && d.query.pages;
    if (!paginas) return null;
    const pagina = paginas[Object.keys(paginas)[0]];
    if (!pagina || pagina.missing !== undefined || !pagina.extract) return null;
    const lineas = pagina.extract.split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 10);
    return { titulo: pagina.title, lineas: lineas };
  }

  function bloqueResultado(titulo, fuente, enlace) {
    const caja = crear("section", "internet__caja");
    const cab = crear("header");
    cab.appendChild(crear("h4", "", titulo));
    if (enlace) {
      const a = crear("a", "", fuente);
      a.href = enlace;
      a.target = "_blank";
      a.rel = "noopener";
      cab.appendChild(a);
    } else {
      cab.appendChild(crear("span", "", fuente));
    }
    caja.appendChild(cab);
    return caja;
  }

  async function buscarEnInternet() {
    const palabra = input.value.trim();
    const consulta = normalizar(palabra);
    if (consulta.length < 2) return;

    resultadoInternet.innerHTML = "";
    resultadoInternet.setAttribute("data-palabra", consulta);

    if (!navigator.onLine) {
      resultadoInternet.appendChild(crear("p", "internet__aviso", "Parece que no hay conexión a internet. Probá de nuevo cuando vuelvas a estar en línea."));
      return;
    }

    const cargando = crear("div", "internet__cargando");
    cargando.appendChild(crear("span", "rueda-carga"));
    cargando.appendChild(crear("span", "", "Buscando “" + palabra + "”…"));
    resultadoInternet.appendChild(cargando);
    botonInternet.disabled = true;

    const [dic, wiki, wikc] = await Promise.allSettled([
      buscarDiccionario(palabra.toLowerCase()),
      buscarWikipedia(palabra),
      buscarWikcionario(palabra.toLowerCase())
    ]);

    // si el usuario cambió la palabra mientras esperábamos, no mostramos resultados viejos
    if (resultadoInternet.getAttribute("data-palabra") !== consulta) { botonInternet.disabled = false; return; }

    resultadoInternet.innerHTML = "";
    botonInternet.disabled = false;
    let hubo = false;

    const d = dic.status === "fulfilled" ? dic.value : null;
    if (d) {
      hubo = true;
      const caja = bloqueResultado("Diccionario: " + d.palabra, "Fuente: Free Dictionary API (basado en Wikcionario)", "https://api.dictionaryapi.dev/");
      d.grupos.forEach((g) => {
        if (g.tipo) caja.appendChild(crear("p", "internet__tipo", g.tipo));
        const ol = crear("ol");
        g.defs.forEach((t) => ol.appendChild(crear("li", "", t)));
        caja.appendChild(ol);
      });
      resultadoInternet.appendChild(caja);
    } else {
      const wc = wikc.status === "fulfilled" ? wikc.value : null;
      if (wc) {
        hubo = true;
        const caja = bloqueResultado("Wikcionario: " + wc.titulo, "Fuente: Wikcionario", "https://es.wiktionary.org/wiki/" + encodeURIComponent(wc.titulo));
        wc.lineas.forEach((l) => caja.appendChild(crear("p", "internet__linea", l)));
        resultadoInternet.appendChild(caja);
      }
    }

    const w = wiki.status === "fulfilled" ? wiki.value : null;
    if (w) {
      hubo = true;
      const caja = bloqueResultado("Enciclopedia: " + w.titulo, "Fuente: Wikipedia", w.enlace);
      if (!w.exacto) caja.appendChild(crear("p", "internet__aviso", "Es el resultado más cercano a lo que escribiste. Fijate si es lo que buscabas."));
      if (w.descripcion) caja.appendChild(crear("p", "internet__tipo", w.descripcion));
      const texto = w.texto.length > 620 ? w.texto.slice(0, 620).replace(/\s+\S*$/, "") + "…" : w.texto;
      caja.appendChild(crear("p", "", texto));
      resultadoInternet.appendChild(caja);
    }

    /* guardar el significado para poder verlo después sin conexión */
    let paraGuardar = "";
    if (d) paraGuardar = d.grupos[0].defs.slice(0, 2).join(" / ");
    else if (w && w.exacto) paraGuardar = w.texto.length > 300 ? w.texto.slice(0, 300).replace(/\s+\S*$/, "") + "…" : w.texto;
    if (paraGuardar) {
      const nombre = palabra.charAt(0).toUpperCase() + palabra.slice(1);
      guardarDeInternet(nombre, paraGuardar);
      resultadoInternet.appendChild(crear("p", "internet__aviso", "✔ Guardamos “" + nombre + "” en el diccionario de este navegador: la próxima vez la vas a encontrar aunque no tengas internet."));
    }

    if (!hubo) {
      resultadoInternet.appendChild(
        crear("p", "internet__aviso", "No pudimos encontrar el significado de “" + palabra + "”. Puede que esté escrita de otra forma, que sea una palabra muy específica o que falle la conexión. Probá con otra escritura o sin tildes.")
      );
    }
  }

  /* ---------- eventos ---------- */
  input.addEventListener("input", mostrar);
  botonLimpiar.addEventListener("click", () => {
    input.value = "";
    resultadoInternet.innerHTML = "";
    resultadoInternet.removeAttribute("data-palabra");
    mostrar();
    input.focus();
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const consulta = normalizar(input.value);
    if (consulta.length < 2) return;
    if (filtrarLocal(consulta).length === 0) buscarEnInternet();
    else bloqueInternet.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  botonInternet.addEventListener("click", buscarEnInternet);

  armarCategorias();
  armarAbc();
  mostrar();

  /* Función global por si otra sección quiere abrir una palabra */
  window.buscarEnGlosario = function (palabra) {
    categoria = "todas"; letra = "";
    armarCategorias(); armarAbc();
    input.value = palabra;
    mostrar();
    document.getElementById("glosario").scrollIntoView({ behavior: "smooth", block: "start" });
  };
})();
