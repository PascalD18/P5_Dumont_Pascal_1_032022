// Classement des proppriétés 'name' dans l'ordre alphabétique 
// Met une majuscule à chaque début de nom de canapé
// exemple : Kanap orthosie devient 'Kanap Orthosie'
function sortDataProducts() {
  dataProductsServer.forEach(item => {
    item.name = premLettrenameProductEnMaj(item.name);
  });

  //Trie dans l'ordre alphabétique les propriétés 'name' dans l'objet Json 'datasProduitsAPI'
  dataProductsServer.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
};

// Met 1ére lettre de la 2éme partie du nom de produit en majuscule
function premLettrenameProductEnMaj(nameProduct) {

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

// Affichage du lien 'Panier' en fonction de son existance ou non dans localStorage
function affLienPanier() {

  // Récupére le lien panier
  elemCart = document.getElementsByClassName("cart")

  // si le panier est inexistant => N'affiche pas le lien du panier
  if (localStorage.panier == undefined) {
    elemCart[0].style.display = "none";

    // Sinon laisse affiché le lien du panier
  } else {
    elemCart[0].style.display = "";
  };
};