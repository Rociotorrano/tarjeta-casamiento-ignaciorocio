# Invitación de Casamiento — Ignacio & Rocio

Tarjeta digital para compartir por WhatsApp. Se abre con solo tocar el enlace.

## Archivos importantes

| Archivo | Para qué |
|---|---|
| `js/config.js` | **Tus datos**: fechas, lugares, enlaces de mapas, cuenta bancaria y Google Sheets |
| `assets/` | Reemplazá `photo1.svg`…`photo6.svg` por fotos reales (JPG de tu celular) |
| `GOOGLE_SHEETS.md` | Guía para conectar la sección Confirmación a tu planilla de Google Drive |
| `generar-links.html` | **Herramienta para crear el link personal + PIN de cada invitado** |

## Pendientes que tenés que completar

1. **Fotos** → reemplazar los SVGs de `assets/` por fotos reales.
2. **Cuenta bancaria** → en `js/config.js` el campo `cuentaBancaria`.
3. **Enlaces "Cómo llegar"** → en `js/config.js`, `ceremonia.mapa` y `celebracion.mapa` (link de Google Maps del lugar).
4. **Dress code** → en `js/config.js`, `enlaceDressCode` (ej: Pinterest de vestimenta formal).
5. **Confirmación** → seguir `GOOGLE_SHEETS.md` para que los Sí/No lleguen a tu hoja de cálculo.

## Invitaciones personales con PIN (¡importante!)

Para que cada invitado tenga SU link y no pueda reenviarlo:

1. Abrí **`generar-links.html`** (doble clic en el archivo).
2. Cargá la **URL base** de tu invitación (la que subís a Netlify, ej. `https://tu-sitio.netlify.app`).
3. Escribí el **nombre del invitado** y un **PIN** (4 a 8 números).
4. Tocá **Generar link** → te da el link y el PIN. Enviáselo por WhatsApp.
5. Cuando él lo abra, verá *"Para: Su Nombre"* y deberá ingresar el PIN para entrar.
6. Si reenvía el link, quien lo reciba verá el nombre del destinatario original y
   **no podrá entrar sin el PIN**.

> Como cada persona tiene un PIN distinto, alcanza con que el link y el PIN viajen
> en mensajes separados (o se los comuniques por teléfono) para que el reenvío no sirva de nada.

La invitación ya está configurada con `enlacesUnicos: true` en `js/config.js`.

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
