//localStorage.removeItem("panier");
//localStorage.removeItem("bddProduits");

fetch("http://localhost:3000/api/products/")

  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(tableauProduits => {
    sauveBddProduits(tableauProduits);
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
    //Insertion nouvelle balise 'img' dans la balise 'article'
    nomProduit = criteresProduit.name.replace(" ", '_');
    newBaliseArticle.innerHTML = "<img src =" + criteresProduit.imageUrl + " alt = " + nomProduit + ">";
    // insertion nouvelle balise 'h3' dans la balise 'article' (aprés la balise 'img')
    var parentListe = newBaliseArticle;
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
  bddProduitsLinea = JSON.stringify(tableauProduits);
  localStorage.setItem("bddProduits", bddProduitsLinea);
}
