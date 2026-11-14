/* ==========================================================================
   DATOS.JS
   Todos los datos de la página en un solo lugar: pueblos, puntos del mapa,
   materiales de la galería, diccionario cultural y preguntas del quiz.
   Si querés cambiar un texto, agregar una palabra al diccionario o sumar un
   material, lo hacés acá sin tocar el resto del código.
   ========================================================================== */

"use strict";

/* ---------- 1. PUEBLOS ---------- */
const PUEBLOS = {
  qom: {
    id: "qom",
    nombre: "Qom (Toba)",
    color: "#2f7d4f",
    zona: "Este, sur, norte, centro y oeste (mayoría en el este)",
    lengua: "Qom l’aqtac (familia guaycurú)",
    comunidades: 50,
    resumen:
      "Se autodenominan Qom, palabra de su lengua que significa “persona” o “gente”. Ocupan el segundo lugar en población y se organizaban en bandas lideradas por un Neta."
  },
  wichi: {
    id: "wichi",
    nombre: "Wichí",
    color: "#d9701c",
    zona: "Oeste de la provincia (mayor concentración)",
    lengua: "Wichí (familia mataco-mataguayo)",
    comunidades: 116,
    resumen:
      "Es el pueblo más numeroso de Formosa. Antes se lo llamaba “mataco”, un nombre externo que hoy se reemplaza por su autodenominación. Su artesanía más identitaria es el chaguar."
  },
  pilaga: {
    id: "pilaga",
    nombre: "Pilagá",
    color: "#2b5fae",
    zona: "Centro-oeste y norte",
    lengua: "Pilagá (familia guaycurú)",
    comunidades: 26,
    resumen:
      "Es el pueblo con menor población de los tres. Vivían de la pesca, la caza y la recolección, y hoy son muy reconocidos por su cestería de carandillo."
  }
};

/* ---------- 2. MAPA ---------- */
/* Contorno aproximado de la provincia [longitud, latitud].
   Es una silueta simplificada con fines didácticos (no es cartografía oficial). */
const FORMOSA_CONTORNO = [
  [-62.40, -22.50],
  [-61.90, -22.85], [-61.20, -23.25], [-60.50, -23.70], [-59.80, -24.10],
  [-59.10, -24.50], [-58.50, -24.85], [-58.30, -25.00], [-57.72, -25.28],
  [-57.75, -25.60], [-57.95, -25.95], [-58.12, -26.20], [-58.35, -26.55],
  [-58.45, -26.90],
  [-59.00, -26.65], [-59.60, -26.20], [-60.20, -25.75], [-60.90, -25.35],
  [-61.60, -24.95], [-62.35, -24.40]
];

/* Puntos principales (con ficha). Las coordenadas son aproximadas. */
const PUNTOS_MAPA = [
  {
    id: "w-oeste", pueblo: "wichi", lon: -62.15, lat: -23.65,
    titulo: "Oeste · zona de Ingeniero Juárez",
    texto: "En el oeste vive la mayor concentración de población wichí. Es una región tropical semiárida del Gran Chaco, donde el clima cambia mucho según la época del año.",
    dato: "Los wichí dividen el año en cuatro estaciones propias: Lup, Nawop, Yachep y Chelchep."
  },
  {
    id: "w-pilcomayo", pueblo: "wichi", lon: -62.05, lat: -23.15,
    titulo: "Noroeste · cuenca del Pilcomayo",
    texto: "Aquí se habla el dialecto güisnay (weenhayey), que significa “gente desconocida”. Es el que usan los wichí establecidos en la región del Pilcomayo.",
    dato: "Las dos variantes del wichí son el vejoz y el güisnay."
  },
  {
    id: "w-bermejo", pueblo: "wichi", lon: -62.05, lat: -24.35,
    titulo: "Sudoeste · cuenca del Bermejo",
    texto: "Aquí se habla el dialecto vejoz (wehwos), el de los wichí establecidos en la región del río Bermejo.",
    dato: "La organización social wichí trasciende los límites provinciales: forma una red de comunidades unidas por parentesco y matrimonio."
  },
  {
    id: "q-comleec", pueblo: "qom", lon: -61.7, lat: -23.95,
    titulo: "Barrio Comle’ec (Ing. Juárez)",
    texto: "Un grupo de unas 400 personas qom habita este barrio, en los alrededores de Ingeniero Juárez.",
    dato: "Comle’ec es una de las comunidades qom que viven lejos del este provincial."
  },
  {
    id: "q-estrella", pueblo: "qom", lon: -61.1, lat: -24.2,
    titulo: "Bañado La Estrella",
    texto: "Varias comunidades qom viven dentro de un predio comunitario de 35.000 hectáreas, cerca del bañado La Estrella, formado por los desbordes del río Pilcomayo.",
    dato: "Hoy la superficie que ocupan es mucho menor que la de los tiempos antiguos."
  },
  {
    id: "q-este", pueblo: "qom", lon: -58.6, lat: -25.6,
    titulo: "Este de la provincia",
    texto: "La mayoría de las comunidades tobas se localizan en el este provincial. Es la zona de ríos, esteros y bañados cercana al río Paraguay.",
    dato: "Tradicionalmente pescaban dorado, surubí, pacú y sábalo."
  },
  {
    id: "p-lomitas", pueblo: "pilaga", lon: -60.95, lat: -24.5,
    titulo: "Centro-oeste · zona de Las Lomitas",
    texto: "Las comunidades pilagá ocupan el centro-oeste. Para elegir dónde asentarse buscaban agua potable, pesca o caza abundante y un lugar seguro.",
    dato: "La mayoría de las mujeres pilagá practica la cestería de carandillo."
  },
  {
    id: "p-pilcomayo", pueblo: "pilaga", lon: -59.75, lat: -24.45,
    titulo: "Norte · ribera del Pilcomayo",
    texto: "El caudal del Pilcomayo marcaba los movimientos de la comunidad: cuando crecía (de julio a septiembre) se retiraban a sitios más altos.",
    dato: "La pesca con arpón era una actividad masculina entre abril y junio o julio."
  },
  {
    id: "p-centro", pueblo: "pilaga", lon: -59.9, lat: -25.2,
    titulo: "Centro · monte y bañados",
    texto: "Los pilagá de los bañados también se trasladaban al monte en busca de frutos. Al abandonar un campamento, lo quemaban.",
    dato: "Cuentan que las mujeres vivían en el cielo y eran las estrellas."
  }
];

/* Puntos de referencia (ciudades) */
const CIUDADES = [
  { nombre: "Formosa", lon: -58.22, lat: -26.17, ancla: "end" },
  { nombre: "Clorinda", lon: -57.8, lat: -25.3, ancla: "start" },
  { nombre: "Pirané", lon: -59.1, lat: -25.73, ancla: "start" },
  { nombre: "Las Lomitas", lon: -60.59, lat: -24.71, ancla: "start" },
  { nombre: "Ing. Juárez", lon: -61.85, lat: -23.8, ancla: "start", dy: -12 }
];

