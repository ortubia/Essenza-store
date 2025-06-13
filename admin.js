document.addEventListener("DOMContentLoaded", () => {
  // Lógica de login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      
      // Aquí iría la validación real con el backend
      if (email === "admin@essenza.com" && password === "admin123") {
        window.location.href = "productos.html";
      } else {
        alert("Credenciales incorrectas. Intente nuevamente.");
      }
    });
  }
  
  // Lógica de gestión de productos
  const productsTable = document.querySelector(".products-table tbody");
  if (productsTable) {
    // Simulación de carga de productos
    fetch("../../productos.json")
      .then(response => response.json())
      .then(products => {
        productsTable.innerHTML = "";
        
        products.forEach(product => {
          const row = document.createElement("tr");
          
          row.innerHTML = `
            <td><img src="${product.imagen}" alt="${product.nombre}" width="50"></td>
            <td>${product.nombre}</td>
            <td>${product.categoria}</td>
            <td>${product.precio.toLocaleString('es-AR', {
              style: 'currency',
              currency: 'ARS',
              minimumFractionDigits: 2
            })}</td>
            <td>${Math.floor(Math.random() * 10)}</td>
            <td>
              <span class="action-icon">✏️</span>
              <span class="action-icon">🗑️</span>
            </td>
          `;
          
          productsTable.appendChild(row);
        });
      })
      .catch(error => {
        console.error("Error al cargar productos:", error);
        productsTable.innerHTML = "<tr><td colspan='6'>Error al cargar los productos</td></tr>";
      });
  }
});
