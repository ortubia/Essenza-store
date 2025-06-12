let productos = [];

const container = document.getElementById("products-container");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

// Cargar los productos desde productos.json
fetch("productos.json")
  .then(response => response.json())
  .then(data => {
    productos = data;
    renderProductos(productos);
  })
  .catch(error => {
    console.error("Error cargando productos:", error);
    container.innerHTML = "<p>Error al cargar productos.</p>";
  });

// Renderizar productos en el contenedor
function renderProductos(lista) {
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = "<p>No se encontraron productos.</p>";
    return;
  }

  lista.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" />
      <div class="info">
        <h3>${p.nombre}</h3>
        <p><strong>Categoría:</strong> ${p.categoria}</p>
        <p>${p.descripcion}</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// Aplicar filtros por búsqueda y categoría
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

// Eventos
searchInput.addEventListener("input", aplicarFiltros);
categoryFilter.addEventListener("change", aplicarFiltros);