/* Zonas aproximadas de predominio (se dibujan como manchas suaves) */
const ZONAS_MAPA = {
  wichi: { lonMax: -61.0 },
  pilaga: { lonMin: -61.0, lonMax: -59.5 },
  qom: { lonMin: -59.5 }
};

/* ---------- 3. MATERIALES DE LA GALERÍA ---------- */
const MATERIALES = [
  {
    id: "chaguar",
    nombre: "Chaguar y caraguatá",
    pueblos: ["wichi", "pilaga"],
    origen: "Bromelias espinosas del monte chaqueño (el chaguar es Bromelia hieronymi)",
    intro: "El chaguar es la fibra que más identifica a la cultura wichí. Sus hojas largas y espinosas se transforman en hilo y, con el hilo, en bolsos, redes y tejidos.",
    usos: [
      ["Yica", "El bolso típico wichí, tejido con fibra de chaguar."],
      ["Bolsas y redes", "Objetos de uso cotidiano para llevar y guardar cosas."],
      ["Carteras y paños", "Hoy también se tejen piezas para vender en ferias."]
    ],
    pasos: [
      ["Buscar en el monte", "Se camina hasta los chaguarales y se eligen las hojas. Es un trabajo duro porque las hojas tienen espinas."],
      ["Quitar espinas y machacar", "Se sacan las espinas y se golpean las hojas para separar la fibra de la pulpa."],
      ["Lavar y secar", "La fibra limpia se lava y se deja secar al sol."],
      ["Hilar", "Con las fibras se arma un hilo largo y resistente, a mano."],
      ["Teñir con plantas", "Se colorea con tintes naturales que se obtienen de plantas y cortezas del monte."],
      ["Tejer la yica", "Se enlaza el hilo con una aguja, punto por punto, hasta formar la pieza."]
    ],
    dato: "En lengua wichí, “hilu wet” significa “la casa de la yica”. Hoy el chaguar escasea en algunas zonas, por eso hay proyectos para replantarlo."
  },
  {
    id: "palosanto",
    nombre: "Palo santo",
    pueblos: ["wichi"],
    origen: "Árbol del monte chaqueño de madera muy dura y de aroma intenso",
    intro: "El palo santo da una madera dura y resistente, ideal para tallar. En Formosa se usa en artesanías de madera y su cuidado preocupa a las comunidades.",
    usos: [
      ["Figuras talladas", "Animales del monte y otras figuras."],
      ["Utensilios", "Cuencos, morteros, cucharas y otros objetos de uso diario."],
      ["Adornos", "Piezas decorativas para llevar de recuerdo."]
    ],
    pasos: [
      ["Elegir la madera", "Se selecciona un tronco o una rama del tamaño y la forma adecuados."],
      ["Desbastar", "Con herramientas de mano se saca el exceso y se marca la forma general."],
      ["Tallar los detalles", "Se trabajan con cuidado las formas finales, como patas, cabeza o borde."],
      ["Lijar y pulir", "Se alisa la superficie para que quede suave."],
      ["Terminar", "Se pule o se da una terminación para realzar el color de la madera."]
    ],
    dato: "Es una madera muy buscada, por eso su tala descontrolada es un problema y algunas comunidades trabajan para proteger los ejemplares que quedan."
  },
  {
    id: "ceramica",
    nombre: "Cerámica y arcilla",
    pueblos: ["wichi"],
    origen: "Arcilla que se encuentra en el propio territorio",
    intro: "Con arcilla del lugar se modelan vasijas y figuras. Es una de las artesanías que trabajan los wichí, junto con las fibras y las semillas.",
    usos: [
      ["Vasijas y ollas", "Para guardar agua o cocinar."],
      ["Cuencos", "Para servir alimentos."],
      ["Figuras", "Piezas pequeñas decorativas."]
    ],
    pasos: [
      ["Buscar la arcilla", "Se recoge en lugares donde la tierra es fina y pegajosa."],
      ["Limpiar y amasar", "Se sacan piedritas y raíces y se amasa con agua hasta que quede pareja."],
      ["Modelar a mano", "Se forman tiras y se las va enrollando para levantar las paredes de la pieza."],
      ["Alisar y decorar", "Se alisa con las manos y se pueden marcar dibujos."],
      ["Secar y cocer", "Primero se seca a la sombra y después se cuece al fuego para que se endurezca."]
    ],
    dato: "Las artesanías de Formosa se hacen con materiales naturales de la zona: arcilla, semillas, plumas, madera y fibras."
  },
  {
    id: "lana",
    nombre: "Lana de oveja",
    pueblos: ["qom", "wichi", "pilaga"],
    origen: "Vellón de oveja, hilado y tejido a mano",
    intro: "Los tres pueblos tejen con lana. Los qom la trabajan en telar y pretelar y los pilagá también la combinan con sus fibras vegetales.",
    usos: [
      ["Mantas y fajas", "Tejidos de abrigo y de uso diario."],
      ["Bolsos", "Piezas tejidas en telar."],
      ["Tejidos decorativos", "Con diseños y colores propios."]
    ],
    pasos: [
      ["Esquilar y lavar", "Se corta la lana de la oveja y se lava para sacar la suciedad."],
      ["Peinar", "Se desenreda y se ordena la lana para poder hilarla."],
      ["Hilar", "Se estira y se retuerce a mano hasta formar un hilo."],
      ["Teñir", "Los colores salen de plantas del monte, que se recolectan, se secan y se preparan como tinte."],
      ["Armar el telar", "Se tienden los hilos largos de la base, llamados urdimbre."],
      ["Tejer", "Se cruza el hilo de trama una y otra vez hasta formar el tejido."]
    ],
    dato: "Preparar un tinte natural involucra a toda la familia y lleva tiempo: hay que entrar al monte, cosechar, secar y conservar las plantas."
  },
  {
    id: "semillas",
    nombre: "Semillas",
    pueblos: ["wichi"],
    origen: "Semillas de plantas y árboles del monte",
    intro: "Las semillas del monte, con sus distintos colores, tamaños y formas, se convierten en collares, pulseras y adornos.",
    usos: [
      ["Collares y pulseras", "Combinando colores y tamaños."],
      ["Adornos", "Piezas para el cuerpo y para la casa."],
      ["Decoración de artesanías", "Detalles sobre otras piezas."]
    ],
    pasos: [
      ["Recolectar", "Se juntan semillas del monte en la época en que maduran."],
      ["Seleccionar", "Se separan por color, tamaño y forma."],
      ["Limpiar y secar", "Se limpian y se dejan secar al sol."],
      ["Perforar", "Se hace un pequeño agujero para poder pasar el hilo."],
      ["Ensartar", "Se arma el diseño uniendo las semillas en un hilo."]
    ],
    dato: "Cada diseño aprovecha los colores naturales de las semillas, sin necesidad de pintarlas."
  },
  {
    id: "palma",
    nombre: "Palma",
    pueblos: ["qom"],
    origen: "Palma del monte; en qom, la palma que se teje se llama lagaxadai",
    intro: "Con las hojas de la palma, las mujeres qom tejen canastos y otros objetos. Su cestería es una de las artesanías más reconocidas del pueblo.",
    usos: [
      ["Canastos y cestos", "Para guardar y transportar."],
      ["Sombreros", "Tejidos con hoja de palma."],
      ["Objetos decorativos", "Para vender en ferias y muestras."]
    ],
    pasos: [
      ["Ir al monte temprano", "A veces la palma queda lejos, por eso se sale muy de mañana."],
      ["Cortar solo algunas hojas", "Se dejan otras para que la planta siga creciendo, porque la palma no se cultiva."],
      ["Desfibrar", "Se separan las fibras de la hoja."],
      ["Secar al sol", "La fibra se deja secar hasta que quede firme y clara."],
      ["Tejer", "Se entrelaza la fibra con las manos, vuelta tras vuelta, dando forma al cesto."]
    ],
    dato: "Cuidar la planta es parte del oficio: se toma solo lo necesario, igual que “tomaban lo justo y seguían camino”."
  },
  {
    id: "totora",
    nombre: "Totora",
    pueblos: ["qom"],
    origen: "Planta acuática que crece en lagunas y esteros",
    intro: "La totora crece en ambientes que se inundan, como lagunas y esteros. Sus tallos largos y flexibles se usan para trenzar y tejer.",
    usos: [
      ["Esteras", "Para sentarse o dormir."],
      ["Cestos", "Trenzados con tallos secos."],
      ["Otros trenzados", "Objetos de uso cotidiano."]
    ],
    pasos: [
      ["Cortar en la laguna", "Se cosechan los tallos largos en lagunas y esteros."],
      ["Secar al sol", "Se dejan secar hasta que estén bien firmes."],
      ["Humedecer", "Antes de trabajar se mojan un poco para que se ablanden."],
      ["Trenzar y tejer", "Se entrelazan los tallos para formar esteras o cestos."]
    ],
    dato: "Es otro ejemplo de cómo se aprovecha lo que ofrece cada ambiente: el monte, el río y el bañado."
  },
  {
    id: "carandillo",
    nombre: "Carandillo",
    pueblos: ["pilaga"],
    origen: "Palmera de hojas duras (Trithrinax); en pilagá, qatalaguá",
    intro: "El carandillo es la fibra con la que las mujeres pilagá tejen su cestería, que se llama noonek en su lengua. Es la artesanía pilagá que más se comercializa.",
    usos: [
      ["Canastos", "Piezas de distintos tamaños y formas."],
      ["Individuales y portavasos", "Objetos de mesa."],
      ["Objetos de decoración", "Como marcos y cestos decorativos."]
    ],
    pasos: [
      ["Cosechar", "Las mujeres reconocen y eligen las hojas largas y verdosas."],
      ["Desfibrar", "Se separan las fibras de la hoja."],
      ["Secar al sol", "El secado lleva varias semanas con buen sol."],
      ["Teñir (opcional)", "Se agregan colores con tintes de plantas del monte."],
      ["Tejer", "Se arma el canasto a mano, vuelta tras vuelta, hasta lograr la forma."]
    ],
    dato: "Es un trabajo de mujeres: en su mayoría, las pilagá practican la cestería y los saberes pasan de generación en generación."
  },
  {
    id: "algarroba",
    nombre: "Algarroba",
    pueblos: ["qom", "wichi"],
    origen: "Fruto del algarrobo, árbol del monte",
    intro: "La algarroba merecía un lugar especial: era un alimento central en la dieta. Con ella se hacía harina, pan y una bebida fermentada para las celebraciones.",
    usos: [
      ["Harina", "Se muele y se usa para cocinar."],
      ["Patay", "Una especie de pan que se cocina con la harina."],
      ["Aloja", "Bebida fermentada que se usaba en celebraciones y rituales."]
    ],
    pasos: [
      ["Recolectar las vainas", "Se juntan las vainas maduras del algarrobo."],
      ["Secar al sol", "Se dejan secar para poder molerlas."],
      ["Moler en mortero", "Se machacan en morteros de madera."],
      ["Tamizar", "Se separa la harina fina de los restos."],
      ["Preparar", "Con la harina se amasa y se cocina el patay; con agua y fermentación se obtiene la aloja."]
    ],
    dato: "Entre los wichí, las fiestas de la aloja celebraban la maduración de la algarroba. La estación del cultivo se llama Yachep."
  },
  {
    id: "miel",
    nombre: "Miel silvestre",
    pueblos: ["qom", "pilaga"],
    origen: "Miel de abejas silvestres del monte",
    imagen: "img/miel.jpg",
    imagenAlt: "Panales de miel con abejas en actividad",
    intro: "La miel silvestre era un alimento muy preciado. Los hombres la extraían del monte, identificando las colmenas al observar el vuelo de las abejas.",
    usos: [
      ["Alimento", "Un alimento dulce y muy valorado."],
      ["Endulzante", "Para endulzar bebidas y comidas."]
    ],
    pasos: [
      ["Observar el vuelo", "Se mira hacia dónde vuelan las abejas para ubicar su colmena."],
      ["Encontrar la colmena", "Se sigue su rastro hasta el árbol o el hueco donde viven."],
      ["Extraer los panales", "Se sacan con cuidado los panales con miel."],
      ["Colar y guardar", "Se separa la miel de la cera y se conserva o se comparte."]
    ],
    dato: "Foto: Danika Perkinson en Unsplash. Aprender a leer el monte era parte de la educación de los jóvenes."
  },
  {
    id: "plumas",
    nombre: "Plumas",
    pueblos: ["qom"],
    origen: "Plumas de aves del monte y los bañados",
    intro: "Los ñandúes, patos, perdices, charatas y garzas no solo daban alimento: sus plumas se aprovechaban para adornos ceremoniales.",
    usos: [
      ["Adornos ceremoniales", "Para celebraciones y rituales."],
      ["Tocados", "Piezas que se usan en la cabeza o el cuerpo."]
    ],
    pasos: [
      ["Recolectar", "Se aprovechan las plumas de las aves que se cazan para alimentarse."],
      ["Limpiar", "Se limpian y se dejan secar."],
      ["Clasificar", "Se ordenan por tamaño y color."],
      ["Armar el adorno", "Se atan y combinan para formar el diseño."]
    ],
    dato: "Nada se desperdiciaba: del animal se aprovechaba la carne y también las plumas."
  },
  {
    id: "arpon",
    nombre: "Arpón y redes",
    pueblos: ["pilaga"],
    origen: "Vara larga, hueso de vacuno y cuerda",
    intro: "La pesca era una actividad masculina que se hacía entre abril y junio o julio. Los pilagá usaban un arpón con punta desmontable y también distintos tipos de redes.",
    usos: [
      ["Pesca con arpón", "Una vara de unos 5 metros con punta de hueso."],
      ["Red de tijera", "Armazón de dos palos atados en un extremo."],
      ["Red de bolsa", "Montada sobre dos varillas flexibles atadas en ambos extremos."]
    ],
    pasos: [
      ["Preparar la vara", "Se usa un palo largo de unos 5 metros."],
      ["Montar la punta", "En el extremo hay una varilla donde descansa, floja, la punta hecha de hueso de vacuno."],
      ["Atar la cuerda", "La punta queda unida a la mano del pescador por una cuerda que corre a lo largo del palo."],
      ["Lanzar", "Al clavarse en el pez, la punta se desprende de la vara."],
      ["Recoger la presa", "El pescador suelta la cuerda y luego atrae al pez con breves tirones."]
    ],
    dato: "Mientras los hombres pescaban y cazaban, las mujeres recolectaban huevos de chajá, frutos y hojas de chaguar."
  },

  /* ---------- Materiales agregados (información ampliada, no está en el informe) ---------- */
  {
    id: "algarrobo",
    ampliado: true,
    nombre: "Madera de algarrobo",
    pueblos: ["wichi", "qom", "pilaga"],
    origen: "Tronco del algarrobo, árbol del monte chaqueño de madera dura y pesada",
    intro: "Además de dar la algarroba para comer, el algarrobo da una madera firme que no se raja fácilmente. Con ella se hacen los morteros donde se muelen los frutos del monte.",
    usos: [
      ["Mortero y mano", "Un tronco ahuecado y un palo pesado para moler algarroba, maíz y otras semillas."],
      ["Cucharas y cuencos", "Utensilios de cocina tallados en una sola pieza."],
      ["Postes y leña", "Su madera sirve para armar la estructura de las viviendas y para el fuego."]
    ],
    pasos: [
      ["Elegir el tronco", "Se busca un trozo sano y grueso, sin grietas, de un árbol caído o de una rama grande."],
      ["Cortar a medida", "Se corta un tramo del alto del mortero, casi siempre de unos 50 a 80 centímetros."],
      ["Ahuecar", "Se va abriendo el hueco de arriba con hacha y fuego controlado: se quema un poco y se raspa lo quemado."],
      ["Alisar el hueco", "Se raspa el interior hasta que queda parejo y liso para moler."],
      ["Hacer la mano", "Con otro palo pesado se talla la “mano” o pisón que golpea dentro del mortero."]
    ],
    dato: "Como la madera de algarrobo es muy dura, un buen mortero puede durar muchísimos años y pasar de madres a hijas."
  },
  {
    id: "calabaza",
    ampliado: true,
    nombre: "Calabaza (porongo)",
    pueblos: ["wichi", "qom"],
    origen: "Fruto de una planta trepadora (Lagenaria) de cáscara dura que, seca, queda hueca y liviana",
    intro: "Antes de que llegaran los recipientes de metal y plástico, la calabaza seca era el recipiente de todos los días: para llevar agua, guardar semillas o servir comida.",
    usos: [
      ["Recipientes para agua", "Las calabazas grandes y cerradas sirven como cantimploras."],
      ["Cuencos y cucharones", "Partidas al medio, se usan para servir o sacar agua."],
      ["Mates y piezas decoradas", "Hoy se graban dibujos en la cáscara para venderlas como artesanía."]
    ],
    pasos: [
      ["Cosechar madura", "Se espera a que la calabaza se seque en la planta y su cáscara se ponga dura."],
      ["Secar", "Se deja secar al sol hasta que las semillas suenan por dentro."],
      ["Abrir y vaciar", "Se corta la boca o se parte al medio, y se sacan las semillas y la pulpa seca."],
      ["Raspar y lavar", "Se raspa el interior y se lava para que no quede sabor ni olor."],
      ["Decorar", "Se pueden grabar dibujos en la cáscara con una punta caliente o un cuchillo fino."]
    ],
    dato: "Las semillas que salen de adentro se guardan para sembrar nuevas calabazas el año siguiente."
  },
  {
    id: "vivienda",
    ampliado: true,
    nombre: "Ramas, barro y paja",
    pueblos: ["wichi", "qom", "pilaga"],
    origen: "Materiales del monte y del suelo: ramas, troncos finos, barro y pastos secos",
    intro: "La vivienda tradicional se construía con lo que daba el monte. Era fácil de armar y de dejar, algo importante para pueblos que se trasladaban según la época del año.",
    usos: [
      ["Paredes", "Ramas clavadas en el suelo y entrelazadas; a veces se cubren con barro."],
      ["Techo", "Ramas cubiertas con paja o pastos secos para dar sombra y frenar la lluvia."],
      ["Enramada", "Un techo sin paredes, a la sombra, donde se cocina, se teje y se conversa."]
    ],
    pasos: [
      ["Juntar materiales", "Se cortan ramas y troncos finos, se junta paja y se prepara barro con agua."],
      ["Marcar y clavar", "Se marcan las esquinas y se clavan los postes en el suelo."],
      ["Entrelazar las paredes", "Se tejen ramas entre los postes, como una canasta grande."],
      ["Embarrar", "Se cubren las paredes con barro para que no pase el viento ni el frío."],
      ["Techar", "Se arma el techo con ramas y encima se pone la paja bien apretada."]
    ],
    dato: "La forma redondeada de muchas viviendas antiguas ayudaba a resistir el viento y a mantener el interior más fresco."
  },
  {
    id: "chanar",
    ampliado: true,
    nombre: "Chañar y mistol",
    pueblos: ["wichi", "qom", "pilaga"],
    origen: "Frutos de dos árboles del monte chaqueño que maduran en verano",
    intro: "Junto con la algarroba, el chañar y el mistol eran frutos muy importantes. Se comen frescos o se cocinan para hacer dulces que duran mucho tiempo.",
    usos: [
      ["Arrope", "Un jarabe espeso y dulce hecho cocinando los frutos durante horas."],
      ["Fruta fresca", "Se comen directamente del árbol cuando están maduros."],
      ["Harina y reserva", "Secos y molidos, se guardan para los meses en que hay menos comida."]
    ],
    pasos: [
      ["Recolectar", "En verano se juntan los frutos maduros caídos o se sacuden las ramas."],
      ["Lavar", "Se lavan bien los frutos para sacarles la tierra."],
      ["Hervir", "Se hierven en agua hasta que se ablandan y sueltan su dulzor."],
      ["Colar", "Se pisan y se cuelan para separar los carozos y las cáscaras."],
      ["Espesar", "El líquido se sigue cocinando a fuego lento hasta que queda espeso: así se hace el arrope."]
    ],
    dato: "El arrope de chañar también se usaba como remedio casero para la tos."
  },
  {
    id: "tintes",
    ampliado: true,
    nombre: "Tintes del monte",
    pueblos: ["wichi", "qom", "pilaga"],
    origen: "Cortezas, raíces, frutos y hojas de plantas del monte",
    intro: "Los colores de los tejidos y la cestería no se compran: se sacan de las plantas. Cada color sale de una planta distinta y su preparación es un saber que se transmite entre mujeres.",
    usos: [
      ["Rojos y marrones", "Se obtienen hirviendo cortezas de árboles, como el quebracho colorado."],
      ["Negros y grises", "Se logran con cortezas y frutos oscuros, a veces mezclados con barro."],
      ["Amarillos y verdes", "Salen de raíces, hojas y flores de distintas plantas."]
    ],
    pasos: [
      ["Recolectar", "Se juntan cortezas, raíces u hojas sin dañar a la planta entera."],
      ["Machacar", "Se pisan o se cortan en trozos chicos para que suelten el color."],
      ["Hervir", "Se hierven en agua hasta que el líquido toma color."],
      ["Teñir", "Se sumerge la fibra o la lana y se deja un buen rato, a veces toda la noche."],
      ["Secar", "Se deja secar a la sombra para que el color no se pierda con el sol."]
    ],
    dato: "Hirviendo una misma planta más o menos tiempo se pueden obtener tonos más claros o más oscuros."
  }
];

