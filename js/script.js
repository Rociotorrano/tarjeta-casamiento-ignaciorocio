(function () {
  "use strict";

  const d = document;

  /* ---------- Reveal al hacer scroll ---------- */
  function initReveal() {
    const items = d.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Cuenta regresiva ---------- */
  function initCountdown() {
    const target = new Date(CONFIG.fechaBoda).getTime();
    const elDias = d.getElementById("cd-dias");
    const elHoras = d.getElementById("cd-horas");
    const elMin = d.getElementById("cd-min");
    const elSeg = d.getElementById("cd-seg");
    if (!elDias) return;

    const pad = (n) => String(n).padStart(2, "0");
    const pad3 = (n) => String(n).padStart(3, "0");

    function tick() {
      let diff = target - Date.now();
      if (diff < 0) {
        elDias.textContent = "000";
        elHoras.textContent = "00";
        elMin.textContent = "00";
        elSeg.textContent = "00";
        return;
      }
      const dias = Math.floor(diff / 86400000);
      diff -= dias * 86400000;
      const horas = Math.floor(diff / 3600000);
      diff -= horas * 3600000;
      const min = Math.floor(diff / 60000);
      const seg = Math.floor((diff % 60000) / 1000);
      elDias.textContent = pad3(dias);
      elHoras.textContent = pad(horas);
      elMin.textContent = pad(min);
      elSeg.textContent = pad(seg);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Botones "Cómo llegar" / "Ver enlace" ---------- */
  function initPlaceholders() {
    d.querySelectorAll("[data-placeholder]").forEach((a) => {
      a.addEventListener("click", (e) => {
        const key = a.dataset.placeholder;
        let url = "";
        if (key === "mapa-ceremonia") url = CONFIG.ceremonia.mapa;
        if (key === "mapa-celebracion") url = CONFIG.celebracion.mapa;
        if (key === "dresscode") url = CONFIG.enlaceDressCode;

        if (url) {
          a.href = url;
          return;
        }
        e.preventDefault();
        alert(
          "Enlace pendiente de configurar.\n\n" +
            "Completá el enlace en el archivo js/config.js " +
            "(ceremonia.mapa / celebracion.mapa / enlaceDressCode)."
        );
      });
    });
  }

  /* ---------- Copiar cuenta bancaria ---------- */
  function initCopy() {
    d.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const txt = d.getElementById(btn.dataset.copy).textContent;
        try {
          await navigator.clipboard.writeText(txt);
          const original = btn.textContent;
          btn.textContent = "¡Copiado!";
          setTimeout(() => (btn.textContent = original), 1800);
        } catch (err) {
          alert("No se pudo copiar. El número es: " + txt);
        }
      });
    });
  }

  /* ---------- Galería / lightbox ---------- */
  function initGallery() {
    const box = d.getElementById("lightbox");
    const img = d.getElementById("lightbox-img");
    if (!box) return;

    d.querySelectorAll("#galeria .g-item img").forEach((im) => {
      im.addEventListener("click", () => {
        img.src = im.src;
        img.alt = im.alt;
        box.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });

    function close() {
      box.hidden = true;
      document.body.style.overflow = "";
    }
    d.getElementById("lightbox-close").addEventListener("click", close);
    box.addEventListener("click", (e) => {
      if (e.target === box) close();
    });
    d.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Confirmación ---------- */
  function initRsvp() {
    const options = d.getElementById("rsvp-options");
    const form = d.getElementById("rsvp-form");
    const choice = d.getElementById("rsvp-choice");
    const note = d.getElementById("rsvp-note");
    const nombre = d.getElementById("rsvp-nombre");
    const submit = d.getElementById("rsvp-submit");
    const cambiar = d.getElementById("rsvp-cambiar");
    const done = d.getElementById("rsvp-done");
    const doneText = d.getElementById("rsvp-done-text");

    let respuesta = "";

    d.querySelectorAll(".rsvp-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        respuesta = btn.dataset.rsvp;
        const esSi = respuesta === "si";
        choice.textContent = esSi ? "¡Sí, confirmo!" : "No puedo";
        note.textContent = esSi
          ? "¡Te esperamos! Ingresá tu nombre para confirmar."
          : "Lamentamos no poder contar con vos. Ingresá tu nombre para avisar.";
        options.hidden = true;
        form.hidden = false;
        nombre.focus();
      });
    });

    cambiar.addEventListener("click", () => {
      form.hidden = true;
      options.hidden = false;
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = nombre.value.trim();
      if (!name) {
        nombre.focus();
        return;
      }

      submit.disabled = true;
      submit.innerHTML = '<span class="spinner"></span> Enviando…';

      const payload = {
        nombre: name,
        asistencia: respuesta === "si" ? "Sí" : "No",
        descripcion:
          respuesta === "si"
            ? "¡Sí confirmo! asistirá a la celebración"
            : "No podrá asistir",
        fecha: new Date().toLocaleString("es-AR", {
          dateStyle: "short",
          timeStyle: "medium",
        })
      };

      let ok = false;

      if (CONFIG.appsScriptURL) {
        try {
          const res = await fetch(CONFIG.appsScriptURL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload)
          });
          const txt = await res.text();
          ok = res.ok && /ok|exito|éxito|success/i.test(txt || "");
        } catch (err) {
          ok = false;
        }
      } else {
        // Modo demo: sin conexión a Google Sheets
        console.info("Modo demo. Datos:", payload);
        ok = true;
      }

      if (ok) {
        form.hidden = true;
        doneText.textContent =
          respuesta === "si"
            ? `¡${name}, te esperamos el 6 de marzo!`
            : `Gracias ${name} por avisarnos. Te vamos a extrañar.`;
        done.hidden = false;
      } else {
        submit.disabled = false;
        submit.textContent = "Reintentar";
        alert(
          "Hubo un problema al enviar tu confirmación.\n" +
            "Por favor, intentá de nuevo en unos segundos."
        );
      }
    });
  }

  /* ---------- Música de fondo ---------- */
  function initMusic() {
    const audio = d.getElementById("bg-music");
    const btn = d.getElementById("music-btn");
    const iconNote = d.getElementById("icon-note");
    const iconPause = d.getElementById("icon-pause");
    const hint = d.getElementById("music-hint");
    if (!audio || !btn) return;

    let started = false;

    function setPlaying(playing) {
      btn.classList.toggle("playing", playing);
      iconNote.hidden = playing;
      iconPause.hidden = !playing;
    }

    function showHint() {
      if (!hint) return;
      hint.hidden = false;
      requestAnimationFrame(() => hint.classList.add("show"));
      setTimeout(() => {
        hint.classList.remove("show");
        setTimeout(() => (hint.hidden = true), 500);
      }, 2600);
    }

    function tryPlay() {
      const p = audio.play();
      if (p !== undefined) {
        p.catch(() => {
          /* autoplay bloqueado: espera el toque del botón */
        });
      }
    }

    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(() => {
          started = true;
          setPlaying(true);
          showHint();
        });
      } else {
        audio.pause();
        setPlaying(false);
      }
    });

    // Intento de autoplay (funciona en escritorio; en celulares
    // el navegador lo bloquea y el botón pulsa para invitarlos)
    if (audio.src) {
      audio.addEventListener("canplay", tryPlay, { once: true });
      tryPlay();
    }

    // Si el navegador pausó la reproducción, reflejarlo en el botón
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("play", () => setPlaying(true));
  }

  /* ---------- Init ---------- */
  function init() {
    initReveal();
    initCountdown();
    initPlaceholders();
    initCopy();
    initGallery();
    initRsvp();
    initMusic();
    // Fuerza visibilidad de la portada
    d.querySelectorAll("#portada .reveal").forEach((el) =>
      el.classList.add("is-visible")
    );
  }

  if (document.readyState === "loading") {
    d.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
