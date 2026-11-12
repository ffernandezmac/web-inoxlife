# Web Inoxlife — Diseño 2: Taller de Autor & Escala Monumental + Scrollytelling 3D

Rediseño completo de la página principal para **INOXLIFE S.L.** (`inoxlife.es`) bajo la dirección visual de la **Propuesta 2 (Taller de Autor & Escala Monumental)** combinada con **Scrollytelling Nivel 3**, escalera helicoidal 3D interactiva al hacer scroll y todo el contenido técnico y portfolio real de obras.

## Estructura del proyecto

- [`index.html`](index.html): Documento semántico (`lang="es"`, landmarks, `<search>`, `<dialog>` nativos, bloque oscuro editorial y bloque blanco de conversión).
- [`css/tokens.css`](css/tokens.css): Paleta oscura de taller de autor (`#141416`, `#1c1c1f`, `#222226`, `#2a2a2f`, contraste blanco `#ffffff` en bloque de conversión), tipografía arquitectónica y curvas de animación.
- [`css/styles.css`](css/styles.css): Maquetación responsive (`1440px` a `390px`), barra de progreso superior con `animation-timeline: scroll()`, scrollytelling fijo por capítulos, tablas de aleaciones y parejas de contraste.
- [`js/staircase3d.js`](js/staircase3d.js): Motor 3D procedural sin dependencias externas para escalera helicoidal en acero inoxidable y vidrio laminado, sincronizado con el scroll y respetando `prefers-reduced-motion` y visibilidad en pantalla (`IntersectionObserver`).
- [`js/main.js`](js/main.js): Controladores de la escalera 3D en portada y en los capítulos (`CAD -> Acero/TIG -> Vidrio/Montaje`), regla milimetrada (`000–1000 mm`), *peek-list*, filtrado de obras reales, modales y validación accesible de formulario.
- [`data/inoxlife.js`](data/inoxlife.js): Fuente única de datos verificados, especialidades, 8 obras reales y lista `pendingValidation` para confirmar con dirección.
- `assets/img/`: Logotipo, 20 fotografías de obras reales y 8 logotipos de clientes almacenados en local.

## Ejecución local

```powershell
python -m http.server 8088
```

Abrir `http://localhost:8088/` o `http://127.0.0.1:8088/`.

## Decisiones pendientes de confirmar con dirección (`data/inoxlife.js`)

1. Confirmar si se mantiene la cifra histórica del dossier (`+40.000 m² de naves en diferentes instalaciones`).
2. Confirmar si sigue operativa la delegación comercial en Madrid.
3. Confirmar alcance actual de la alianza industrial con **NAVACEL Procesos Industriales**.
4. Confirmar CIF societario y datos del Registro Mercantil para el Aviso Legal definitivo.
5. Sustituir o ampliar fotografías de obras con originales en máxima resolución cuando estén disponibles.
