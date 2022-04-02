// Lecture du N° 'id' avec l'URL envoyé par la page 'index.html'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
console.log(id)
const btnAjoutPanier = document.getElementById("addToCart");
// Requete API sur les produitSelect du produit suivant N° 'id
fetch("http://localhost:3000/api/products/" + id)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(produitSelect => {
        console.log(produitSelect);
        majElemsProduitHTML(produitSelect);
        majPanier(produitSelect);


    })


    //       localStorage.removeItem("panier");

    .catch(function (err) {
        // Une erreur est survenue
        console.log("Erreur N°" + err);
    });
//





//console.log(produitSelect.price);
//console.log("panier".prix);



/*
console.log(routes.length)
for ( let i=0; i<= routes.length;i++){
    console.log("-"+i+"-");
    console.log(routes[i]);
};
for (let i=0; i<= localStorage.length;i++){
    console.log(localStorage.key(i));
}
*/
////////////////////////////////////////}/////////////
////////////////////// FONCTIONS ////////////////////;
function majElemsProduitHTML(produitSelect) {
    // MAJ du prix
    document.getElementById("price").innerHTML = produitSelect.price;
    // MAJ de 'description'
    document.getElementById("description").innerHTML = produitSelect.description;
    // MAJ des options de couleur
    var couleursProduitSelect = produitSelect.colors;
    majOptionsCouleur(couleursProduitSelect);
};
// Renseigne l'Option des couleurs //
function majOptionsCouleur(couleursProduitSelect) {
    var etape = "Début"
    couleursProduitSelect.forEach(couleur => {
        var parentElemCouleur = document.getElementById("colors");
        var enfantElemCouleur = document.createElement("option");
        if (etape = "Option par défaut") {
            // Au début, Ajoute en premier l'option par défaut
            enfantElemCouleur.innerHTML = "--SVP, choisissez une couleur"
            etape = "Suite";
        }
        // Puis ajoute la couleur
        enfantElemCouleur.innerHTML = couleur;
        parentElemCouleur.appendChild(enfantElemCouleur);
    });
};
// MAJ du panier
function majPanier(produitSelect) {
    btnAjoutPanier.addEventListener("click", function (event) {
        event.preventDefault();
        console.log(produitSelect);
        let panierLinea = localStorage.getItem("panier");
        if (panierLinea == null) {
            alert("Panier vide");
            let qtProduit=document.getElementById("quantity");
            let panierJson={"ligne":0,"codeArt":id,"Qt":qtProduit,"couleur":document.querySelector("#colors>option")}
            let panierLinea=JSON.stringify(panierJson);
            localStorage.setItem("panier",panierLinea);
            console.log(panierJson);
        }
        else {
            // Si panier non vide
            let panierJson = JSON.parse(panierLinea)
            if (verifProduitExist(panierJson) = true) {
                // Produit déjà existant
                // ... augmente la Qt

            }
            //       let panierJson = { prix: tableau1.price };
            //      let panierLinea = JSON.stringify(panierJson);
            //      localStorage.setItem("panier", panierLinea);

        }
        });
};
// Recherche si le produit à déjà été selectionné
function verifProduitExist(panierJson) {

}