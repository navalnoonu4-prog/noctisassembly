/* =============================================
   app.js — NOCTIS ASSEMBLY
   ============================================= */

const WA_CATALOGUE = "https://wa.me/p/29540746408898857/918891680805";

/* ---- Single Product ---- */
const PRODUCTS = [
  {
    id: 1,
    name: "Afterhours D. Oversized Tee",
    category: "Oversized Tees",
    price: 799,
    originalPrice: 999,
    badge: "New Drop",
    img: "images/shirt front.png",
    hoverImg: "images/shirt back.png",
    gallery: [
      "images/shirt front.png",
      "images/shirt back.png",
      "images/front leg.jpg",
      "images/front chair.jpg",
      "images/back.jpg"
    ],
    description: "Act 01: Fear of the Dark / Worn in the Dark. Debut heavyweight 240 GSM combed cotton oversized tee. Celestial cathedral screen-print in gold on front, signature 'noctis.' print on back. Dropped shoulders, boxy relaxed fit.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  }
];

/* =============================================
   ORDER via WhatsApp Catalogue
   ============================================= */
function orderOnWhatsApp() {
  window.open(WA_CATALOGUE, "_blank");
}

/* =============================================
   RENDER PRODUCTS
   ============================================= */
function renderProducts(list, container) {
  if (!container) return;
  container.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-img-wrap">
        <img class="img-primary contain has-hover" src="${p.img}" alt="${p.name}" loading="lazy" />
        <img class="img-hover" src="${p.hoverImg}" alt="${p.name} back" loading="lazy" />
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        <button class="product-wishlist" data-id="${p.id}" title="Wishlist">
          <i class="fa-heart ${isWishlisted(p.id) ? 'fa-solid active' : 'fa-regular'}"></i>
        </button>
        <button class="quick-view-btn" data-id="${p.id}">Quick View</button>
      </div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <p class="product-name">${p.name}</p>
        <div class="product-price-row">
          <div>
            <span class="product-price">₹${p.price.toLocaleString()}</span>
            ${p.originalPrice ? `<span class="product-price-og">₹${p.originalPrice.toLocaleString()}</span>` : ""}
          </div>
          <button class="btn-add-cart" onclick="event.stopPropagation(); orderOnWhatsApp()">
            Order <i class="fa-brands fa-whatsapp" style="font-size:12px;"></i>
          </button>
        </div>
      </div>`;
    card.querySelector(".quick-view-btn").addEventListener("click", e => { e.stopPropagation(); openQuickView(p.id); });
    card.querySelector(".product-wishlist").addEventListener("click", e => { e.stopPropagation(); toggleWishlist(p.id, e.currentTarget); });
    card.addEventListener("click", () => openQuickView(p.id));
    container.appendChild(card);
  });
}

/* =============================================
   WISHLIST
   ============================================= */
let wishlist = JSON.parse(localStorage.getItem("na_wish") || "[]");
function isWishlisted(id) { return wishlist.includes(id); }
function toggleWishlist(id, btn) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(x => x !== id);
    btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
    btn.classList.remove("active");
    showToast("Removed from wishlist");
  } else {
    wishlist.push(id);
    btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
    btn.classList.add("active");
    showToast("Added to wishlist ♥");
  }
  localStorage.setItem("na_wish", JSON.stringify(wishlist));
}

/* =============================================
   QUICK VIEW
   ============================================= */
function openQuickView(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const inner = document.getElementById("qvInner");
  if (!inner) return;

  const thumbsHTML = p.gallery.map((src, i) => `
    <img src="${src}" class="qv-thumb ${i === 0 ? 'active' : ''}"
         onclick="switchQVImage('${src}', this)" alt="view ${i + 1}" />`).join("");

  inner.innerHTML = `
    <div class="qv-gallery">
      <img class="qv-img" id="qvMainImg" src="${p.gallery[0]}" alt="${p.name}" />
      <div class="qv-thumbs">${thumbsHTML}</div>
    </div>
    <div class="qv-details">
      <p class="qv-cat">${p.category}</p>
      <h2 class="qv-name">${p.name}</h2>
      <p class="qv-price">
        ₹${p.price.toLocaleString()}
        ${p.originalPrice ? `<span class="qv-og">₹${p.originalPrice.toLocaleString()}</span>` : ""}
      </p>
      ${p.description ? `<p class="qv-desc">${p.description}</p>` : ""}
      <p class="qv-label">Available Sizes</p>
      <div class="size-grid">
        ${p.sizes.map(s => `<span class="size-btn">${s}</span>`).join("")}
      </div>
      <button class="qv-add" onclick="orderOnWhatsApp()">
        <i class="fa-brands fa-whatsapp"></i> Order on WhatsApp — ₹${p.price.toLocaleString()}
      </button>
      <p class="qv-wa-note">You'll be taken to our WhatsApp catalogue to complete your order.</p>
    </div>`;

  openModal("quickViewModal");
}

function switchQVImage(src, thumb) {
  const mainImg = document.getElementById("qvMainImg");
  if (mainImg) {
    mainImg.style.opacity = "0.3";
    setTimeout(() => { mainImg.src = src; mainImg.style.opacity = "1"; }, 120);
  }
  document.querySelectorAll(".qv-thumb").forEach(t => t.classList.remove("active"));
  thumb.classList.add("active");
}

/* =============================================
   MODALS
   ============================================= */
function openModal(id) {
  document.getElementById(id)?.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove("open");
  document.body.style.overflow = "";
}
function closeModalOutside(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

/* =============================================
   SEARCH
   ============================================= */
const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");

searchInput?.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { searchDropdown?.classList.remove("open"); return; }
  const results = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
  if (!results.length) { searchDropdown?.classList.remove("open"); return; }
  if (!searchDropdown) return;
  searchDropdown.innerHTML = results.map(p => `
    <li onclick="openQuickView(${p.id}); searchDropdown.classList.remove('open'); searchInput.value=''">
      <img src="${p.img}" alt="${p.name}" style="object-fit:contain;background:#141414;padding:2px;" />
      <div>
        <div style="font-weight:500;">${p.name}</div>
        <div style="font-size:11px;color:#888;">₹${p.price.toLocaleString()}</div>
      </div>
    </li>`).join("");
  searchDropdown.classList.add("open");
});
document.addEventListener("click", e => {
  if (!e.target.closest(".search-wrap")) searchDropdown?.classList.remove("open");
});

/* =============================================
   TOAST
   ============================================= */
let toastTimeout;
function showToast(msg) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2800);
}

/* =============================================
   HEADER SCROLL
   ============================================= */
window.addEventListener("scroll", () => {
  const header = document.getElementById("header");
  if (!header) return;
  header.style.boxShadow = window.scrollY > 60 ? "0 2px 20px rgba(0,0,0,.5)" : "none";
});

/* =============================================
   KEYBOARD ESC
   ============================================= */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeModal("trackModal");
    closeModal("quickViewModal");
  }
});

/* =============================================
   MOBILE NAVIGATION
   ============================================= */
function toggleMobileNav() {
  const nav = document.getElementById("mobileNav") || document.querySelector(".nav-bar");
  const btn = document.getElementById("hamburger") || document.querySelector(".hamburger");
  if (!nav) return;
  const isOpen = nav.classList.toggle("mobile-open");
  if (btn) btn.classList.toggle("open", isOpen);
}

document.addEventListener("click", e => {
  const nav = document.getElementById("mobileNav") || document.querySelector(".nav-bar");
  const btn = document.getElementById("hamburger") || document.querySelector(".hamburger");
  if (nav && nav.classList.contains("mobile-open")) {
    if (!nav.contains(e.target) && (!btn || !btn.contains(e.target))) {
      nav.classList.remove("mobile-open");
      if (btn) btn.classList.remove("open");
    }
  }
});

/* =============================================
   INIT
   ============================================= */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("productsGrid") || document.getElementById("shopGrid");
  if (grid) renderProducts(PRODUCTS, grid);
});
