// Recuperation du panier avec localStorage
panierLinea = localStorage.getItem("panier");
panierJson=JSON.parse(panierLinea);
AffProduitsPanier();

//////////////////////////////////////////////////////
////////////////////// FONCTIONS /////////////////////
//////////////////////////////////////////////////////
function AffProduitsPanier(){
 // Affichage de tous les produits du panier
  var i = 0;
  while (i < panierJson.length){
    id=panierJson[i].codeArt
    couleur=panierJson.couleur
    qtProduit=panierJson.qt
    AffItemProduit(i);

    i++
  };
};
function AffItemProduit(itemProduit){
    // Affiche les elements en fonction du panier
    // Création 'article' dans 'section #cart__items"
    parent=document.getElementById("cart__items");
    enfant=document.createElement("article");
    enfant.classList="cart__item";
    enfant.classList=`data-id=`+id;
    //enfant.classList=`data-color=`+couleur;

    parent.appendChild(enfant);
    // Création balise 'div' du container de l'image dans 'article'
    parent=document.querySelector("#cart__items>.cart__item");
    enfant=document.createElement("div");
    parent.appendChild(enfant);


    
    

};