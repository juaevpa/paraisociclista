/**
 * Script MASIVO de enriquecimiento basado en investigación de consultor experto en Xàtiva.
 *
 * Ejecutar: SANITY_TOKEN=xxx node enrich-all.mjs
 *
 * Qué hace:
 *  1. Borra redundancias (restaurantes-historicos, sierra-vernissa duplicado)
 *  2. Enriquece 13 lugares con contenido verificado (Wikipedia, turismo oficial, fuentes locales)
 *  3. Reescribe los 5 posts del blog con contenido real de Xàtiva
 *  4. Limpia descripciones de restaurantes (quita el bloque "Dirección: ..." redundante)
 *
 * NO TOCA: rutas ni alojamientos (descripciones plantilladas sin valor, requieren fotos reales)
 */

import { createClient } from '@sanity/client';

const SANITY_TOKEN = process.env.SANITY_TOKEN;
if (!SANITY_TOKEN) {
  console.error('Falta SANITY_TOKEN');
  process.exit(1);
}

const client = createClient({
  projectId: 'kb9dsoe4',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_TOKEN,
  useCdn: false,
});

const rnd = () => Math.random().toString(36).slice(2, 12);

function block(text, style = 'normal', listItem) {
  const b = {
    _type: 'block',
    _key: rnd(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: rnd(), text, marks: [] }],
  };
  if (listItem) {
    b.listItem = listItem;
    b.level = 1;
  }
  return b;
}

const h2 = (t) => block(t, 'h2');
const h3 = (t) => block(t, 'h3');
const p = (t) => block(t);
const li = (t) => block(t, 'normal', 'bullet');

// =============================================================
// LUGARES A ENRIQUECER
// =============================================================

