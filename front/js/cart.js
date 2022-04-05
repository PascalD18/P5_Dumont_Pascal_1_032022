// Recuperation du panier avec localStorage
panierLinea = localStorage.getItem("panier");
panierJson=JSON.parse(panierLinea);
AffProduitsPanier(panierJson);

//////////////////////////////////////////////////////
////////////////////// FONCTIONS /////////////////////
//////////////////////////////////////////////////////
function AffProduitsPanier(panierJson){
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
    let parent=document.getElementById("cart__items");
    let enfant=document.createElement("article");
    enfant.classList="cart__item";
    parent.appendChild(enfant);
    // Création 

    
    

};