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

  /* ---------- Video de entrada ---------- */
  function initEntrada() {
    const overlay = d.getElementById("entrada");
    const video = d.getElementById("entrada-video");
    const skip = d.getElementById("entrada-skip");
    if (!overlay || !video) return;

    let closed = false;

    function close() {
      if (closed) return;
      closed = true;
      d.body.classList.remove("no-scroll");
      overlay.classList.add("closed");
      window.setTimeout(() => {
        overlay.hidden = true;
      }, 700);

      const audio = d.getElementById("bg-music");
      const btn = d.getElementById("music-btn");
      if (audio && audio.paused && btn) btn.click();
    }

    d.body.classList.add("no-scroll");
    video.addEventListener("ended", close);
    video.addEventListener("error", close);
    video.addEventListener("loadedmetadata", () => {
      const p = video.play();
      if (p !== undefined) p.catch(() => {});
    });
    skip.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    window.setTimeout(close, 30000);
  }

  /* ---------- Video final tras confirmar ---------- */
  function playFinale() {
    const overlay = d.getElementById("finale");
    const video = d.getElementById("finale-video");
    if (!overlay || !video) return;

    const audio = d.getElementById("bg-music");
    if (audio && !audio.paused) audio.pause();

    overlay.hidden = false;
    d.body.classList.add("no-scroll");

    const p = video.play();
    if (p !== undefined) {
      p.catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
    }

    video.addEventListener(
      "ended",
      () => {
        overlay.classList.add("done");
        window.close();
        window.setTimeout(() => {
          d.body.classList.remove("no-scroll");
        }, 1200);
      },
      { once: true }
    );
  }

  /* ---------- Burbujas que suben ---------- */
  function initBubbles() {
    const layer = d.getElementById("bubbles");
    if (!layer) return;
    const count = 18;
    for (let i = 0; i < count; i++) {
      const b = d.createElement("span");
      b.className = "bubble";
      const size = 18 + Math.random() * 48;
      b.style.width = b.style.height = size.toFixed(1) + "px";
      b.style.left = (Math.random() * 100).toFixed(1) + "%";
      b.style.setProperty("--sway", (Math.random() * 60 - 30).toFixed(0) + "px");
      b.style.setProperty("--o", (0.4 + Math.random() * 0.4).toFixed(2));
      b.style.animationDuration = (10 + Math.random() * 14).toFixed(1) + "s";
      b.style.animationDelay = (-Math.random() * 30).toFixed(1) + "s";
      layer.appendChild(b);
    }
  }

  /* ---------- Confetti (papelitos) ---------- */
  function confettiBurst(cx, cy, count) {
    const layer = d.getElementById("confetti");
    if (!layer) return;
    const colors = ["#b23a4e", "#6e1423", "#f2eee4", "#1f3d2b", "#6e1423", "#1f3a5f"];
    for (let i = 0; i < count; i++) {
      const p = d.createElement("span");
      p.className = "confetti-piece";
      const ang = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * 280;
      const tx = Math.cos(ang) * dist;
      const ty = Math.sin(ang) * dist * 0.9 + 40;
      p.style.setProperty("--tx", tx.toFixed(1) + "px");
      p.style.setProperty("--ty", ty.toFixed(1) + "px");
      p.style.setProperty("--rot", (Math.random() * 900 - 450).toFixed(0) + "deg");
      p.style.width = p.style.height = (6 + Math.random() * 8).toFixed(1) + "px";
      p.style.background = colors[i % colors.length];
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.animationDelay = Math.random() * 0.22 + "s";
      layer.appendChild(p);
      window.setTimeout(() => p.remove(), 2800);
    }
  }

  /* ---------- Tarjetas para raspar (fecha) ---------- */
  function initScratch() {
    const group = d.getElementById("scratch-group");
    if (!group) return;
    const circles = group.querySelectorAll(".scratch-circle");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const doneCount = { n: 0 };

    circles.forEach((circle) => {
      const canvas = circle.querySelector(".scratch-canvas");
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      let drawing = false;
      let done = false;
      let lastCheck = 0;

      function paint() {
        const r = circle.getBoundingClientRect();
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const w = r.width;
        const h = r.height;

        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, w, h);

        const g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, "#b05263");
        g.addColorStop(0.5, "#6e1423");
        g.addColorStop(1, "#d08894");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        const sheen = ctx.createLinearGradient(0, 0, w, h);
        sheen.addColorStop(0, "rgba(255,255,255,0)");
        sheen.addColorStop(0.5, "rgba(255,255,255,0.4)");
        sheen.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = sheen;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "rgba(9,15,17,0.55)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "600 12px Montserrat, sans-serif";
        ctx.fillText("RASPÁ", w / 2, h / 2);
      }

      paint();
      window.addEventListener("resize", paint);

      function pos(e) {
        const r = canvas.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      }

      function scratch(p) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      function progress() {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const step = 24;
        let erased = 0;
        let total = 0;
        for (let i = 3; i < data.length; i += 4 * step) {
          total++;
          if (data[i] === 0) erased++;
        }
        return total ? erased / total : 0;
      }

      function finish() {
        if (done) return;
        done = true;
        doneCount.n++;
        circle.classList.add("done");
        const r = circle.getBoundingClientRect();
        confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 45);
        if (doneCount.n === circles.length) {
          const gr = group.getBoundingClientRect();
          window.setTimeout(() => {
            confettiBurst(gr.left + gr.width / 2, gr.top + gr.height / 2, 120);
          }, 500);
        }
      }

      canvas.addEventListener("pointerdown", (e) => {
        if (done) return;
        drawing = true;
        canvas.setPointerCapture(e.pointerId);
        scratch(pos(e));
      });

      canvas.addEventListener("pointermove", (e) => {
        if (!drawing || done) return;
        scratch(pos(e));
        const now = performance.now();
        if (now - lastCheck > 180) {
          lastCheck = now;
          if (progress() > 0.38) finish();
        }
      });

      ["pointerup", "pointercancel"].forEach((ev) => {
        canvas.addEventListener(ev, () => {
          drawing = false;
          if (!done && progress() > 0.38) finish();
        });
      });
    });
  }

  /* ---------- Iconos animados al entrar en pantalla ---------- */
  function initAnimatedSections() {
    if (!("IntersectionObserver" in window)) {
      d.querySelectorAll("[data-animate]").forEach((s) =>
        s.classList.add("in-view")
      );
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          e.target.classList.toggle("in-view", e.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );
    d.querySelectorAll("[data-animate]").forEach((s) => io.observe(s));
  }

  /* ---------- Acordeones "Ver más" ---------- */
  function initToggles() {
    d.querySelectorAll(".toggle-btn").forEach((btn) => {
      const target = d.getElementById(btn.dataset.toggle);
      if (!target) return;
      const more = btn.dataset.more || "Ver más";
      const less = btn.dataset.less || "Ver menos";
      btn.addEventListener("click", () => {
        const open = target.classList.toggle("panel-open");
        btn.textContent = open ? less : more;
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

  /* ---------- Carrusel de la galería ---------- */
  function initGalleryNav() {
    const gal = d.getElementById("galeria");
    const prev = d.getElementById("g-prev");
    const next = d.getElementById("g-next");
    if (!gal) return;
    const step = () => {
      const item = gal.querySelector(".g-item");
      return item ? item.getBoundingClientRect().width + 12 : 300;
    };
    if (prev) {
      prev.addEventListener("click", () => {
        gal.scrollBy({ left: -step(), behavior: "smooth" });
      });
    }
    if (next) {
      next.addEventListener("click", () => {
        gal.scrollBy({ left: step(), behavior: "smooth" });
      });
    }
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
    const dato = d.getElementById("rsvp-dato");
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
        if (dato) dato.hidden = !esSi;
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

      const dato = (d.getElementById("rsvp-dato").value || "").trim();

      const payload = {
        nombre: name,
        asistencia: respuesta === "si" ? "Sí" : "No",
        descripcion:
          respuesta === "si"
            ? "¡Sí confirmo! asistirá a la celebración"
            : "No podrá asistir",
        dato: dato,
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
        window.setTimeout(playFinale, 1800);
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
    initEntrada();
    initReveal();
    initCountdown();
    initScratch();
    initBubbles();
    initPlaceholders();
    initAnimatedSections();
    initToggles();
    initCopy();
    initGalleryNav();
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