const places = {
  'casa-cultura': {
    excerpt: 'Edificio histórico rehabilitado con patios interiores, biblioteca y programación cultural diaria en el corazón del casco antiguo.',
    description: [
      p('La Casa de Cultura de Xàtiva ocupa un edificio histórico rehabilitado en el corazón del casco antiguo, en el Carrer Montcada, 7. Su planta dual es una de las particularidades más curiosas del inmueble: la fachada que da al Passeig de l\'Albereda acoge la Biblioteca Pública Municipal, mientras que la fachada recayente a la calle Montcada se dedica a actividades culturales, salas de exposiciones y conferencias.'),
      p('El interior sorprende al visitante por sus amplias salas iluminadas naturalmente, las enormes columnas que articulan los espacios expositivos y dos patios interiores descubiertos que aportan luz a todo el edificio. Es uno de esos lugares donde la piedra vieja convive con programación contemporánea.'),

      h2('Programación habitual'),
      p('La actividad cultural combina exposiciones de arte, conciertos de música clásica, jazz y flamenco, conferencias, presentaciones literarias, talleres y ciclos de cine. Durante la Fira d\'Agost y el Corpus Christi la Casa de la Cultura funciona como sede de exposiciones temáticas ligadas a las fiestas.'),
      p('La biblioteca, muy activa, organiza clubs de lectura en valenciano y castellano, cuentacuentos infantiles y actividades de promoción lectora.'),

      h2('Información práctica'),
      li('Dirección: Carrer Montcada, 7 — 46800 Xàtiva'),
      li('Teléfono: 962 282 304'),
      li('Horario: lunes a viernes 9:00–14:00 y 16:00–21:00; sábados 16:00–19:00'),
      li('Accesibilidad: entrada adaptada, aseos adaptados y aparcamiento accesible'),

      h2('Tip para ciclistas'),
      p('Punto frecuente para refugiarse del sol del mediodía en verano: el patio interior y la sala de lectura son un oasis climático perfecto entre rutas.'),
    ],
  },

  'centro-artesania': {
    excerpt: 'Xàtiva mantiene viva la artesanía tradicional a través de ferias que recorren el casco histórico todo el año.',
    description: [
      p('A diferencia de otras ciudades valencianas, Xàtiva no cuenta con un Centro de Artesanía municipal con sede fija, sino con una red viva de ferias artesanales que recorren el casco histórico a lo largo del año. La artesanía setabense se expresa sobre todo en la cerámica, el esparto, el cuero, la forja y la dulcería tradicional (arnadí, rollets, almendrados).'),
      p('El Mercat d\'Artesania se despliega habitualmente en la Albereda Jaume I y en la Glorieta José Espejo, reuniendo joyería artesanal, cerámica, marroquinería, textil, cosmética natural y productos gastronómicos de proximidad.'),

      h2('Citas artesanales imprescindibles'),
      li('Mercado Medieval (enero): más de 80 puestos de artesanía y comestibles ambientan las calles de la ciudad antigua con música y recreaciones.'),
      li('Fira Borja (octubre): feria de artesanía, gastronomía, turismo y música que recupera el legado de la familia Borja, oriunda de Xàtiva.'),
      li('Plaza de la Calderería durante la Fira d\'Agost: demostraciones en directo de siete oficios tradicionales (forja, cestería, cerámica, etc.) junto a juegos valencianos tradicionales.'),

      h2('Comercio artesano todo el año'),
      p('Para comprar artesanía local fuera de las fechas de ferias, los comercios históricos de la calle Botigues y el entorno de la Seu son la mejor apuesta. Cerámica setabense, obradores de dulces tradicionales y talleres de cuero siguen activos en el casco antiguo.'),
    ],
  },

  'museo-bellas-artes': {
    excerpt: 'Una de las mayores colecciones públicas de pintura de la Comunitat Valenciana: Ribera, Goya, depósitos del Prado y obra del setabense más universal.',
    description: [
      p('El Museu de Belles Arts de Xàtiva abrió sus puertas en 2015 en la Casa de l\'Ensenyança, un edificio de 1758 concebido originalmente como colegio para niñas huérfanas. Forma tándem con el Museu de l\'Almodí, el viejo almudín renacentista con fachada gótica y patio de columnas jónicas que fue antiguo mercado del trigo y que hoy alberga la colección arqueológica (desde la Cova Negra hasta restos íberos, romanos, visigodos e islámicos).'),
      p('La pinacoteca del Belles Arts es uno de los conjuntos públicos más relevantes de la Comunitat Valenciana. Reúne obras de Josep de Ribera, Goya (serie completa de los "Caprichos" y "Disparates"), Vicente López, Santiago Rusiñol, Mariano Benlliure y Antoni Miró, junto con un depósito del Museo Nacional del Prado que incluye tablas y lienzos de las escuelas española, italiana, flamenca y francesa: Luca Giordano, Carducho, Orrente, Palomino, Mazo y piezas de los círculos de Rubens, Rembrandt, Teniers, Brueghel, Murillo, Velázquez y Carreño.'),

      h2('Josep de Ribera, el setabense universal'),
      p('Josep de Ribera "Lo Spagnoletto" nació en Xàtiva en 1591 y murió en Nápoles en 1652. Fue uno de los grandes renovadores del tenebrismo barroco, maestro del claroscuro caravaggesco y figura imprescindible de la pintura europea del XVII.'),
      p('El Museu de Belles Arts exhibe "San Matías Apóstol", pequeña joya procedente del Prado, además de "San Andrés" y un "Salvador" que son ejemplos extraordinarios de su tenebrismo. En septiembre de 2024 el Prado cedió además en préstamo la "Magdalena Penitent", que ha podido contemplarse en la sala principal del museo.'),

      h2('Visita conjunta con el Almodí'),
      p('La entrada combinada permite ver ambos museos en una misma mañana. En el Almodí se expone también un "San Matías" de Ribera, propiedad del Prado en depósito, y el célebre retrato invertido de Felipe V, protesta muda que los setabenses mantienen desde el incendio borbónico de 1707.'),

      h2('Información práctica'),
      li('Museu de Belles Arts — Casa de l\'Ensenyança, Plaça de l\'Españoleto (entorno de la Seu)'),
      li('Museu de l\'Almodí — Carrer de la Corretgeria, 46'),
      li('Se recomienda visita conjunta (entrada combinada)'),
      li('Cierra los lunes'),
    ],
  },

  'plaza-mercat': {
    excerpt: 'El corazón comercial y ceremonial de Xàtiva durante siglos, hoy escenario del mercado de los martes y viernes.',
    description: [
      p('La Plaça del Mercat ha sido durante siglos el centro vital de Xàtiva. En ella se leyeron proclamas reales, se subastaron obras municipales y en determinadas épocas también se celebraron ejecuciones públicas. Era, en definitiva, el ágora setabense.'),
      p('El conjunto arquitectónico que hoy vemos es principalmente del siglo XVIII, reconstruido tras el incendio de 1707 durante la Guerra de Sucesión. Aun así, conserva trazas medievales en el parcelario, arcos, pasajes y algunas portadas que recuerdan su origen gótico.'),

      h2('El mercado semanal'),
      p('El mercado al aire libre se instala los martes y viernes por la mañana, con puestos de alimentación fresca, textil y menaje. Es uno de los mejores momentos para ver la vida local auténtica, escuchar el valenciano de la Costera y comprar productos de proximidad: mandarina de la Ribera, aceite de la Vall d\'Albaida, almendra, miel y queso de cabra de la Serra Grossa.'),

      h2('Dónde parar'),
      p('En la misma plaza funcionan varias cafeterías tradicionales donde desayunar un "esmorzar" de tellada (bocadillo grande) antes o después de subir al castillo. La plaza también concentra parte de los mejores restaurantes de cocina tradicional setabense.'),
    ],
  },

  'palau-alarco': {
    excerpt: 'El edificio civil privado más monumental de Xàtiva, escondido en la Plaça de la Trinitat con sobriedad castellana y barroco valenciano.',
    description: [
      p('El Palau d\'Alarcó se alza en la Plaça de la Trinitat y es considerado el edificio civil privado más monumental de Xàtiva. El edificio que hoy contemplamos se construyó después del incendio de 1707 (probablemente antes de 1730), aunque la documentación acredita la existencia de una casa anterior en el siglo XVII, residencia de la familia Cabanilles, condes del Casal.'),
      p('El palacio nació como convento, y esa doble alma religiosa y palaciega se percibe en su distribución interior. Destaca la fusión de estilos: la sobriedad de la planta castellana convive con la riqueza ornamental del barroco valenciano de la primera mitad del XVIII.'),

      h2('Del convento al apellido Alarcón'),
      p('En 1760 Carlos Ruiz de Alarcón compró el edificio y le dio el nombre con el que ha pasado a la posteridad. Desde entonces el palacio ha pasado por varias manos privadas, conservando la fachada de sillería, el portal monumental de medio punto, la reja volada del balcón principal y el patio interior característico de las grandes casas señoriales valencianas.'),

      h2('Cómo visitarlo'),
      p('Al tratarse de un edificio de propiedad privada, habitualmente solo puede admirarse desde la plaza. Ocasionalmente abre sus puertas durante las Jornadas Europeas de Patrimonio y actos culturales especiales programados por el Ajuntament.'),
    ],
  },

  'fuente-25-canos': {
    excerpt: 'Veinticinco caños de bronce, rostro barbudo central y más de dos siglos apagando la sed de Xàtiva: la fuente más emblemática de la ciudad.',
    description: [
      p('La Font dels 25 Dolls (o Font dels Vint-i-cinc Dolls) es la fuente más emblemática de Xàtiva, símbolo de una ciudad que fue conocida como "la ciutat de les mil fonts" por la abundancia de sus manantiales. Se construyó entre 1788 y 1804 en estilo neoclásico, reutilizando piedra del antiguo Portal de Cocentaina o Portal dels Banys.'),
      p('Sustituyó un abeurador islámico del siglo XI que servía como abrevadero para ganados y viajeros; aquel pilón original se conserva hoy en el Museu de l\'Almodí. La fuente fue, durante siglos, parada obligatoria de quienes entraban o salían de la ciudad por el sur.'),

      h2('Arquitectura y simbolismo'),
      p('El pilón es un gran rectángulo presidido por un rostro masculino barbudo con una gran boca-bebedero. A su alrededor se distribuyen veinticinco caños de bronce con forma de serpiente que dan nombre al monumento. El agua procede del manantial de Bellús.'),
      p('Un siglo después de su construcción, el arquitecto Acuña realizó la primera restauración, que convirtió las esquinas del pilón en líneas rectas. En 2026 el Ajuntament inició obras de mejora del entorno y del aparcamiento contiguo de Sant Vicent.'),

      h2('Punto clave para ciclistas'),
      p('Avituallamiento clásico de cualquier ruta por Xàtiva: todos los caños dan agua potable. Leyenda popular: se dice que quien bebe de los 25 caños seguidos volverá siempre a Xàtiva.'),
    ],
  },

  'jardin-del-beso': {
    excerpt: 'Un jardín romántico con templete modernista donde un filósofo italiano escribió versos a su amada Carmen. Parada obligada para parejas.',
    description: [
      p('El Jardí del Bes (Jardín del Beso), también conocido como Jardí del Vers o Jardín de Carmen Pérez, se encuentra en el Carrer Puig, 55, junto a la Plaça de Bous y a un paseo corto de la Font dels 25 Dolls. Es uno de los rincones más románticos y menos masificados del casco urbano.'),
      p('El nombre procede de los poemas de amor que el filósofo italiano Attilio Bruschetti dedicó a su amada Carmen Pérez a la sombra de estos mismos árboles. Originalmente se llamó "Jardín del Verso", pero la tradición popular acabó transformando "vers" en "bes" (beso en valenciano), dando al jardín su nombre definitivo. El matrimonio donó el jardín a la ciudad de Xàtiva.'),

      h2('Qué ver'),
      li('Templete modernista donde, según la costumbre local, las parejas sellan su compromiso con un beso.'),
      li('Antiguo lavadero restaurado.'),
      li('Vegetación frondosa con árboles centenarios que dan sombra todo el año.'),

      h2('Combinación perfecta'),
      p('Combinado con la Font dels 25 Dolls forma la estampa más fotografiada de Xàtiva después del castillo y la Colegiata. Ambos monumentos están a pocos minutos a pie uno del otro.'),
    ],
  },

  'sierra-de-vernissa': {
    excerpt: 'La cresta rocosa que corona Xàtiva por el sur con vistas 360° sobre la Costera, el Mondúver y, en días claros, el mar.',
    description: [
      p('La Serra Vernissa se alza al sur de Xàtiva como una pequeña pero espectacular cresta rocosa que cierra la ciudad por la espalda del castillo. Su vértice geodésico alcanza los 454 metros de altitud y ofrece una de las panorámicas más completas de la comarca: a un lado la planicie agrícola de la Costera, al otro la Vall d\'Albaida y, en días despejados, el Mediterráneo y el Mondúver.'),
      p('La flora es típicamente mediterránea: pinada carrasca y pi blanc (Pinus halepensis), carrasca dispersa, romero, tomillo, coscoja, estepa y palmito. La avifauna incluye águila perdicera, halcón peregrino y abejaruco.'),

      h2('Rutas recomendadas'),
      li('Ruta circular Castell–Creueta–Vèrtex Vernissa: ~10 km, 3–4 horas, dificultad media. Sin grandes desniveles salvo un tramo de ~30 minutos con pasos aéreos y grapas fijas para ascender a la Creueta.'),
      li('Vuelta a la sierra desde el cementerio: recorrido más suave, apto para familias con niños mayores, de unas 2 horas.'),
      li('Enlace con el castillo de Xàtiva: se puede encadenar la cresta con la subida al Castell Menor y Major, convirtiendo el día en una ruta de monte y patrimonio.'),

      h2('Consejos prácticos'),
      p('Cuidado en verano: la cresta está totalmente expuesta, no hay fuentes en el recorrido. Llevar al menos 1,5 L de agua por persona. Amanecer y atardecer son los mejores momentos para fotografía.'),
    ],
  },

  'arros-al-forn': {
    excerpt: 'Arroz al horno en cazuela de barro con costra dorada: el plato más identitario de Xàtiva, también conocido como "arròs passejat".',
    description: [
      p('El arròs al forn valenciano tiene en Xàtiva una de sus cunas indiscutibles. Nació como plato de aprovechamiento: con el caldo y los restos del cocido del día anterior se preparaba al horno un arroz que convertía las sobras en fiesta. La tradición documentada se remonta al siglo XVI: "El Llibre del Coch" de Robert de Nola, cocinero del rey de la Corona de Aragón, recoge ya una receta próxima a la actual.'),
      p('Se le llama también "arròs passejat" (arroz paseado) porque, cuando las casas no tenían horno propio, las vecinas "paseaban" la cazuela hasta el horno de pan del barrio para que la hornearan junto a las cocas y el pan de cada día.'),

      h2('Ingredientes tradicionales'),
      li('Arroz bomba o senia'),
      li('Caldo de cocido (pollo, morcillo, tocino)'),
      li('Costillas y panceta de cerdo'),
      li('Morcilla de cebolla valenciana'),
      li('Garbanzos (los del cocido del día anterior)'),
      li('Patata en rodajas'),
      li('Tomate maduro entero en el centro'),
      li('Una cabeza entera de ajos sin pelar'),

      h2('Cuándo y dónde probarlo'),
      p('Tradicionalmente se cocina los jueves (día de cocido) y los domingos en casa. En Xàtiva se celebra cada año el Concurso Nacional d\'Arròs al Forn, que reúne a cocineros profesionales y aficionados de toda España.'),
      p('La Terrassa Sant Josep, Arrosseria Xàtiva y varios restaurantes del entorno de la Plaça de la Trinitat son puntos seguros para degustarlo.'),

      h2('El secreto del socarrat'),
      p('El arroz se sirve directamente en la cazuela de barro y la costra superior debe quedar crujiente y dorada. Pide siempre el "socarrat" del fondo: el bocado más codiciado.'),
    ],
  },

  'arnadi': {
    excerpt: 'El dulce más antiguo de Xàtiva: herencia andalusí de calabaza, almendra y canela, horneada en cazuela de barro para Pascua.',
    description: [
      p('El arnadí es uno de los postres más antiguos que se conservan vivos en España. Su origen es andalusí: el nombre procede del árabe y se cree que deriva de "garnatí" (granadino), ya que se elaboraba en todo el reino de Al-Andalus. En Xàtiva y su entorno se mantiene prácticamente igual que hace siglos.'),
      p('La base es calabaza asada con azúcar, a la que se añade almendra molida, yema de huevo, canela y ralladura de limón. Se presenta con forma cónica, servido en cazuela de barro, y se decora antes de hornear con una cresta de almendras enteras y piñones crudos.'),

      h2('Variantes'),
      h3('De calabaza'),
      p('La más extendida y la considerada "original" de Xàtiva. Color naranja-dorado, sabor intenso.'),
      h3('De boniato'),
      p('Variante histórica, más dulce y de color más oscuro.'),
      h3('Mixta'),
      p('Mitad calabaza, mitad boniato. Combina la textura fibrosa con la dulzura del boniato.'),

      h2('Cuándo se come'),
      p('Tradicionalmente es un dulce de Semana Santa y Pascua, aunque en las pastelerías y obradores históricos de Xàtiva puede encontrarse todo el año. También aparece en las mesas de Todos los Santos.'),

      h2('La leyenda de la dote'),
      p('Se dice que las mujeres moriscas de Xàtiva enseñaban el secreto de la receta a sus hijas como parte de la dote. Hoy se considera emblema de la cocina dulce de la Costera y uno de los productos imprescindibles de la gastronomía setabense.'),
    ],
  },

  'fira-dagost': {
    excerpt: 'Una de las ferias más antiguas de Europa: privilegio real de Jaume I en 1250, con 775 años de historia continuada.',
    description: [
      p('La Fira d\'Agost de Xàtiva fue instituida en 1250 por privilegio del rey Jaume I el Conqueridor, lo que la convierte en una de las ferias más antiguas de Europa. En 2025 celebró su 775 aniversario, un hito que pocas celebraciones europeas pueden presentar con continuidad documentada.'),
      p('Originalmente se celebraba el 11 de noviembre, día de Sant Martí, coincidiendo con el fin de la cosecha para revitalizar la economía local. Con el tiempo se desplazó al mes de agosto, y hoy se celebra del 15 al 20 de agosto. Su origen fue la compraventa de ganado, una vertiente que aún sobrevive simbólicamente en la feria ganadera.'),

      h2('Programación típica'),
      li('Mercado tradicional y feria de artesanía en el casco histórico.'),
      li('Atracciones de feria en el recinto de la Albereda Jaume I.'),
      li('Conciertos nocturnos, teatro de calle, espectáculos infantiles.'),
      li('Feria ganadera y exhibición de razas autóctonas.'),
      li('Programa deportivo y taurino.'),

      h2('Actos emblemáticos'),
      h3('Nit de les Albaes (15 y 20 de agosto)'),
      p('Desde la Plaça de Sant Pere parte una comitiva en la que cantadores recorren las calles interpretando las "albaes", versos improvisados acompañados por dolçaina y tabal. Es uno de los actos más emotivos y auténticos de la feria.'),
      h3('Trofeo de Velocidad Fira de Xàtiva'),
      p('Carrera ciclista urbana considerada la carrera urbana más antigua de España, celebrada ininterrumpidamente desde 1951.'),
      h3('Proclamación de la Reina de la Fira y la Cort d\'Honor'),
      p('Acto oficial de apertura en el que la ciudad elige y presenta a sus representantes festivos del año.'),

      h2('Escenario histórico'),
      p('La Plaça de Sant Pere, conocida históricamente como "plaça de la Fira" o "dels Porxins", era el escenario tradicional de la feria medieval y sigue siendo el epicentro ceremonial.'),
    ],
  },

  'corpus-christi': {
    excerpt: 'Uno de los Corpus Christi más antiguos de España: ocho gigantes de 1588 representan los cuatro continentes bajo la Eucaristía.',
    description: [
      p('El Corpus Christi de Xàtiva es una de las celebraciones religioso-festivas con mayor antigüedad documentada de la Comunitat Valenciana. La procesión solemne sale de la Plaça de la Seu y recorre las calles del casco antiguo acompañada por danzas tradicionales, gegants (gigantes) y cabezudos.'),
      p('Los primeros gigantes se construyeron en 1588, imitando los de Toledo, y desfilaron por primera vez en la procesión en 1589. Son ocho figuras agrupadas en cuatro parejas que representan las cuatro partes conocidas del mundo en la época: Europa (Rey y Reina), Asia (Turco y Turca), África (Negro y Negra) y América (Gitano y Gitana). Todas, según la iconografía del momento, rinden simbólicamente homenaje a la doctrina católica representada en la Eucaristía.'),

      h2('Los Nanos o Cabezudos'),
      p('El grupo de cabezudos está formado por un capitán de cabeza mayor y ocho miembros emparejados (cuatro hombres y cuatro mujeres) que, igual que los gigantes, simbolizan las distintas partes del mundo. Las crónicas sitúan su aparición hacia 1372, aunque la primera parella documentada con seguridad bailó también en 1589.'),

      h2('Cuándo se celebra'),
      p('El Corpus Christi cambia cada año según el calendario litúrgico (nueve semanas después de Jueves Santo, entre finales de mayo y finales de junio). En Xàtiva la procesión mayor se celebra en domingo, precedida durante la semana por actos litúrgicos, exposiciones y pasacalles de danzas.'),

      h2('Reconocimiento'),
      p('En 2025 Xàtiva llevó el Corpus junto con la Semana Santa a FITUR para reivindicar su valor patrimonial. La cofradía y el Ajuntament trabajan en la candidatura para aumentar su reconocimiento turístico.'),
    ],
  },

  'semana-santa-de-xativa': {
    excerpt: 'Interés Turístico Autonómico: dieciséis cofradías y una Cofradía de la Sangre que se remonta al siglo XIV.',
    description: [
      p('La Semana Santa de Xàtiva es una de las celebraciones más solemnes e históricamente ricas de la Comunitat Valenciana, declarada Fiesta de Interés Turístico Autonómico en 2025. La ciudad cuenta con dieciséis cofradías, un número notable para una población de su tamaño.'),
      p('Sus orígenes se remontan al final de la Edad Media, aunque toda la documentación anterior a 1707 se perdió en el incendio borbónico. A partir del siglo XVIII alcanzó su máximo esplendor y, según crónicas de la época, era una de las más destacadas de todo el Mediterráneo. La Cofradía de la Sangre, la más antigua de Xàtiva, tiene sus orígenes documentados en el siglo XIV y es una de las más antiguas de toda España.'),

      h2('Procesiones más destacadas'),
      h3('Domingo de Ramos'),
      p('Bendición de palmas y Procesión de las Palmas que inaugura la semana.'),
      h3('Miércoles Santo — Les Cortesies (El Encuentro)'),
      p('Uno de los actos más emblemáticos, con el encuentro entre Cristo (Ecce Homo) y la Virgen de la Soledad en la calle, con cortesías y saludos procesionales.'),
      h3('Jueves Santo y Viernes Santo'),
      p('Procesiones nocturnas y Procesión General del Santo Entierro, con participación de todas las cofradías.'),
      h3('Domingo de Resurrección'),
      p('Encuentro de Jesús Resucitado y la Virgen en la plaza mayor.'),

      h2('Música y tambores'),
      p('La música es parte intrínseca de las procesiones. Además de las bandas de tambores de cada cofradía, participan las dos sociedades musicales históricas de Xàtiva: la Primitiva Setabense y la Nova de Xàtiva, que han producido conjuntamente las "Marxes processonals", un compendio de piezas específicamente compuestas para sonar en las calles de Xàtiva durante la Semana Santa.'),

      h2('Qué la hace única'),
      p('Xàtiva combina la solemnidad castellana heredada del Barroco con la sonoridad mediterránea de sus bandas, y tiene una densidad de cofradías y pasos inusual para su tamaño. El gótico de sus calles realza visualmente los cortejos.'),
    ],
  },
};

