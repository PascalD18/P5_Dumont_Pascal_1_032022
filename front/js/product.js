/*fetch("http://localhost:3000/api/products/")

    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .catch(function (err) {
        // Une erreur est survenue
        console.log("Erreur N°" + err);
    });
console.log(criteresProduit)
*/
// Lecture URL envoyé par la page 'index.html'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
// Requete API sur les criteresProduit du produit suivant N° 'id
fetch("http://localhost:3000/api/products/" + id)
.then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
.then(criteresProduit => {
  majElemsProduitHTML(criteresProduit);

});
/*
.then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(tableauProduits => {
    //ajoutListeProduitsHTML(tableauProduits);

  })
*/

console.log(id);
console.log(urlParams);

/////////////////////////////////////////////////////
////////////////////// FONCTIONS ////////////////////
/////////////////////////////////////////////////////
function majElemsProduitHTML(criteresProduit){
    console.log(criteresProduit.description);
    var elemDescription = document.getElementById("description").innerHTML=criteresProduit.description
};

