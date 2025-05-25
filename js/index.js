// Funciones y eventos que interactúan con la UI
import { fetchProducts } from './data.js';
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.1/+esm';

let currentProduct = null;

// Detecta contenedores según la página
const cardsContainer = document.querySelector("#card_container") || document.querySelector("#productContainer");
const carrouselContainer = document.querySelector('#carousel-inner');

// Renderiza productos en cards (para products.html o index si aplica)
async function renderProducts() {
  const products = await fetchProducts();
  if (!cardsContainer) return;

  cardsContainer.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = `
      card custom-card
      p-2 col-6 col-md-3 col-lg-2
      d-flex flex-column align-items-center card-hover
    `;
    card.setAttribute("data-id", product.id);

    card.innerHTML = `
      <img src="${product.image}" class="card-img-top" alt="${product.title}">
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text text-primary fw-bold">$${product.price}</p>
      </div>
      <div class="card-overlay-bottom">
        <span>Más información</span>
      </div>
    `;

    cardsContainer.appendChild(card);
  });
}

// Renderiza el carrusel (para index.html)
async function renderCarrousel() {
  const productos = await fetchProducts();
  if (!carrouselContainer) return;

  carrouselContainer.innerHTML = '';

  for (let i = 0; i < productos.length; i += 3) {
    const grupo = productos.slice(i, i + 3);

    const slide = document.createElement('div');
    slide.className = 'carousel-item' + (i === 0 ? ' active' : '');

    const row = document.createElement('div');
    row.className = 'row justify-content-center';

    grupo.forEach(producto => {
      const col = document.createElement('div');
      col.className = 'col-md-4 d-flex justify-content-center';

      col.innerHTML = `
        <div class="card" data-id="${producto.id}">
          <img src="${producto.image}" class="card-img-top product-img" alt="${producto.title}">
          <div class="card-body">
            <h5 class="card-title">${producto.title}</h5>
            <p class="card-text">$${producto.price}</p>
          </div>
        </div>
      `;

      row.appendChild(col);
    });

    slide.appendChild(row);
    carrouselContainer.appendChild(slide);
  }
}

// Abre modal al hacer clic en una card con data-id
document.addEventListener("click", (e) => {
  const card = e.target.closest(".card[data-id]");
  if (card) {
    const productId = card.getAttribute("data-id");

    fetchProducts().then(products => {
      const product = products.find(p => p.id == productId);
      if (product) {
        currentProduct = product;
        document.getElementById("productModalLabel").innerText = product.title;
        document.getElementById("modal-image").src = product.image;
        document.getElementById("modal-description").innerText = product.description;
        document.getElementById("modal-price").innerText = `$${product.price}`;

        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
      }
    });
  }
});

// Agrega producto al carrito y actualiza contador
document.getElementById("btn-add-to-cart")?.addEventListener("click", () => {
  if (currentProduct) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.id === currentProduct.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: currentProduct.id,
        title: currentProduct.title,
        price: currentProduct.price,
        image: currentProduct.image,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    // Cierra el modal
    const modalElement = document.getElementById('productModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    // SweetAlert2
    Swal.fire({
      title: "¡Agregado!",
      text: `"${currentProduct.title}" fue agregado al carrito.`,
      icon: "success",
      timer: 1800,
      showConfirmButton: false
    });
  }
});

// Actualiza el número del carrito en la navbar
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = totalItems;
}

// Ejecutar todo cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCarrousel();
  updateCartCount();
});
