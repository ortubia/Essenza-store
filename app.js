let productos = [];

const container = document.getElementById("products-container");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

card.innerHTML = `
  <img src="${p.imagen}" alt="${p.nombre}" />
  <div class="info">
    <h3>${p.nombre}</h3>
    <p><strong>Categoría:</strong> ${p.categoria}</p>
    <p>${p.descripcion}</p>
    <button onclick="agregarAlCarrito('${p.nombre}')">Agregar al carrito</button>
  </div>
`;

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
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(nombre) {
  const producto = productos.find(p => p.nombre === nombre);
  if (producto) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarritoUI();
  }
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarCarritoUI();
}

function actualizarCarritoUI() {
  const carritoCont = document.getElementById("carrito-items");
  const total = document.getElementById("carrito-total");
  carritoCont.innerHTML = "";

  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "carrito-item";
    div.innerHTML = `
      <span>${item.nombre}</span>
      <button onclick="eliminarDelCarrito(${index})">❌</button>
    `;
    carritoCont.appendChild(div);
  });

  total.textContent = carrito.length;
}

// Mostrar/Ocultar panel
function toggleCarrito() {
  document.getElementById("carrito").classList.toggle("visible");
}

actualizarCarritoUI();
function generarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Resumen de Pedido - Essensa", 10, 15);

  doc.setFontSize(12);
  let y = 30;

  carrito.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.nombre} - ${item.categoria}`, 10, y);
    y += 10;
  });

  doc.save("pedido_essensa.pdf");

  // Guardar en pedidos del localStorage
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidos.push({
    id: Date.now(),
    fecha: new Date().toLocaleString(),
    productos: [...carrito]
  });
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  alert("Pedido guardado correctamente.");
}




