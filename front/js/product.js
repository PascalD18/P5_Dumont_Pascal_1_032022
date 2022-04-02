// Lecture du N° 'id' avec l'URL envoyé par la page 'index.html'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
console.log(id)
const btnAjoutPanier = document.getElementById("addToCart");
//const selectQt=document.querySelector("select>#colors");
localStorage.removeItem("panier");
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

    var i,j=0;
      couleursProduitSelect.forEach(couleur => {

        var enfantElemCouleur = document.createElement("option");
        enfantElemCouleur.id = "couleur" + i;
        console.log(j);
        if (j==0) {
            // Au début, Ajoute en premier l'option par défaut
            var premEnfantElemCouleur = document.querySelector("#colors>option");
            console.log(premEnfantElemCouleur);
            // premEnfantElemCouleur.remove;
            var parentElemCouleur = document.getElementById("colors")
            enfantElemCouleur.innerHTML = "--SVP, choisissez une couleur"
            parentElemCouleur.appendChild(enfantElemCouleur);
            j++;
            console.log(j)
            i++;
        }
        //Sinon ajoute
        else {
            var parentElemCouleur = document.getElementById("colors")
            enfantElemCouleur.innerHTML = couleur;
            parentElemCouleur.appendChild(enfantElemCouleur);
            i++;
        };
    });

    console.log(i);
};
// MAJ du panier
function majPanier(produitSelect) {
    btnAjoutPanier.addEventListener("click", function (event) {
        event.preventDefault();
        console.log(produitSelect);
        let panierLinea = localStorage.getItem("panier");
        let couleur = document.querySelector("#colors>option>value").innerHTML;
        let qtProduit = document.querySelector(".item__content__settings__quantity>input").innerHTML;
        console.log(couleur);
        console.log(qtProduit);
        if ((panierLinea == null) && (qtProduit != 0)) {
            alert("Panier vide");
            let panierJson = { "ligne": 0, "codeArt": id, "Qt": qtProduit, "couleur": couleur }
            let panierLinea = JSON.stringify(panierJson);
            localStorage.setItem("panier", panierLinea);
            console.log(panierJson);
        }
        else {
            // Si panier non vide

            let panierJson = JSON.parse(panierLinea)
            console.log(panierJson);
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
