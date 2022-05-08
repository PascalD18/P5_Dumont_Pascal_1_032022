function classeBddProduits(tableauProduits) {
    // Sauvegarde la base de donnés de tous les produits
    // avec classement des proppriétés 'name' dans l'ordre alphabétique 
    // 1) Met une majuscule à chaque début de nom de canapé
    // exemple : Kanap orthosie devient 'Kanap Orthosie'
    tableauProduits.forEach(item => {
      premLettreNomprodEnMaj(item.name); 
      item.name = nomProduit;
  
    });
    //2) Trie dans l'ordre alphabétique les propriétés 'name'
    //   dans l'objet Json 'tableauProduits'
    tableauProduits.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      } else {
        return 1;
      }
    });
   // // 3) Sauvegarde l'objet 'bddProduits'
   // bddProduitsLinea = JSON.stringify(tableauProduits);
   // localStorage.setItem("bddProduits", bddProduitsLinea);
  }
  // Mets la premiere lettre de la 2éme partie du nom de produit en majuscule
  function premLettreNomprodEnMaj(nomProd) {
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
    nomProduit = debNom + premLettreMaj + finNom;// Concaténe début + lettreMajuscule + fin
  };