document.addEventListener("DOMContentLoaded", () => {
  fetch("productos.json")
    .then(response => response.json())
    .then(productos => {
      const container = document.getElementById("products-container");

      productos.forEach(producto => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}" />
          <div class="info">
            <h3>${producto.nombre}</h3>
            <p><strong>Código:</strong> ${producto.codigo}</p>
            <p><strong>Precio:</strong> $${producto.precio}</p>
            <p>${producto.descripcion}</p>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error("Error al cargar productos:", error);
    });
});
