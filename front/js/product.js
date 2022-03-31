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
.then((res) => res.json())
.then(function (res) {
})
.then(criteresProduit => {
  majElemsProduitHTML(criteresProduit);

});


console.log(id);
console.log(urlParams);
console.log(criteresProduit);
/////////////////////////////////////////////////////
////////////////////// FONCTIONS ////////////////////
/////////////////////////////////////////////////////
function majElemsProduitHTML(criteresProduit){
    document.getElementsByClassName(".item__content__description").innerHTML=criteresProduit.description
};

