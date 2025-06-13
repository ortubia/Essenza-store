document.addEventListener("DOMContentLoaded", () => {
  // Cargar productos destacados
  const productHighlights = document.querySelector('.product-highlights');
  
  fetch('productos.json')
    .then(response => response.json())
    .then(products => {
      // Tomar los primeros 3 productos como destacados
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
          <img src="${product.imagen}" alt="${product.nombre}" />
          <div class="info">
            <h3>${product.nombre}</h3>
            <p class="price">${formattedPrice}</p>
          </div>
        `;
        
        productHighlights.appendChild(productCard);
      });
    })
    .catch(error => {
      console.error('Error al cargar productos destacados:', error);
      productHighlights.innerHTML = '<p>Error al cargar productos destacados</p>';
    });
});
