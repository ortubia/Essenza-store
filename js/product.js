document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById('product-grid');
  const searchInput = document.querySelector('.search-input');
  const categoryFilter = document.querySelector('.category-filter');

  // Datos de ejemplo (en producción vendrían de una API)
  const products = [
    {
      id: 1,
      name: "Yves d'Orgeval VIP",
      price: 39300,
      category: "Caballeros",
      image: "images/product1.jpg"
    },
    {
      id: 2,
      name: "Scandal Sexy",
      price: 41600,
      category: "Damas", 
      image: "images/product2.jpg"
    }
  ];

  // Renderizar productos
  function renderProducts(productsToRender) {
    productGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
      productGrid.innerHTML = '<p class="no-products">No se encontraron productos</p>';
      return;
    }
    
    productsToRender.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      
      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image">
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-price">$${product.price.toLocaleString('es-CO')}</p>
        </div>
      `;
      
      productGrid.appendChild(productCard);
    });
  }

  // Filtrar productos
  function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    let filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory = category === 'all' || product.category === category;
      return matchesSearch && matchesCategory;
    });
    
    renderProducts(filteredProducts);
  }

  // Event listeners
  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);

  // Cargar todos los productos inicialmente
  renderProducts(products);
});