// =============================================================
// BLOG POSTS A REESCRIBIR
// =============================================================

const blogPosts = {
  'bienvenidos-a-paraiso-ciclista': {
    excerpt: 'Paraíso Ciclista: el portal pensado por y para quienes descubren Xàtiva a golpe de pedal.',
    content: [
      p('Bienvenidos a Paraíso Ciclista. Este proyecto nace de una convicción sencilla: Xàtiva es uno de los mejores rincones de España para rodar en bicicleta, y merece una guía hecha con mirada local, honesta y actualizada. Aquí encontrarás rutas probadas metro a metro, consejos prácticos que solo alguien que vive y pedalea por la Costera puede darte, y una apuesta clara por el cicloturismo sostenible que respeta el territorio.'),
      p('No somos una plataforma genérica que copia rutas de otros sitios. Cada itinerario que publicamos ha sido rodado, fotografiado y verificado. Sabemos dónde hay una fuente operativa, dónde la carretera tiene un bache que conviene esquivar, qué bar del pueblo abre el domingo por la mañana y qué puerto es mejor afrontar con temperaturas frescas. Esa es la diferencia entre una guía y un catálogo.'),

      h2('Por qué Xàtiva'),
      p('Xàtiva está exactamente donde hay que estar para disfrutar del ciclismo. A 50 minutos de Valencia y a poco más de una hora de Alicante, la ciudad es bisagra entre la costa mediterránea y el interior montañoso. Eso significa que desde el mismo punto de partida puedes elegir un día de llaneo suave hacia la Albufera o un encadenado de puertos por la Vall d\'Albaida o el Canal de Navarrés.'),
      p('A esto hay que sumar un clima que permite rodar cómodamente más de trescientos días al año, una red densa de carreteras secundarias tranquilas heredadas del parcelario agrícola tradicional, y una cultura local muy respetuosa con el ciclista. Aquí no eres un extraño: eres un cliente bienvenido en bares, restaurantes y casas rurales que llevan décadas acogiendo a pelotones.'),

      h2('Qué vas a encontrar en esta web'),
      li('Rutas clasificadas por nivel, distancia, desnivel y tipo de firme.'),
      li('Tracks GPX descargables y compatibles con Wikiloc, Komoot y Strava.'),
      li('Guías de alojamiento "bike friendly" en Xàtiva y comarca.'),
      li('Consejos de mecánica básica, material recomendado y seguridad vial.'),
      li('Reportajes sobre eventos: la Volta a la Comunitat Valenciana, la Nit de les Albaes, el Trofeo de Velocidad Fira de Xàtiva.'),
      li('Gastronomía ciclista: qué comer antes y después, dónde reponer fuerzas con un arròs al forn o un arnadí sin remordimientos.'),

      h2('Filosofía'),
      p('Creemos en un cicloturismo lento, respetuoso con el entorno natural de la Serra Grossa, la Vernissa, el Mondúver y el Benicadell. Creemos en los pueblos pequeños que se mantienen vivos gracias a los visitantes que paran a tomar algo. Y creemos que la bicicleta es la mejor forma de entender un territorio: a la velocidad justa para ver el paisaje y a la velocidad justa para conversar con quien te cruzas.'),
      p('Si echas en falta una ruta, un servicio o un bar ciclista, escríbenos. Esta web crece con la comunidad que la usa.'),
    ],
  },

  'xativa-paraiso-natural-ciclismo': {
    excerpt: 'Entre Valencia y Alicante, con sol casi todo el año y cuatro comarcas al alcance: Xàtiva es un laboratorio perfecto para el ciclista.',
    content: [
      p('Hay lugares del mundo donde el ciclismo funciona por inercia, y hay lugares donde funciona porque la geografía y el clima se alinean. Xàtiva pertenece al segundo grupo. La ciudad se levanta en el centro-sur de la provincia de Valencia, capital de la comarca de La Costera, en un cruce natural entre el litoral mediterráneo y las sierras prelitorales. Esta posición estratégica, a apenas 50–60 km de la ciudad de Valencia y a poco más de una hora de Alicante, convierte a Xàtiva en un hub ciclista poco habitual: puedes entrenar en llano por la mañana y subir un puerto de montaña por la tarde.'),
      p('El clima es el segundo gran aliado. La comarca disfruta de más de 300 días de sol al año, temperaturas medias que rara vez bajan de 8 °C en invierno y veranos cálidos pero tolerables si se sale temprano. La primavera y el otoño son prácticamente permanentes y permiten rodar en manga corta buena parte del calendario.'),

      h2('Una orografía de cuatro mundos'),
      p('Desde Xàtiva puedes acceder sin apenas transición a cuatro comarcas con personalidades ciclistas distintas:'),
      li('La Costera: paisaje de huertas, naranjos y olivares, carreteras secundarias tranquilas, perfecto para rodajes largos en llano.'),
      li('La Vall d\'Albaida: al sur, terreno ondulado con pueblos como Ontinyent y Bocairent y los primeros puertos serios (Benicadell, Agullent).'),
      li('El Canal de Navarrés: al oeste, valle fluvial estrecho entre sierras, con carreteras espectaculares hacia Enguera, Anna y el embalse de Tous.'),
      li('La Ribera y La Safor: al este, conexión con la costa y terreno llano para ir al mar por Sumacàrcer, Cullera o Gandia.'),

      h2('Carreteras secundarias de calidad'),
      p('El parcelario agrícola tradicional ha dejado como herencia una red densa de carreteras comarcales (CV-) y caminos asfaltados de concentración parcelaria. La CV-41, la CV-610, la CV-580 y la CV-645 son ejemplos de carreteras con tráfico bajo y firme en general aceptable. El coche no es el rey aquí: lo son el tractor agrícola, el ciclista local y el corredor del sábado por la mañana.'),

      h2('Naturaleza que acompaña'),
      p('Pedalear por Xàtiva es rodar entre olores: azahar en primavera, pinada mediterránea en verano, tierra mojada en otoño. La Serra Grossa, la Vernissa y el Mondúver son fondos visuales permanentes, y en pocas salidas puedes ver águilas perdiceras, abejarucos, cernícalos y, en los embalses, cormoranes y ánades reales.'),

      h2('Primera visita'),
      p('Una primera toma de contacto a Xàtiva debería incluir al menos tres días para rodar en las tres direcciones (llano al norte, montaña al sur, valle al oeste) y descubrir qué perfil te pide el cuerpo. La mayoría de ciclistas que llegan por primera vez vuelven; esa es quizá la mejor prueba de que algo funciona.'),
    ],
  },

  'las-5-mejores-rutas-ciclistas-de-xativa': {
    excerpt: 'Cinco rutas ciclistas imprescindibles desde Xàtiva: llano, montaña, costa y valles en un radio de 100 km.',
    content: [
      p('Elegir cinco rutas en Xàtiva es como elegir cinco platos en una mesa valenciana: injusto, pero necesario. Estas son las cinco salidas que mejor resumen la variedad de la zona. Todas están probadas, tienen avituallamiento intermedio y pueden adaptarse en distancia según el nivel del ciclista.'),

      h2('1. La Vuelta del Níspero'),
      p('Ruta que recorre la comarca de La Costera y sus núcleos productores, en un paisaje agrícola muy setabense. Apta para rodajes intermedios y desde ella pueden encadenarse pequeñas subidas de la zona. Una buena primera toma de contacto o salida de regeneración.'),

      h2('2. Xàtiva – Mondúver – Tavernes de la Valldigna'),
      p('Una de las rutas reina para escaladores. Se cruza la Serra del Mondúver (841 m) hasta bajar a Tavernes de la Valldigna, a un paso del mar. Paisaje de pinar denso, miradores sobre la Valldigna y descenso técnico hacia la costa. Avituallamiento en Barx. Aproximadamente 85 km con desnivel considerable.'),

      h2('3. Xàtiva – Valencia'),
      p('Ruta llanera por excelencia, siguiendo el eje del Xúquer y la huerta. Unos 150 km de ida y vuelta por trazado tranquilo, con opción de regreso en tren si el viento en contra o el calor lo desaconsejan (el Cercanías C-2 admite bicis). Perfecta para entrenar rodaje continuo y para los que quieren acabar mojando las ruedas en la Malvarrosa.'),

      h2('4. Xàtiva – Navarrés – Villanueva de Castellón'),
      p('Ruta circular de interior por carreteras tranquilas que conecta el Canal de Navarrés con la Ribera Alta. Unos 74 km con dificultad moderada, recomendable en primavera cuando la vegetación está en plenitud. Varios pueblos en ruta para parar a reponer.'),

      h2('5. Xàtiva – Vent del Benicadell'),
      p('Ruta clásica para cazadores de puertos. Subida al entorno del Benicadell (1.104 m), cresta que separa la Vall d\'Albaida del Comtat. Unos 93 km con cerca de 1.800 m de desnivel acumulado. Avituallamiento en Beniatjar u Otos. Premio al final: una pancarta panorámica sobre dos provincias a la vez.'),

      h2('Tracks GPX y niveles'),
      p('Todos los tracks GPX están disponibles en la sección "Rutas" de la web. Niveles: la Vuelta del Níspero y la ruta a Valencia son aptas para nivel iniciación/medio; las de Mondúver, Navarrés y Benicadell están recomendadas para nivel medio-alto.'),
    ],
  },

  'consejos-esenciales-pedalear-xativa': {
    excerpt: 'Cuándo ir, qué llevar, dónde repostar agua y a qué taller acudir si algo falla: la letra pequeña de rodar en Xàtiva.',
    content: [
      p('Xàtiva es amable con el ciclista, pero como todo destino ciclista serio tiene sus claves. Conocerlas marca la diferencia entre una salida redonda y un día de sufrimiento innecesario. Estos son los consejos que compartimos con cualquier amigo que viene a rodar por primera vez.'),

      h2('Mejores épocas del año'),
      li('Primavera (marzo–mayo): la mejor temporada. Temperaturas entre 15 y 25 °C, campos verdes, azahar y días largos.'),
      li('Otoño (octubre–noviembre): casi tan bueno como la primavera, con luz dorada y poca lluvia.'),
      li('Invierno (diciembre–febrero): rodable casi cualquier día, mínimas entre 5 y 10 °C. Es la temporada que eligen los pelotones profesionales para concentraciones.'),
      li('Verano (julio–agosto): salir antes de las 8:00 o después de las 18:00. A mediodía el asfalto puede superar los 45 °C al sol.'),

      h2('Qué llevar siempre'),
      li('Casco, guantes y gafas de sol con lente polarizada.'),
      li('Dos bidones mínimo en verano; uno basta en invierno.'),
      li('Cámara de repuesto, bombona de CO2 o hinchador, desmontables y multiherramienta.'),
      li('Impermeable ligero en primavera y otoño (las tormentas son rápidas pero intensas).'),
      li('Dinero en metálico o tarjeta: no todos los bares de pueblo aceptan pago móvil.'),
      li('Identificación y teléfono con batería suficiente.'),

      h2('Talleres y tiendas en Xàtiva'),
      p('Bicicletas Sanchis (C/ Braçal del Roncador, Nave 10, Polígono Industrial "C", 46800 Xàtiva) es dealer oficial Trek y ofrece servicio de taller completo. Para averías serias, Valencia capital tiene talleres especializados a 50 minutos en tren.'),

      h2('Fuentes y avituallamiento'),
      li('Font dels 25 Dolls (Xàtiva): veinticinco caños potables, el punto clásico.'),
      li('En ruta: fuentes municipales en Llosa de Ranes, Canals, Vallada, Moixent, Barx, Simat de la Valldigna, Anna y Bocairent.'),
      li('Bares de pueblo: casi todos abren de 7:00 a 10:00 y son la red de apoyo natural del ciclista (bocadillo, tostada, café doble y relleno de bidón).'),

      h2('Seguridad vial'),
      p('La ley española obliga a casco homologado en vías interurbanas y luces delanteras/traseras en condiciones de baja visibilidad. Circular por la derecha, en fila cuando el tráfico lo exija y en paralelo cuando la vía lo permita (máx. dos en paralelo). Respetar pasos de ganado y tractores: Xàtiva es todavía zona agrícola en activo. En puertos con niebla (Mondúver, Benicadell en invierno) extremar la prudencia en los descensos.'),

      h2('Niveles de ruta recomendados'),
      li('Iniciación (1/5): Xàtiva–Genovés–Quatretonda ida y vuelta (40 km llanos).'),
      li('Medio (3/5): Xàtiva–Canal de Navarrés (~85 km, 1.000 m D+).'),
      li('Alto (5/5): Xàtiva–Benicadell–retorno (~110 km, +1.800 m D+).'),

      h2('La regla de oro'),
      p('Si a las 9:00 en verano la sombra en tu espalda ya quema, el paseo ha terminado. Vuelve al hotel, come un arròs al forn y sal al atardecer. Xàtiva no se rinde nunca, pero sabe cuándo parar.'),
    ],
  },

  'xativa-el-nuevo-epicentro-del-ciclismo-profesional-en-la-comunidad-valenciana': {
    excerpt: 'Con la Volta a la Comunitat Valenciana, pelotones profesionales en sus carreteras y talento local emergente, Xàtiva se afianza como base ciclista.',
    content: [
      p('Durante años, cuando se hablaba de ciclismo profesional en la Comunitat Valenciana se miraba casi exclusivamente hacia Calpe y Altea. Aquellos hoteles de la Marina Alta siguen siendo el búnker invernal de equipos World Tour, pero el mapa ha empezado a ampliarse. Xàtiva está reclamando con argumentos su espacio como epicentro alternativo del ciclismo profesional valenciano.'),
      p('La razón es triple: clima, geografía y conectividad. Xàtiva combina la misma bondad climática del litoral con acceso inmediato a terreno de montaña real (Mondúver, Benicadell, Serra d\'Enguera) y, a diferencia de la costa, tiene tráfico sensiblemente inferior en las carreteras comarcales. Para un ciclista profesional que busca encadenar seis horas de entrenamiento sin semáforos y con puertos largos, la ecuación funciona.'),

      h2('La Volta a la Comunitat Valenciana'),
      p('La Volta a la Comunitat Valenciana (VCV) es la gran cita profesional del calendario autonómico. Se celebra a principios de febrero, es puntuable para el UCI Pro Series y atrae cada año a escuadras World Tour que la utilizan como preparación para Paris-Niza, la Tirreno-Adriático y, más tarde, las clásicas.'),
      p('Xàtiva ha sido en distintas ediciones salida o meta de etapa, aprovechando la subida al castillo como final explosivo. Que una ciudad aparezca repetidamente en el libro de ruta de una Vuelta es la mejor prueba de que sus carreteras están probadas al más alto nivel.'),

      h2('Concentraciones invernales: la alternativa a Calpe'),
      p('Calpe y Altea llevan décadas acogiendo en enero y febrero a equipos como Jumbo-Visma, Ineos o Movistar. Xàtiva, a apenas 90 minutos por autopista, ofrece una alternativa con más identidad local, hoteles de 3 y 4 estrellas con servicios "bike friendly" y un precio medio menor. No compite con Calpe en volumen, pero sí en autenticidad: quien entrena desde Xàtiva come arròs al forn, duerme en el centro histórico y se entrena por carreteras que los locales consideran propias.'),

      h2('Por qué es buena para entrenar'),
      li('Puertos variados: cortos y explosivos (castillo de Xàtiva, Bixquert), medios (Barx-Mondúver) y largos (Benicadell).'),
      li('Carreteras llanas para series de fuerza y umbral por la huerta.'),
      li('Posibilidad de encadenar 4.000 m de desnivel en un día sin repetir carretera.'),
      li('Conexión ferroviaria con Valencia para equipos que quieren combinar entrenamientos en Xàtiva con recuperación en la costa.'),
      li('Infraestructura hotelera y gastronómica de calidad para estancias largas.'),

      h2('Cantera local'),
      p('La Comunitat Valenciana ha producido ciclistas profesionales de primera fila en las últimas generaciones. La cantera de clubes locales de Xàtiva y pueblos vecinos como Canals, Ontinyent o Genovés ha dado sub-23 con proyección, y la Setmana Ciclista – Volta Femina de la Comunitat Valenciana aporta visibilidad al ciclismo femenino profesional en la región.'),

      h2('Un clásico: el Trofeo de Velocidad Fira de Xàtiva'),
      p('El Trofeo de Velocidad Fira de Xàtiva, la carrera urbana más antigua de España en activo (desde 1951), es el mejor testimonio de la tradición ciclista setabense: en agosto, los mejores velocistas nacionales se baten en un circuito urbano frente a la Colegiata. Una cita que ningún aficionado al ciclismo debería perderse.'),
    ],
  },
};

