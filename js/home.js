const url = "https://striveschool-api.herokuapp.com/api/product/";
const authorization = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzM3M2JhYWFlZGU3ODAwMTU3OTM1NGYiLCJpYXQiOjE3MzE2NzMwMDIsImV4cCI6MTczMjg4MjYwMn0.MWVl3f2dEwUnPEanETMDQVA6HUvTxQSecwCwwIsYUfI";

window.onload = function () {
    const productCards = document.getElementById("product-cards");

    fetch(url, {
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
        .then((products) => {
            let cards = "";
            products.forEach((product) => {
                cards += `<div class="col-md-4 mb-4">
  <div class="card" style="width: 100%;">
    <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
    <div class="card-body">
      <h5 class="card-title">${product.name}</h5>
      <p class="card-text">${product.description}</p>
      <p class="card-text"><strong>Brand:</strong> ${product.brand}</p>
      <h5 class="card-text"><strong>Prezzo:</strong> € ${product.price.toFixed(2)}</h5>
      <a href="product-details.html?id=${product._id}" class="btn btn-primary">Scopri di più</a>
    </div>
  </div>
</div>`;
            });
            productCards.innerHTML = cards;
        })
        .catch((error) => console.error("Errore:", error));
};
