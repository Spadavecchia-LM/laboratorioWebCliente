//en este archivo van las funciones y eventos que interactuan con el index html
import { fetchProducts } from './data.js';


const cardsContainer = document.querySelector("#card_container");

//hecho por leo
const carrouselContainer = document.querySelector('#carousel-inner');


let currentProduct = null; // para saber qué producto se está viendo

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

//se modifico el estilo de la card para que quede bien en la pagina (leo)
async function renderProducts() {
  const products = await fetchProducts();

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

renderProducts();

//hecho por leo
async function renderCarrousel() {

  const productos = await fetchProducts();

  carrouselContainer.innerHTML = ''

  // agrupar de a 3 productos por slide
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
            <div class="card">
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
//hecho por leo
renderCarrousel();
