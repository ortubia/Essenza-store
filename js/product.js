document.addEventListener("DOMContentLoaded", function() {
  // Elementos del DOM
  const productsContainer = document.getElementById('products-container');
  const searchInput = document.getElementById('search');
  const categorySelect = document.getElementById('category');
  const sortSelect = document.getElementById('sort');
  const cartCount = document.querySelector('.cart-count');
  
  let products = [];
  let cart = JSON.parse(localStorage.getItem('essenza-cart')) || [];

  // Función para renderizar productos
  function renderProducts(productsToRender) {
    productsContainer.innerHTML = '';
    
    if (productsToRender.length === 0) {
      productsContainer.innerHTML = `
        <div class="no-products">
          <p>No se encontraron productos que coincidan con tu búsqueda</p>
          <button id="reset-filters">Restablecer filtros</button>
        </div>
      `;
      
      document.getElementById('reset-filters').addEventListener('click', () => {
        searchInput.value = '';
        categorySelect.value = 'all';
        sortSelect.value = 'default';
        filterProducts();
      });
      return;
    }
    
    productsToRender.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      
      const formattedPrice = product.precio.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
      });
      
      // Verificar si el producto ya está en el carrito
      const inCart = cart.some(item => item.codigo === product.codigo);
      
      productCard.innerHTML = `
        <div class="product-badge">${product.categoria}</div>
        <img src="${product.imagen}" alt="${product.nombre}" class="product-image">
        <div class="product-info">
          <h3 class="product-name">${product.nombre}</h3>
          <p class="product-description">${product.descripcion}</p>
          <div class="product-footer">
            <p class="product-price">${formattedPrice}</p>
            <button class="add-to-cart ${inCart ? 'in-cart' : ''}" data-id="${product.codigo}">
              ${inCart ? '✔ En carrito' : 'Añadir al carrito'}
            </button>
          </div>
        </div>
      `;
      
      productsContainer.appendChild(productCard);
    });
    
    // Actualizar contador del carrito
    updateCartCount();
  }

  // Función para filtrar y ordenar productos
  function filterProducts() {
    let filteredProducts = [...products];
    
    // Filtrar por búsqueda
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm) || 
        product.descripcion.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrar por categoría
    const category = categorySelect.value;
    if (category !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.categoria === category
      );
    }
    
    // Ordenar
    const sortOption = sortSelect.value;
    switch (sortOption) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.precio - b.precio);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.precio - a.precio);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      default:
        // Orden por defecto
        break;
    }
    
    renderProducts(filteredProducts);
  }

  // Función para actualizar contador del carrito
  function updateCartCount() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Manejar clic en "Añadir al carrito"
  function handleAddToCart(e) {
    if (e.target.classList.contains('add-to-cart')) {
      const productId = e.target.dataset.id;
      const product = products.find(p => p.codigo === productId);
      
      // Verificar si ya está en el carrito
      const existingItem = cart.find(item => item.codigo === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          ...product,
          quantity: 1
        });
      }
      
      // Actualizar localStorage
      localStorage.setItem('essenza-cart', JSON.stringify(cart));
      
      // Actualizar UI
      e.target.textContent = '✔ En carrito';
      e.target.classList.add('in-cart');
      updateCartCount();
      
      // Mostrar notificación
      showNotification(`${product.nombre} añadido al carrito`);
    }
  }

  // Mostrar notificación
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  // Event listeners
  searchInput.addEventListener('input', filterProducts);
  categorySelect.addEventListener('change', filterProducts);
  sortSelect.addEventListener('change', filterProducts);
  productsContainer.addEventListener('click', handleAddToCart);

  // Cargar productos
  fetch('productos.json')
    .then(response => response.json())
    .then(data => {
      products = data;
      filterProducts();
      
      // Llenar opciones de categoría
      const categories = [...new Set(data.map(p => p.categoria))];
      categories.forEach(cat => {
        if (![...categorySelect.options].some(opt => opt.value === cat)) {
          const option = document.createElement('option');
          option.value = cat;
          option.textContent = cat;
          categorySelect.appendChild(option);
        }
      });
    })
    .catch(error => {
      console.error('Error al cargar productos:', error);
      productsContainer.innerHTML = '<p class="error">Error al cargar los productos. Por favor, intente más tarde.</p>';
    });
});
