// admin.js - Lógica del panel de administración
document.addEventListener("DOMContentLoaded", function() {
  // Login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Validación básica (en producción usar autenticación segura)
      if (email === 'admin@essenza.com' && password === 'AdminEssenza2025') {
        localStorage.setItem('admin-authenticated', 'true');
        window.location.href = 'productos.html';
      } else {
        alert('Credenciales incorrectas. Por favor, intente nuevamente.');
      }
    });
  }
  
  // Verificar autenticación en páginas protegidas
  const isAdminPage = window.location.pathname.includes('/admin/') && 
                     !window.location.pathname.includes('login.html');
  
  if (isAdminPage && localStorage.getItem('admin-authenticated') !== 'true') {
    window.location.href = 'login.html';
  }
  
  // Logout
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      localStorage.removeItem('admin-authenticated');
      window.location.href = 'login.html';
    });
  }
  
  // Cargar productos en el admin (si estamos en la página de productos)
  const adminProductsContainer = document.getElementById('admin-products');
  if (adminProductsContainer) {
    fetch('../productos.json')
      .then(response => response.json())
      .then(products => {
        adminProductsContainer.innerHTML = '';
        
        products.forEach(product => {
          const row = document.createElement('tr');
          
          row.innerHTML = `
            <td><img src="../${product.imagen}" alt="${product.nombre}" width="50"></td>
            <td>${product.nombre}</td>
            <td>${product.categoria}</td>
            <td>${product.precio.toLocaleString('es-AR', {
              style: 'currency',
              currency: 'ARS'
            })}</td>
            <td>${Math.floor(Math.random() * 20)}</td>
            <td class="actions">
              <button class="edit-btn" data-id="${product.codigo}">✏️</button>
              <button class="delete-btn" data-id="${product.codigo}">🗑️</button>
            </td>
          `;
          
          adminProductsContainer.appendChild(row);
        });
      })
      .catch(error => {
        console.error('Error al cargar productos:', error);
        adminProductsContainer.innerHTML = '<tr><td colspan="6">Error al cargar los productos</td></tr>';
      });
  }
});
