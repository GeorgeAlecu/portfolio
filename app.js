const t = (key) => I18n.t(key);

const projects = [
  {
    title: "Invoice Financing Platform",
    date: "2026",
    image: "ACAB",
    tags: [],
    note: true,
    translationKey: "projects.1",
  },
  {
    title: "Energy Marketplace with AI",
    date: "2024–2025",
    image: "DEM4PED",
    tags: ["React", "Redux Toolkit", "Python / FastAPI", "TensorFlow"],
    translationKey: "projects.2",
  },
  {
    title: "IBeChange",
    date: "2026",
    image: "IBeChange",
    imagesPerPage: 2,
    tags: ["Angular", "Ionic", "Capacitor"],
    translationKey: "projects.3",
  },
  {
    title: "NCTS & AES",
    date: "2023–2024",
    image: "NCTS & AES",
    tallGallery: true,
    tags: ["Business workflows", "PDF", "Adobe Lifecycle"],
    translationKey: "projects.4",
  },
  {
    title: "Minimum Inclusion Income",
    date: "2023–2024",
    image: "VMI",
    tags: ["Angular", "RxJS", "PrimeNG", "REST API"],
    translationKey: "projects.5",
  },
  {
    title: "Maintenance Scheduler",
    date: "2021–2023",
    image: "KYKLOS 4.0",
    tags: ["Angular", "PrimeNG", "REST API"],
    translationKey: "projects.6",
  },
];

