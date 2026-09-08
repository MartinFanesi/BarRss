# Política de Privacidad de BarRSS

Última actualización técnica: 8 de septiembre de 2026, versión 1.3.0.

## Datos almacenados

BarRSS no dispone de un servidor propio de analítica ni envía datos a un servicio de publicidad. En el perfil del navegador guarda:

- Canales elegidos y personalizados en `chrome.storage.local`.
- Titulares, enlaces, resúmenes y URLs de imágenes en una caché local de hasta 60 feeds. Las copias de más de 7 días no se utilizan como respaldo.
- Favoritos, enlaces marcados como leídos y opciones del lector en almacenamiento local del perfil. Se conservan hasta 5000 enlaces de lectura.
- Preferencias visuales y de funcionamiento en `chrome.storage.sync`. Chrome puede sincronizarlas entre dispositivos según la configuración de la cuenta del usuario.

Al actualizar desde una versión anterior, la lista de canales de `storage.sync` se copia al almacenamiento local; al guardar cambios en la lista se elimina la copia antigua de `sync`. La lista nueva no se sincroniza automáticamente entre equipos. Puede exportarse por decisión del usuario mediante OPML o un respaldo JSON.

## Conexiones externas

El navegador puede conectarse a:

1. Los servidores de los canales RSS elegidos, para descargar noticias.
2. Google Favicons, para obtener los logotipos de los medios.
3. Google Fonts, para descargar las tipografías de la interfaz.
4. Los servidores que alojan imágenes de las noticias.
5. El sitio del artículo al abrirlo y el servicio social elegido al usar un botón para compartir.

Estos servidores reciben los datos técnicos habituales de una solicitud, como la dirección IP. La caché conserva resúmenes y direcciones de imágenes; no descarga artículos completos para lectura sin conexión.

## Permisos y páginas visitadas

- `storage`: preferencias, canales y caché.
- `tabs` y `activeTab`: gestión de las vistas y comunicación con las pestañas donde funciona la barra.
- `sidePanel`: apertura del panel lateral.
- `contextMenus`: accesos desde el menú del icono de la extensión.
- Acceso a sitios web (`<all_urls>`): consultas de feeds personalizados y ejecución del componente de barra y descubrimiento RSS en páginas compatibles.

La barra flotante viene desactivada inicialmente. El descubrimiento RSS puede detectar enlaces públicos a feeds y datos del sitio para sugerir un canal. La adaptación visual puede inspeccionar estilos y posición de elementos de la página. Los dominios de correo y autenticación enumerados en el manifiesto y en el código están excluidos.

Shadow DOM ayuda a separar los estilos de la barra de los de la página; no es una barrera de seguridad absoluta frente al código de la página anfitriona.

## Control de los datos

El usuario puede eliminar favoritos individualmente, cambiar el estado de lectura, importar o exportar canales y vaciar la caché desde Configuración. Vaciar la caché no borra favoritos; una actualización posterior vuelve a guardar las noticias descargadas. El reinicio de configuración restaura preferencias y canales, conservando favoritos y lectura. Los datos locales pertenecen al perfil donde está instalada la extensión.

## Contacto

Las consultas sobre el tratamiento de datos o el funcionamiento de la extensión pueden realizarse mediante un issue en el repositorio del proyecto.
