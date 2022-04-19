// Lecture du N° 'id' avec l'URL envoyé par la page 'index.html'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');
// Identifie dans le D.O.M le bouton 'Ajouter au panier'
const btnAjoutPanier = document.getElementById("addToCart");
// Identifie la selection de la Qt
selectQt = document.getElementById("quantity");
selectCouleur=document.getElementById("colors");
qtNonVide = false;couleurSelect = false;
affBtnAjoutPanier();
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
            modifQt();
            choixCouleur();
            initPanier();
            majPanier(produitSelect);
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
// Affiche ou non le bouton 'Ajout au  panier'
function affBtnAjoutPanier() {
    if (couleurSelect == false) {
        // Si aucune couleur n'est selectionnée et/ou QT = 0
        // => Masque le bouton 'd'ajout au panier
        btnAjoutPanier.style.display = "none";
    }
    else if (qtNonVide == false) {
        // Sinon affiche le bouton
        btnAjoutPanier.style.display = "none";
    }
    else {
        btnAjoutPanier.style.display = "";
    }
};
// Selection d'une couleur
function choixCouleur() {
    // Lit la couleur selectionnée
    selectCouleur.addEventListener("change", function (event) {
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
        affBtnAjoutPanier();
    });
};
// Modification Qt
function modifQt() {
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
        affBtnAjoutPanier();
    });
};
// Recuperation ou réinitialisation du panier
function initPanier() {
    if (localStorage.panier != undefined) {
        // Récupération si panier déjà en cours
        localStorage.getItem("panier");
        //Conversion en format json
        panierJson = JSON.parse(localStorage.panier);
    }
}
function majElemsProduitHTML(produitSelect) {
    // MAJ du prix
    document.getElementById("price").innerHTML = produitSelect.price;
    // MAJ de 'description'
    document.getElementById("description").innerHTML = produitSelect.description;
    // MAJ des options de couleur
    var couleursProduitSelect = produitSelect.colors;
    majOptionsCouleur(couleursProduitSelect);
    affLienPanier();
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
function affLienPanier() {
    // Définie dans le D.O.M le lien 'panier'
    elemPanier = document.querySelectorAll(".limitedWidthBlock>nav>ul>a li")[1]
    if (localStorage.panier == undefined) {
        // si le panier est in'existant => N'affiche pas le lien du panier
        elemPanier.style.display = "none";
    }
    else if (localStorage.panier.length == 2) {
        // Si le panier est existant mais vide => N'affiche pas le lien du panier
        elemPanier.style.display = "none";
    }
    else {
        // Sinon remet le lien du panier
        elemPanier.style.display = "";
    };
}
// MAJ du panier
function majPanier(produitSelect) {
    btnAjoutPanier.addEventListener("click", function (event) {
        event.preventDefault();
         premLettreNomprodEnMaj(produitSelect.name);
       // if (couleurSelect && qtNonVide) {
            // Si une couleur selectionnée et Qt >0
            if (localStorage.panier == undefined) {
                // Si panier inexistant => MAJ 1er data du panier
                panierJson = [{ "codeArt": id, "couleur": couleur, "qt": qtProduit, "nomProd": nomProduit }]
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
                    
                    panierJson.push({ "codeArt": id, "couleur": couleur, "qt": qtProduit, "nomProd": nomProduit });
                };
            }
            sauvegardePanier();
            window.location.href = "../html/cart.html"
      //  }
        // Ne fait rien si aucune coulanier();eur sélectionnée  et/ou Qt = 0
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
// Mets la premiere lettre de la 2éme partie du nom de produit en majuscule
function premLettreNomprodEnMaj(nomProd){
  // recherche la lettre 'premLettreMaj' à mettre en majuscule  
  posiSep = nomProd.indexOf(" ");
  premLettreMaj=nomProd.substring(posiSep+1,posiSep+2);
// La mets systématiquement en majuscule
  premLettreMaj=premLettreMaj.toUpperCase();
// Reconstitue le nom complet
 debNom = nomProd.substring(posiSep+1,0);
 finNom = nomProd.substring(nomProd.length,posiSep+2);
 nomProduit=debNom+premLettreMaj+finNom;
};