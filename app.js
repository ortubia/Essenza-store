document.addEventListener("DOMContentLoaded", () => {
  
  // Guardamos una referencia a los elementos del DOM
  const container = document.getElementById("products-container");
  
  // Función para renderizar los productos en el HTML
  const renderProducts = (productos) => {
    container.innerHTML = ""; // Limpiamos el contenedor antes de dibujar
    
    productos.forEach(producto => {
      const card = document.createElement("div");
      card.className = "product-card";

      // Formatear el precio a un formato de moneda local si es necesario
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

  // Cargar los productos desde el JSON
  fetch("productos.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(productos => {
      // Una vez que tenemos los productos, los renderizamos
      renderProducts(productos);
    })
    .catch(error => {
      console.error("Error al cargar productos:", error);
      container.innerHTML = "<p>Error al cargar los productos. Por favor, intente más tarde.</p>";
    });
});