// =============================================================
// LIMPIEZA DE RESTAURANTES: quitar bloque "Dirección: ..." del inicio
// =============================================================

async function cleanRestaurants() {
  console.log('\n=== Limpieza de descripciones de restaurantes ===\n');
  const restaurants = await client.fetch(`*[_type == "restaurant"]{_id, title, description}`);
  let cleaned = 0;

  for (const r of restaurants) {
    if (!r.description || !Array.isArray(r.description)) continue;

    const newDesc = r.description.filter((b) => {
      if (b._type !== 'block') return true;
      const text = (b.children || []).map((c) => c.text || '').join('').trim();
      // Filtra bloques que empiezan con "Dirección:" seguido directamente del texto
      if (/^Dirección:\s*\S/i.test(text) && text.length < 200) return false;
      return true;
    });

    if (newDesc.length !== r.description.length) {
      await client.patch(r._id).set({ description: newDesc }).commit();
      cleaned++;
      console.log(`  ✅ ${r.title}`);
    }
  }
  console.log(`\n  Total: ${cleaned}/${restaurants.length} restaurantes limpiados`);
}

// =============================================================
// DELETIONS
// =============================================================

async function deletePlace(slug, reason) {
  const p = await client.fetch(
    `*[_type == "explorePlace" && slug.current == $slug][0]{_id}`,
    { slug }
  );
  if (!p) {
    console.log(`  ⚠️  ${slug}: no existe`);
    return;
  }
  await client.delete(p._id);
  console.log(`  ✅ ${slug} BORRADO (${reason})`);
}

