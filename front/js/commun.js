// Classement des proppriétés 'name' dans l'ordre alphabétique 
function sortDataProducts() {
  dataProductsServer.forEach(item => {
    item.name = firstLetterNameProduct(item.name);
  });

  //Trie dans l'ordre alphabétique les propriétés 'name' dans l'objet Json 'datasProduitsAPI'
  dataProductsServer.sort(function (a, b) {
    if (a.name >= b.name) {
      return 1;
    } else {
      return -1;
    }
  });
};

// Met 1ére lettre de la 2éme partie du nom de produit en majuscule
function firstLetterNameProduct(nameProduct) {

  // recherche la 1ére lettre 'firstLetterLowercase' à mettre en majuscule dans le nom 'Kanap [firstLetterLowercase]...'
  // exp: 'Kanap orthosie' devient 'Kanap Orthesie'
  // Repére la position de l'espace comme séparateur
  posiSep = nameProduct.indexOf(" ");

  // Extrait la lettre à mettre en majuscule
  firstLetterLowercase = nameProduct.substring(posiSep + 1, posiSep + 2);

  // La mets systématiquement en majuscule
  firstLetterLowercase = firstLetterLowercase.toUpperCase();

  // Reconstitue le nom complet
  // Début de 'name' avec l'espace inclu
  beginName = nameProduct.substring(posiSep + 1, 0);

  // Fin de 'name' sans la lettre en majuscule
  endName = nameProduct.substring(nameProduct.length, posiSep + 2);

  // Concaténe début + lettreMajuscule + fin
  nameProduct = beginName + firstLetterLowercase + endName;
  return nameProduct;
};

 //Affiche ou non le lien du panier en fonction de son existance ou non dans localStorage
function ShowLinkCartIfItis() {

  // Récupére le lien panier
  elemCart = document.getElementsByClassName("panier");

  // si le panier est inexistant => N'affiche pas le lien du panier
  if (localStorage.cart != undefined) {
    elemCart[0].style.display = "";
  } else {

  // Sinon laisse affiché le lien du panier
    elemCart[0].style.display = "none";
  };
};