
initialization();
initCartIfIs();
ShowLinkCartIfItis();
StatusBtnAddCart();

// Requete API d'un produit en fonction de son 'id'
// Déclaration de 'ProductSelect'
let productSelect;
fetch("http://localhost:3000/api/products/" + id)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        };
    })
    .then(response => {
        if (response != undefined) {

            // Mémorisation du produit dans 'producSelect'
            productSelect = response;
            UpdateElemsHtmlWithProducSelect();
        } else {
            // Sinon, affiche un message d'erreur, et retour à la page d'acceuil
            alert(`La page 'products.html', ne peut-être ouverte directement.
            Il faut avoir selectionner un produit avec la page d'acceuil.`)
            window.location.href = "../html/index.html"
        }
    })
    .catch(function (err) {

        // Affiche l'erreur de l'API
        alert(`l'erreur` + err + ` est survenue sur le serveur.
        Nous faisons notre possible pour remédier à ce probléme.
        N'hesitez pas à revenir plus tard sur le site, vous serez les bienvenus.
        Merci pour votre comprehension.`)
    });
changeQt();
ChooseColor();
actionBtnAddCart();
////////////////////////////////////////}/////////////
////////////////////// FONCTIONS ////////////////////;
function initialization() {

    // Lecture du N° 'id' avec l'URL envoyé par la page 'index.html'
    var queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    id = urlParams.get('id');

    // Par défaut : Qt=0 et aucune couleur de selectionnée
    qtNoZero = false;
    colorSelect = false;

    // Définition de l'élement bouton 'Ajouter au panier'
    btnAddCart = document.getElementById("addToCart");
}

// Affiche couleur du bouton 'Ajouter au panier', seleon la selection couleur et/ou Qt
function StatusBtnAddCart() {

    // Colueur bleu fonçé, si une couleur est selectionnée et Qt > 0
    if (colorSelect && qtNoZero) {
        btnAddCart.style.backgroundColor = "#2c3e50";
        btnAddCart.classList = "yesHover";
        btnAddCart.title = "";
    } else {

        // Sinon en grisé, si la selection n'est pas compléte
        btnAddCart.style.backgroundColor = "grey";
        btnAddCart.classList = "noHover";

        // Maj du message d'erreur en bulle info au survol de la souris 
        if (!qtNoZero) if (colorSelect) {
            btnAddCart.title = "Selectionner une couleur";
        } else if (!(colorSelect == false && qtNoZero == false)) {
            btnAddCart.title = "Selectionner une Qt >0";
        } else {
            btnAddCart.title = "Selectionner une couleur et Qt >0";
        }
    }
};

// Si le panier existe dans localStorage => le charge dans 'cartJson'
function initCartIfIs() {
    if (localStorage.cart != undefined) {
        cartLinear = localStorage.getItem("cart");
        cartJson = JSON.parse(cartLinear);
    }
}

// Selection d'une couleur
function ChooseColor() {

    // Initialise l'élement concernant la liste déroulante
    selectCouleur = document.getElementById("colors");

    // A chaque modification de l'élément, lit la couleur selectionnée
    selectCouleur.addEventListener("change", function (event) {
        event.preventDefault();
        color = selectCouleur.value;
        nbCars = color.length;
        if (nbCars > 20) {
            if (couleur.slice(0, 5) == "--SVP") {
                colorSelect = false;
            }
        } else {
            colorSelect = true
        }
        StatusBtnAddCart();
    });
};

// Mise à jour de la page lorsque l'on change la Qt d'un prouit
function changeQt() {
    qtNoZero = false;// Par défaut
    selectQt = document.getElementById("quantity");
    selectQt.addEventListener("change", function (event) {
        event.preventDefault();
        // Qt considérée comme > 0 par défault
        qtProduct = parseInt(selectQt.value);
        if (!(isNaN(qtProduct) || qtProduct <= 0)) {
            qtNoZero = true;
        } else {
            qtNoZero = false;
            selectQt.value = 0;
        };
        StatusBtnAddCart();
    });
};
function UpdateElemsHtmlWithProducSelect() {
    // MAJ du prix
    document.getElementById("price").innerHTML = productSelect.price;
    // MAJ de 'description'
    document.getElementById("description").innerHTML = productSelect.description;
    // MAJ des options de couleur
    var colorsProductSelect = productSelect.colors;
    updateOptColor(colorsProductSelect);
};

// Renseigne l'Option des couleurs //
function updateOptColor(colorsProductSelect) {
    var i = 0; var j = 0;
    colorsProductSelect.forEach(color => {
        var childElemColor = document.createElement("option");
        childElemColor.id = "couleur" + i;
        if (j == 0) {
            // Au début, Ajoute en premier l'option par défaut

            var firstChildElemColor = document.querySelector("#colors>option");
            var parentElemColor = document.getElementById("colors");

            parentElemColor.removeChild(firstChildElemColor);
            var parentElemColor = document.getElementById("colors")
            childElemColor.innerHTML = "--SVP, choisissez une couleur"
            parentElemColor.appendChild(childElemColor);
            j++; i++;
            var childElemColor = document.createElement("option");
            childElemColor.id = "couleur" + i;
            childElemColor.innerHTML = color;
            parentElemColor.appendChild(childElemColor);
            i++;

            //Sinon ajoute            
        } else {
            childElemColor.innerHTML = color;
            var parentElemColor = document.getElementById("colors")
            parentElemColor.appendChild(childElemColor);
            i++;
        };
    });
};

// MAJ du panier en cliquant sur le bouton 'Ajouter au panier'
function actionBtnAddCart() {
    btnAddCart.addEventListener("click", function (event) {
        event.preventDefault();
        if (colorSelect && qtNoZero) {
            nameProd = firstLetterNameProduct(productSelect.name);

            // Si une couleur selectionnée et Qt >0
            if (localStorage.cart == undefined) {

                // Si panier inexistant => MAJ 1er data du panier
                cartJson = [{ "codeArt": id, "color": color, "qt": qtProduct, "nameProd": nameProd }]
            } else {

                // Si panier non vide
                ;
                if (!productItisInCart()) {

                    // Sinon, ajoute le produit
                    cartJson.push({ "codeArt": id, "color": color, "qt": qtProduct, "nameProd": nameProd });
                } else {

                    // Si le produit existe déjà dans le panier => MAJ qt uniquement
                    newQt = qtProduct + cartJson[itemProduit].qt;
                    cartJson[itemProduit].qt = newQt;
                };
            }
            saveCart();
            window.location.href = "../html/cart.html"
        } else {
            alert(btnAddCart.title);
        }
    });
};

// Classement et Sauvegarde du panier dans locaStorage
function saveCart() {

    //Classe
    cartJson.sort(function (a, b) {
        if (a.nameProd >= b.nameProd) {
            return 1;
        } else {
            return -1;
        }
    });

    //Sauvegarde
    cartLinear = JSON.stringify(cartJson);
    localStorage.setItem("cart", cartLinear);
};

// Verifie si le produit exite déjà dans le panier
function productItisInCart() {
    var i = 0;
    productItIS = false;

    // Par défaut, considére le produit inexistant dans panier
    while (i < cartJson.length && productItIS == false) {
        if (cartJson[i].codeArt == id && cartJson[i].color == color) {
            itemProduit = i;
            productItIS = true;
        };
        i++
    };
    if (productItIS) { return true } else { return false };
};
