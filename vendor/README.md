# Third-party code

`sax.js` is copied without modifications from **sax-js 1.6.1** (`lib/sax.js`).
Source: https://github.com/isaacs/sax-js
License: Blue Oak Model License 1.0.0, included in `LICENSE.md`.

It parses XML inside the MV3 service worker. No code is downloaded at runtime.
The application rejects DOCTYPE declarations and does not load external entities.
