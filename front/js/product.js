// Lecture du N° 'id' avec l'URL envoyé par la page 'index.html'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
console.log(id)
const btnAjoutPanier = document.getElementById("addToCart");

localStorage.removeItem("panier");
  console.log(localStorage);




// Requete API sur les produitSelect du produit suivant N° 'id
fetch("http://localhost:3000/api/products/" + id)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .then(produitSelect => {
        console.log(produitSelect);
        initPanier(panierJson);
        var panierJson=localStorage.panier;
        majElemsProduitHTML(produitSelect);
        verifProduitExist(panierJson);
        majPanier(produitSelect);



    })


    //       localStorage.removeItem("panier");

    .catch(function (err) {
        // Une erreur est survenue
        console.log("Erreur N°" + err);
    });

////////////////////////////////////////}/////////////
////////////////////// FONCTIONS ////////////////////;
// Recuperation ou réinisialisation du panier
function initPanier(){
    if (localStorage.panier != null) {
        then (panierJson => {
      // Récupération si panier déjà en cours
        localStorage.getItem("panier");
      //Conversion en format json
        panierJson=JSON.parse(localStorage.panier);
        console.log(panierJson);
        })
    }
    else {
        // Réinitialise un panier vide
        var panierJson=[{}];
        panierJson[0].age=32;
        let panierLinea=JSON.stringify(panierJson);
        localStorage.setItem("panier",panierLinea);
    }
    };
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

    var i = 0;
    var j = 0;
    couleursProduitSelect.forEach(couleur => {

        var enfantElemCouleur = document.createElement("option");
        enfantElemCouleur.id = "couleur" + i;
        console.log(j);
        if (j == 0) {
            // Au début, Ajoute en premier l'option par défaut

            var premEnfantElemCouleur = document.querySelector("#colors>option");
            var parentElemCouleur = document.getElementById("colors");

            parentElemCouleur.removeChild(premEnfantElemCouleur);
            var parentElemCouleur = document.getElementById("colors")
            enfantElemCouleur.innerHTML = "--SVP, choisissez une couleur"
            parentElemCouleur.appendChild(enfantElemCouleur);
            j++;
            console.log(j)
            i++;
            var enfantElemCouleur = document.createElement("option");
            enfantElemCouleur.id = "couleur" + i;
            enfantElemCouleur.innerHTML =couleur;
            parentElemCouleur.appendChild(enfantElemCouleur);
            i++;
        }
        //Sinon ajoute
        else {
            enfantElemCouleur.innerHTML = couleur;
            console.log(enfantElemCouleur);
            var parentElemCouleur = document.getElementById("colors")
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
        // Lit la couleur selectionnée
        var option = document.getElementById("colors");
        var couleur = option.value;
        var option = document.getElementById("quantity");
        var qtProduit = option.value;
        console.log(couleur);
        console.log(qtProduit);
        let panierJson=JSON.parse(panierLinea);
        console.log(panierJson);
        if ((panierLinea == null) && (qtProduit != 0)) {
            alert("Panier vide");
            //panierJson.push(1);
            let panierJson = { "ligne": 0, "codeArt": id, "Qt": qtProduit, "couleur": couleur }
            let panierLinea = JSON.stringify(panierJson);
            localStorage.setItem("panier", panierLinea);
            console.log(panierJson);
        }
        else {
            // Si panier non vide
            
            panierJson = JSON.parse(panierLinea);
            var newLigne = 1;
            var newcouleur = couleur;
            panierJson[1].push("essai");
            console.log(panierJson);
            let panierJson = { "ligne": 0, "codeArt": id, "Qt": qtProduit, "couleur": couleur }
            console.log(panierJson);
            
            if (verifProduitExist) {
                // Produit déjà existant
                // ... augmente la Qt

            }
            //       let panierJson = { prix: tableau1.price };
            //      let panierLinea = JSON.stringify(panierJson);
            //      localStorage.setItem("panier", panierLinea);

        }
    });
};
// Verifie si le produit exit déjà dans le panier
function verifProduitExist(panierJson) {

    
    
};