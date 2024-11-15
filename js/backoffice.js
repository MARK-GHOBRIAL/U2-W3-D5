const url = "https://striveschool-api.herokuapp.com/api/product/";
const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3M2JhYWFlZGU3ODAwMTU3OTM1NGYiLCJpYXQiOjE3MzE2NzMwMDIsImV4cCI6MTczMjg4MjYwMn0.MWVl3f2dEwUnPEanETMDQVA6HUvTxQSecwCwwIsYUfI";


window.onload = function () {
  loadProducts();
};

function loadProducts() {
  fetch(url, {
    headers: {
      "Authorization": "Bearer " + authorization,
    },
  })
  .then(response => response.json())
  .then(products => displayProducts(products))
  .catch(error => console.error('Error loading products:', error));
}

function displayProducts(products) {
  const cardsContainer = document.getElementById("product-cards");
  cardsContainer.innerHTML = "";
  products.forEach((product) => {
    cardsContainer.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100">
          <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><strong>Brand:</strong> ${product.brand}</p>
            <p class="card-text"><strong>Prezzo:</strong> € ${product.price.toFixed(2)}</p>
          </div>
          <div class="card-footer text-center">
            <button class="btn btn-warning btn-sm me-2" onclick="openEditModal('${product._id}')">Modifica</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Elimina</button>
          </div>
        </div>
      </div>
    `;
  });
}

function resetForm() {
  document.getElementById("product-form").reset();
  document.getElementById("product-id").value = "";
  document.getElementById("productModalLabel").innerText = "Aggiungi Prodotto";
}

document.getElementById("product-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const productId = document.getElementById("product-id").value;
  const product = {
    name: document.getElementById("name").value,
    brand: document.getElementById("brand").value,
    price: parseFloat(document.getElementById("price").value),
    imageUrl: document.getElementById("imageUrl").value,
    description: document.getElementById("description").value,
  };

  const method = productId ? "PUT" : "POST";
  const endpoint = productId ? `${url}${productId}` : url;

  fetch(endpoint, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + authorization,
    },
    body: JSON.stringify(product),
  })
  .then(() => {
    const modal = bootstrap.Modal.getInstance(document.getElementById("productModal"));
    modal.hide();
    loadProducts();
  })
  .catch(error => console.error('Error saving product:', error));
});


function openEditModal(productId) {
  fetch(`${url}${productId}`, {
    headers: {
      "Authorization": "Bearer " + authorization,
    },
  })
  .then(response => response.json())
  .then(product => {
    document.getElementById("name").value = product.name;
    document.getElementById("brand").value = product.brand;
    document.getElementById("price").value = product.price;
    document.getElementById("imageUrl").value = product.imageUrl;
    document.getElementById("description").value = product.description;
    document.getElementById("product-id").value = product._id;
    document.getElementById("productModalLabel").innerText = "Modifica Prodotto";

    const modal = new bootstrap.Modal(document.getElementById("productModal"));
    modal.show();
  })
  .catch(error => console.error('Error fetching product:', error));
}


function deleteProduct(productId) {
  if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
    fetch(`${url}${productId}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + authorization,
      },
    })
    .then(() => loadProducts())
    .catch(error => console.error('Error deleting product:', error));
  }
}
