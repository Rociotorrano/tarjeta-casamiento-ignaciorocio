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
const HOJA = "Hoja 1";              // pestaña de confirmaciones
const HOJA_INVITADOS = "Invitados"; // pestaña con los links personales

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

// Valida y consume el link personal (una sola vez)
function doGet(e) {
  const token = (e && e.parameter && e.parameter.t) || "";
  if (!token) {
    return json({ ok: true });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(HOJA_INVITADOS);
  if (!sheet) {
    return json({ ok: false, error: "sin-hoja" });
  }

  const values = sheet.getDataRange().getValues();
  // Columnas: A Nombre | B Token | C Estado | D Fecha de uso | E Link
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (String(row[1]).trim() === token) {
      if (String(row[2]).trim() !== "") {
        return json({ ok: false, error: "usado" });
      }
      sheet
        .getRange(i + 1, 3)
        .setValue("usado " + new Date().toLocaleString("es-AR"));
      return json({ ok: true, nombre: String(row[0]).trim() });
    }
  }
  return json({ ok: false, error: "invalido" });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

// Genera un token y el link para cada nombre de la hoja "Invitados"
function generarLinks() {
  const SITIO = "https://TU-SITIO.netlify.app"; // 👈 cambiá por tu dirección
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(HOJA_INVITADOS);
  if (!sheet) {
    sheet = ss.insertSheet(HOJA_INVITADOS);
    sheet.appendRow(["Nombre", "Token", "Estado", "Fecha de uso", "Link"]);
  }
  const last = sheet.getLastRow();
  for (let i = 2; i <= last; i++) {
    if (!sheet.getRange(i, 3).getValue() && !sheet.getRange(i, 2).getValue()) {
      const token = Utilities.getUuid().replace(/-/g, "").slice(0, 12);
      sheet.getRange(i, 2).setValue(token);
      sheet.getRange(i, 5).setValue(SITIO + "/?t=" + token);
    }
  }
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

---

# Links personales de un solo uso

Esta opción hace que la invitación **solo se pueda abrir con un link personalizado**
y que cada link **sirva una sola vez** (primera apertura). Así, quien recibe el link
no puede reenviarlo y que otra persona lo use.

> ⚠️ No es imposible de burlar (nadie puede evitar una captura de pantalla ni que el
> invitado copie el link *antes* de abrirlo), pero impide que un tercero abra la
> invitación con el link ya usado. Tiene un costo: si el invitado borra el caché de su
> navegador o cambia de celular, el link aparecerá como "ya utilizado".

## Paso 1 — Cargar los invitados y generar los links

1. En tu planilla, creá una pestaña nueva llamada **`Invitados`**.
2. En la fila 1 escribí estos encabezados:

   | Nombre | Token | Estado | Fecha de uso | Link |
   |--------|-------|--------|--------------|------|

3. Debajo, escribí **solo los nombres** en la columna A (una persona por fila).
4. En el editor de Apps Script, cambiá `SITIO` por la dirección de tu invitación
   (por ejemplo `https://ignaciorocio.netlify.app`) y ejecutá la función
   **`generarLinks`** (menú Ejecutar → `generarLinks`).
5. En la columna **Link** te aparecen los enlaces personalizados
   (`.../?t=xxxxxxxx`). Enviále a cada invitado **su** link por WhatsApp.

## Paso 2 — Activar la opción en la invitación

En `js/config.js` cambiá:

```js
enlacesUnicos: true,
```

Listo. A partir de ahí, quien abra el sitio sin link personalizado verá un aviso,
y cada link personalizado se marca como usado en la columna **Estado** la primera
vez que se abre.

## Cómo funciona

1. El invitado abre su link `.../?t=TOKEN`.
2. Toca **Abrir mi invitación** (esto evita que las vistas previas de WhatsApp
   gasten el link automáticamente).
3. La invitación consulta a Apps Script: si el token es válido y no se usó,
   lo marca como usado y deja entrar. Se muestra **"Para: Nombre"**.
4. Si vuelve a abrir desde **el mismo dispositivo**, entra directo (queda guardado).
   Desde **otro dispositivo**, dirá que el link ya fue utilizado.

## Para volver a habilitar un link usado

Borrá la celda de la columna **Estado** (dejándola vacía) de esa persona y avisale
que vuelva a abrir su link.
