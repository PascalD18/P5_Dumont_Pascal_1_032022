//localStorage.removeItem("panier");
//localStorage.removeItem("bddProduits");

fetch("http://localhost:3000/api/products/")

  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(tableauProduits => {
    classeBddProduits(tableauProduits);
    //ajoutListeProduitsHTML(tableauProduits);
    majElemHtmlDOMavecTableauProduits(tableauProduits);
    affLienPanier();

  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("Erreur N°" + err);
    alert("l'erreur" + err + " est survenue sur le serveur. Nous faisons notre possible pour remédier à ce probléme.N'hesitez pas à revenir plus tard sur le site, vous serez les bienvenus.")

  })
/////////////////////////////////////////
////////////////////// FONCTIONS ////////////////////
/////////////////////////////////////////////////////
//Modification des elements HTML avec la methode `..${[valeurs issues du 'panierJson']}..`
function majElemHtmlDOMavecTableauProduits(tableauProduits){

  tableauProduits.forEach(item => {
    document.getElementById("items").innerHTML+=`
     <a href="../html/product.html?id=${item._id}">
     <article>
      <img src="${item.imageUrl}" alt="${item.name}">
      <h3 class="productName">${item.name}</h3>
      <p class="productDescription">${item.description}</p>
     </article>
     </a>
     `
  });
};
// Insertion en dynamique de la liste de produits en HTML
function ajoutListeProduitsHTML(tableauProduits) {
  var etape = "Départ"
  tableauProduits.forEach(item => { 
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
    //Maj du lien pour ouvrir la page 'Product.html' avec le N° 'id' correspondands au produit selectionné
    newBaliseA.href = "../html/product.html?id=" + item._id;
    //Insertion nouvelle balise 'article' dans la balise 'a'
    var parentListe = newBaliseA;
    var newBaliseArticle = document.createElement("article");
    parentListe.appendChild(newBaliseArticle);
    //Remplace l'espace contenu dans le nom du produit par ' '
    // pour que la balise soit correctement dénifie avec ' alt = "[nom du produit]" >'
    nomProduit = item.name;
    newBaliseArticle.innerHTML = "<img src =" + item.imageUrl + ` alt = "` + nomProduit + `" >`;
    // insertion nouvelle balise 'h3' dans la balise 'article' (aprés la balise 'img')
    var newElemListe = document.createElement("h3");
    parentListe.appendChild(newElemListe);
    newElemListe.classList.add("productName")
    newElemListe.innerHTML = nomProduit
    // insertion nouvelle balise 'p' dans la balise 'article'
    var newElemListe = document.createElement("p");
    parentListe.appendChild(newElemListe);
    newElemListe.classList.add("productDescription")
    newElemListe.innerHTML = item.description
    var etape = "Suite"
  })
};
// Gestion affichage bouton panier en fonction état panier
function affLienPanier() {
  //Affiche ou non le lien 'Panier' en fonction de son existance ou non.
  // Initialise l'élément <a: 'panier'
  elemPanier = document.querySelectorAll(".limitedWidthBlock>nav>ul>a li")[1]
  if (localStorage.panier == undefined) {
    // si le panier est inexistant => N'affiche pas le lien du panier
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

