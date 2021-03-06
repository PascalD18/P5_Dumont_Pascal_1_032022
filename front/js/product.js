initialization();
initCartIfIs();
ShowLinkCartIfItis();
StatusBtnAddCart();

// Requete API d'un produit en fonction de son 'id'
fetch("http://localhost:3000/api/products/" + id)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        };
    })
    .then(response => {
        if (response != undefined) {

            // Mémorisation du produit selectionné dans 'producSelect'
            productSelect = response;
            UpdateElemsHtmlWithProducSelect();
            // Sinon, affiche un message d'erreur, et retour à la page d'acceuil
        } else {
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

// initialisation de l'état de saisie, et recupération de l'id' avec l'URL envoyé par la page 'index.html'
function initialization() {
    var queryString = window.location.search;
    urlParams = new URLSearchParams(queryString);
    id = urlParams.get('id');

    // Par défaut : Qt=0 et aucune couleur de selectionnée
    qtNoZero = false;
    colorSelect = false;

    // Définition de l'élement bouton 'Ajouter au panier'
    btnAddCart = document.getElementById("addToCart");
}

// Affiche couleur du bouton 'Ajouter au panier', selon la selection couleur et/ou Qt
function StatusBtnAddCart() {
    if (colorSelect && qtNoZero) {

        // Couleur bleu fonçé, si une couleur est selectionnée et Qt > 0
        btnAddCart.classList = "yesHover";
        btnAddCart.title = "";
    } else {

        // Sinon en grisé, si la selection n'est pas compléte
        btnAddCart.classList = "noHover";

        // Maj du message d'erreur en bulle info au survol de la souris 
        if (qtNoZero && colorSelect == false) {
            btnAddCart.title = "Selectionner une couleur";
        } else if (colorSelect && qtNoZero == false) {
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
            if (color.slice(0, 5) == "--SVP") {
                colorSelect = false;
            }
        } else {
            colorSelect = true
        }
        StatusBtnAddCart();
    });
};

// Mise à jour de la page lorsque que l'on change la Qt d'un produit
function changeQt() {

    // Par défaut, on considére que la qt est <=0
    qtNoZero = false;
    selectQt = document.getElementById("quantity");
    selectQt.addEventListener("change", function (event) {
        event.preventDefault();
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

// Modification en dynamique du prix et de la description
function UpdateElemsHtmlWithProducSelect() {

    //Maj Image du produit
    parent = document.getElementsByClassName("item__img");
    parent[0].innerHTML = `<img src = "${productSelect.imageUrl}" alt = "${productSelect.altTxt}">`;

    // MAJ du prix
    nameProduct = firstLetterNameProduct(productSelect.name);
    document.getElementById("title").innerHTML = nameProduct;

    // MAJ du prix
    document.getElementById("price").innerHTML = productSelect.price;

    // MAJ de la description
    document.getElementById("description").innerHTML = productSelect.description;

    // Récupére l'élément correspondant à la sélection des couleurs
    colorsProductSelect = productSelect.colors;

    // 1ere option par défaut
    elemsOptionColors = "<option>--SVP, choisissez une couleur</option>";

    //Concaténe les options de selection des couleurs
    colorsProductSelect.forEach(color => {
        elemsOptionColors += `<option>${color}</option>`
    });

    //Modification en dynamique de la liste en intégrant 'elemsOptionColors'
    parentElemColor = document.getElementById("colors");
    parentElemColor.innerHTML = elemsOptionColors;
};

// MAJ du panier en cliquant sur le bouton 'Ajouter au panier'
function actionBtnAddCart() {
    btnAddCart.addEventListener("click", function (event) {
        event.preventDefault();

        // Si une couleur selectionnée et Qt >0
        if (colorSelect && qtNoZero) {
            nameProd = firstLetterNameProduct(productSelect.name);

            // Si le panier existe dans localStorage
            if (localStorage.cart != undefined) {

                // Et si le produit n'existe pas dans le panier => Ajoute le produit
                if (productItisInCart() == false) {
                    cartJson.push({ "codeArt": id, "color": color, "qt": qtProduct, "nameProd": nameProd });

                    // Et si le produit existe déjà dans le panier => MAJ qt uniquement
                } else {
                    newQt = qtProduct + cartJson[itemProduit].qt;
                    cartJson[itemProduit].qt = newQt;
                };

                // Si panier inexistant => MAJ 1er data du panier
            } else {
                cartJson = [{ "codeArt": id, "color": color, "qt": qtProduct, "nameProd": nameProd }]
            }
            saveCart();
            window.location.href = "../html/cart.html"
        } else {
            alert(btnAddCart.title);
        }
    });
};

// Classement et sauvegarde du panier 'cartJson' dans locaStorage
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
//function productItisInCart() {
//    var i = 0;

    // Par défaut, considére le produit inexistant dans panier
//    productItIS = false;
//    while (i < cartJson.length && productItIS == false) {
 //       if (cartJson[i].codeArt == id && cartJson[i].color == color) {
 //           itemProduit = i;
 //           productItIS = true;
//        };
 //       i++
 //   };
 //   if (productItIS) {
 //       return true
 //   } else {
 //       return false
  //  };
//};

// Verifie si le produit exite déjà dans le panier
function productItisInCart() {
    var i = 0;
    // Retourne faux si produit inexistant dans le panier 
    while (i < cartJson.length) {
        if (cartJson[i].codeArt == id && cartJson[i].color == color) {
            itemProduit = i;
            return true;
        };
        i++
    };
    return false;
 };
