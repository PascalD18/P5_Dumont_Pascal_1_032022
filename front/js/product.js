// Lecture du N° 'id' avec l'URL envoyé par la page 'index.html'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
console.log(id)

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



/////////////////////////////////////////////////////
////////////////////// FONCTIONS ////////////////////
/////////////////////////////////////////////////////
// Maj des elements de la page à partir de l'API et du N° 'id' retourné avec la page 'index.html' //
function majElemsProduitHTML(criteresProduit) {
    // MAJ du prix
    document.getElementById("price").innerHTML = criteresProduit.price;
    // MAJ de 'description'
    document.getElementById("description").innerHTML = criteresProduit.description;
    // MAJ des options de couleur
    var couleursProduit = criteresProduit.colors;
    majOptionsCouleur(couleursProduit);
};

// Renseigne l'Option des couleurs //
function majOptionsCouleur(couleursProduit) {
    var etape = "Début"
    couleursProduit.forEach(couleur => {
       var parentElemCouleur = document.getElementById("colors");
        var enfantElemCouleur = document.createElement("option");
        if (etape = "Option par défaut") {
            // Au début, Ajoute en premier l'option par défaut
            enfantElemCouleur.innerHTML = "--SVP, choisissez une couleur"
            etape="Suite";
        }
        // Puis ajoute la couleur
        enfantElemCouleur.innerHTML = couleur;
        parentElemCouleur.appendChild(enfantElemCouleur);
    });

};