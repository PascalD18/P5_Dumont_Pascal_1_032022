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
    majDOMdsArticlesProduits();

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
  }
  function majDOMdsArticlesProduits(){
    // Memorise tous les elements parents concernant les arcticles du DOM
    // correspondat à chaque produits du panier
     parentsArticlesProduits=document.querySelectorAll("#cart__items>article")
     var i=0;
     while (i< panierJson.length){
      id=panierJson[i].codeArt;couleur=panierJson[i].couleur;
      parentArticle=parentsArticlesProduits[i];
        insereElemsProduitDsElemArticle(parentArticle);
      } 
     i++
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
    function insereElemsProduitDsElemArticle(parentArticle){
      // insert les elements du produit dans l'élement 'article' correspondant à l'id et la couleur du roduit
      enfant = document.createElement("div");
      enfant.classList = "cart__item__img";
      rechImageNomPrixProduit();// recupére l'addresse Url de l'image, le Nom du produit, et le prix.
      //insert l'élément' image
      enfant.innerHTML = "<img src =" + imageUrlProduit +  ` alt =` + nomProduit + ">";
      parentArticle.appendChild(enfant);
      enfant=document.createElement("div");
      enfant.classList="cart__item__content";
      parent.appendChild(enfant); 
      parent=document.querySelector("#cart__items article>div.cart__item__content");
      enfant=document.createElement("div");
      enfant.classList="cart__item__content__description";
      parent.appendChild(enfant);
      parent=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__description");
      enfant=document.createElement("h2");
      enfant.innerHTML=nomProduit;
      parent.appendChild(enfant);
      enfant=document.createElement("p");
      enfant.innerHTML=couleur;
      parent.appendChild(enfant);
      enfant=document.createElement("p");
      enfant.innerHTML=prixProduit;
      parent.appendChild(enfant);
      parent=document.querySelector("#cart__items article>div.cart__item__content");
      enfant=document.createElement("div");
      enfant.classList="cart__item__content__settings";
      parent.appendChild(enfant);
      parent=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings");
      enfant=document.createElement("div");
      enfant.classList="cart__item__content__settings__quantity";
      parent.appendChild(enfant);
      parent=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings>div.cart__item__content__settings__quantity");
      parent.innerHTML="<p>Qté : "+qtProduit+"</p>";
      parent.innerHTML=parent.innerHTML+`<input type="number" classe="itemQuantity" name="itemQuantity" min="1" max="100"value=`+qtProduit+">";
      parent=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings");
      enfant=document.createElement("div");
      enfant.classList="cart__item__content__settings__delete";
      parent.appendChild(enfant);
      parent=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings>div.cart__item__content__settings__delete");
      enfant=document.createElement("p");
      enfant.classList="deleteItem";
      enfant.innerHTML="Supprimer";
      parent.appendChild(enfant);
    
    
    
    
    };