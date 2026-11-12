# Web Inoxlife — Ingeniería Arquitectónica Clara + Scrollytelling (Nivel 3)

Nueva web corporativa y de captación de proyectos a medida para **INOXLIFE S.L.** (`inoxlife.es`), diseñada bajo la dirección estética de la **Propuesta 1 (Ingeniería Arquitectónica Clara)** combinada con **Scrollytelling Nivel 3** y elementos de conversión directa (**«Pedir algo similar»**).

## Estructura del proyecto

- [`index.html`](index.html): Documento principal semántico (`lang="es"`, landmarks, formulario accesible y diálogos nativos `<dialog>`).
- [`css/tokens.css`](css/tokens.css): Tokens de diseño (paleta arquitectónica `#ffffff` / `#f6f7f9` / `#18191b` / `#1c69d4`, atmósfera industrial `#141a21`, escala tipográfica fluida y curvas de movimiento).
- [`css/styles.css`](css/styles.css): Maquetación responsive (`1440px` escritorio a `390px` móvil), animaciones ligadas al scroll (`animation-timeline: scroll()`, `@supports`, `prefers-reduced-motion: reduce`), *peek-list* interactivo, bloque *sticky* por capítulos con regla milimetrada viva y estilos de formulario.
- [`js/main.js`](js/main.js): Lógica modular sin dependencias externas (iluminación progresiva de declaración al scroll, *peek-list*, observadores de capítulos y cambio de atmósfera, regla milimetrada `000–1000 mm`, filtrado de obras reales, modales de ficha técnica/legal y validación accesible del formulario).
- [`data/inoxlife.js`](data/inoxlife.js): Fuente única de datos de negocio, obras reales, especialidades, preguntas frecuentes y notas pendientes de confirmar con dirección.
- `assets/img/`: Fotografías reales de obras ejecutadas por Inoxlife y logotipos de clientes descargados localmente para evitar dependencia del antiguo CDN de Wix.

## Ejecución local

Al utilizar módulos ES (`<script type="module">`), sirve la carpeta desde cualquier servidor HTTP estático:

```powershell
npx serve .
# o con Python:
python -m http.server 8080
```

## Decisiones pendientes de confirmar con dirección (`data/inoxlife.js`)

1. Confirmar si se mantiene la cifra histórica del dossier (`+40.000 m² de naves en diferentes instalaciones`).
2. Confirmar si sigue activa la delegación comercial en Madrid.
3. Confirmar el alcance actual de la alianza industrial con **NAVACEL Procesos Industriales**.
4. Confirmar el CIF societario y datos registrales para el texto definitivo del Aviso Legal.
5. Sustituir o ampliar fotografías de obras con originales en máxima resolución cuando estén disponibles.
