/* shop.js — filter + sort logic */

function getFilteredProducts() {
  let list = [...PRODUCTS];
  const catInputs = document.querySelectorAll('input[name="cat"]');
  let cat = "";
  catInputs.forEach(r => { if (r.checked) cat = r.value; });
  if (cat) list = list.filter(p => p.category === cat);

  const maxPrice = parseInt(document.getElementById("priceRange")?.value || 2500);
  list = list.filter(p => p.price <= maxPrice);

  const sort = document.getElementById("sortBy")?.value;
  if (sort === "priceLow") list.sort((a,b) => a.price - b.price);
  if (sort === "priceHigh") list.sort((a,b) => b.price - a.price);
  if (sort === "new") list.sort((a,b) => b.id - a.id);

  return list;
}

function applyFilters() {
  const list = getFilteredProducts();
  const grid = document.getElementById("shopGrid");
  const count = document.getElementById("productCount");
  const noResults = document.getElementById("noResults");
  if (grid) renderProducts(list, grid);
  if (count) count.textContent = `${list.length} item${list.length !== 1 ? "s" : ""}`;
  if (noResults) noResults.style.display = list.length ? "none" : "block";
}

function clearFilters() {
  document.querySelectorAll('input[name="cat"]')[0].checked = true;
  const pr = document.getElementById("priceRange");
  if (pr) { pr.value = 2500; document.getElementById("priceVal").textContent = 2500; }
  const sb = document.getElementById("sortBy");
  if (sb) sb.value = "";
  applyFilters();
}

// Bind events
document.querySelectorAll('input[name="cat"]').forEach(r => r.addEventListener("change", applyFilters));
document.getElementById("priceRange")?.addEventListener("input", function() {
  document.getElementById("priceVal").textContent = this.value;
  applyFilters();
});
document.getElementById("sortBy")?.addEventListener("change", applyFilters);

// Read URL param for category
const urlCat = new URLSearchParams(window.location.search).get("cat");
if (urlCat) {
  const catMap = {
    oversized: "Oversized Tees",
    afterhours: "Oversized Tees"
  };
  const matched = catMap[urlCat.toLowerCase()] || "Oversized Tees";
  if (matched) {
    document.querySelectorAll('input[name="cat"]').forEach(r => {
      r.checked = r.value === matched;
    });
    const title = document.getElementById("shopTitle");
    if (title) title.textContent = matched;
  }
}

/* Mobile filter drawer toggle */
function toggleShopSidebar() {
  const sidebar = document.getElementById("shopSidebar");
  const chevron = document.getElementById("filterChevron");
  if (!sidebar) return;
  sidebar.classList.toggle("open");
  if (chevron) chevron.classList.toggle("rotate");
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  applyFilters();
});
