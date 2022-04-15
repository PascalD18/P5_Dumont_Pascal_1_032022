// Lecture du N° 'id' avec l'URL envoyé par la page 'index.html'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
const btnAjoutPanier = document.getElementById("addToCart");

//localStorage.removeItem("panier");

// Requete API sur les produitSelect du produit suivant N° 'id
fetch("http://localhost:3000/api/products/" + id)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        };
    })
    .then(produitSelect => {
        if (produitSelect != undefined) {
            majElemsProduitHTML(produitSelect);
            initPanier();
            majPanier();
        }
        else {
            alert("La page 'products.html', ne peut-être ouverte directement.Il faut avoir selectionner un produit avec la page d'acceuil.")
            window.location.href = "../html/index.html"
        }
    })
    .catch(function (err) {
        // Une erreur est survenue
        console.log("Erreur N°" + err);
    });

////////////////////////////////////////}/////////////
////////////////////// FONCTIONS ////////////////////;
// Lecture Couleur et Qt depuis de D.O.M
function lectureCouleurQt() {
    couleurSelect = false; qtProduit = false; // Initialisation par défaut
    // Lit la couleur selectionnée
    var option = document.getElementById("colors");
    couleur = option.value;
    couleurSelect = true// Couleur considérée comme selectionnée par défaut
    nbCars = couleur.length;
    if (nbCars > 20) {
        if (couleur.slice(0, 5) == "--SVP") {
            couleurSelect = false;
        }
    };
    var option = document.getElementById("quantity");
    qtNonVide = true // Qt considérée comme > 0 par défault
    qtProduit = parseInt(option.value);
    if (qtProduit == 0) {
        qtNonVide = false
    };
    if ((couleurSelect == false) && (qtNonVide == false)) {
        alert("Veuillez selectionner, une couleur et une quantité.");
    }
    else if (couleurSelect == false) {
        alert("Veuillez selectionner une couleur");

    }
    else if (qtNonVide == false) {
        alert("Il faut une quantité > 0");

    };
};
// Recuperation ou réinitialisation du panier
function initPanier() {
    if (localStorage.panier != 'undefined') {
        // Récupération si panier déjà en cours
        localStorage.getItem("panier");
        //Conversion en format json
        panierJson = JSON.parse(localStorage.panier);
    }
    //  else {
    //      // Réinitialise un panier vide
    //     panierJson = [{ "codeArt": id, "couleur": couleur, "qt": qtProduit }];
    //      sauvegardePanier();
    // }
};
function majElemsProduitHTML(produitSelect) {
    // MAJ du prix
    document.getElementById("price").innerHTML = produitSelect.price;
    // MAJ de 'description'
    document.getElementById("description").innerHTML = produitSelect.description;
    // MAJ des options de couleur
    var couleursProduitSelect = produitSelect.colors;
    majOptionsCouleur(couleursProduitSelect);
    affElemPanier();
};
// Renseigne l'Option des couleurs //
function majOptionsCouleur(couleursProduitSelect) {
    var i = 0; var j = 0;
    couleursProduitSelect.forEach(couleur => {
        //sauvegardePanier();
        var enfantElemCouleur = document.createElement("option");
        enfantElemCouleur.id = "couleur" + i;
        if (j == 0) {
            // Au début, Ajoute en premier l'option par défaut

            var premEnfantElemCouleur = document.querySelector("#colors>option");
            var parentElemCouleur = document.getElementById("colors");

            parentElemCouleur.removeChild(premEnfantElemCouleur);
            var parentElemCouleur = document.getElementById("colors")
            enfantElemCouleur.innerHTML = "--SVP, choisissez une couleur"
            parentElemCouleur.appendChild(enfantElemCouleur);
            j++; i++;
            var enfantElemCouleur = document.createElement("option");
            enfantElemCouleur.id = "couleur" + i;
            enfantElemCouleur.innerHTML = couleur;
            parentElemCouleur.appendChild(enfantElemCouleur);
            i++;
        }
        //Sinon ajoute
        else {
            enfantElemCouleur.innerHTML = couleur;
            var parentElemCouleur = document.getElementById("colors")
            parentElemCouleur.appendChild(enfantElemCouleur);
            i++;
        };
    });
};
// Gestion affichage bouton panier en fonction état panier
function affElemPanier() {
    // Initialise l'élément <a: 'panier'
    elemPanier = document.querySelectorAll(".limitedWidthBlock>nav>ul>a li")[1]
    if (localStorage.panier == 'undefined') {
        if (localStorage.panier == 'undefined' | localStorage.panier.length == 2) {
            // si le panier est vide => N'affiche pas le bonton du panier
            elemPanier.style.display = "none";
        }
        else {
            elemPanier.style.display=""
        }
    }
}
// MAJ du panier
function majPanier() {
    btnAjoutPanier.addEventListener("click", function (event) {
        event.preventDefault();
        lectureCouleurQt();
        if (couleurSelect && qtNonVide) {
            // Si une couleur selectionnée et Qt >0
            if (localStorage.panier == 'undefined') {
                // Si panier vide => MAJ 1er data du panier
                panierJson = [{ "codeArt": id, "couleur": couleur, "qt": qtProduit }]
            }
            else {
                // Si panier non vide
                verifSiProduitExisteDsPanier();
                if (produitExiste) {
                    // Si le produit existe déjà dans le panier => MAJ qt uniquement
                    newQt = qtProduit + panierJson[itemProduit].qt;
                    panierJson[itemProduit].qt = newQt;
                }
                else {
                    // Sinon, ajoute le produit
                    panierJson.push({ "codeArt": id, "couleur": couleur, "qt": qtProduit });
                };
            }
            sauvegardePanier();
            window.location.href = "../html/cart.html"
        }
        // Ne fait rien si aucune couleur sélectionnée  et/ou Qt = 0
    });
};
// Sauvedarde en local du panier
function sauvegardePanier() {
    panierLinea = JSON.stringify(panierJson);
    localStorage.setItem("panier", panierLinea);
};
// Verifie si le produit exit déjà dans le panier
function verifSiProduitExisteDsPanier() {
    // Verifie si le produit selectionné existe déjà dans le panier
    var i = 0; continuer = true;
    produitExiste = false; // Par défaut, considére le produit inexistant dans panier
    while (i < panierJson.length && produitExiste == false) {
        if (panierJson[i].codeArt == id && panierJson[i].couleur == couleur) {
            itemProduit = i; produitExiste = true;
            continuer = false;
        };
        i++
    };
};