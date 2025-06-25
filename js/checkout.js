import Swal from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.10.1/+esm';

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalQuantity;
    cartCountElement.style.display = totalQuantity > 0 ? "inline-block" : "none";
  }
}

function renderCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const list = document.getElementById("cart-detail");
  const total = document.getElementById("cart-total");

  if (!list || !total) return;

  list.innerHTML = "";
  let finalTotal = 0;

  if (cart.length === 0) {
    list.innerHTML = "<li class='text-muted'>Tu carrito está vacío.</li>";
    total.textContent = "0.00";
    updateCartCount();
    return;
  }

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
        <span>${item.quantity}</span>
      </div>
    `;

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-sm btn-outline-danger";
    removeBtn.innerText = "🗑️";
    removeBtn.onclick = () => {
      const updatedCart = cart.filter(p => p.id !== item.id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      renderCheckout();
    };

    li.querySelector("div.d-flex.align-items-center.gap-2").appendChild(removeBtn);
    list.appendChild(li);
  });

  total.textContent = finalTotal.toFixed(2);
  updateCartCount();
}

//  MOSTRAR ALERTA CON RESUMEN EN EL SUBMIT
document.addEventListener("DOMContentLoaded", () => {
  renderCheckout();

  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart.length === 0) {
        Swal.fire("Tu carrito está vacío", "Agregá productos antes de confirmar la compra.", "warning");
        return;
      }

      const nombre = document.getElementById("nombre")?.value || "";
      const dni = document.getElementById("dni")?.value || "";
      const email = document.getElementById("email")?.value || "";
      const direccion = document.getElementById("direccion")?.value || "";

      const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const resumenProductos = cart.map(p => `➤ ${p.title} x${p.quantity} - $${(p.price * p.quantity).toFixed(2)}`).join('<br>');

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
        form.reset();
        renderCheckout();
        window.location.href = "../index.html";
      });
    });
  }
});