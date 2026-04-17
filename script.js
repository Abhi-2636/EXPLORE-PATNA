document.documentElement.classList.add("js");

const CATEGORY_META = {
  spiritual: {
    title: "Spiritual Patna",
    label: "Temples and faith",
    intro: "Temples, shrines, old-city prayer spaces and river rituals that shape Patna's everyday devotion.",
    file: "spiritual.html"
  },
  heritage: {
    title: "Heritage Patna",
    label: "History and museums",
    intro: "Ancient Pataliputra, museums, public landmarks and civic memory points across the city.",
    file: "heritage.html"
  },
  food: {
    title: "Patna Food",
    label: "Food and sweets",
    intro: "Litti chokha, sattu, thekua, khaja, tilkut and the street snacks that make Patna taste local.",
    file: "food.html"
  },
  culture: {
    title: "Patna Culture",
    label: "Festivals and crafts",
    intro: "Chhath, Durga Puja, folk art, fairs and the living traditions that bring the city together.",
    file: "culture.html"
  },
  leisure: {
    title: "Leisure Patna",
    label: "Ghats and recreation",
    intro: "Riverfront drives, ghats, parks, family outings, planetarium shows, water parks and green breaks.",
    file: "leisure.html"
  },
  shopping: {
    title: "Shopping Patna",
    label: "Markets and malls",
    intro: "Classic bazaars, old-city markets, mall stops and everyday shopping places across Patna.",
    file: "shopping.html"
  },
  trip: {
    title: "Trips From Patna",
    label: "Nearby heritage trips",
    intro: "Nalanda, Rajgir, Bodh Gaya, Vaishali, Pawapuri and Kesaria for full-day heritage routes.",
    file: "trips.html"
  }
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function categoryFile(category) {
  return CATEGORY_META[category]?.file || "index.html#famous";
}

function detailHref(item) {
  return `detail.html?item=${encodeURIComponent(item.id)}`;
}

function cardMarkup(item) {
  const details = item.details.map((detail) => `
    <div><strong>${escapeHtml(detail.label)}</strong><span>${detail.value}</span></div>
  `).join("");

  return `
    <article class="patna-card reveal" data-category="${escapeHtml(item.categories.join(" "))}" data-card-link="${detailHref(item)}" role="link" tabindex="0" aria-label="Open ${escapeHtml(item.title)} details">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}">
      <div class="card-body">
        <p class="card-type">${escapeHtml(item.type)}</p>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <div class="detail-list">${details}</div>
        <a class="card-open" href="${detailHref(item)}">Open full details</a>
      </div>
    </article>
  `;
}

function cardsForScope(scope) {
  const cards = window.PATNA_CARDS || [];
  if (!scope || scope === "all") return cards;
  return cards.filter((item) => item.categories.includes(scope));
}

function renderCardGrids() {
  document.querySelectorAll("[data-card-grid]").forEach((grid) => {
    const scope = grid.dataset.cardScope || "all";
    const items = cardsForScope(scope);
    grid.innerHTML = items.map(cardMarkup).join("");
  });
}

function setupOpenableCards() {
  document.querySelectorAll("[data-card-link]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      window.location.href = card.dataset.cardLink;
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      window.location.href = card.dataset.cardLink;
    });
  });
}

function setupFilters() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".patna-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      cards.forEach((card) => {
        const categories = (card.dataset.category || "").split(" ");
        const shouldShow = filter === "all" || categories.includes(filter);
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });
}

function setupReveal() {
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

function setupHeader() {
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  if (!menuToggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function renderCategoryPage() {
  const category = document.body.dataset.categoryPage;
  if (!category) return;

  const meta = CATEGORY_META[category];
  const items = cardsForScope(category);
  const hero = document.querySelector("[data-category-hero]");
  const title = document.querySelector("[data-category-title]");
  const intro = document.querySelector("[data-category-intro]");
  const count = document.querySelector("[data-category-count]");
  const firstItem = items[0];

  if (meta) {
    document.title = `${meta.title} | Explore Patna`;
    if (title) title.textContent = meta.title;
    if (intro) intro.textContent = meta.intro;
    if (count) count.textContent = `${items.length} detailed cards`;
  }

  if (hero && firstItem) {
    hero.style.backgroundImage = `linear-gradient(90deg, rgba(23, 21, 18, 0.86), rgba(23, 21, 18, 0.46)), url("${firstItem.image}")`;
  }
}

function renderDetailPage() {
  const root = document.querySelector("[data-detail-root]");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const itemId = params.get("item");
  const cards = window.PATNA_CARDS || [];
  const item = cards.find((entry) => entry.id === itemId);

  if (!item) {
    root.innerHTML = `
      <section class="section detail-empty">
        <div class="section-heading reveal">
          <p class="kicker">Not found</p>
          <h1>This Patna card could not be opened.</h1>
          <p>Return to the homepage and choose another famous place, food, market or trip.</p>
          <a class="button primary" href="index.html#famous">Back to all cards</a>
        </div>
      </section>
    `;
    return;
  }

  const primaryCategory = item.categories[0];
  const meta = CATEGORY_META[primaryCategory];
  const related = cards.filter((entry) => entry.id !== item.id && entry.categories.includes(primaryCategory)).slice(0, 3);
  const details = item.details.map((detail) => `
    <div><strong>${escapeHtml(detail.label)}</strong><span>${detail.value}</span></div>
  `).join("");

  document.title = `${item.title} | Explore Patna`;
  root.innerHTML = `
    <section class="item-hero reveal">
      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.alt)}">
      <div class="item-hero-copy">
        <p class="kicker">${escapeHtml(meta?.label || item.type)}</p>
        <h1>${escapeHtml(item.title)}</h1>
        <p>${escapeHtml(item.description)}</p>
        <div class="hero-actions">
          <a class="button primary" href="${categoryFile(primaryCategory)}">Back to ${escapeHtml(meta?.label || "category")}</a>
          <a class="button secondary" href="index.html#famous">All cards</a>
        </div>
      </div>
    </section>

    <section class="section detail-content">
      <div class="detail-panel reveal">
        <div>
          <p class="kicker">Full card details</p>
          <h2>Plan around ${escapeHtml(item.title)}</h2>
        </div>
        <div class="detail-list detail-list-large">${details}</div>
      </div>
    </section>

    <section class="section">
      <div class="section-heading reveal">
        <p class="kicker">Keep exploring</p>
        <h2>More from ${escapeHtml(meta?.label || "Patna")}</h2>
      </div>
      <div class="card-grid">${related.map(cardMarkup).join("")}</div>
    </section>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  setupHeader();
  renderCategoryPage();
  renderCardGrids();
  renderDetailPage();
  setupOpenableCards();
  setupFilters();
  setupReveal();

  document.querySelectorAll(".patna-card img, .mosaic img, .item-hero img").forEach((image) => {
    image.loading = "lazy";
    image.decoding = "async";
  });
});