/* ---------- 4. DICCIONARIO CULTURAL (GLOSARIO) ---------- */
/* Cada entrada: [palabra, categoría, definición, pueblo (opcional)] */
const GLOSARIO = [
  /* Plantas y frutos */
  ["Algarroba", "Plantas y frutos", "Fruto del algarrobo, un árbol del monte. Era un alimento central: con ella se hacía harina, patay y aloja.", "qom"],
  ["Algarrobina", "Plantas y frutos", "Jarabe espeso que se obtiene cocinando durante muchas horas la algarroba con agua."],
  ["Arrope", "Plantas y frutos", "Dulce espeso, parecido a un jarabe, que se prepara cocinando frutos del monte como la algarroba o el chañar."],
  ["Aloja", "Plantas y frutos", "Bebida fermentada hecha con algarroba. Se usaba en celebraciones y rituales comunitarios.", "qom"],
  ["Patay", "Plantas y frutos", "Una especie de pan que se hace con la harina de algarroba, comprimida y cocida.", "qom"],
  ["Chañar", "Plantas y frutos", "Árbol del monte cuyo fruto es comestible. Se usaba como alimento.", "qom"],
  ["Mistol", "Plantas y frutos", "Árbol del monte de frutos dulces y comestibles.", "qom"],
  ["Tuna", "Plantas y frutos", "Fruto comestible de ciertos cactus.", "qom"],
  ["Poroto del monte", "Plantas y frutos", "Fruto silvestre del monte que se recolectaba como alimento.", "qom"],
  ["Cogollo", "Plantas y frutos", "Brote tierno de una planta, como el de algunas palmeras. Algunos se comen."],
  ["Corazón de palma", "Plantas y frutos", "Parte tierna del interior de ciertas palmas, que se come.", "qom"],
  ["Chaguar", "Plantas y frutos", "Planta espinosa del monte chaqueño (Bromelia hieronymi) cuyas hojas dan una fibra para hilar y tejer. Identifica a la cultura wichí.", "wichi"],
  ["Caraguatá", "Plantas y frutos", "Planta del monte parecida al chaguar, también de hojas largas y espinosas que dan fibra para tejer.", "wichi"],
  ["Carandillo", "Plantas y frutos", "Palmera de hojas duras cuya fibra se usa para la cestería. Los pilagá la llaman qatalaguá.", "pilaga"],
  ["Palma", "Plantas y frutos", "Planta de hojas grandes en forma de abanico. Sus hojas se desfibran y se tejen para hacer canastos.", "qom"],
  ["Totora", "Plantas y frutos", "Planta acuática de tallos largos que crece en lagunas y esteros. Se usa para trenzar y tejer.", "qom"],
  ["Palo santo", "Plantas y frutos", "Árbol del Chaco de madera muy dura y aroma intenso. Con ella se tallan artesanías.", "wichi"],
  ["Quebracho colorado", "Plantas y frutos", "Árbol de madera muy dura del Gran Chaco. Da nombre a la estación Chelchep de los wichí.", "wichi"],
  ["Papa de agua", "Plantas y frutos", "Alimento vegetal de ambientes húmedos que recolectaban las mujeres pilagá.", "pilaga"],
  ["Plantas tintóreas", "Plantas y frutos", "Plantas, cortezas y raíces con las que se obtienen colores para teñir fibras."],

  /* Animales */
  ["Dorado", "Animales", "Pez de río de escamas doradas, muy apreciado. Se pescaba en el Pilcomayo y el Bermejo.", "qom"],
  ["Surubí", "Animales", "Pez grande de río, de piel manchada. Era uno de los alimentos de la pesca.", "qom"],
  ["Pacú", "Animales", "Pez de río de cuerpo ancho y plateado.", "qom"],
  ["Sábalo", "Animales", "Pez de río muy común, de escamas plateadas.", "qom"],
  ["Palometa", "Animales", "Pez de río de cuerpo chato y dientes filosos.", "qom"],
  ["Bagre", "Animales", "Pez de río con bigotes y sin escamas.", "qom"],
  ["Pecarí", "Animales", "Mamífero parecido a un cerdo salvaje que vive en el monte. Se cazaba en grupo.", "qom"],
  ["Carpincho", "Animales", "El roedor más grande del mundo. Vive cerca del agua.", "qom"],
  ["Tapir", "Animales", "Mamífero grande de hocico alargado y movible. También se lo conoce como anta.", "qom"],
  ["Tatú", "Animales", "Armadillo: mamífero con caparazón de placas.", "qom"],
  ["Quirquincho", "Animales", "Armadillo pequeño, con caparazón. Lo capturaban los hombres pilagá.", "pilaga"],
  ["Suri", "Animales", "Nombre regional del ñandú, un ave corredora grande.", "pilaga"],
  ["Ñandú", "Animales", "Ave corredora grande que no vuela. Se cazaba y se aprovechaban sus plumas.", "qom"],
  ["Iguana", "Animales", "Lagarto grande del monte. Se cazaba para alimentarse."],
  ["Vizcacha", "Animales", "Roedor que vive en cuevas, en colonias.", "qom"],
  ["Comadreja", "Animales", "Pequeño marsupial de hábitos nocturnos.", "qom"],
  ["Cuis", "Animales", "Pequeño roedor de campo, parecido a un conejito de Indias silvestre.", "qom"],
  ["Charata", "Animales", "Ave del monte, de canto fuerte y bullicioso.", "qom"],
  ["Chajá", "Animales", "Ave grande de humedales. Las mujeres pilagá recolectaban sus huevos.", "pilaga"],
  ["Garza", "Animales", "Ave de patas y cuello largos que vive cerca del agua.", "qom"],

  /* Lengua y cultura */
  ["Qom", "Lengua y cultura", "Nombre con el que los llamados “tobas” se reconocen a sí mismos. Significa “persona” o “gente”.", "qom"],
  ["Toba", "Lengua y cultura", "Nombre con el que otras personas llamaron a los Qom. Hoy se prefiere decir Qom.", "qom"],
  ["Wichí", "Lengua y cultura", "Pueblo originario del Gran Chaco, el más numeroso de Formosa.", "wichi"],
  ["Mataco", "Lengua y cultura", "Nombre externo que se usaba antes para los wichí. Hoy se reemplaza por su autodenominación.", "wichi"],
  ["Pilagá", "Lengua y cultura", "Pueblo originario de Formosa, el de menor población de los tres.", "pilaga"],
  ["Autodenominación", "Lengua y cultura", "El nombre con el que un pueblo se llama a sí mismo, en lugar del que le pusieron otros."],
  ["Etnia", "Lengua y cultura", "Grupo humano que comparte cultura, lengua y tradiciones. Hoy se prefiere hablar de “pueblo originario”."],
  ["Pueblo originario", "Lengua y cultura", "Pueblo que vivía en el territorio antes de la formación de los estados actuales."],
  ["Qom l’aqtac", "Lengua y cultura", "La lengua de los Qom. Pertenece a la familia guaycurú.", "qom"],
  ["Guaycurú", "Lengua y cultura", "Familia lingüística a la que pertenecen el qom y el pilagá. También se escribe guaicurú."],
  ["Mataco-mataguayo", "Lengua y cultura", "Familia lingüística a la que pertenece la lengua wichí.", "wichi"],
  ["Dialecto", "Lengua y cultura", "Variante de una lengua que se habla en una zona o por un grupo. En Formosa se hablan 17 variantes dialectales."],
  ["Vejoz (wehwos)", "Lengua y cultura", "Dialecto wichí de las comunidades de la región del Bermejo.", "wichi"],
  ["Güisnay (weenhayey)", "Lengua y cultura", "Dialecto wichí de la región del Pilcomayo. Significa “gente desconocida”.", "wichi"],
  ["Monolingüe", "Lengua y cultura", "Persona que habla una sola lengua."],
  ["Bilingüe", "Lengua y cultura", "Persona que habla dos lenguas. Muchos adultos qom hablan qom y español."],
  ["Tradición oral", "Lengua y cultura", "Forma de transmitir saberes, historias y creencias hablando, de generación en generación."],
  ["Cosmovisión", "Lengua y cultura", "Manera de entender el mundo, la naturaleza y la vida propia de un pueblo."],
  ["Chamán", "Lengua y cultura", "Máxima autoridad religiosa qom. Intercede ante los seres espirituales, protege de la maldad y cura enfermedades.", "qom"],
  ["Piooxonak", "Lengua y cultura", "Nombre qom del chamán, la persona a la que se acude en busca de paz espiritual y alivio.", "qom"],
  ["Pentecostal", "Lengua y cultura", "Iglesia cristiana evangélica. Una parte del pueblo Qom se convirtió a ella."],
  ["Lup", "Lengua y cultura", "Estación wichí del frío, que corresponde al invierno (mayo a julio).", "wichi"],
  ["Nawop", "Lengua y cultura", "Estación wichí de la flor, que corresponde a la primavera (agosto y septiembre).", "wichi"],
  ["Yachep", "Lengua y cultura", "Estación wichí del cultivo, que corresponde al verano (octubre a febrero). También designa las fiestas de la aloja.", "wichi"],
  ["Chelchep", "Lengua y cultura", "Estación wichí del quebracho colorado, que corresponde al otoño (marzo y abril).", "wichi"],
  ["Multiétnico", "Lengua y cultura", "Que reúne varias etnias o pueblos. Formosa es una provincia multiétnica y pluricultural."],

  /* Organización social */
  ["Neta", "Organización social", "Líder de una banda qom. Significa “padre” u “hombre mayor” y se distinguía por ser fuerte, alto y respetado.", "qom"],
  ["Banda", "Organización social", "Grupo de varias familias que se desplaza y vive junto. Las bandas qom reunían de 40 a 70 personas adultas.", "qom"],
  ["Familia extensa", "Organización social", "Familia formada por varias generaciones y parientes que viven juntos y trabajan en conjunto."],
  ["Exogamia", "Organización social", "Regla social por la cual se forma pareja con alguien de otro grupo familiar. Los pilagá eran exogámicos.", "pilaga"],
  ["Matrilocal", "Organización social", "Residencia después del casamiento en la aldea de la esposa. Era la costumbre de los pilagá.", "pilaga"],
  ["Campamento", "Organización social", "Lugar temporal donde se instalaba una banda antes de mudarse a otro."],
  ["Nomadizar", "Organización social", "Trasladarse de un lugar a otro según las estaciones, buscando agua, frutos y animales."],
  ["Mariscar", "Organización social", "En el Chaco, salir al monte o al río a buscar alimento.", "wichi"],
  ["Buena voluntad wichí", "Organización social", "Concepto con el que el antropólogo John Palmer define un eje de la vida social wichí.", "wichi"],
  ["Comunidad", "Organización social", "Grupo de familias que viven en un mismo lugar y comparten organización, territorio y cultura."],
  ["Llayaqapi", "Organización social", "Banda qom cuyo nombre viene de llayaga, “zorro”: cantaban y andaban toda la noche como los zorros.", "qom"],

  /* Territorio */
  ["Bañado", "Territorio", "Terreno bajo e inundable donde el agua de un río se desborda y se queda estancada."],
  ["Pilcomayo", "Territorio", "Río que nace en Bolivia y marca el límite entre Argentina y Paraguay. Sus desbordes forman bañados."],
  ["Bermejo", "Territorio", "Río del Gran Chaco que nace en Bolivia y desemboca en el río Paraguay."],
  ["Gran Chaco", "Territorio", "Gran llanura de monte y humedales que abarca el norte de Argentina, Paraguay, Bolivia y una parte de Brasil."],
  ["Monte", "Territorio", "Ambiente de árboles y arbustos del Chaco que provee alimentos, fibras y plantas medicinales."],
  ["Ceja de monte", "Territorio", "Borde o franja de monte donde la visibilidad es escasa. Los pilagá buscaban esos lugares por seguridad.", "pilaga"],
  ["Aguada", "Territorio", "Lugar donde hay agua disponible, como una laguna o un pozo."],
  ["Comle’ec", "Territorio", "Barrio donde vive un grupo de unas 400 personas qom, cerca de Ingeniero Juárez.", "qom"],
  ["Predio comunitario", "Territorio", "Terreno que pertenece a la comunidad y no a una persona. Los Qom tienen uno de 35.000 hectáreas.", "qom"],
  ["Estero", "Territorio", "Terreno bajo y húmedo, con agua estancada y plantas acuáticas."],

  /* Artesanía */
  ["Telar", "Artesanía", "Armazón con el que se entrecruzan hilos para tejer telas.", "qom"],
  ["Pretelar", "Artesanía", "Forma de tejer más simple que el telar, sobre un armazón sencillo de palos.", "qom"],
  ["Cestería", "Artesanía", "Arte de tejer canastos y otros objetos con fibras vegetales.", "pilaga"],
  ["Noonek", "Artesanía", "Nombre pilagá de la cestería hecha con carandillo.", "pilaga"],
  ["Yica", "Artesanía", "Bolso tradicional wichí, tejido con fibra de chaguar.", "wichi"],
  ["Hilado", "Artesanía", "Proceso de estirar y retorcer una fibra para convertirla en hilo."],
  ["Desfibrar", "Artesanía", "Separar las fibras de una hoja para poder usarlas en un tejido."],
  ["Teñido natural", "Artesanía", "Colorear fibras con tintes que se sacan de plantas, cortezas o raíces."],
  ["Mortero", "Artesanía", "Recipiente donde se machacan o muelen alimentos, como las vainas de algarroba."],
  ["Arpón", "Artesanía", "Vara con una punta que se lanza para pescar. Los pilagá usaban una de unos 5 metros.", "pilaga"],
  ["Red de tijera", "Artesanía", "Red de pesca con un armazón de dos palos atados en uno de sus extremos.", "pilaga"],
  ["Red de bolsa", "Artesanía", "Red de pesca montada sobre dos varillas flexibles atadas en ambos extremos.", "pilaga"],

  /* Instituciones y leyes */
  ["ICA", "Instituciones y leyes", "Instituto de Comunidades Aborígenes: organismo de Formosa que centraliza las políticas indígenas. Su directorio lo integran representantes elegidos por las propias comunidades."],
  ["Ley 426", "Instituciones y leyes", "Ley Integral del Aborigen de Formosa, promulgada el 16 de noviembre de 1984. Fue la primera norma del país en reconocer de manera igualitaria los derechos indígenas."],
  ["Organismo autárquico", "Instituciones y leyes", "Entidad pública que puede administrarse a sí misma, con cierta independencia."],
  ["Educación intercultural bilingüe (EIB)", "Instituciones y leyes", "Educación que enseña en dos lenguas y respeta la cultura y la cosmovisión de los pueblos indígenas."],
  ["Interculturalidad", "Instituciones y leyes", "Relación respetuosa e igualitaria entre culturas distintas, donde una no reemplaza a la otra."],
  ["Titularización de tierras", "Instituciones y leyes", "Proceso por el cual el Estado entrega el título legal de las tierras a las comunidades para evitar desalojos."],
  ["Propiedad comunitaria", "Instituciones y leyes", "Derecho de una comunidad a poseer la tierra que habita en conjunto, y no de forma individual."],
  ["Periodización", "Instituciones y leyes", "Forma de dividir la historia en etapas. Siempre responde a una mirada, por eso no es neutral."],
  ["Recurso Educativo Digital (RED)", "Instituciones y leyes", "Material digital creado con intención pedagógica para favorecer aprendizajes mediante tecnologías."]
];

