fetch("http://localhost:3000/api/products/")

  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(tableauProduits => {
    // Recuperation du panier avec localStorage
    panierLinea = localStorage.getItem("panier");
    panierJson = JSON.parse(panierLinea);
    dataProduits = tableauProduits;
    AffProduitsPanier();

  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("Erreur N°" + err);
  })
  //////////////////////////////////////////////////////
////////////////////// FONCTIONS /////////////////////
//////////////////////////////////////////////////////
function AffProduitsPanier() {
  // Affichage de tous les produits du panier
  var i = 0;
  while (i < panierJson.length) {
    id = panierJson[i].codeArt;
    couleur = panierJson[i].couleur;
    qtProduit = panierJson[i].qt;
     affItemArticleProduit(i);

    //i=panierJson.length

    i++
  };
};
function affItemArticleProduit() {
  // Affiche les elements concernant seulement les articles du D.O.M en fonction du panier  
  // l'insertion dans l'élément id='cart__item'
    parent = document.getElementById("cart__items");
    enfant = document.createElement("article");
    enfant.id = id;
    enfant.classList = `cart__item" data-color="` + couleur;
    parent.appendChild(enfant);
  }