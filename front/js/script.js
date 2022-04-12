fetch("http://localhost:3000/api/products/") 

  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then (tableauProduits => {
    console.log(tableauProduits);
    sauveBddProduits(tableauProduits);
    return ajoutListeProduitsHTML(tableauProduits);
  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("Erreur N°" + err);
  })

/////////////////////////////////////////
////////////////////// FONCTIONS ////////////////////
/////////////////////////////////////////////////////
// Insertion en dynamique de la liste de produits en HTML
function ajoutListeProduitsHTML(tableauProduits) {
  console.log(tableauProduits)
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
function sauveBddProduits(tableauProduits){
// Sauvegarde la base de donnés de tous les produits
   bddProduitsLinea = JSON.stringify(tableauProduits);
   localStorage.setItem("bddProduits", bddProduitsLinea); 
}

