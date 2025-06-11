// en este archivo va la funcionalidad del carrito de compras

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
  localStorage.removeItem("cart");
  alert("¡Compra confirmada! Gracias por su pedido.");
  renderCheckout();
});

// Al cargar la página
document.addEventListener("DOMContentLoaded", renderCheckout);
