// =============================================================
//  CONFIGURACIÓN DE LA INVITACIÓN
//  Editá estos valores con tus datos cuando los tengas.
// =============================================================

const CONFIG = {
  // --- Datos de la pareja ---
  novio: "Ignacio",
  novia: "Rocío",

  // --- Música de fondo ---
  // Reemplazá el nombre si cargás otra canción en la carpeta audio/
  musica: {
    src: "audio/Lauv - Steal The Show (From Elemental).mp3",
    nombre: "Steal The Show — Lauv"
  },

  // --- Fecha y hora de la boda (para la cuenta regresiva) ---
  fechaBoda: "2027-03-06T18:00:00",
  // Ceremonia y celebración (para los botones "Cómo llegar")
  ceremonia: {
    lugar: "Nuestra Señora de los Dolores",
    hora: "18:00 Hs",
    // Reemplazá por el enlace de Google Maps del lugar
    mapa: ""
  },
  celebracion: {
    lugar: "Salón María Lucrecia - Pavón",
    hora: "20:00 Hs",
    // Reemplazá por el enlace de Google Maps del lugar
    mapa: ""
  },

  // --- Dress code: enlace de inspiración (Pinterest, etc.) ---
  enlaceDressCode: "",

  // --- Cuenta bancaria para regalos ---
  cuentaBancaria: "XXXX XXXX XXXX XXXX",

  // --- Google Sheets (Confirmación) ---
  // URL del "Web App" de Google Apps Script (doPost).
  // Dejá vacío para modo demo (la confirmación no se guarda).
  // Instrucciones: ver archivo GOOGLE_SHEETS.md
  appsScriptURL: "https://script.google.com/macros/s/AKfycbwOd7dCLnQqSqBkGylNbinEuGUP8Q_Vfqr4T0WRALmWSwFoJtAHmoDlYEIKqprqfLSd/exec",

  // Nombre de la pestaña/hoja (cambialo si tu hoja se llama distinto)
  hojaGoogle: "Confirmaciones"
};
