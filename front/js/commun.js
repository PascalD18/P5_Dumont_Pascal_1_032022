function classeBddProduits() {
  // Classement des proppriétés 'name' dans l'ordre alphabétique 
  // Met une majuscule à chaque début de nom de canapé
  // exemple : Kanap orthosie devient 'Kanap Orthosie'
  bddProduitsServer.forEach(item => {
    item.name = premLettreNomprodEnMaj(item.name);
  });
  //Trie dans l'ordre alphabétique les propriétés 'name'
  // dans l'objet Json 'datasProduitsAPI'
  bddProduitsServer.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
};
function premLettreNomprodEnMaj(nomProd) {
  // Mets la premiere lettre de la 2éme partie du nom de produit en majuscule
  // recherche la lettre 'premLettreMaj' à mettre en majuscule 
  // dans le nom 'Kanap [premLettreMaj]... '
  // exp: 'Kanap orthosie' devient 'Kanap Orthesie'
  posiSep = nomProd.indexOf(" ");// Repére la position de l'espace comme séparateur
  premLettreMaj = nomProd.substring(posiSep + 1, posiSep + 2);// Extrait la lettre à mettre en majuscule
  // La mets systématiquement en majuscule
  premLettreMaj = premLettreMaj.toUpperCase();
  // Reconstitue le nom complet
  debNom = nomProd.substring(posiSep + 1, 0);// Début de 'name' avec l'espace inclu
  finNom = nomProd.substring(nomProd.length, posiSep + 2);// Fin de 'name' sans la lettre en majuscule
  nomProd = debNom + premLettreMaj + finNom;// Concaténe début + lettreMajuscule + fin
  return nomProd;
};
function affLienPanier() {
  // Affichage du lien 'Panier' en fonction de son existance ou non dans localStorage
  // Récupére le lien panier
  elemPanier = document.getElementsByClassName("panier")
  if (localStorage.panier == undefined) {
    // si le panier est inexistant => N'affiche pas le lien du panier
    elemPanier[0].style.display = "none"
  }
  else {
    // Sinon laisse affiché le lien du panier
    elemPanier[0].style.display = "";
  };
};