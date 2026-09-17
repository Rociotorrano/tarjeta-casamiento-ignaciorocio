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

    // --- Verificación de PIN (invitación personal) ---
    if (data && data.action === "verificarPin") {
      const inv = ss.getSheetByName(HOJA_INVITADOS);
      if (!inv) return json({ ok: false, error: "sin-hoja" });

      const values = inv.getDataRange().getValues();
      // Columnas: A Nombre | B Token | C PIN | D Estado | E Fecha de uso | F Link
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        if (String(row[1]).trim() === data.token) {
          if (String(row[3]).trim() !== "") {
            return json({ ok: false, error: "usado" });
          }
          if (String(row[2]).trim() !== String(data.pin).trim()) {
            return json({ ok: false, error: "pin_incorrecto" });
          }
          inv.getRange(i + 1, 4).setValue(
            "usado " + new Date().toLocaleString("es-AR")
          );
          return json({ ok: true, nombre: String(row[0]).trim() });
        }
      }
      return json({ ok: false, error: "invalido" });
    }

    // --- Guardar confirmación ---
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

// Valida el link personal (no lo consume: se consume al ingresar el PIN)
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
  // Columnas: A Nombre | B Token | C PIN | D Estado | E Fecha de uso | F Link
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (String(row[1]).trim() === token) {
      if (String(row[3]).trim() !== "") {
        return json({ ok: false, error: "usado" });
      }
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

// Genera el token y el PIN para cada nombre de la hoja "Invitados"
function generarLinks() {
  const SITIO = "https://TU-SITIO.netlify.app"; // 👈 cambiá por tu dirección
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(HOJA_INVITADOS);
  if (!sheet) {
    sheet = ss.insertSheet(HOJA_INVITADOS);
    sheet.appendRow(["Nombre", "Token", "PIN", "Estado", "Fecha de uso", "Link"]);
  }
  const last = sheet.getLastRow();
  for (let i = 2; i <= last; i++) {
    const rangoT = sheet.getRange(i, 2);
    const rangoP = sheet.getRange(i, 3);
    if (!rangoT.getValue()) {
      const token = Utilities.getUuid().replace(/-/g, "").slice(0, 12);
      rangoT.setValue(token);
    }
    if (!rangoP.getValue()) {
      const pin = String(Math.floor(1000 + Math.random() * 9000));
      rangoP.setValue(pin);
    }
    const pin = String(rangoP.getValue());
    const token = String(rangoT.getValue());
    sheet.getRange(i, 6).setValue(SITIO + "/?t=" + token + "  PIN: " + pin);
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

# Links personales de un solo uso con PIN

Esta opción hace que la invitación **solo se pueda abrir con un link personalizado**
acompañado de un **PIN numérico** que solo conoce el invitado. Además, cada link
**sirve una sola vez**. Así, si alguien reenvía el link por WhatsApp, quien lo reciba
verá el nombre del destinatario original y no podrá abrir la invitación sin el PIN.

> ⚠️ No es imposible de burlar (nadie puede evitar una captura de pantalla ni que el
> invitado comparta su PIN), pero impide que un tercero abra la invitación con el
> link reenviado. Tiene un costo: si el invitado borra el caché de su navegador o
> cambia de celular, el link aparecerá como "ya utilizado".

## Dos formas de crear los links

| Opción | Qué hace | Qué necesitás |
|---|---|---|
| **A) `generar-links.html`** (recomendada) | Abrís un archivo local, escribís nombre + PIN y te da el link listo para mandar por WhatsApp. El PIN se verifica dentro de la invitación. No requiere planilla. | Solamente el archivo `generar-links.html` |
| **B) Apps Script + hoja "Invitados"** | Generás los links desde tu planilla de Google. El PIN se verifica en el servidor y el link se consume **estrictamente una sola vez** (aunque borren los datos del navegador). | La planilla configurada (pasos de abajo) |

> Elegí la opción **B** si querés control estricto de "un solo uso" en todos los
> dispositivos. La opción **A** es más simple: alcanza con que cada invitado tenga su
> link y su PIN, y quien reenvíe el link no conozca el PIN.

La opción **A** está explicada dentro de la propia página `generar-links.html`.
Acá abajo se detalla la opción **B**.

## Opción B — Cargar los invitados y generar los links

1. En tu planilla, creá una pestaña nueva llamada **`Invitados`**.
2. En la fila 1 escribí estos encabezados:

   | Nombre | Token | PIN | Estado | Fecha de uso | Link |
   |--------|-------|-----|--------|--------------|------|

3. Debajo, escribí **solo los nombres** en la columna A (una persona por fila).
   Dejá vacías las columnas Token, PIN, Estado y Link.
4. En el editor de Apps Script, cambiá `SITIO` por la dirección de tu invitación
   (por ejemplo `https://ignaciorocio.netlify.app`) y ejecutá la función
   **`generarLinks`** (menú Ejecutar → `generarLinks`).
5. La columna **Link** te muestra por cada invitado su enlace y su PIN
   (`.../?t=xxxxxxxx  PIN: 4582`).
6. Enviále a cada invitado **su link** y **su PIN por separado** por WhatsApp.

> 💡 **Recomendación:** mandá el link en un primer mensaje y el PIN en un segundo
> mensaje aparte, o comunicáselo por otra vía (teléfono, en persona). Así, quien
> reenvíe el mensaje con el link no tiene el PIN.

## Paso 2 — Activar la opción en la invitación

En `js/config.js` ya está activado:

```js
enlacesUnicos: true,
```

## Cómo funciona

1. El invitado abre su link `.../?t=TOKEN`.
2. La invitación consulta a Apps Script y muestra **"Para: Nombre"** del invitado.
3. El invitado ingresa su **PIN**. Apps Script lo verifica y recién ahí deja entrar
   y marca el link como usado en la columna **Estado**.
4. Si vuelve a abrir desde **el mismo dispositivo**, entra directo (queda guardado).
   Desde **otro dispositivo**, o si borró datos del navegador, dirá que el link ya
   fue utilizado.
5. Si alguien reenvía el link, verá el nombre del destinatario original y no podrá
   entrar sin el PIN correcto.

## Para volver a habilitar un link usado

Borrá la celda de la columna **Estado** (dejándola vacía) de esa persona y avisale
que vuelva a abrir su link con el mismo PIN.