/* ---------- 5. QUIZ ---------- */
const PREGUNTAS = [
  {
    p: "¿Cómo se autodenominan los llamados “tobas”?",
    o: ["Wichí", "Qom", "Pilagá", "Mataco"],
    c: 1,
    e: "Qom significa “persona” o “gente” en su lengua. “Toba” fue un nombre que usaron otros."
  },
  {
    p: "¿Qué pueblo es el más numeroso de Formosa?",
    o: ["Wichí", "Qom", "Pilagá", "Los tres son iguales"],
    c: 0,
    e: "Los wichí son los más numerosos y viven sobre todo en el oeste. Los pilagá son los de menor población."
  },
  {
    p: "¿Qué significa “Neta” en la organización tradicional qom?",
    o: ["Río", "Estación del año", "Padre u hombre mayor, líder de la banda", "Bebida de algarroba"],
    c: 2,
    e: "El Neta era el líder de una banda de 40 a 70 personas adultas, respetado por su grupo."
  },
  {
    p: "¿En qué año se promulgó la Ley Integral del Aborigen N.º 426?",
    o: ["1955", "1984", "1994", "2010"],
    c: 1,
    e: "Se promulgó el 16 de noviembre de 1984 y fue pionera en el país."
  },
  {
    p: "¿Cómo se llama la estación del frío para los wichí?",
    o: ["Lup", "Nawop", "Yachep", "Chelchep"],
    c: 0,
    e: "Lup es la época fría y corresponde al invierno, de mayo a julio."
  },
  {
    p: "¿Cuál NO es una condición que los pilagá tenían en cuenta para elegir dónde asentarse?",
    o: ["Cercanía de agua potable", "Abundancia de pesca o caza", "Seguridad del lugar", "Cercanía a una ciudad"],
    c: 3,
    e: "Buscaban agua potable, pesca o caza abundante y seguridad, no cercanía a ciudades."
  },
  {
    p: "¿A qué familia lingüística pertenece el wichí?",
    o: ["Guaycurú", "Mataco-mataguayo", "Quechua", "Guaraní"],
    c: 1,
    e: "El qom y el pilagá son guaycurú; el wichí es mataco-mataguayo."
  },
  {
    p: "¿Cuántas comunidades hay entre los tres pueblos, según el ICA?",
    o: ["26", "50", "116", "192"],
    c: 3,
    e: "Son 192: 116 wichí, 50 qom y 26 pilagá."
  },
  {
    p: "¿Cómo se llama la bebida fermentada que se prepara con algarroba?",
    o: ["Patay", "Aloja", "Arrope", "Yica"],
    c: 1,
    e: "La aloja se usaba en celebraciones y rituales. El patay es un pan y la yica es un bolso."
  },
  {
    p: "¿Con qué fibra tejen las mujeres wichí sus bolsos llamados yicas?",
    o: ["Con carandillo", "Con totora", "Con chaguar", "Con plumas"],
    c: 2,
    e: "El chaguar es la fibra que más identifica a la cultura wichí."
  },

  /* ----- Más preguntas: en cada partida se eligen 10 al azar ----- */
  {
    p: "¿Qué significa la palabra “qom” en su lengua?",
    o: ["Río", "Persona o gente", "Monte", "Fuego"],
    c: 1,
    e: "Qom quiere decir “persona” o “gente”. Por eso es su autodenominación."
  },
  {
    p: "¿Qué organismo crea la Ley Integral del Aborigen N.º 426?",
    o: ["El Instituto de Comunidades Aborígenes (ICA)", "El Ministerio de Turismo", "La Universidad de Formosa", "El Banco Provincial"],
    c: 0,
    e: "La ley crea el ICA, un organismo autárquico que centraliza las políticas indígenas de la provincia."
  },
  {
    p: "¿Quiénes integran el directorio del ICA?",
    o: ["Solo funcionarios de la ciudad de Formosa", "Representantes elegidos por las comunidades qom, pilagá y wichí", "Empresarios de la provincia", "Docentes de otras provincias"],
    c: 1,
    e: "Lo integran representantes elegidos por las propias comunidades, para que la gestión sea “con” ellas y no solo “para” ellas."
  },
  {
    p: "¿Qué derecho sobre las tierras reconoce la Ley 426?",
    o: ["El derecho a venderlas a empresas", "La propiedad comunitaria de las tierras que habitan", "El derecho a usarlas solo un año", "Ninguno"],
    c: 1,
    e: "Reconoce la propiedad comunitaria y busca la titularización de las tierras para evitar desalojos."
  },
  {
    p: "¿Qué tipo de educación promueve la Ley 426?",
    o: ["Solo en español", "Solo a distancia", "Intercultural bilingüe", "Solo para adultos"],
    c: 2,
    e: "Promueve la educación intercultural bilingüe, que enseña en la lengua propia y en español, respetando las dos culturas."
  },
  {
    p: "Según el ICA, ¿cuántos habitantes indígenas viven en Formosa?",
    o: ["3.800", "38.039", "380.000", "1.200"],
    c: 1,
    e: "Son 38.039 personas, el 7,21 % de la población de la provincia."
  },
  {
    p: "Para los wichí, ¿qué significa Nawop?",
    o: ["Época de la flor (primavera)", "Época del frío", "Época del cultivo", "Época del quebracho colorado"],
    c: 0,
    e: "Nawop es la época de la flor, en agosto y septiembre, cuando el monte florece después del frío."
  },
  {
    p: "La estación wichí Chelchep lleva el nombre de…",
    o: ["Un río", "El quebracho colorado", "La luna", "Un pez"],
    c: 1,
    e: "Chelchep es la época del quebracho colorado (otoño, marzo y abril), un árbol muy duro del Gran Chaco."
  },
  {
    p: "¿Cuál es la estación más larga del calendario wichí?",
    o: ["Lup", "Nawop", "Yachep", "Chelchep"],
    c: 2,
    e: "Yachep, la época del cultivo, va de octubre a febrero. En ella se hacen las fiestas de la aloja."
  },
  {
    p: "¿En qué meses crecía el río Pilcomayo, según el calendario pilagá?",
    o: ["De enero a marzo", "De abril a junio", "De julio a septiembre", "De octubre a diciembre"],
    c: 2,
    e: "De julio a septiembre el río crecía e inundaba los terrenos cercanos, y los pilagá se retiraban a sitios más altos."
  },
  {
    p: "¿Cómo llaman los pilagá al carandillo?",
    o: ["Qatalaguá", "Chaguar", "Yica", "Noonek"],
    c: 0,
    e: "Lo llaman qatalaguá. Con su fibra hacen la cestería, que en pilagá se llama noonek."
  },
  {
    p: "¿De qué estaba hecha la punta del arpón de pesca pilagá?",
    o: ["De piedra", "De hueso de vacuno", "De metal", "De caña"],
    c: 1,
    e: "La punta era de hueso de vacuno y se desprendía de la vara al clavarse en el pez."
  },
  {
    p: "¿Cuánto medía aproximadamente la vara del arpón pilagá?",
    o: ["Medio metro", "Un metro", "Unos 5 metros", "Unos 20 metros"],
    c: 2,
    e: "Era un palo largo, de unos 5 metros, con una cuerda que unía la punta con la mano del pescador."
  },
  {
    p: "Según un relato pilagá, ¿quiénes eran las estrellas del cielo?",
    o: ["Los peces del río", "Las mujeres que vivían en el cielo", "Los guerreros de la banda", "Los frutos del algarrobo"],
    c: 1,
    e: "Cuentan que las mujeres vivían en el cielo y eran las estrellas."
  },
  {
    p: "¿Qué dialecto wichí se habla en la región del río Pilcomayo?",
    o: ["Vejoz", "Güisnay", "Qom l’aqtac", "Guaraní"],
    c: 1,
    e: "En el Pilcomayo se habla el güisnay (weenhayey). En el Bermejo se habla el vejoz (wehwos)."
  },
  {
    p: "¿Qué es la yica?",
    o: ["Una bebida de algarroba", "El bolso típico wichí, tejido con chaguar", "Un instrumento musical", "Un tipo de pez"],
    c: 1,
    e: "La yica es el bolso wichí tejido con hilo de chaguar."
  },
  {
    p: "¿Qué es el patay?",
    o: ["Una especie de pan hecho con harina de algarroba", "Un bolso tejido", "Un pez de río", "Una danza"],
    c: 0,
    e: "El patay se hace con harina de algarroba, comprimida y cocida."
  },
  {
    p: "¿Cómo se llama la lengua de los qom?",
    o: ["Wichí", "Qom l’aqtac", "Guaraní", "Quechua"],
    c: 1,
    e: "El qom l’aqtac pertenece a la familia guaycurú, igual que el pilagá."
  },
  {
    p: "¿Con qué nombre externo se llamaba antes a los wichí?",
    o: ["Tobas", "Matacos", "Guaraníes", "Pilagás"],
    c: 1,
    e: "“Mataco” era un nombre puesto por otros. Hoy se usa su autodenominación: wichí."
  },
  {
    p: "El barrio qom Comle’ec está cerca de…",
    o: ["Clorinda", "Ingeniero Juárez", "Formosa capital", "Pirané"],
    c: 1,
    e: "Comle’ec está en los alrededores de Ingeniero Juárez, y allí viven unas 400 personas qom."
  },
  {
    p: "¿Cuántas hectáreas tiene el predio comunitario qom cerca del Bañado La Estrella?",
    o: ["350", "3.500", "35.000", "350.000"],
    c: 2,
    e: "Varias comunidades qom viven dentro de un predio comunitario de 35.000 hectáreas."
  },
  {
    p: "¿Qué pueblo tiene la menor población de los tres?",
    o: ["Wichí", "Qom", "Pilagá", "Todos tienen la misma"],
    c: 2,
    e: "Los pilagá son el pueblo de menor población, con 26 comunidades."
  },
  {
    p: "¿Qué hacían los pilagá al abandonar un campamento?",
    o: ["Lo vendían", "Lo quemaban", "Lo dejaban a otra familia", "Lo desarmaban y lo llevaban"],
    c: 1,
    e: "Al abandonar un campamento, lo quemaban."
  },
  {
    p: "En lengua wichí, “hilu wet” significa…",
    o: ["La casa de la yica", "El río grande", "La época del frío", "El hombre mayor"],
    c: 0,
    e: "“Hilu wet” significa “la casa de la yica”, y es también el nombre de una organización de mujeres wichí."
  },
  {
    p: "¿Cómo se llama en qom el chamán, al que se acude en busca de paz espiritual?",
    o: ["Neta", "Piooxonak", "Llayaqapi", "Noonek"],
    c: 1,
    e: "El piooxonak es el chamán. Hoy, algunos chamanes también son pastores de iglesias."
  },
  {
    p: "¿Por qué los pilagá buscaban asentarse en las “cejas de monte”?",
    o: ["Porque había ciudades cerca", "Porque eran lugares de poca visibilidad y más seguros", "Porque no había árboles", "Porque estaban junto al mar"],
    c: 1,
    e: "Eran franjas de monte con poca visibilidad, que daban seguridad, aunque se descartaban si no había buenas aguadas."
  },
  {
    p: "¿Cuál de estos NO es un pez que pescaban los qom?",
    o: ["Dorado", "Surubí", "Sábalo", "Tapir"],
    c: 3,
    e: "El tapir es un mamífero del monte. Los qom pescaban dorado, surubí, pacú y sábalo."
  }
];
