document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const container = document.getElementById("products-container");
  const searchBox = document.getElementById("search-box");
  const categorySelect = document.getElementById("category-select");
  const sortSelect = document.getElementById("sort-select");
  
  let products = [];
  
  // Función para renderizar productos
  const renderProducts = (productsToRender) => {
    container.innerHTML = "";
    
    if (productsToRender.length === 0) {
      container.innerHTML = "<p>No se encontraron productos que coincidan con tu búsqueda.</p>";
      return;
    }
    
    productsToRender.forEach(producto => {
      const card = document.createElement("div");
      card.className = "product-card";
      
      const formattedPrice = producto.precio.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
      });
      
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" />
        <div class="info">
          <h3>${producto.nombre}</h3>
          <p class="description">${producto.descripcion}</p>
          <p class="price">${formattedPrice}</p>
          <button class="add-to-cart-btn">Añadir al Carrito</button>
        </div>
      `;
      
      container.appendChild(card);
    });
  };
  
  // Función para filtrar y ordenar productos
  const filterAndSortProducts = () => {
    let filteredProducts = [...products];
    
    // Filtrar por búsqueda
    const searchTerm = searchBox.value.toLowerCase();
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm) || 
        producto.descripcion.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrar por categoría
    const selectedCategory = categorySelect.value;
    if (selectedCategory !== "todas") {
      filteredProducts = filteredProducts.filter(
        producto => producto.categoria === selectedCategory
      );
    }
    
    // Ordenar
    const sortOption = sortSelect.value;
    switch (sortOption) {
      case "precio-asc":
        filteredProducts.sort((a, b) => a.precio - b.precio);
        break;
      case "precio-desc":
        filteredProducts.sort((a, b) => b.precio - a.precio);
        break;
      case "nombre-asc":
        filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "nombre-desc":
        filteredProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        // Orden por defecto (como vienen del JSON)
        break;
    }
    
    renderProducts(filteredProducts);
  };
  
  // Event listeners para filtros
  searchBox.addEventListener("input", filterAndSortProducts);
  categorySelect.addEventListener("change", filterAndSortProducts);
  sortSelect.addEventListener("change", filterAndSortProducts);
  
  // Cargar productos
  fetch("productos.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      products = data;
      renderProducts(products);
      
      // Llenar opciones de categoría (eliminando duplicados)
      const categories = [...new Set(data.map(p => p.categoria))];
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error al cargar productos:", error);
      container.innerHTML = "<p>Error al cargar los productos. Por favor, intente más tarde.</p>";
    });
});
