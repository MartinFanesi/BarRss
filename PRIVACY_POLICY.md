# Política de Privacidad de BarRSS

**Última actualización:** 1 de Septiembre de 2026

En **BarRSS**, la privacidad y la seguridad de los usuarios es una prioridad fundamental. Esta extensión fue diseñada bajo el principio de **Privacidad por Diseño (Privacy by Design)** y **Mínimo Privilegio (Least Privilege)**.

---

## 1. Información que recopilamos
**BarRSS NO recopila, almacena, transmite ni comparte ningún dato personal ni información sensible de navegación.**

* **No recopilamos:**
  - Nombres, correos electrónicos, contraseñas o datos de inicio de sesión.
  - Mensajes de correo, chats, historiales de navegación o búsquedas.
  - Información financiera, tarjetas de crédito o datos bancarios.
  - Dirección IP del usuario para rastreo o creación de perfiles analíticos.
  - Cookies o tokens de sesión de las páginas visitadas.

---

## 2. Permisos y uso técnico de datos

La extensión requiere ciertos permisos técnicos estrictamente necesarios para su funcionamiento visual y de consulta de noticias:

* `storage`: Utilizado de forma exclusiva para almacenar localmente las preferencias visuales del usuario (colores, posición, velocidad, feeds RSS seleccionados) en su propio perfil mediante `chrome.storage.sync` o `chrome.storage.local`. Ninguno de estos datos se envía a servidores externos.
* `activeTab` y `tabs`: Permiten que el panel de configuración (popup) notifique a la pestaña activa los cambios de estilo o noticias seleccionadas en tiempo real sin tener que recargar la página.
* `sidePanel`: Permite al usuario abrir el visor de noticias en el panel lateral nativo de Google Chrome.
* `host_permissions` / `<all_urls>`:
  - Se utiliza **únicamente** desde el Service Worker en segundo plano (`background.js`) para realizar peticiones HTTP seguras (`fetch`) a las URLs públicas de los canales de noticias RSS elegidos por el usuario (ej. Infobae, BBC, etc.) y evitar bloqueos por políticas de CORS.
  - En ningún momento se lee ni se extrae contenido privado de los sitios web que el usuario visita.
  - Por seguridad, sitios de correo electrónico y autenticación (como Gmail, Outlook, Yahoo Mail y cuentas de Google/Microsoft) están expresamente **excluidos** de la inyección de la barra.

---

## 3. Servicios de Terceros
La extensión se conecta únicamente a:
1. **Los servidores RSS públicos** que el usuario tenga activos para descargar los titulares de las noticias.
2. **Servicio público de favicons de Google** (`google.com/s2/favicons`) para mostrar los logotipos de los periódicos junto a cada titular.

No utilizamos ningún servicio de analítica de terceros ni redes publicitarias.

---

## 4. Seguridad y Aislamiento (Shadow DOM)
La barra flotante de noticias se inyecta utilizando **Shadow DOM**, lo que garantiza un aislamiento total:
* El código de los sitios web visitados no puede interferir en los datos ni configuración de la extensión.
* La extensión no interfiere ni lee los formularios, campos de texto ni contenido confidencial de las páginas anfitrionas.

---

## 5. Contacto
Si tenés dudas o consultas sobre esta política de privacidad o sobre el funcionamiento de BarRSS, podés abrir un issue o contactar al desarrollador a través del repositorio del proyecto.
