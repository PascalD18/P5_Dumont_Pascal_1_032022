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
  //while (i < 2) {
    id = panierJson[i].codeArt;
    couleur = panierJson[i].couleur;
    qtProduit = panierJson[i].qt;
     affItemArticleProduit();
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
    parent_1=enfant;
    insereElemsProduitDsElemArticle();
  
  };
    // recherche l'image correspondant au produit dans la base Json 'tableauProduits'
    function rechImageNomPrixProduit(){
      var i = 0; continuer = true; imageUrlProduit = ""
      while (i < dataProduits.length && imageUrlProduit == "") {
        if (id == dataProduits[i]._id ){
          imageUrlProduit = dataProduits[i].imageUrl;
          nomProduit = dataProduits[i].name;
          nomProduit = nomProduit.replace(" ", "_");
          prixProduit= dataProduits[i].price+",00€";
        }
        i++
      }
    
    };
    function insereElemsProduitDsElemArticle(){
      // insert les elements du produit dans l'élement 'article' correspondant à l'id et la couleur du roduit
      enfant = document.createElement("div");
      enfant.classList = "cart__item__img";
      rechImageNomPrixProduit();// recupére l'addresse Url de l'image, le Nom du produit, et le prix.
      //insert l'élément' image
      enfant.innerHTML = "<img src =" + imageUrlProduit +  ` alt =` + nomProduit + ">";
      parent_1.appendChild(enfant);
      enfant=document.createElement("div");
      enfant.classList="cart__item__content";
      parent_1.appendChild(enfant);
      
      //parent_1_1=document.querySelector("#cart__items article>div.cart__item__content");
      parent_1_1=enfant;
      enfant=document.createElement("div");
      enfant.classList="cart__item__content__description";
      parent_1_1.appendChild(enfant);

      // parent_1_1_1=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__description");
      parent_1_1_1=enfant;
      enfant=enfant=document.createElement("h2");
      enfant.innerHTML=nomProduit;
      parent_1_1_1.appendChild(enfant);
      enfant=document.createElement("p");
      enfant.innerHTML=couleur;
      parent_1_1_1.appendChild(enfant);
      enfant=document.createElement("p");
      enfant.innerHTML=prixProduit;
      parent_1_1_1.appendChild(enfant);
      
     // parent_1_1=document.querySelector("#cart__items article>div.cart__item__content");
      enfant=document.createElement("div");
      enfant.classList="cart__item__content__settings";
      parent_1_1.appendChild(enfant);

      
      //parent_1_1_2=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings");
      parent_1_1_2=enfant;
      enfant=document.createElement("div");
      enfant.classList="cart__item__content__settings__quantity";
      parent_1_1_2.appendChild(enfant);

      
      //parent_1_1_2_1=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings>div.cart__item__content__settings__quantity");
      parent_1_1_2_1=enfant;
      parent_1_1_2.innerHTML="<p>Qté : "+qtProduit+"</p>";
      parent_1_1_2.innerHTML=parent_1_1_2.innerHTML+`<input type="number" classe="itemQuantity" name="itemQuantity" min="1" max="100"value=`+qtProduit+">";
      //parent_1_1_2=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings");
      enfant=document.createElement("div");
      enfant.classList="cart__item__content__settings__delete";
      parent_1_1_2.appendChild(enfant);
      
      //parent_1_1_2_2=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings>div.cart__item__content__settings__delete");
      parent_1_1_2_2=enfant;
      enfant=document.createElement("p");
      enfant.classList="deleteItem";
      enfant.innerHTML="Supprimer";
      parent_1_1_2_2.appendChild(enfant);
    
    };