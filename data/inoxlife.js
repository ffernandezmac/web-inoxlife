/**
 * Datos verificados de INOXLIFE (extraídos de inoxlife.es y dossier corporativo Inoxlife_ES).
 * Los puntos pendientes de validar con dirección están señalizados en `pendingValidation`.
 */
export const INOXLIFE_DATA = {
  company: {
    name: "INOXLIFE",
    legalName: "Inoxlife S.L.",
    sloganOriginal: "Our life is Stainless Steel",
    tagline: "Ingeniería, fabricación y montaje a medida en acero inoxidable",
    experienceYears: "+25 años",
    phoneDisplay: "912 66 69 73",
    phoneHref: "tel:+34912666973",
    email: "info@inoxlife.es",
    address: "Ctra. Carril de Guetara, 78 · Pol. Ind. Villa Rosa",
    city: "29010 Málaga, España",
    coverage: "Málaga, Costa del Sol, Gibraltar, Península y Baleares",
    responsePromise: "Respuesta técnica en 24–48 h laborables",
    heritage:
      "Convertida en S.L., nace como heredera de la que fue durante décadas la fábrica malagueña de estructuras metálicas, integrando oficina técnica de Ingeniería, Arquitectura y Diseño con taller propio.",
    pendingValidation: [
      "Confirmar si se mantiene la mención a +40.000 m² de naves en diferentes instalaciones.",
      "Confirmar si sigue operativa la sede/delegación comercial en Madrid.",
      "Confirmar alcance actual de la alianza industrial con NAVACEL Procesos Industriales.",
      "Confirmar si la Mesa CUBIC (8.500 €) se mantiene como pieza bajo pedido o se retira la venta unitaria."
    ]
  },

  heroSlides: [
    {
      id: "wtc",
      code: "REF. WTC-GIB · ESTRUCTURA SINGULAR",
      title: "World Trade Center · Gibraltar",
      spec: "AISI 316L Marino · Pasarela acristalada, marquesinas y árbol interior",
      image: "assets/img/projects/wtc-gibraltar-1.jpg",
      alt: "Estructura exterior y marquesinas en acero inoxidable del World Trade Center en Gibraltar realizadas por Inoxlife"
    },
    {
      id: "crowne",
      code: "REF. CP-EST · OBRA HOTELERA",
      title: "Hotel Crowne Plaza · Estepona",
      spec: "AISI 316L + Vidrio laminado · Marquesina monumental de acceso",
      image: "assets/img/projects/crowne-plaza-1.jpg",
      alt: "Marquesina monumental en acero inoxidable y vidrio en Hotel Crowne Plaza Estepona"
    },
    {
      id: "escalera",
      code: "REF. BLL-MLG · ARQUITECTura INTERIOR",
      title: "Bufete López Linares · Málaga",
      spec: "AISI 304 Satinado/Espejo · Escalera helicoidal con peldaños de vidrio",
      image: "assets/img/projects/lopez-linares-1.jpg",
      alt: "Escalera interior de acero inoxidable y peldaños de vidrio laminado en Málaga"
    }
  ],

  services: [
    {
      id: "escaleras-barandillas",
      num: "01",
      title: "Barandillas y escaleras singulares",
      summary:
        "Escaleras helicoidales, de caracol, con eje central o zanca vista y barandillas curvas con vidrio estructural para viviendas, oficinas y puertos deportivos.",
      alloys: "AISI 304 · AISI 316L Marino · Vidrio laminado templado",
      finish: "Satinado esmerilado, pulido espejo o combinado con madera/vidrio",
      locationExample: "Bufete López Linares (Málaga) · Puerto Deportivo (Marbella)",
      image: "assets/img/projects/lopez-linares-1.jpg",
      alt: "Escalera a medida de acero inoxidable con peldaños de vidrio realizada por Inoxlife"
    },
    {
      id: "marquesinas-hoteles",
      num: "02",
      title: "Marquesinas, fachadas y obra hotelera",
      summary:
        "Marquesinas de gran vuelo, revestimiento de pilares, pasarelas acristaladas, accesos y equipamiento exterior para cadenas hoteleras y edificios corporativos.",
      alloys: "AISI 316L alta resistencia a salinidad · Perfilería estructural",
      finish: "Acabado marino anticorrosión, soldadura TIG vista o pulida",
      locationExample: "Hotel Crowne Plaza (Estepona) · Amàre Beach Hotel (Marbella e Ibiza)",
      image: "assets/img/projects/crowne-plaza-1.jpg",
      alt: "Marquesina de entrada en acero inoxidable para el Hotel Crowne Plaza de Estepona"
    },
    {
      id: "proyectos-especiales",
      num: "03",
      title: "Proyectos especiales y obra civil",
      summary:
        "Estructuras no seriadas de alta complejidad geométrica: árboles estructurales interiores, puentes acristalados, monumentos urbanos y elementos de templos.",
      alloys: "Acero inoxidable estructural · Latón · Acero al carbono tratado",
      finish: "Cálculo por elementos finitos, despiece CAD 3D y montaje especial",
      locationExample: "World Trade Center (Gibraltar) · Estupa Budista (Benalmádena)",
      image: "assets/img/projects/wtc-gibraltar-2.jpg",
      alt: "Árbol estructural interior y pasarela en acero inoxidable en el World Trade Center de Gibraltar"
    },
    {
      id: "decoracion-piscinas",
      num: "04",
      title: "Decoración, chimeneas, mesas y piscinas inox",
      summary:
        "Revestimiento de chimeneas en latón e inoxidable, mobiliario para hostelería y viviendas, mesas arquitectónicas (serie CUBIC) y vasos de piscina en acero inoxidable.",
      alloys: "AISI 304 / 316L · Latón natural y envejecido · Vidrio templado",
      finish: "Plegado de precisión sin juntas visibles, estanqueidad TIG",
      locationExample: "Chalet en Estepona · Restaurante en Soho Málaga · Villas Costa del Sol",
      image: "assets/img/projects/decoracion-chimenea.jpg",
      alt: "Trabajo de decoración e interiorismo metálico a medida por Inoxlife"
    },
    {
      id: "ingenieria-gran-formato",
      num: "05",
      title: "Ingeniería y grandes desarrollos industriales",
      summary:
        "Departamento propio de Ingeniería, Arquitectura y Diseño para levantar planos, calcular estructuras y ejecutar proyectos industriales de gran envergadura.",
      alloys: "Acero inoxidable industrial · Calderería y estructuras pesadas",
      finish: "Trazabilidad certificada (proveedores como Acerinox) y alianza con NAVACEL",
      locationExample: "Parque Tecnológico (Málaga) · Proyectos internacionales",
      image: "assets/img/projects/wtc-gibraltar-3.jpg",
      alt: "Pasarela estructural acristalada y soportes de acero inoxidable de gran formato"
    }
  ],

  chapters: [
    {
      num: "01",
      code: "COTA 000 — 320 mm · OFICINA TÉCNICA",
      title: "Ingeniería, medición en obra y despiece bajo plano",
      lead: "Partimos del plano de tu estudio de arquitectura o realizamos el levantamiento y medición técnica directamente en obra.",
      details: [
        "Departamento propio de Ingeniería, Arquitectura y Diseño en Málaga.",
        "Revisión de cargas, anclajes, dilataciones y elección de aleación (AISI 304 interior o AISI 316L para costa y piscinas).",
        "Presupuesto desglosado y definición de acabados antes de cortar la primera pieza."
      ],
      metricLabel: "Tolerancia de diseño",
      metricValue: "± 0,5 mm CAD",
      image: "assets/img/projects/wtc-gibraltar-3.jpg",
      caption: "Fase 01 · Diseño estructural y definición de encuentros acero-vidrio"
    },
    {
      num: "02",
      code: "COTA 320 — 710 mm · FABRICACIÓN EN TALLER",
      title: "Corte, curvado y soldadura TIG en taller propio",
      lead: "Transformamos la materia prima en nuestras instalaciones del Polígono Industrial Villa Rosa (Málaga), sin intermediarios.",
      details: [
        "Materia prima de primera calidad (acero inoxidable suministrado por referentes como Acerinox, latón y vidrio estructural).",
        "Curvado de tubo y chapa para escaleras helicoidales, barandillas orgánicas y mobiliario sin aristas vivas.",
        "Soldadura TIG de penetración controlada, decapado, pasivado y pulido artesanal (satinado, vibrado o espejo)."
      ],
      metricLabel: "Trayectoria del equipo",
      metricValue: "+25 años",
      image: "assets/img/projects/taller-soldadura.jpg",
      caption: "Fase 02 · Fabricación, soldadura TIG y control dimensional en taller de Málaga"
    },
    {
      num: "03",
      code: "COTA 710 — 1000 mm · PUESTA EN OBRA",
      title: "Transporte especial, montaje e instalación llave en mano",
      lead: "Nuestro propio equipo de montadores instala la pieza en obra coordinándose con la dirección facultativa o el propietario.",
      details: [
        "Montaje limpio y seguro en hoteles en activo, edificios de oficinas, obra nueva y viviendas particulares.",
        "Ajuste final en destino de vidrios templados/laminados, pasamanos continuos y sellados.",
        "Capacidad para abordar desde una escalera única en una villa hasta grandes desarrollos junto a NAVACEL."
      ],
      metricLabel: "Cobertura habitual",
      metricValue: "Andalucía · Gibraltar · Nacional",
      image: "assets/img/projects/crowne-plaza-2.jpg",
      caption: "Fase 03 · Entrega e instalación final en Hotel Crowne Plaza Estepona"
    }
  ],

  projects: [
    {
      id: "wtc-gibraltar",
      title: "World Trade Center Gibraltar",
      location: "Gibraltar",
      category: "singular",
      categoryLabel: "Obra Singular y Corporativa",
      clientType: "Corporativo / Internacional",
      materials: "AISI 316L Marino · Vidrio estructural laminado",
      summary:
        "Ejecución integral de las marquesinas exteriores, revestimiento de columnas en acero inoxidable, árbol estructural en el atrio interior, zancas de escalera y pasarela acristalada en altura.",
      scope: [
        "Diseño técnico de encuentros, fabricación en Málaga y montaje en Gibraltar.",
        "Acero inoxidable AISI 316L resistente a ambiente marítimo severo.",
        "Pasarela interior acristalada y estructura arbórea central en acero pulido."
      ],
      images: [
        "assets/img/projects/wtc-gibraltar-1.jpg",
        "assets/img/projects/wtc-gibraltar-2.jpg",
        "assets/img/projects/wtc-gibraltar-3.jpg"
      ]
    },
    {
      id: "crowne-plaza-estepona",
      title: "Hotel Crowne Plaza Estepona",
      location: "Estepona (Málaga)",
      category: "hoteles",
      categoryLabel: "Hoteles y Contract",
      clientType: "Cadena Hotelera",
      materials: "AISI 316L · Vidrio templado laminado",
      summary:
        "Fabricación y montaje de la marquesina monumental de entrada principal y elementos de carpintería en acero inoxidable para hotel de 5 estrellas en la Costa del Sol.",
      scope: [
        "Estructura portante en acero inoxidable con techo acristalado de gran formato.",
        "Revestimientos de pilares y remates de alta precisión con acabado satinado marino.",
        "Coordinación en obra con constructora y dirección facultativa del hotel."
      ],
      images: [
        "assets/img/projects/crowne-plaza-1.jpg",
        "assets/img/projects/crowne-plaza-2.jpg"
      ]
    },
    {
      id: "bufete-lopez-linares",
      title: "Bufete López Linares Abogados",
      location: "Málaga",
      category: "escaleras",
      categoryLabel: "Escaleras y Barandillas",
      clientType: "Oficinas / Despacho Profesional",
      materials: "AISI 304 Pulido y Satinado · Peldaños de vidrio",
      summary:
        "Escalera protagonista a medida con estructura curva en acero inoxidable, peldaños de vidrio laminado de alta transparencia y barandilla perimetral continua.",
      scope: [
        "Medición milimétrica en local existente y modelado previo de desarrollo helicoidal.",
        "Curvado de zancas y pasamanos en tubo de acero inoxidable sin cortes visibles.",
        "Soportes puntuales mecanizados en inox para sujeción de peldaños de vidrio."
      ],
      images: [
        "assets/img/projects/lopez-linares-1.jpg",
        "assets/img/projects/lopez-linares-2.jpg"
      ]
    },
    {
      id: "estupa-benalmadena",
      title: "Estupa del Templo Budista",
      location: "Benalmádena (Málaga)",
      category: "singular",
      categoryLabel: "Obra Singular y Corporativa",
      clientType: "Patrimonio y Arquitectura Singular",
      materials: "Acero Inoxidable · Elementos ornamentales a medida",
      summary:
        "Trabajos especiales de metalurgia artística y estructural para la Estupa de la Iluminación en Benalmádena, expuesta a intemperie en cota alta sobre la costa.",
      scope: [
        "Fabricación artesanal de geometrías no estándar bajo especificaciones del proyecto.",
        "Máxima durabilidad frente a viento, radiación solar y humedad costera.",
        "Montaje especializado en emplazamiento monumental."
      ],
      images: [
        "assets/img/projects/estupa-benalmadena-1.jpg",
        "assets/img/projects/estupa-benalmadena-2.jpg"
      ]
    },
    {
      id: "amare-beach-hotels",
      title: "Amàre Beach Hotel Marbella e Ibiza",
      location: "Marbella e Ibiza",
      category: "hoteles",
      categoryLabel: "Hoteles y Contract",
      clientType: "Grupo El Fuerte / Hostelería",
      materials: "AISI 316L Calidad Marina · Vidrio",
      summary:
        "Instalaciones en fachada, accesos, barandillas y elementos arquitectónicos en acero inoxidable en primera línea de playa tanto en Marbella como en Ibiza.",
      scope: [
        "Ejecución en dos destinos costeros de alta exigencia estética y ambiental.",
        "Acabados resistentes a la corrosión salina directa.",
        "Integración con iluminación y cerramientos de vidrio."
      ],
      images: [
        "assets/img/projects/amare-marbella.jpg",
        "assets/img/projects/amare-ibiza.jpg"
      ]
    },
    {
      id: "villa-particular-marbella",
      title: "Residencia Particular en Marbella",
      location: "Marbella (Málaga)",
      category: "escaleras",
      categoryLabel: "Escaleras y Barandillas",
      clientType: "Vivienda Unifamiliar / Villa",
      materials: "AISI 316 · Vidrio de seguridad",
      summary:
        "Conjunto de escalera y barandillas a medida con paños de vidrio limpio y estructura de acero inoxidable para vivienda unifamiliar en Marbella.",
      scope: [
        "Levantamiento de medidas en obra y adaptación a niveles existentes.",
        "Postes y pasamanos en acero inoxidable con pinzas y herrajes ocultos.",
        "Instalación completa lista para entrega a propiedad."
      ],
      images: [
        "assets/img/projects/villa-marbella-1.jpg",
        "assets/img/projects/villa-marbella-2.jpg"
      ]
    },
    {
      id: "zanca-particular-malaga",
      title: "Escalera con Zanca Vista y Barandilla",
      location: "Málaga",
      category: "escaleras",
      categoryLabel: "Escaleras y Barandillas",
      clientType: "Cliente Particular",
      materials: "AISI 304 Satinado · Barandilla multitubo",
      summary:
        "Zanca de escalera metálica con barandillas de acero inoxidable fabricada e instalada a medida para vivienda particular en Málaga.",
      scope: [
        "Fabricación de estructura portante lateral en acero inoxidable.",
        "Barandilla con barrotes horizontales y pasamanos continuo ergonómico.",
        "Acabado satinado de fácil mantenimiento."
      ],
      images: [
        "assets/img/projects/escalera-malaga-1.jpg",
        "assets/img/projects/escalera-malaga-2.jpg"
      ]
    },
    {
      id: "decoracion-hosteleria-chimenea",
      title: "Interiorismo Soho Málaga, Chimenea Latón y Mesa CUBIC",
      location: "Málaga y Estepona",
      category: "decoracion",
      categoryLabel: "Decoración y Mobiliario",
      clientType: "Hostelería y Residencial",
      materials: "AISI 304 · Latón · Cristal templado blanco/negro",
      summary:
        "Proyectos de decoración metálica a medida: equipamiento en acero inoxidable para restaurante en el Soho de Málaga, chimenea en latón en Estepona y mesa arquitectónica CUBIC.",
      scope: [
        "Trabajos en latón natural/cepillado y acero inoxidable para interiorismo.",
        "Mobiliario de gran formato soldado y pulido sin juntas vistas.",
        "Diseño personalizado para restaurantes, despachos y viviendas."
      ],
      images: [
        "assets/img/projects/cavala-soho.jpg",
        "assets/img/projects/decoracion-chimenea.jpg",
        "assets/img/projects/mesa-cubic.jpg"
      ]
    }
  ],

  clients: [
    { name: "Acerinox", logo: "assets/img/logos/acerinox.png" },
    { name: "Sacyr", logo: "assets/img/logos/sacyr.png" },
    { name: "Meliá Hotels & Resorts", logo: "assets/img/logos/melia.png" },
    { name: "Crowne Plaza Hotels & Resorts", logo: "assets/img/logos/crowne-plaza.png" },
    { name: "AC Hotels by Marriott", logo: "assets/img/logos/ac-hotels.png" },
    { name: "Grupo El Fuerte", logo: "assets/img/logos/el-fuerte.png" },
    { name: "Gran Hotel Guadalpín Banús", logo: "assets/img/logos/guadalpin.png" },
    { name: "Ayuntamiento de Marbella", logo: "assets/img/logos/marbella.png" }
  ],

  faqs: [
    {
      question: "¿Necesito tener planos de arquitecto o hacéis medición en obra?",
      answer:
        "Trabajamos de las dos formas. Si eres un estudio de arquitectura, constructora u hotel, presupuestamos directamente sobre tus planos CAD/PDF y mediciones. Si eres un particular o negocio, nuestro equipo técnico visita la obra, toma medidas reales y diseña la solución contigo."
    },
    {
      question: "¿Por qué no tenéis un catálogo con precios fijos?",
      answer:
        "Porque cada escalera, marquesina, barandilla o piscina cambia según las dimensiones del hueco, el tipo de anclaje, el espesor del vidrio y la aleación necesaria (AISI 304 para interior o AISI 316L marino para costa). Así solo pagas por la solución exacta que requiere tu proyecto."
    },
    {
      question: "¿Trabajáis solo en Málaga o os desplazáis a otras provincias?",
      answer:
        "Nuestra fábrica y taller están en el Polígono Industrial Villa Rosa (Málaga), con actuación continua en toda la Costa del Sol (Marbella, Estepona, Benalmádena), Gibraltar, resto de Andalucía, Madrid e islas (como Ibiza) según la envergadura del proyecto."
    },
    {
      question: "¿Fabricáis e instaláis vosotros mismos?",
      answer:
        "Sí. Controlamos el ciclo completo: oficina técnica de ingeniería y diseño, corte, plegado, curvado y soldadura TIG en nuestro taller, y montaje final en obra con personal propio."
    }
  ]
};
