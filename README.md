# Invitación de Casamiento — Ignacio & Rocío

Tarjeta digital para compartir por WhatsApp. Se abre con solo tocar el enlace.

## Archivos importantes

| Archivo | Para qué |
|---|---|
| `js/config.js` | **Tus datos**: fechas, lugares, enlaces de mapas, cuenta bancaria y Google Sheets |
| `assets/` | Reemplazá `photo1.svg`…`photo6.svg` por fotos reales (JPG de tu celular) |
| `GOOGLE_SHEETS.md` | Guía para conectar la sección Confirmación a tu planilla de Google Drive |

## Pendientes que tenés que completar

1. **Fotos** → reemplazar los SVGs de `assets/` por fotos reales.
2. **Cuenta bancaria** → en `js/config.js` el campo `cuentaBancaria`.
3. **Enlaces "Cómo llegar"** → en `js/config.js`, `ceremonia.mapa` y `celebracion.mapa` (link de Google Maps del lugar).
4. **Dress code** → en `js/config.js`, `enlaceDressCode` (ej: Pinterest de vestimenta formal).
5. **Confirmación** → seguir `GOOGLE_SHEETS.md` para que los Sí/No lleguen a tu hoja de cálculo.

## Subir a Netlify (gratis)

1. Creá una cuenta en <https://netlify.com>.
2. Arrastrá toda esta carpeta a **netlify.com/drop** (o conectá un repo de GitHub).
3. Te da un enlace tipo `https://tu-nombre.netlify.app`.
4. Ese enlace es el que compartís por WhatsApp.

> El sitio es estático, no necesita build: solo arrastrar la carpeta y listo.

## Ver en local

```bash
python3 -m http.server 8000
# abrí http://localhost:8000
```
