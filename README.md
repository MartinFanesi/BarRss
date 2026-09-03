# BarRSS - El Diario Digital & Lector RSS (Manifest V3)

Extensión para **Google Chrome** con arquitectura centrada en la lectura: **El Diario Digital** como centro principal de noticias RSS en vivo, junto a soporte de panel lateral nativo y ticker marquesina flotante opcional.

---

## 🌟 Tres Experiencias de Lectura

### Modo 1: 📰 El Diario Digital (Lector Principal)
- **Experiencia Editorial Completa:** Maquetación limpia tipo periódico broadsheet con noticia principal (*Hero story*) y grilla de artículos balanceada.
- **7 Estilos y Tipografías Editoriales:** Papel Prensa (Playfair), Noche Editorial (Merriweather), Sepia Vintage (EB Garamond), Financial Salmón (Newsreader), Nórdico Minimal (Space Grotesk), Terminal Cyberpunk (JetBrains Mono) y Midnight Elegance (Cormorant Garamond).
- **Apertura Versátil:** Podés abrirlo en una **pestaña de Chrome** o como **ventana independiente dedicada (App)** sin barras de navegación.
- **Auto-Actualización:** Contador inteligente con refresco automático cada 5 minutos y botón de pausa.
- **Favoritos / Guardados:** Marcador para guardar artículos y leerlos más tarde.
- **Búsqueda Instantánea & Filtro de Secciones:** Noticias, Economía, Tecnología, Deportes, Internacional, Show y Favoritos.

### Modo 2: 🖥️ Panel Lateral Nativo de Chrome (Side Panel)
- **100% Integrado en el navegador:** Se abre a la derecha de Chrome, totalmente **fuera del DOM de las páginas**.
- **Cero interferencia:** Imposible que tape menús, encabezados o botones de ninguna web.
- **Persistente:** Permanece abierto y activo mientras navegás y cambiás de pestaña.
- **Dos vistas:** Modo lista de tarjetas o ticker vertical continuo con buscador instantáneo.

### Modo 3: 🌊 Barra Flotante Opcional (Desactivada por defecto)
- **Completamente Opcional:** Viene desactivada por defecto para no invadir tu navegación web, pudiendo activarla cuando quieras desde la configuración.
- **Aislamiento Shadow DOM:** Mimetizado con la web (Modo Camaleón) y velocidad calibrada.

---

## 📡 Múltiples Fuentes & Favicons Oficiales

- **Selección Múltiple:** Podés activar varios canales simultáneamente (Infobae, El Cronista, Xataka, ESPN, BBC Mundo, etc.).
- **Mezcla Equitativa (Round-Robin):** Las noticias se intercalan de manera uniforme para ofrecer variedad de categorías.
- **Canales Propios:** Agregá cualquier URL de feed RSS o Atom con nombre personalizado.
- **Favicons Reales + Fallback a RSS:** Cada titular muestra el logo oficial del medio o el ícono RSS si no está disponible.

---

## 📁 Estructura del Proyecto

```text
BarRss/
├── manifest.json      # Manifest V3 con permisos de storage, tabs y sidePanel
├── background.js       # Service Worker: Fetch múltiple paralelo, parseo XML y bypass CORS
├── reader.html         # Lector Editorial Principal: El Diario Digital
├── reader.js           # Lógica del diario: 7 temas, buscador, favoritos y auto-refresco
├── reader.css          # Estilos editoriales avanzados tipo periódico
├── popup.html          # Menú de gestión: Lanzador de El Diario y configuración de feeds
├── popup.js            # Lógica del popup y sincronización en tiempo real
├── sidepanel.html      # Interfaz del Panel Lateral Nativo de Google Chrome
├── sidepanel.js        # Lógica del Side Panel: tarjetas, ticker vertical y buscador
├── content.js          # Barra flotante opcional: Shadow DOM y offsets
├── styles.css          # Estilos de la barra flotante opcional
├── README.md           # Documentación
└── icons/              # Iconos (16x16, 48x48 y 128x128)
```

---

## 🚀 Cómo Cargar o Actualizar la Extensión en Chrome

1. Abrí **Google Chrome** y navegá a:
   ```text
   chrome://extensions/
   ```
2. Activá el interruptor **"Modo de desarrollador"** (esquina superior derecha).
3. Hacé clic en **"Cargar descomprimida"** (*Load unpacked*) y seleccioná `/home/cko09/BarRss`.
   *(Si ya la tenías cargada, simplemente hacé clic en el botón de **Actualizar (Reload)** 🔄 en la tarjeta de BarRSS).*
4. Para abrir el **Panel Lateral Nativo**, hacé clic en el ícono de la extensión en la barra de herramientas y presioná:  
   **"🖥️ Abrir en Panel Lateral Nativo de Chrome"**.
