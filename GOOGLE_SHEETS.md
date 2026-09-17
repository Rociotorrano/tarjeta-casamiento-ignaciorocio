# Conectar las confirmaciones a Google Sheets

Cuando alguien responde **Sí / No** en la invitación, los datos se guardan
automáticamente en tu hoja de cálculo de Google Drive con **fecha, horario,
nombre, dato importante y descripción**.

Se usa **Google Apps Script** (gratis, sin instalar nada).

---

## Paso 1 — Crear la hoja de cálculo

1. Entrá a <https://sheets.new> (se crea una planilla nueva).
2. En la primera fila de la hoja "Hoja 1", escribí estos encabezados:

   | Fecha       | Hora   | Nombre | Asistencia | Dato importante | Descripción |
   |-------------|--------|--------|------------|-----------------|-------------|
   | 14/08/2026  | 12:34  | Ana    | Sí         | Celíaco          | ¡Sí confirmo! asistirá a la celebración |

   (La fecha y la hora las registra solo el sistema; podés dejar la fila vacía.)

---

## Paso 2 — Crear el script

1. Con la planilla abierta, andá a **Extensiones → Apps Script**.
2. Borrá todo lo que haya en el editor y pegá este código:

```javascript
const HOJA = "Hoja 1"; // cambiá si tu hoja tiene otro nombre

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(HOJA) || ss.getActiveSheet();

    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (err) {
      return ContentService.createTextOutput("error: JSON inválido");
    }

    const ahora = new Date();
    const fecha = ahora.toLocaleDateString("es-AR");
    const hora = ahora.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    sheet.appendRow([
      fecha,
      hora,
      data.nombre || "",
      data.asistencia || "",
      data.dato || "",
      data.descripcion || "",
    ]);

    return ContentService.createTextOutput("ok: confirmación guardada");
  } catch (err) {
    return ContentService.createTextOutput("error: " + err.message);
  }
}

function doGet() {
  return ContentService.createTextOutput("ok");
}
```

3. Si tu hoja se llama distinto a "Hoja 1", cambiá la línea `const HOJA = ...`.

---

## Paso 3 — Publicar como Web App

1. Arriba a la derecha, tocá **Implementar → Nueva implementación**.
2. En "Seleccionar tipo", elegí **Aplicación web**.
3. Configuración:
   - **Descripción**: `Confirmaciones`
   - **Ejecutar como**: *Yo*
   - **Quién tiene acceso**: **Cualquier persona**
4. Tocá **Implementar** y acepta los permisos.
5. Copiá la **URL del Web App** (termina en `/exec`).

---

## Paso 4 — Pegar la URL en la invitación

1. Abrí el archivo `js/config.js`.
2. Pegá la URL en `appsScriptURL`:

```js
appsScriptURL: "https://script.google.com/macros/s/TU_ID/exec",
```

> Mientras `appsScriptURL` esté vacío, la invitación funciona en **modo demo**:
> la confirmación se muestra como exitosa pero no se guarda nada.

---

## Probar

1. Subí la tarjeta (o abrí `index.html` localmente).
2. Respondé **Sí** e ingresá un nombre.
3. Revisá tu planilla: debería aparecer la fila con la fecha, hora, nombre y descripción.
