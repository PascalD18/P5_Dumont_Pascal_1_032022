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
     AffItemProduit(i);

    i=panierJson.length

    // i++
  };
};
function AffItemProduit() {
  // Affiche les elements en fonction du panier  
  // Si non déjà existant, ajoute l'élement id = 'codeArt'
  // Vérifie si element 'article' avec id= 'codeArt'
  parentTestId = document.getElementById(id);
  if (parentTestId == null) {
    // si l'élément 'article' id= 'codeArt' n'existe pas encore
    // l'insert dans l'élément id='cart__item'
    parent = document.getElementById("cart__items");
    enfant = document.createElement("article");
    enfant.id = id;
    enfant.classList = `cart__item" data-color="` + couleur;
    parent.appendChild(enfant);
    parent=document.querySelector("#cart__items article");
    insereElemsProduitDsElemArticle();
  }
  else {
   // Vérifie si l'element 'article' id=[N° id] existe avec classe 'data-color' = 'couleur'
   // parent=document.querySelector("#cart__items article>div>img");
    
   // console.log(parent.innerHTML);
  };

};
function insereElemsProduitDsElemArticle(){
  // insert les elements du produit dans l'élement 'article' correspondant à l'id et la couleur du roduit
  enfant = document.createElement("div");
  enfant.classList = "cart__item__img";
  rechImageNomPrixProduit();// recupére l'addresse Url de l'image, le Nom du produit, et le prix.
  //insert l'élément' image
  enfant.innerHTML = "<img src =" + imageUrlProduit +  ` alt =` + nomProduit + ">";
  parent.appendChild(enfant);
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
  // recherche l'image correspondant au produit dans la base Json 'tableauProduits'
  function rechImageNomPrixProduit(){
  var i = 0; continuer = true; imageUrlProduit = ""
  while (i < dataProduits.length && imageUrlProduit == "") {
    if (id == dataProduits[i]._id) {
      imageUrlProduit = dataProduits[i].imageUrl;
      nomProduit = dataProduits[i].name;
      espcInsecable = /\s/;
      nomProduit = nomProduit.replace(" ", espcInsecable);
      prixProduit= dataProduits[i].price+",00€";
    }
    i++
  }

};