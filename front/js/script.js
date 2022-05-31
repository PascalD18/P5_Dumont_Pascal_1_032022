ShowLinkCartIfItis();
let dataProductsServer;
fetch("http://localhost:3000/api/products/")
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(function (response) {
    dataProductsServer = response;
    sortDataProducts();
    addElemHtmlFromDataproducts();
  })
  .catch(function (err) {

    // Affiche l'erreur de l'API
    alert(`l'erreur` + err + ` est survenue sur le serveur.
    Nous faisons notre possible pour remédier à ce probléme.
    N'hesitez pas à revenir plus tard sur le site, vous serez les bienvenus.
    Merci pour votre comprehension.`)
  });

/////////////////////////////////////////
////////////////////// FONCTIONS ////////////////////
/////////////////////////////////////////////////////

// Ajoute en dynamique les prodduits dans la page HTML
function addElemHtmlFromDataproducts() {

  // Mémorisation de tous les éléments de tous les produits concernant les items dans 'elemItems'
  elemItems = "";
  dataProductsServer.forEach(item => {
    elemItems += `
     <a href="../html/product.html?id=${item._id}">
     <article>
      <img src="${item.imageUrl}" alt="${item.altTxt}">
      <h3 class="productName">${item.name}</h3>
      <p class="productDescription">${item.description}</p>
     </article>
     </a>
     `
  });

  // Modification du Html avec l'élément 'elemItems'
  document.getElementById("items").innerHTML = elemItems;
};
