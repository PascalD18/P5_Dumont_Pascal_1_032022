

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
<<<<<<< HEAD
    .then((res) => res.json())
    .then(function (res) {
=======
  .then((res) => res.json())
  .then(function(res) {
  })
   .catch(function(err) {
    // Une erreur est survenue
    console.log("Erreur N°"+err)
  });  
};   // Insertion en dynamique de la liste de produits en HTML
    function ajoutListeProduitsHTML(tableauProduits) {
    const parentListes = document.querySelector("#items > ul");

    console.log(tableauProduits)
    tableauProduits.forEach (criteresProduit => {
    //Dernier element de la liste avant lequel sera ajouté les autres elements
      let derElemListe = document.querySelector("#items>ul>li");
    //Nouvelles balises 'li' de liste à ajouter 
      let newElemListe = document.createElement("li");
    //Insertion avant la derniére liste
      parentListes.insertBefore(newElemListe, derElemListe);
      newElemListe.style.listStyleType = "none";
      let nomProduit = criteresProduit.name.replace(" ", '&#160');
      newElemListe.innerHTML= "<img src =" + 'criteresProduit.imageUrl' + " alt = " +  nomProduit + ">"
      console.log(criteresProduit.name)

>>>>>>> parent of 43d0076 (--- Auto-Git Commit ---)
    })
    .catch(function (err) {
      // Une erreur est survenue
      console.log("Erreur N°" + err)
    });
};
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
    newBaliseA.href = "../html/product.html";
    //Insertion nouvelle balise 'article' dans la balise 'a'
    var parentListe = newBaliseA;
    var newBaliseArticle = document.createElement("article");
    parentListe.appendChild(newBaliseArticle);
    //Insertion nouvelle balise 'img' dans la balise 'article'
    nomProduit = criteresProduit.name.replace(" ", '_');
    newBaliseArticle.innerHTML = "<img src =" + criteresProduit.imageUrl + " alt = " + nomProduit + ">";
    // insertion nouvelle balise 'h3' dans la balise 'article' (aprés la balise 'img')
    var parentListe=newBaliseArticle;
    var newElemListe = document.createElement("h3");
    parentListe.appendChild(newElemListe);
    newElemListe.classList.add("productName")
    newElemListe.innerHTML=nomProduit
    // insertion nouvelle balise 'p' dans la balise 'article'
    var newElemListe = document.createElement("p");
    parentListe.appendChild(newElemListe);
    newElemListe.classList.add("productDescription")
    newElemListe.innerHTML=criteresProduit.description
    var etape="Suite"

  })
};

/*
  newListe.innerHTML = "Element" + i + "<strong>Fort</Strong>"

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