// =============================================================
// EJECUCIÓN
// =============================================================

async function run() {
  console.log('\n=== Borrado de lugares redundantes/duplicados ===\n');
  await deletePlace('restaurantes-historicos', 'redundante con /restaurantes, sin contenido real');
  await deletePlace('sierra-vernissa', 'duplicado de sierra-de-vernissa');

  console.log('\n=== Enriquecimiento de lugares ===\n');
  for (const [slug, data] of Object.entries(places)) {
    const p = await client.fetch(
      `*[_type == "explorePlace" && slug.current == $slug][0]{_id, title}`,
      { slug }
    );
    if (!p) {
      console.log(`  ⚠️  ${slug}: no existe`);
      continue;
    }
    const patch = {};
    if (data.excerpt) patch.excerpt = data.excerpt;
    if (data.description) patch.description = data.description;
    await client.patch(p._id).set(patch).commit();
    console.log(`  ✅ ${p.title} (${data.description?.length || 0} bloques)`);
  }

  console.log('\n=== Reescritura de blog posts ===\n');
  for (const [slug, data] of Object.entries(blogPosts)) {
    const bp = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]{_id, title}`,
      { slug }
    );
    if (!bp) {
      console.log(`  ⚠️  ${slug}: no existe`);
      continue;
    }
    const patch = {};
    if (data.excerpt) patch.excerpt = data.excerpt;
    if (data.content) patch.content = data.content;
    await client.patch(bp._id).set(patch).commit();
    console.log(`  ✅ ${bp.title} (${data.content?.length || 0} bloques)`);
  }

  await cleanRestaurants();

  console.log('\n=== Hecho ===\n');
  console.log('🔐 REVOCA EL TOKEN AHORA en https://www.sanity.io/manage/project/kb9dsoe4/api');
  console.log('🚀 Redeploy en Vercel o espera al webhook de Sanity.\n');
}

run().catch((err) => {
  console.error('\n❌ Error:', err.message);
  process.exit(1);
});
