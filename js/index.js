//en este archivo van las funciones y eventos que interactuan con el index html
import { fetchProducts } from './data.js';


const cardsContainer = document.querySelector("#card_container");

let currentProduct = null; // para saber qué producto se está viendo

import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.1/+esm';

document.getElementById("btn-add-to-cart").addEventListener("click", () => {
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

    // Cierra el modal
    const modalElement = document.getElementById('productModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    // SweetAlert2: aviso
    Swal.fire({
      title: "¡Agregado!",
      text: `"${currentProduct.title}" fue agregado al carrito.`,
      icon: "success",
      timer: 1800,
      showConfirmButton: false
    });
  }
});

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

async function renderProducts() {
  const products = await fetchProducts();

  cardsContainer.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.style.width = "18rem";
    card.classList.add("card", "m-2", "card-hover", "position-relative");
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

renderProducts();