const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const url = "https://striveschool-api.herokuapp.com/api/product/";
const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3M2JhYWFlZGU3ODAwMTU3OTM1NGYiLCJpYXQiOjE3MzE2NzMwMDIsImV4cCI6MTczMjg4MjYwMn0.MWVl3f2dEwUnPEanETMDQVA6HUvTxQSecwCwwIsYUfI";

// Caricamento prodotto al caricamento della pagina
window.onload = function () {
    const container = document.getElementById("product-container");

    fetch(url + id, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + authorization,
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Errore nel recupero dei dettagli");
            }
        })
        .then((product) => {
            let productDetails = "";
            productDetails = `
<div class="container my-5">
  <div class="row align-items-center">
    <div class="col-md-6 text-center">
      <img src="${product.imageUrl}" class="img-fluid rounded shadow-lg" alt="${product.name}">
    </div>
    <div class="col-md-6">
      <h1 class="display-4">${product.name}</h1>
      <p class="text-muted mb-3">${product.description}</p>
      <p><strong>Brand:</strong> ${product.brand}</p>
      <h3 class="text"><strong>Prezzo:</strong> € ${product.price.toFixed(2)}</h3>
      <div class="mt-4">
        <button class="btn btn-warning btn-sm me-2" onclick="openEditModal('${product._id}')">Modifica</button>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}')">Elimina</button>
      </div>
    </div>
  </div>
</div>`;
            container.innerHTML = productDetails;
        })
        .catch((error) => console.error("Errore:", error));
};

// Funzione per aprire il modal in modalità modifica
function openEditModal(productId) {
    fetch(`${url}${productId}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + authorization,
        },
    })
        .then((response) => response.json())
        .then((product) => {
            document.getElementById("name").value = product.name;
            document.getElementById("brand").value = product.brand;
            document.getElementById("price").value = product.price;
            document.getElementById("imageUrl").value = product.imageUrl;
            document.getElementById("description").value = product.description;
            document.getElementById("product-id").value = product._id;

            const modal = new bootstrap.Modal(document.getElementById("productModal"));
            modal.show();
        })
        .catch((error) => console.error("Errore nel caricamento del prodotto:", error));
}

// Funzione per salvare il prodotto (modificato)
function saveProduct() {
    const productId = document.getElementById("product-id").value;
    const updatedProduct = {
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
        body: JSON.stringify(updatedProduct),
    })
        .then(() => {
            const modal = bootstrap.Modal.getInstance(document.getElementById("productModal"));
            modal.hide();
            window.location.reload();
        })
        .catch((error) => console.error("Errore nel salvataggio del prodotto:", error));
}

// Funzione per eliminare il prodotto
function deleteProduct(productId) {
    if (confirm("Sei sicuro di voler eliminare questo prodotto?")) {
        fetch(`${url}${productId}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + authorization,
            },
        })
            .then(() => window.location.href = "/home.html")
            .catch(error => console.error('Error deleting product:', error));
    }
}
