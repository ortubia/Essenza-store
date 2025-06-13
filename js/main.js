document.addEventListener("DOMContentLoaded", function() {
  // Efecto de scroll en el header
  const header = document.querySelector('.main-header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.style.padding = '0.5rem 0';
      header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.padding = '1rem 0';
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
    }
  });

  // Cargar productos destacados
  const featuredContainer = document.getElementById('featured-products');
  
  if (featuredContainer) {
    fetch('productos.json')
      .then(response => response.json())
      .then(products => {
        const featuredProducts = products.slice(0, 3);
        
        featuredProducts.forEach(product => {
          const productCard = document.createElement('div');
          productCard.className = 'product-card';
          
          const formattedPrice = product.precio.toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2
          });
          
          productCard.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}" class="product-image">
            <div class="product-info">
              <h3 class="product-name">${product.nombre}</h3>
              <p class="product-price">${formattedPrice}</p>
            </div>
          `;
          
          featuredContainer.appendChild(productCard);
        });
      })
      .catch(error => {
        console.error('Error al cargar productos:', error);
        featuredContainer.innerHTML = '<p>Error al cargar los productos. Por favor, intente más tarde.</p>';
      });
  }
});