function escapeAttr(value) {
  return String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function projectGallery(project, lang) {
  const images = (window.PROJECT_IMAGES?.[project.image] || []).filter(
    (item) => item && typeof item.src === "string" && item.src.trim(),
  );
  if (!images.length)
    return `<div class="project-image placeholder" aria-label="${t("gallery.placeholder")}: ${escapeAttr(project.image)}"><span>+</span><small>${escapeAttr(project.image)}</small></div>`;
  const perPage = project.imagesPerPage || 1;
  const multiple = images.length > perPage;
  const slides = images
    .map(
      (item, i) =>
        `<div class="gallery-slide" ${i >= perPage ? "hidden" : ""}><img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.translationKey ? t(item.translationKey) : (item[lang] && item[lang] !== "-" ? item[lang] : item.ro || item.alt || project.title + " — " + (i + 1)))}" loading="lazy" decoding="async"><span class="image-error" hidden>${t("gallery.unavailable")}</span></div>`,
    )
    .join("");
  return `<div class="project-gallery${perPage === 2 ? " gallery-paired" : ""}${project.tallGallery ? " gallery-tall" : ""}" data-per-page="${perPage}" ${multiple ? 'role="group" aria-roledescription="' + t("gallery.role") + '"' : ""} aria-label="${escapeAttr(project.title)}"><div class="gallery-viewport">${slides}${multiple ? `<button type="button" class="gallery-arrow previous" data-step="-1" aria-label="${t("gallery.previous")}">‹</button><button type="button" class="gallery-arrow next" data-step="1" aria-label="${t("gallery.next")}">›</button>` : ""}</div>${multiple ? `<div class="gallery-bottom"><div class="gallery-dots">${images.map((_, i) => i % perPage ? "" : `<button type="button" data-slide="${i}" aria-label="${t("gallery.show")} ${i + 1}" aria-pressed="${i === 0}"><span></span></button>`).join("")}</div><span class="gallery-count" aria-live="polite" aria-atomic="true">1 / ${images.length}</span></div>` : ""}</div>`;
}
function initGalleries() {
  document.querySelectorAll(".project-gallery").forEach((gallery) => {
    const slides = [...gallery.querySelectorAll(".gallery-slide")];
    const perPage = Number(gallery.dataset.perPage) || 1;
    let current = 0;
    const caption = document.createElement("p");
    caption.className = "gallery-description";
    caption.setAttribute("aria-live", "polite");
    caption.setAttribute("aria-atomic", "true");
    caption.textContent = slides[0].querySelector("img").alt;
    gallery.append(caption);
    gallery.querySelectorAll("img").forEach((img) =>
      img.addEventListener(
        "error",
        () => {
          img.hidden = true;
          img.nextElementSibling.hidden = false;
        },
        { once: true },
      ),
    );
    const expand = document.createElement("button");
    expand.type = "button";
    expand.className = "gallery-expand";
    expand.textContent = t("gallery.expand");
    expand.setAttribute("aria-haspopup", "dialog");
    if (perPage === 1) gallery.querySelector(".gallery-viewport").append(expand);
    expand.addEventListener("click", () =>
      openImageViewer(
        slides,
        current,
        gallery.getAttribute("aria-label"),
        expand,
        show,
      ),
    );
    slides.forEach((slide, index) => {
      const image = slide.querySelector("img");
      if (perPage === 1) {
        image.addEventListener("click", () => expand.click());
        return;
      }
      const button = expand.cloneNode(true);
      button.setAttribute("aria-label", t("gallery.expand") + ": " + image.alt);
      slide.append(button);
      button.addEventListener("click", () => openImageViewer(
        slides, index, gallery.getAttribute("aria-label"), button, show,
      ));
      image.addEventListener("click", () => button.click());
    });
    const dots = [...gallery.querySelectorAll("[data-slide]")];
    function show(index) {
      const pages = Math.ceil(slides.length / perPage);
      current = ((Math.floor(index / perPage) % pages + pages) % pages) * perPage;
      slides.forEach((el, i) => {
        el.hidden = i < current || i >= current + perPage;
      });
      dots.forEach((el, i) =>
        el.setAttribute("aria-pressed", String(Number(el.dataset.slide) === current)),
      );
      caption.replaceChildren(...slides.slice(current, current + perPage).map(slide => {
        const label = document.createElement("span");
        label.textContent = slide.querySelector("img").alt;
        return label;
      }));
      const count = gallery.querySelector(".gallery-count");
      if (count) count.textContent = `${current + 1}${perPage > 1 ? "–" + Math.min(current + perPage, slides.length) : ""} / ${slides.length}`;
    }
    gallery
      .querySelectorAll("[data-step]")
      .forEach((b) =>
        b.addEventListener("click", () =>
          show(current + Number(b.dataset.step) * perPage),
        ),
      );
    dots.forEach((b) =>
      b.addEventListener("click", () => show(Number(b.dataset.slide))),
    );
    gallery.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        show(current + (e.key === "ArrowLeft" ? -perPage : perPage));
      }
    });
    show(0);
    let touchStart = null;
    const viewport = gallery.querySelector(".gallery-viewport");
    viewport.addEventListener(
      "touchstart",
      (e) => {
        const t = e.changedTouches[0];
        touchStart = { x: t.clientX, y: t.clientY };
      },
      { passive: true },
    );
    viewport.addEventListener(
      "touchend",
      (e) => {
        if (!touchStart) return;
        const t = e.changedTouches[0],
          dx = t.clientX - touchStart.x,
          dy = t.clientY - touchStart.y;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5)
          show(current + (dx < 0 ? perPage : -perPage));
        touchStart = null;
      },
      { passive: true },
    );
    viewport.addEventListener(
      "touchcancel",
      () => {
        touchStart = null;
      },
      { passive: true },
    );
  });
}

