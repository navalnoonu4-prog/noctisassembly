/* shop.js — product rendering */

function applyFilters() {
  const list = [...PRODUCTS];
  const grid = document.getElementById("shopGrid");
  const count = document.getElementById("productCount");
  const noResults = document.getElementById("noResults");
  if (grid) renderProducts(list, grid);
  if (count) count.textContent = `${list.length} item${list.length !== 1 ? "s" : ""}`;
  if (noResults) noResults.style.display = list.length ? "none" : "block";
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  applyFilters();
});
