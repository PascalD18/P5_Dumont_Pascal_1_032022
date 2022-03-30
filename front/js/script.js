

//function requeteProduits(){
fetch("http://localhost:3000/api/products/")

  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(tableauProduits => {
    ajoutListeProduitsHTML(tableauProduits);

  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("Erreur N°" + err);
  });

var i = 0;
let erreur = "Non";

/*
while (erreur="Non") {
    //Nouvelles balises 'li' de liste à ajouter 
    let newListe = document.createElement("li");
    newListe.style.listStyleType = "none";

    console.log(tableauProduits)
    let numId = tableauProduits[i]._id;
};
  
*/
/////////////////////////////////////////////////////
////////////////////// FONCTIONS ////////////////////
/////////////////////////////////////////////////////
// --- Requete API sur les criteresProduit du produit suivant numId ----   
function requeteCriteresProduit(numId) {
  fetch("http://localhost:3000/api/products/" + numId)
    .then((res) => res.json())
    .then(function (res) {
    })
    .catch(function (err) {
      // Une erreur est survenue
      console.log("Erreur N°" + err)
    });
};
// Insertion en dynamique de la liste de produits en HTML
function ajoutListeProduitsHTML(tableauProduits) {
  console.log(tableauProduits)

  tableauProduits.forEach(criteresProduit => {
    var parentListe = document.getElementById("items");
    var newBaliseA = document.createElement("a");
    //Ajout nouvelle balise 'a' aprés le parent #items
    parentListe.appendChild(newBaliseA);
    newBaliseA.href="../html/product.html";
    //Insertion nouvelle balise 'article' dans la balise 'a'
    var parentListe = newBaliseA;
    var newBaliseArticle = document.createElement("article");
    parentListe.appendChild(newBaliseArticle);
    //Insertion nouvelle balise 'img' dans la balise 'article'
    nomProduit = criteresProduit.name.replace(" ", '-');
    newBaliseArticle.innerHTML = "<img src =" + criteresProduit.imageUrl + " alt = " + nomProduit + ">";
    // insertion nouvelle balise <h3 dans la balise <article
     var newElemListe = document.createElement("h3");
    parentListe.appendChild(newElemListe);
    var parentListe = newBaliseA
    var newBaliseA = document.createElement("a");
  

    
    console.log(criteresProduit.name)

  })
};

/*
  newListe.innerHTML = "Element" + i + "<strong>Fort</Strong>"

  // Liste N°3 en rouge et gros caractere
  if (i == 3) {
      newListe.style.fontSize = "40px";
      newListe.style.color = "red";
  };

  if (i == 4) {
      //Si i = 4, Liste N° 4 remplace balise 'p' par 'div'
      // dans 'derElemListe'
      elemRemplacement.innerHTML = "Remplace balise p";
      derElemListe.replaceChild(elemRemplacement, elemARemplacer);
      console.log(elemRemplacement.innerHTML);
  };

    //document
    //.querySelector("div>.titles")
    //.addEventListener("click", requeteProduits);
*/