function openImageViewer(slides, initialIndex, title, trigger, syncGallery) {
  const dialog = document.createElement("dialog");
  dialog.className = "image-viewer";
  dialog.setAttribute("aria-label", title);
  dialog.innerHTML = `<div class="viewer-toolbar"><strong></strong><button type="button" class="viewer-close" autofocus>${t("gallery.close")} ✕</button></div><div class="viewer-stage"><button type="button" class="viewer-previous" aria-label="${t("gallery.previous")}">‹</button><img><span class="viewer-error" hidden>${t("gallery.unavailable")}</span><button type="button" class="viewer-next" aria-label="${t("gallery.next")}">›</button></div><p class="viewer-caption" aria-live="polite" aria-atomic="true"></p>`;
  dialog.querySelector("strong").textContent = title;
  const img = dialog.querySelector("img");
  const error = dialog.querySelector(".viewer-error");
  let current = initialIndex;
  function show(index) {
    current = (index + slides.length) % slides.length;
    const original = slides[current].querySelector("img");
    img.hidden = false;
    error.hidden = true;
    img.alt = original.alt;
    img.src = original.src;
    dialog.querySelector(".viewer-caption").textContent =
      `${current + 1} / ${slides.length} — ${original.alt}`;
    syncGallery(current);
  }
  img.addEventListener("error", () => {
    img.hidden = true;
    error.hidden = false;
  });
  dialog
    .querySelector(".viewer-close")
    .addEventListener("click", () => dialog.close());
  for (const [selector, step] of [
    [".viewer-previous", -1],
    [".viewer-next", 1],
  ]) {
    const button = dialog.querySelector(selector);
    button.hidden = slides.length < 2;
    button.addEventListener("click", () => show(current + step));
  }
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      show(current + (event.key === "ArrowLeft" ? -1 : 1));
    }
  });
  dialog.addEventListener("click", (event) => {
    if (
      event.target === dialog ||
      event.target.classList.contains("viewer-stage")
    )
      dialog.close();
  });
  const previousOverflow = document.body.style.overflow;
  dialog.addEventListener(
    "close",
    () => {
      document.body.style.overflow = previousOverflow;
      dialog.remove();
      trigger.focus({ preventScroll: true });
    },
    { once: true },
  );
  document.body.append(dialog);
  show(current);
  document.body.style.overflow = "hidden";
  dialog.showModal();
}

let language =
  new URLSearchParams(location.search).get("lang") === "en" ? "en" : "ro";
function render(lang) {
  language = lang;
  document.documentElement.lang = lang;
  I18n.apply(lang);
  document
    .querySelectorAll("[data-lang]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang)),
    );
  document.title = t("meta.title");
  document.querySelector('meta[name="description"]').content =
    t("meta.description");
  document.getElementById("projects").innerHTML = projects
    .map(
      (p) =>
        `<article class="project">${projectGallery(p, lang)}<div class="project-meta"><span>${t(`${p.translationKey}.category`)}</span><span>${p.date}</span></div><h3>${p.title}</h3><p>${t(`${p.translationKey}.description`)}</p><div class="tags">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>${p.note ? `<p class="project-note">${t(`${p.translationKey}.note`)}</p>` : ""}</article>`,
    )
    .join("");
  document.getElementById("form-status").textContent = "";
  initGalleries();
}
document.querySelectorAll("[data-lang]").forEach((b) =>
  b.addEventListener("click", () => {
    render(b.dataset.lang);
    const u = new URL(location.href);
    u.searchParams.set("lang", language);
    history.replaceState(null, "", u);
  }),
);
document.getElementById("contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.currentTarget);
  const subject = `Portfolio enquiry — ${f.get("service")}`;
  const body = `${t("contact.name")}: ${f.get("name")}\nEmail: ${f.get("email")}\n${t("contact.serviceLabel")}: ${f.get("service")}\n\n${f.get("message")}`;
  location.href = `mailto:george.alecu.81@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.getElementById("form-status").textContent = t("contact.ready");
});
document.getElementById("year").textContent = new Date().getFullYear();
render(language);

// Set the portrait file path in index.html (data-src).
const portraitButton = document.querySelector('.portrait-reveal');
const portraitPhoto = portraitButton.querySelector('.portrait-photo');
portraitPhoto.addEventListener('load', () => {
  portraitButton.disabled = false;
  const hint = portraitButton.querySelector('small');
  hint.dataset.i18n = 'portrait.reveal';
  hint.textContent = t('portrait.reveal');
});
portraitPhoto.addEventListener('error', () => {
  portraitButton.disabled = true;
  portraitButton.setAttribute('aria-pressed', 'false');
});
portraitPhoto.src = portraitPhoto.dataset.src;
portraitButton.addEventListener('click', () => {
  const pressed = portraitButton.getAttribute('aria-pressed') === 'true';
  portraitButton.setAttribute('aria-pressed', String(!pressed));
});
portraitButton.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    portraitButton.setAttribute('aria-pressed', 'false');
    portraitButton.blur();
  }
});
