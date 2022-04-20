//localStorage.removeItem("panier");
//localStorage.removeItem("bddProduits");
// Storage.clear;
if (localStorage.test != undefined) {
  // Récupération si bdd déjà en cours
  testLinea = localStorage.getItem("test");
  //Conversion en format json 
  testJson = JSON.parse(testLinea);
}

fetch("http://localhost:3000/api/products/")

  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(tableauProduits => {
    sauveBddProduits(tableauProduits);

    //window.location.href = "../html/index2.html";

    ajoutListeProduitsHTML(tableauProduits);
    affElemPanier();

  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("Erreur N°" + err);
    alert("l'erreur" + err + " est survenue sur le serveur. Nous faisons notre possible pour remédier à ce probléme.N'hesitez pas à revenir plus tard sur le site, vous serez les bienvenus.")

  })
/////////////////////////////////////////
////////////////////// FONCTIONS ////////////////////
/////////////////////////////////////////////////////
// Insertion en dynamique de la liste de produits en HTML
function ajoutListeProduitsHTML(tableauProduits) {
  var etape = "Départ"
  tableauProduits.forEach(criteresProduit => {
    if (etape = "Départ") {
      // Balise parent de départ
      var parentListe = document.getElementById("items");
      // Définie une premiére balise 'a' enfant
      var newBaliseA = document.createElement("a");
    }
    else {
      // Reprends la derniére balise 'a' comme élément parent
      var parentListe = newBaliseA
      // Redefini une nouvelle balise 'a' enfant
      var newBaliseA = document.createElement("a");
    };
    //Ajout nouvelle balise 'a' dans le parent
    parentListe.appendChild(newBaliseA);
    newBaliseA.href = "../html/product.html?id=" + criteresProduit._id;
    //Insertion nouvelle balise 'article' dans la balise 'a'
    var parentListe = newBaliseA;
    var newBaliseArticle = document.createElement("article");
    parentListe.appendChild(newBaliseArticle);
    //Remplace l'espace contenu dans le nom du produit par ' '
    // pour que la balise soit correctement dénifie avec ' alt = "[nom du produit]" >'
    nomProduit = criteresProduit.name;
    newBaliseArticle.innerHTML = "<img src =" + criteresProduit.imageUrl + ` alt = "` + nomProduit + `" >`;
    // insertion nouvelle balise 'h3' dans la balise 'article' (aprés la balise 'img')
    var newElemListe = document.createElement("h3");
    parentListe.appendChild(newElemListe);
    newElemListe.classList.add("productName")
    newElemListe.innerHTML = nomProduit
    // insertion nouvelle balise 'p' dans la balise 'article'
    var newElemListe = document.createElement("p");
    parentListe.appendChild(newElemListe);
    newElemListe.classList.add("productDescription")
    newElemListe.innerHTML = criteresProduit.description
    var etape = "Suite"
  })
};
// Gestion affichage bouton panier en fonction état panier
function affElemPanier() {
  // Initialise l'élément <a: 'panier'
  elemPanier = document.querySelectorAll(".limitedWidthBlock>nav>ul>a li")[1]
  if (localStorage.panier == undefined) {
    // si le panier est in'existant => N'affiche pas le lien du panier
    elemPanier.style.display = "none";
  }
  else if (localStorage.panier.length == 2) {
    // Si le panier est existant mais vide => N'affiche pas le lien du panier
    elemPanier.style.display = "none";
  }
  else {
    // Sinon remet le lien du panier
    elemPanier.style.display = "";
  };
};
function sauveBddProduits(tableauProduits) {
  // Sauvegarde la base de donnés de tous les produits
  // Mettre une majuscule à chaque début de nom de canapé
  // exemple : Kanap orthosie devient 'Kanap Orthosie
  tableauProduits.forEach(nomProd => {
    premLettreNomprodEnMaj(nomProd.name);
    nomProd.name = nomProduit;

  });
  //Trie dans l'ordre alphabétique les propriétés 'name' dans l'objet Json 'tableauProduits'
  tableauProduits.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
  // Sauvegarde l'objet 'bddProduits' aprés triage de la propriété 'name' dans l'ordre alphabétique
  bddProduitsLinea = JSON.stringify(tableauProduits);
  localStorage.setItem("bddProduits", bddProduitsLinea);
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
