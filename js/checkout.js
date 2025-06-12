// en este archivo va la funcionalidad del carrito de compras
import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.1/+esm';

function renderCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const list = document.getElementById("cart-detail");
  const total = document.getElementById("cart-total");

  if (!list || !total) return;

  list.innerHTML = "";
  let finalTotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    finalTotal += itemTotal;

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    li.innerHTML = `
      <div class="d-flex align-items-center gap-3 flex-grow-1">
        <img src="${item.image}" alt="${item.title}" width="40" height="40" style="object-fit: contain;">
        <div>
          <strong>${item.title}</strong><br>
          <small>$${item.price} x ${item.quantity} = $${itemTotal.toFixed(2)}</small>
        </div>
      </div>
      <div class="d-flex align-items-center gap-2">
        <button class="btn btn-sm btn-outline-secondary" data-action="decrease" data-id="${item.id}" ${item.quantity === 1 ? "disabled" : ""}>-</button>
        <span>${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary" data-action="increase" data-id="${item.id}">+</button>
        <button class="btn btn-sm btn-outline-danger" data-action="remove" data-id="${item.id}">🗑️</button>
      </div>
    `;

    list.appendChild(li);
  });

  total.textContent = finalTotal.toFixed(2);
}

// Acciones: +, –, eliminar
document.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = parseInt(btn.dataset.id);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(p => p.id === id);
  if (!item) return;

  if (action === "increase") item.quantity += 1;
  if (action === "decrease" && item.quantity > 1) item.quantity -= 1;
  if (action === "remove") cart = cart.filter(p => p.id !== id);

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCheckout();
});

// Confirmar formulario de compra
document.getElementById("checkout-form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    Swal.fire("Tu carrito está vacío", "Agregá productos antes de confirmar la compra.", "warning");
    return;
  }

  const nombre = document.getElementById("nombre").value;
  const dni = document.getElementById("dni").value;
  const email = document.getElementById("email").value;
  const direccion = document.getElementById("direccion").value;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const resumenProductos = cart.map(p => `• ${p.title} x${p.quantity} - $${(p.price * p.quantity).toFixed(2)}`).join('<br>');

  Swal.fire({
    title: "¡Compra confirmada!",
    html: `
      <strong>Nombre:</strong> ${nombre}<br>
      <strong>DNI:</strong> ${dni}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Dirección:</strong> ${direccion}<br><br>
      <strong>Productos:</strong><br>${resumenProductos}<br><br>
      <strong>Total:</strong> $${total.toFixed(2)}
    `,
    icon: "success",
    confirmButtonText: "Cerrar"
  }).then(() => {
  localStorage.removeItem("cart");
  renderCheckout();
  document.getElementById("checkout-form").reset();
  window.location.href = "../index.html";
});

    localStorage.removeItem("cart");
    renderCheckout();
    document.getElementById("checkout-form").reset();

});

// Al cargar la página
document.addEventListener("DOMContentLoaded", renderCheckout);
