let productos = [];

const container = document.getElementById("products-container");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

fetch("productos.json")
  .then(res => res.json())
  .then(data => {
    productos = data;
    renderProductos(productos);
  });

function renderProductos(lista) {
  container.innerHTML = "";
  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" />
      <div class="info">
        <h3>${p.nombre}</h3>
        <p><strong>Precio:</strong> $${p.precio}</p>
        <p><strong>Código:</strong> ${p.codigo}</p>
        <p>${p.descripcion}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

function aplicarFiltros() {
  const texto = searchInput.value.toLowerCase();
  const categoria = categoryFilter.value;

  const filtrados = productos.filter(p => {
    const coincideTexto = p.nombre.toLowerCase().includes(texto) || p.descripcion.toLowerCase().includes(texto);
    const coincideCategoria = categoria === "todos" || p.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });

  renderProductos(filtrados);
}

searchInput.addEventListener("input", aplicarFiltros);
categoryFilter.addEventListener("change", aplicarFiltros);
