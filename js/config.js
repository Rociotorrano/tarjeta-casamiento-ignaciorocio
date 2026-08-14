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
    // Enlace de mapa del lugar
    mapa: "https://www.bing.com/maps/search?name=Parroquia+Nuestra+Se%C3%B1ora+de+los+Dolores&trfc=&mepi=0%7E%7EEmbedded%7ELargeMapLink&FORM=MPSRPL&style=r&q=Parroquia+Nuestra+Se%C3%B1ora+de+los+Dolores&ss=id.ypid%3AYN6B912E0E3BC4C216&ppois=-36.763301849365234_-56.68317413330078_Parroquia+Nuestra+Se%C3%B1ora+de+los+Dolores&cp=-36.763763%7E-56.683293&lvl=18.7"
  },
  celebracion: {
    lugar: "Salón María Lucrecia - Pavón",
    hora: "20:00 Hs",
    // Enlace de mapa del lugar
    mapa: "https://www.bing.com/maps/search?name=Camping+Lo+De+Maria+Lucrecia&trfc=&mepi=0%7E%7EEmbedded%7ELargeMapLink&FORM=MPSRPL&style=r&q=Camping+Lo+De+Maria+Lucrecia&ss=id.ypid%3AYN9028CD5F2D92C911&ppois=-36.7122917175293_-56.736961364746094_Camping+Lo+De+Maria+Lucrecia&cp=-36.712384%7E-56.736719&lvl=14.8"
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
