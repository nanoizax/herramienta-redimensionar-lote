# Redimensionar Imágenes en Lote

Cambia el tamaño de muchas imágenes a la vez, mismo ancho, alto y formato. Gratis, sin cuenta y sin subir nada a un servidor.

Herramienta gratuita y de código abierto de [SonhoLab](https://sonholab.com). Corre **100 % en el navegador**: los archivos no se suben a ningún servidor.

> Licencia: **MIT** · Autor: Leandro Manuel Perez Montañana · Idiomas de la interfaz: español, inglés, francés, portugués (BR), alemán, hindi, indonesio y ruso.

## Qué hace

Cuando manejas un catálogo de productos, organizas las fotos de un evento o preparas las imágenes de un trabajo escolar, casi nunca alcanza con cambiar el tamaño de una sola imagen: hay que hacerlo con decenas de archivos, todos al mismo ancho, alto y formato, y repetirlo uno por uno se vuelve eterno. Esta herramienta te deja subir varias imágenes de una sola vez, definir un tamaño y un formato de salida, y aplicarlo a todas juntas en un solo paso. El proceso ocurre dentro de tu navegador, así que las fotos nunca salen de tu equipo, y al final las descargas una por una o todas juntas en un archivo ZIP, listas para usar donde las necesites.

**Cuándo te sirve:**

- Un vendedor con cien productos en su tienda online necesita que todas las fotos midan exactamente lo mismo antes de subirlas al catálogo o a un marketplace que exige medidas uniformes.
- Un estudiante prepara las fotos de un trabajo o un libro de fotos impreso y necesita que todas tengan el mismo tamaño antes de mandarlas a imprimir, sin abrir cada una en un editor distinto.
- Una pequeña marca quiere que todas las fotos de su feed de Instagram tengan las mismas proporciones, sin abrir cada imagen una por una en un editor de fotos.

## Cómo se usa

1. **Sube tus imágenes.** Arrastra varias imágenes a la zona de carga o selecciónalas desde tu equipo, sin límite razonable de cantidad. Se cargan directo en el navegador, sin subir ni un archivo a un servidor, así que el proceso empieza al instante sin esperas.
2. **Define el tamaño y el formato.** Escribe el ancho y el alto en píxeles que quieres para todas las imágenes, y elige el formato de salida entre JPG, PNG o WEBP. Ese mismo tamaño y formato se aplica de una vez a todo el lote, sin tener que repetir la configuración imagen por imagen.
3. **Descarga el lote listo.** Descarga cada imagen procesada por separado o todas juntas dentro de un archivo ZIP. Las imágenes originales quedan intactas en tu equipo, así que puedes repetir el proceso con otro tamaño o formato cuantas veces lo necesites, sin perder nada del material de partida.

## Qué necesita para funcionar

### Para instalarla y compilarla

- [Node.js](https://nodejs.org) 18 o superior (probado con Node 22) y npm.
- Conexión a internet **solo** durante `npm install`. Una vez compilada, la herramienta no pide nada a internet.

### Complementos específicos de esta herramienta

- **PDF.js** (lector de PDF de Mozilla): viene como dependencia de npm; su *worker* se empaqueta solo con Vite.

### En el navegador de quien la usa

- Web Workers y Canvas (cualquier navegador actual).

## Instalación

```bash
git clone https://github.com/nanoizax/herramienta-redimensionar-lote.git
cd herramienta-redimensionar-lote
npm install
npm run dev         # servidor de desarrollo en http://localhost:5173
```

Para publicarla:

```bash
npm run build       # genera la carpeta dist/
npm run preview     # probar la versión compilada
```

Esta herramienta **no tiene servidor propio**: todo ocurre en el navegador de quien la usa. Basta con publicar la carpeta `dist/` en cualquier hosting estático (GitHub Pages, Netlify, Cloudflare Pages, Nginx, Apache...).

## Cómo está organizado

```
src/pages/tools/   La página de la herramienta (interfaz y lógica de pantalla)
src/lib/tools/     La lógica de la herramienta, separada de la interfaz
src/components/    Piezas compartidas (zona de arrastre de archivos, botón)
src/locales/       Textos en 8 idiomas (esta herramienta solamente)
src/i18n.ts        Configuración de idiomas
```

## Cómo meterla en tu propia plataforma

1. **Como página aparte:** publica `dist/` en una ruta de tu sitio, por ejemplo `/herramientas/redimensionar-lote/`. Si la sirves en una subcarpeta, define `base` en `vite.config.ts`.
2. **Dentro de tu aplicación React:** copia `src/pages/tools/*Page.tsx`, `src/lib/tools/` y `src/components/` a tu proyecto, instala las mismas dependencias de `package.json` y renderiza la página donde quieras.
3. **Con tu diseño:** el marco de la página (título, ayuda, preguntas frecuentes) está en `src/components/tools/ToolPageLayout.tsx` y es intencionalmente simple. Cámbialo por tu cabecera, tu pie y tus estilos; solo necesita pintar `children`.
4. **Con tu analítica:** `src/lib/hitCounter.ts` no hace nada. Si quieres medir el uso, conéctalo ahí a tu propia herramienta.

## Privacidad

Todo el procesamiento ocurre en el navegador. Esta copia no incluye analítica, cookies, contadores ni llamadas a ningún servidor propio. Los archivos del usuario no salen de su equipo.

## Preguntas frecuentes

**¿Qué pasa con mis imágenes al redimensionarlas?**  
Nada sale de tu dispositivo. El redimensionado ocurre dentro de tu navegador, usando el procesador de tu propio equipo, así que las imágenes no viajan a ningún servidor nuestro ni de terceros. Cuando cierras la pestaña no queda copia en ninguna parte.

**¿Cuántas imágenes puedo procesar a la vez?**  
No hay un límite fijo: puedes cargar desde un puñado hasta varios cientos de imágenes en la misma tanda, según lo que aguante la memoria de tu navegador. Es gratis sin importar cuántas proceses, sin crear cuenta ni dejar un correo.

**¿Las imágenes quedan estiradas o deformadas?**  
Puede pasar si mezclas fotos con proporciones muy distintas y fuerzas un ancho y un alto fijos: la herramienta ajusta cada imagen a esas medidas exactas, pero no recorta de forma inteligente para conservar el encuadre del sujeto. Para mejores resultados, usa imágenes con proporciones parecidas entre sí o deja margen alrededor del sujeto principal.

**¿Qué formatos de salida puedo elegir?**  
Puedes convertir todo el lote a JPG, PNG o WEBP, sin importar el formato original de cada imagen. Es útil, por ejemplo, para pasar fotos pesadas a WEBP y aligerar una tienda online, o para unificar un catálogo que llegó en formatos mezclados.

**¿Necesito instalar algún programa para usar esta herramienta?**  
No. Funciona en el navegador que ya tienes, en computadora o tablet, sin instalar nada ni pedir permisos especiales para leer tus archivos. Si trabajas con lotes grandes, conviene usar una computadora en vez del celular, porque el navegador va a necesitar más memoria disponible para procesar todas las imágenes a la vez.

## Licencia

Este proyecto se publica bajo la licencia **MIT**. El texto completo está en [LICENSE](LICENSE).

Las dependencias tienen sus propias licencias, listadas en [THIRD-PARTY.md](THIRD-PARTY.md).

## Más herramientas gratuitas

Esta es una de las herramientas gratuitas de SonhoLab. Encuentra el resto, cada una con su repositorio, en https://sonholab.com/es/herramientas.

---

Hecho por Leandro Manuel Perez Montañana.
