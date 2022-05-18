initialisation();
// Requete API sur les produitSelect du produit suivant N° 'id
fetch("http://localhost:3000/api/products/" + id)
    .then(function (res) {
        if (res.ok) {
            return res.json();
        };
    })
    .then(produitSelect => {
        if (produitSelect != undefined) {
            majElemsHTMLsvtProduitselect(produitSelect);
            affLienPanier();
            initPanierSiExiste();
            affEtatBtnAjoutPanier();
            modifQt();
            choixCouleur();
            majPanier(produitSelect);
        }
        else {
            alert(`La page 'products.html', ne peut-être ouverte directement.
            Il faut avoir selectionner un produit avec la page d'acceuil.`)
            window.location.href = "../html/index.html"
        }
    })
    .catch(function (err) {
        // Une erreur est survenue
        console.log("Erreur N°" + err);
    });

////////////////////////////////////////}/////////////
////////////////////// FONCTIONS ////////////////////;
function initialisation(){
// Lecture du N° 'id' avec l'URL envoyé par la page 'index.html'
var queryString = window.location.search;
 urlParams = new URLSearchParams(queryString);
 id = urlParams.get('id');
 // Par défaut : Qt=0 et aucune couleur de selectionnée
 // On initialise cet état dans les 2 indicateurs suivants:
  qtNonVide=false; couleurSelect = false;
 // Définition de l'élement bouton 'Ajouter au panier'
  btnAjoutPanier = document.getElementById("addToCart");
}
function affEtatBtnAjoutPanier() {
// Affiche en grisé ou non le bouton 'Ajouter au panier'
// Et Maj du message d'erreur en bulle info au survol de la souris 
   if (couleurSelect == true && qtNonVide == true) {
      // Si une couleur est selectionnée et Qt > 0
        btnAjoutPanier.style.backgroundColor = "#2c3e50";
        btnAjoutPanier.classList = "yesHover"; 
        btnAjoutPanier.title = "";
    }
    else {
        //Sinon, si la selection n'est pas compléte
        //=> Maj e la bulle info au survol de la souris
        btnAjoutPanier.style.backgroundColor = "grey";
        btnAjoutPanier.classList = "noHover";
        if (qtNonVide==true) {
            btnAjoutPanier.title = "Selectionner une couleur";
        }
        else if (couleurSelect==true) {
            btnAjoutPanier.title = "Selectionner une Qt >0";
        }
        else if (couleurSelect == false && qtNonVide == false) {
            btnAjoutPanier.title = "Selectionner une couleur et Qt >0";
        }
    }
};

function choixCouleur() {
    // Selection d'une couleur
    // Initialise l'élement concernant la liste déroulante
    selectCouleur = document.getElementById("colors");
    selectCouleur.addEventListener("change", function (event) {
    // A chaque modification de l'élément, lit la couleur selectionnée
        event.preventDefault();
        couleur = selectCouleur.value;
        nbCars = couleur.length;
        if (nbCars > 20) {
            if (couleur.slice(0, 5) == "--SVP") {
                couleurSelect = false;
            }
        }
        else {
            couleurSelect = true
        }
        affEtatBtnAjoutPanier();
    });
};
// Modification Qt
function modifQt() {
    qtNonVide = false;// Par défaut
    selectQt = document.getElementById("quantity");
    selectQt.addEventListener("change", function (event) {
        event.preventDefault();
        // Qt considérée comme > 0 par défault
        qtProduit = parseInt(selectQt.value);
        if (qtProduit == 0) {
            qtNonVide = false
        }
        else {
            qtNonVide = true
        };
        affEtatBtnAjoutPanier();
    });
};
function initPanierSiExiste() {
    // Recuperation du panier
    if (localStorage.panier != undefined) {
        // Récupération si panier déjà en cours
        localStorage.getItem("panier");
        //Conversion en format json
        panierJson = JSON.parse(localStorage.panier);
    }
}
function majElemsHTMLsvtProduitselect(produitSelect) {
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
    var i = 0; var j = 0;
    couleursProduitSelect.forEach(couleur => {
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
// MAJ du panier
function majPanier(produitSelect) {
    btnAjoutPanier.addEventListener("click", function (event) {
        event.preventDefault();
        if (couleurSelect && qtNonVide) {
            nomProd=premLettreNomprodEnMaj(produitSelect.name);
            // Si une couleur selectionnée et Qt >0
            if (localStorage.panier == undefined) {
                // Si panier inexistant => MAJ 1er data du panier
                panierJson = [{ "codeArt": id, "couleur": couleur, "qt": qtProduit, "nomProd": nomProd }]
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
                    panierJson.push({ "codeArt": id, "couleur": couleur, "qt": qtProduit, "nomProd": nomProd });
                };
            }
            sauvegardePanier();
            window.location.href = "../html/cart.html"
        }
        else {
            alert(btnAjoutPanier.title);
        }
    });
};
// Sauvegarde en local du panier
function sauvegardePanier() {
    //Trie dans l'ordre alphabétique des noms des produits
    panierJson.sort(function (a, b) {
        if (a.nomProd < b.nomProd) {
            return -1;
        } else {
            return 1;
        }
    });
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
