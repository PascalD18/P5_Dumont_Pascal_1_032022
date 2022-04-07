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
    dataURLProduits = tableauProduits; 

   // supprItemsNullDsPanier();

    MajElemsDOMavecPanier();
    suppressionProduit();


  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("Erreur N°" + err);
  })
//////////////////////////////////////////////////////
////////////////////// FONCTIONS /////////////////////
//////////////////////////////////////////////////////
function MajElemsDOMavecPanier() {
  // Affichage de tous les produits du panier
  var i = 0;
  while (i < panierJson.length) {
    if (panierJson[i] != null){
    MajElemsDOMparProduit(i);
  };
    i++
  };
};
// recherche l'image correspondant au produit dans la base Json 'dataURLProduis' depuis le serveur
function rechImageNomPrixProduit() {
  var i = 0; continuer = true; imageUrlProduit = ""
  while (i < dataURLProduits.length && imageUrlProduit == "") {
    if (id == dataURLProduits[i]._id) {
      imageUrlProduit = dataURLProduits[i].imageUrl;
      nomProduit = dataURLProduits[i].name;
      nomProduit = nomProduit.replace(" ", "_");
      prixProduit = dataURLProduits[i].price + ",00€";
    }
    i++
  }
};
// MAJ des elements du D.O.M avec un produit
function MajElemsDOMparProduit(item) {
  // Récupére les données à partir du 'panierJson' issu du localStorage
  id = panierJson[item].codeArt;
  couleur = panierJson[item].couleur;
  qtProduit = panierJson[item].qt;
  // recupére l'addresse Url de l'image, le Nom du produit, et le prix.
  rechImageNomPrixProduit();
  // l'insertion dans l'élément id='cart__item'
  parent = document.getElementById("cart__items");
  enfant = document.createElement("article");
  enfant.id = "•" + id + "•";
  enfant.classList = `cart__item" data-color="` + couleur;
  parent.appendChild(enfant);
  parent_1 = enfant;
  enfant = document.createElement("div");
  enfant.classList = "cart__item__img";
  //insert l'élément' image
  enfant.innerHTML = "<img src =" + imageUrlProduit + ` alt =` + nomProduit + ">";
  parent_1.appendChild(enfant);
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content";
  parent_1.appendChild(enfant);

  //parent_1_1=document.querySelector("#cart__items article>div.cart__item__content");
  parent_1_1 = enfant;
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__description";
  parent_1_1.appendChild(enfant);

  // parent_1_1_1=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__description");
  parent_1_1_1 = enfant;
  enfant = enfant = document.createElement("h2");
  enfant.innerHTML = nomProduit;
  parent_1_1_1.appendChild(enfant);
  enfant = document.createElement("p");
  enfant.innerHTML = couleur;
  parent_1_1_1.appendChild(enfant);
  enfant = document.createElement("p");
  enfant.innerHTML = prixProduit;
  parent_1_1_1.appendChild(enfant);

  // parent_1_1=document.querySelector("#cart__items article>div.cart__item__content");
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__settings";
  parent_1_1.appendChild(enfant);

  //parent_1_1_2=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings");
  parent_1_1_2 = enfant;
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__settings__quantity";
  parent_1_1_2.appendChild(enfant);

  //parent_1_1_2_1=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings>div.cart__item__content__settings__quantity");
  parent_1_1_2_1 = enfant;
  parent_1_1_2_1.innerHTML = "<p>Qté : " + qtProduit + "</p>";
  parent_1_1_2_1.innerHTML = parent_1_1_2_1.innerHTML + `<input type="number" classe="itemQuantity" name="itemQuantity" min="1" max="100"value=` + qtProduit + ">";
  //parent_1_1_2=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings");
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__settings__delete";
  parent_1_1_2.appendChild(enfant);

  //parent_1_1_2_2=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings>div.cart__item__content__settings__delete");
  parent_1_1_2_2 = enfant;
  enfant = document.createElement("p");
  enfant.classList = "deleteItem";
  enfant.innerHTML = "Supprimer";
  parent_1_1_2_2.appendChild(enfant);
};
function suppressionProduit() {
  // Modification du panier en fonction de l'element 'Supprimer' cliqué dans le D.O.M
  document.querySelectorAll('.deleteItem').forEach(item => {
    item.addEventListener("click", event => {
      event.preventDefault();
      // Recherche de l'id 'idDOM' et de la couleur 'couleurODM' correspondants dans le D.O.M

      parentId = event.target.closest("article");
      idDOM = RechChaineCars(parentId.outerHTML, `id="•`, `•" `);
      parentCouleur = event.target.closest("section >article > div");
      couleurDOM = RechChaineCars(parentCouleur.outerHTML, "/h2><p>", "</p><p>");
      parentId.remove();
      // Suppresion du produit dans 'panierJson'
      var i = 0; continuer = true;
      while (i < panierJson.length && continuer == true) {
        if (panierJson[i].codeArt == idDOM && panierJson[i].couleur == couleurDOM) {
          delete panierJson[i];
          supprItemsNullDsPanier();
          continuer=false;
        };
        i++
      };
    });
  })
};

function RechChaineCars(contenuChaine, chaineAv, chaineAp) {
  debut = contenuChaine.indexOf(chaineAv) + chaineAv.length - 1;
  suiteContenuChaine = contenuChaine.slice(-(contenuChaine.length - debut));
  fin = suiteContenuChaine.indexOf(chaineAp);
  return suiteContenuChaine.slice(1, fin);
}
// Sauvedarde en local du panier
function sauvegardePanier() {
  panierLinea = JSON.stringify(panierJson);
  localStorage.setItem("panier", panierLinea);
};
function supprItemsNullDsPanier() {
  // Supprime definitivement les items effacés ( = 'null' ) dans le panier 'panierJson'
  panierLinea = JSON.stringify(panierJson);
  var i=0;
  while ( panierLinea.indexOf(`,null`) >0 || panierLinea.indexOf(`null,`) >0 || panierLinea.indexOf(`null`) >0){
    panierLinea=panierLinea.replace(`,null`,"");
    panierLinea=panierLinea.replace(`null,`,""); 
    panierLinea=panierLinea.replace(`null`,"");
    i++
  };
  panierJson = JSON.parse(panierLinea);
  sauvegardePanier();  
};