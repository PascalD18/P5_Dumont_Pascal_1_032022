// Déclare l'élément correspondant comme bouton de commande 
const btnCommande = document.getElementById("order");

// Charge la base de donnée des produits 'dataProductServer' depuis l'API
// Car si l'utilisateur ouvre directement la page 'cart.html' concernant le panier,
// une évolution éventuelle des produits issus du server stockés en locaStorage, ne serait pas prise en compte.
fetch("http://localhost:3000/api/products/")
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(response => {
    dataProductsServer = response;
    initialization();
    sortDataProducts();
    UpdateElemsCartInHtml();
    modifqtProduct();
    deleteProduct();
    calcTotalQtPrices();
    displayBtnorderAccordInputStatus();
  })
  .catch(function (err) {

    // Affiche l'erreur de l'API
    alert(`l'erreur` + err + ` est survenue sur le serveur.
    Nous faisons notre possible pour remédier à ce probléme.
    N'hesitez pas à revenir plus tard sur le site, vous serez les bienvenus.
    Merci pour votre comprehension.`)
  });
controlFormEntry();
controlElemLossFocus();
actionBtnCd();

//////////////////////////////////////////////////////
////////////////////// FONCTIONS /////////////////////
//////////////////////////////////////////////////////

// Récupére le panier avec localStorage, vérifie si il y a des produits obsolétes, puis le classe dans l'ordre alphabétique
function initialization() {

  // Récupération depuis locaStorage
  cartLinear = localStorage.getItem("cart");
  cartJson = JSON.parse(cartLinear);

  // ***********************************************************************
  // SIMULATION D'UNE EVOLUTION DES PRODUITS SUR LE SERVER 
  //  dataProductsServer[1]._id = "1234";
  //  dataProductsServer[2].colors[0] = "x";
  // ************************************************************************

  // Verifie si le produit du panier existe encore 'dataProductsServer'
  cartJson.forEach(i => {
    idOk = false; colorOk = false;
    var j = 0; again = true;
    while (j < dataProductsServer.length && again) {
      if (i.codeArt == dataProductsServer[j]._id) {
        idOk = true; again = false;
      }
      if (j < dataProductsServer.length && again) {
        j++;
      }
    };
    if (idOk) {

      // Si le produit du panier existe bien encore dans 'dataProductsServer'
      // => Vérifie que la couleur existe encore
      var k = 0;
      again = true;
      while (k < dataProductsServer[j].colors.length && again) {
        if (i.color == dataProductsServer[j].colors[k]) {
          colorOk = true; again = false;
        }
        if (k < dataProductsServer[j].colors.length && again) {
          k++;
        }
      }
    }

    // Maj de l'évolution eventuelle du produit avec la propriété 'evolution'
    if (idOk && colorOk) {
      i.evolution = "Idem";
    } else if (idOk && colorOk == false) {
      i.evolution = "Couleur OBSOLETE";
    }
    else if (idOk == false) {
      i.evolution = "Id OBSOLETE";
    }
  });
  saveCart();
};

// Pour chaque produit contenu dans le panier 'cartJson', MAJ des elements HTML du D.O.M
function UpdateElemsCartInHtml() {
  var item = 0;
  elemsHtmlProducts = "";
  while (item < cartJson.length) {

    // 1) Preparation des données avant la modification en dynamique
    // 1-1) Chargement des données d'origine à partir du 'cartJson' issu du localStorage
    id = cartJson[item].codeArt;

    // Définition par défaut des éléments HTML, concernant nom, couleur, et selection Qt
    nameProductHtml = cartJson[item].nameProd;
    colorHtml = cartJson[item].color;
    priceProduct = cartJson[item].priceProduct;
    classElemSelectQtProd = `class = "itemQuantity"`;
    classElemNameProduct = "";
    classElemEvolColorProduct = "";
    classAndTypeEdgeColorProduct(cartJson[item].color);

    // Charge l'adresse Url de l'image, et le prix.
    picturePriceApiDepId(id);

    // 1-2) MAJ du style et modification éventuelle des données d'origines précédentes, en fonction de la proprieté 'evolution' 
    if (cartJson[item].evolution == "Couleur OBSOLETE") {

      //   1-2-1) Cas ou il existe une évolution, uniquement sur la couleur
      //    => 1-2-1-1) On indique que la couleur est obsoléte
      colorHtml = "La couleur " + cartJson[item].color + " est OBSOLETE";

      //       1-2-1-2) On ajoute la classe "obsolete", pour que l'élément 'colorHtml' soit rouge sur fond jaune
      classElemEvolColorProduct = `class = "obsolete"`;

      //       1-2-1-3) On met le prix du produit à zero pour ne pas influencer le calcul du prix total
      priceProduct = 0;
    } else if (cartJson[item].evolution == "Id OBSOLETE") {

      //    1-2-2) Cas ou le produit est obsoléte
      //    => 1-2-2-1) Modification de 'nameProductHtml'
      nameProductHtml = "Le produit " + cartJson[item].nameProd + " est devenu OBSOLETE";

      //        1-2-2-2) On utilise la classe "obsolete", pour que le style CSS soit couleur rougr sur fond jaune
      classElemNameProduct = `class = "obsolete"`;

      //      1-2-2-3) On met le prix du produit à zero pour ne pas influencer le calcul du prix total
      priceProduct = 0;
    }
    if (cartJson[item].evolution != "Idem") {

      //      1-2-2-4) Si le produit est obsoléte => On ajoute la classe 'hideselect' pour masquer la  selection de la qt, afin d'éviter de la modifier
      classElemSelectQtProd = `class = "itemQuantity hideselect"`;
    }
    //      1-2-2-5) Charge la qt du produit  
    qtProduct = cartJson[item].qt;
    updateElemHtmlWithCart(item)
    item++
  };

  // Modifie le HTML dans le D.O.M, en 1 fois, en insérant 'elemsHtmlProducts'
  document.querySelector("#cart__items").innerHTML = elemsHtmlProducts;
}

// Concaténe les élements HTML concernant les produits du panier dans 'elemsHtmlProducts'
function updateElemHtmlWithCart(item) {
  elemsHtmlProducts +=
    `<article class="cart__item" data-id="${id}" data-color="${cartJson[item].color}">
    <div class="cart__item__img">
     <img src="${pictureUrlProduct}" alt="${cartJson[item].nameProd}" ${classAndTypeEdgeColorProduct(cartJson[item].color)}>
    </div>
    <div class="cart__item__content">
     <div class="cart__item__content__description">
        <h2 ${classElemNameProduct}>${nameProductHtml}</h2>
        <p ${classElemEvolColorProduct}>${colorHtml}</p>
        <p>${priceProduct} €</p>
     </div>
     <div class="cart__item__content__settings">
       <div class="cart__item__content__settings__quantity">
          <p>Qté : ${cartJson[item].qt}</p>
         <input type="number" ${classElemSelectQtProd} name="itemQuantity" min="1" max="100" value=${cartJson[item].qt}>
       </div>
       <div class="cart__item__content__settings__delete">
         <p class="deleteItem">Supprimer</p>
       </div>
     </div>
    </div>
  </article>`
};

 // A chaque sortie de focus, vérifie la sasie des champs du formulaire, et si non ok, affiche un message d'erreur.
function controlElemLossFocus() {
  document.addEventListener("focusout", even => {
    even.preventDefault();
    elemFocusPerdu = even.target;
    idElemFocusPerdu = even.target.id;
    if (idElemFocusPerdu != undefined && idElemFocusPerdu != '') {
      ChecksEveryInputForm(even.target);
    }
    displayBtnorderAccordInputStatus();
  });
};

//Vérifie la saisie du formulaire en cours
function ChecksEveryInputForm(elemSaisieFormulaire) {
  idElemSaisieFormulaire = elemSaisieFormulaire.id;
  if (idElemSaisieFormulaire != undefined && idElemSaisieFormulaire != '') {
    if (idElemSaisieFormulaire == "firstName" || idElemSaisieFormulaire == "lastName") {
      if (idElemSaisieFormulaire == "firstName") {
        typeInput = "Prenom";
        prenom = elemSaisieFormulaire.value;
      } else {
        typeInput = "Nom";
        nom = elemSaisieFormulaire.value;
      }

      // Teste la saisie 'Prénom' ou 'Nom' avec la méthode regex
      compRegex = /(^[A-Z]{1})([a-z]*)(?![A-Z])\D$/g;
      validOnResultRegex(elemSaisieFormulaire, elemSaisieFormulaire.value, compRegex);

      // Met à jour le message d'erreur correspondant à la saisie du formulaire
      if (ValidRegex == false && elemSaisieFormulaire.value != "") {
        elemerrorMessSaisie.innerText =
          `Saisie du ${typeInput} incorrecte.Le ${typeInput} doit commencer par une lettre majuscule, puis ne doit contenir uniquement que des lettres minuscules.`;
      }
    } else if (idElemSaisieFormulaire == "address") {

      // Teste la saisie adresse avec la méthode regex
      compRegex = /^[0-9a-zA-Z\:,-]+[^<>?%¤!$#²*§£µ€\\\^\]\[\]\{\}~]+$/g;
      adresse = elemSaisieFormulaire.value;
      validOnResultRegex(elemSaisieFormulaire, adresse, compRegex);

      // Met à jour le message d'erreur correspondant à la saisie du formulaire
      if (ValidRegex == false && elemSaisieFormulaire.value != "") {
        elemerrorMessSaisie.innerText =
          "Saisie adresse incorrecte.Eviter les caractéres spéciaux suivants : <>?%¤!$#²*§£µ€\^[]{}~";
      }
    } else if (idElemSaisieFormulaire == "city") {

      // Teste la saisie de la ville avec la méthode regex
      compRegex = /^[0-9]{5}\ [A-Z]([a-z]*\D)$/g;
      ville = elemSaisieFormulaire.value;
      validOnResultRegex(elemSaisieFormulaire, ville, compRegex);
      if (ValidRegex == false && elemSaisieFormulaire.value != "") {

        //Si saisie 'Ville' non valide => Affiche le message d'erreur
        elemerrorMessSaisie.innerText =
          "Saisie de la ville incorrecte.La ville doit commencer par son N° de code postal (5 chiffres),puis espace, puis le nom de la ville doit être du même type que 'Prénom' ou 'Nom";
      }
    } else if (idElemSaisieFormulaire == "email") {

      // Teste la saisie de l'email avec la méthode regex
      compRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      email = elemSaisieFormulaire.value;
      validOnResultRegex(elemSaisieFormulaire, email, compRegex)
      if (ValidRegex == false && elemSaisieFormulaire.value != "") {

        //Si saisie 'Email' non valide => Affiche le message d'erreur
        elemerrorMessSaisie.innerText =
          "Saisie email incorrecte.Commence par 2 groupes de letrre et/ou chiffres contenant 1 ou des '.' non à suivre , séparés par '@', puis se termine avec '.' puis 2 ou 3 letrres.";
      };
    };
  };
};

// Controle chaque saisie du formulaire  en temps réel 
function controlFormEntry() {
  document.addEventListener("input", even => {
    even.preventDefault();

    // Verifie digit par digit 
    ChecksEveryInputForm(even.target);
    displayBtnorderAccordInputStatus();
  });
};

//Validation de la saisie (vert = Ok, Rouge = Non Ok), en fonction du regex correspondant
function validOnResultRegex(elem, contenuSaisie, compRegex) {

  //Efface d'abord le message d'erreur correspondant
  elemerrorMessSaisie = document.getElementById(elem.id + "ErrorMsg");
  elemerrorMessSaisie.innerText = "";

  // Si saisie ok et non vide
  if (compRegex.test(contenuSaisie) || contenuSaisie == "") {
    elem.style.color = "green";
    return ValidRegex = true;
  } else {

    // Si non OK avec une saisie non vide => Colore la saisie en rouge
    elem.style.color = "red";
    return ValidRegex = false;
  };
};

// Récupére 'pictureUrlProduct' et 'priceProduct', correspondants à l'id issu du data des produits de l'API 'dataProductsServer'
function picturePriceApiDepId(id) {
  var i = 0;
  idFound = false;
  while (i < dataProductsServer.length && idFound == false) {
    if (id == dataProductsServer[i]._id) {
      pictureUrlProduct = dataProductsServer[i].imageUrl;
      priceProduct = dataProductsServer[i].price;
      idFound = true;
    }
    i++
  }
  if (idFound == false) {

    // Si 'id' n'a pas été trouvé => Prends par défaut le logo comme image de canapé
    pictureUrlProduct = "../images/logo.png";
  };
};

// Modifie la QT d'un produit
function modifqtProduct() {
  selectQt = document.querySelectorAll('div.cart__item__content__settings__quantity>input')
  selectQt.forEach(item => {
    item.addEventListener("change", even => {
      even.preventDefault();

      // Recherche de l'id 'idDOM' et de la couleur 'colorODM' correspondants dans le D.O.M
      elemProdCorresondant = even.target.closest("section>article");

      // Recupération depuis le D.O.M via le dataset 
      idDOM = elemProdCorresondant.dataset.id;
      colorDom = elemProdCorresondant.dataset.color;

      //Pour chaqque produit du panier 'cartJson'
      var i = 0; again = true;
      qtProduct = item.valueAsNumber;
      if (isNaN(qtProduct) || qtProduct < 0) {
        qtProduct = 0;
        item.valueAsNumber = 0;
      }
      while (i < cartJson.length && again) {
        if (cartJson[i].codeArt == idDOM && cartJson[i].color == colorDom) {

          // Si l'id et la couleur sont identiques => MAJ de la Qt dans le panier
          cartJson[i].qt = qtProduct

          // Récupére l'élément parent contenant l'enfant <p>
          elem = even.target.closest("section>article>div>div>div");

          //Recherche l'enfant <p> contenu dans l'élément parent
          for (let enfant of elem.children) {
            if (enfant.nodeName = 'p') {

              // Maj de la Qt
              enfant.innerText = "Qté : " + qtProduct;
            }
          }
          again = false;
        };
        i++
      };
      saveCart();
      displayBtnorderAccordInputStatus();
      calcTotalQtPrices();
    });
  });
};

// Definie la classe du type et de la ou les couleurs de bordure
function classAndTypeEdgeColorProduct(colorProduct) {
  if (colorProduct.includes("/")) {

    // 1) Si 'colorProduct' contient '/' => Cas bordure bicolore
    // 1-1) Définition firstColor puis secondColor
    posiSep = colorProduct.indexOf("/");
    firstColor = colorProduct.substring(0, posiSep)
    secondColor = colorProduct.substring(posiSep + 1, colorProduct.length)
    return ` class = "pictureEdge" style = "border-top-color: ${firstColor}; border-bottom-color: ${firstColor};
    border-left-color : ${secondColor}; border-right-color: ${secondColor};"`
  } else {

    // 2) bordure continue si colorProduct unique
    return ` class = "pictureEdge" style = "border-color :${colorProduct};"`
  }
};

// Supprime un produit
function deleteProduct() {
  document.querySelectorAll('.deleteItem').forEach(item => {
    item.addEventListener("click", even => {
      even.preventDefault();

      // Recuperation de l'element du D.O.M correspondant au produit à supprimer
      elemSuppr = even.target.closest("section>article");

      // Recupération de l'id et de la couleur depuis le D.O.M via le dataset 
      idDOM = elemSuppr.dataset.id;
      colorDom = elemSuppr.dataset.color;

      // Suppression de l'element dans le D.O.M
      elemSuppr.remove();

      // Suppresion du produit correspondant dans 'cartJson'
      var i = 0; again = true;
      while (i < cartJson.length && again) {
        if (cartJson[i].codeArt == idDOM && cartJson[i].color == colorDom) {
          delete cartJson[i];
          delItemsNullInCart();
          if (cartJson.length == 0) {
            localStorage.removeItem("cart");
          }
          again = false;
        };
        i++
        if (localStorage.cart == undefined) {
          window.location.href = "../html/index.html"
        }
      };
      calcTotalQtPrices();
      displayBtnorderAccordInputStatus();
    });
  });
};

// Sauvedarde du panier dans localStorage
function saveCart() {
  cartLinear = JSON.stringify(cartJson);
  localStorage.setItem("cart", cartLinear);
};

// Supprime definitivement les items effacés ( = 'null' ) dans le panier 'cartJson'
function delItemsNullInCart() {
  cartLinear = JSON.stringify(cartJson);
  var i = 0;
  while (cartLinear.indexOf(`,null`) > 0 || cartLinear.indexOf(`null,`) > 0 || cartLinear.indexOf(`null`) > 0) {
    cartLinear = cartLinear.replace(`,null`, "");
    cartLinear = cartLinear.replace(`null,`, "");
    cartLinear = cartLinear.replace(`null`, "");
    i++
  };
  cartJson = JSON.parse(cartLinear);
  saveCart();
};

// Calcule et affiche les totaux des prix et Qt de tous les produits
function calcTotalQtPrices() {

  // Calcul des totaux en bouclant avec 'cartJson'
  let totalQt = 0;
  let totalPrix = 0;
  cartJson.forEach(item => {
    totalQt = totalQt + item.qt;
    // Récupération du prix avec l'id ( = 'codeArt' dans 'dataProduits')
    picturePriceApiDepId(item.codeArt);
    totalPrix = totalPrix + item.qt * priceProduct;
  });
  // Mise à jour des totaux de Qt et prix dans le D.O.M
  elemTotalQt = document.getElementById("totalQuantity");
  elemTotalQt.innerHTML = totalQt;
  elemTotalPrix = document.getElementById("totalPrice");
  elemTotalPrix.innerHTML = totalPrix;
}

// Affiche l'état du bouton de commande, suivant l'état de validité du formulaire.
function displayBtnorderAccordInputStatus() {

  if (inputSatusOk()) {
    btnCommande.classList = "yesHover";
    btnCommande.title = "Génére la commande"
    btnCommande.enable = true;
  } else {

    // Si la saisie n'est pas validée => Bouton de commande en grisé
    btnCommande.classList = "noHover";

    // Maj de l'infobulle en fonction des erreurs de saisie
    if (errorMessQtNull != "" || errorMessObsolete != "") {

      // Préviens si le produit et obsoléte et/ou si un produit contient une qt =0
      infoBulle = `*Attention* la commande ne pourra être validée`
      if (errorMessObsolete != "") {
        infoBulle = `${infoBulle}\r
       - il existe un ou des produit(s) obosoléte(s).`
      }
      if (errorMessQtNull != "") {
        infoBulle = `${infoBulle}\r
       - il existe un ou des produit(s) avec Qté = 0 .`
      }
    } else {

      // Sinon demande de mieux renseigner le formulaire
      infoBulle = "Finir de renseigner correctement le formulaire."
    };
    btnCommande.title = infoBulle;
  }
};

// Action du bouton de commande avec touche 'enter' ou click
function actionBtnCd() {
  btnCommande.addEventListener("keypress", even => {
    even.preventDefault();
    if (even.key = 'Enter') {
      requeteInfoCd();
    }
  })
  btnCommande.addEventListener("click", even => {
    even.preventDefault();
    requeteInfoCd();
  });
};

// Si la saisie du panier est validé, envoie de la requête 'order'à l'API Fetch,
// et si ok récupére la réponse du serveur = 'orderID', puis appelle la page 'confirmatiino' en transmettant 'orderID' via le lien
function requeteInfoCd() {
  if (inputSatusOk()) {

    // Création de l'objet 'Contact'
    contact = {
      "firstName": prenom,
      "lastName": nom,
      "address": adresse,
      "city": ville,
      "email": email
    }
    // Création du tableasu array 'products'
    let productsID = [];
    cartJson.forEach(produit => {
      productsID.push(produit.codeArt);
    });
    // Regroupement dans l'objet 'order'
    order = {
      "contact": contact,
      "products": productsID
    }
    //envoie de l'info commande 'order' au serveur
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(response => {
        orderID = response.orderId;
        window.location.href = "../html/confirmation.html?orderID=" + orderID
      })
      .catch(function (err) {

      // Affiche l'erreur de l'API
      alert(`l'erreur` + err + ` est survenue sur le serveur.
      Nous faisons notre possible pour remédier à ce probléme.
      N'hesitez pas à revenir plus tard sur le site, vous serez les bienvenus.
      Merci pour votre comprehension.`)
      });
  } else {
    alert(errorMessage);
  };
};

// Valide ou non l'état de saisie du panier
function inputSatusOk() {

  // Verifie qu'il n'y a pas de message d'erreur
  elemerrorMessFormulaire = document.querySelectorAll(".cart__order__form__question p");

  // Par défaut, on considére qu'il n'y a auncun message d'erreur
  errorMessInputStatus = "";

  // Vérifie si il existe un message d'erreur concernant une saisie de formulaire
  elemerrorMessFormulaire.forEach(even => {
    if (even.innerText != "") {
      // Si au moins un message est affiché => Les saisies du formulaire ne sont pas valides
      errorMessInputStatus = "Il reste une/des saisie(s) non correctement renseignée(s)."
    }
  });

  // Vérifie si il n'y a aucune saisie de renseignée
  champsSaisies = document.querySelectorAll(".cart__order__form__question input");

  // Par défaut, on considére que toutes les saisies sont faites.
  errorMessInputEmpty = "";
  champsSaisies.forEach(even => {

    // Si au moins un message est affiché => Les saisies du formulaire ne sont pas valides
    if (even.value == '') {
      errorMessInputEmpty = "Il reste une/des saisie(s) à renseigner."
    }
  });
  cartJson.forEach(item => {

    //Par défaut, on considére pas d'evolution avant verification
    errorMessObsolete = "";

    // Vérifie si tous les produits sont encore d'actualité
    if (item.evolution != "Idem") {
      errorMessObsolete = "il existe un ou des produit(s) obosoléte(s)";
    }

    //Par défaut toutes les qt de produits sont >0
    errorMessQtNull = "";

    // Verifie que tous les produits ont une Qt > 0 
    if (item.qt == 0) {
      errorMessQtNull = "il existe un ou des qt de produit(s) = 0";
    }
  });

  // Retourne vrai, si aucune erreur n'est rencontrée
  if (errorMessObsolete == "" && errorMessInputStatus == "" && errorMessInputEmpty == "" && errorMessQtNull == "") {
    return true
  } else {

    //Sinon, renseigne les erreurs trouvées, et retourne faux
    errorMessage = "La commande ne peut-être envoyée car il reste encore une/des erreur(s) suivante(s):";
    if (errorMessObsolete != "") { errorMessage += `\r- ${errorMessObsolete}` };
    if (errorMessQtNull != "") { errorMessage += `\r- ${errorMessQtNull}` };
    if (errorMessInputStatus != "") { errorMessage += `\r- ${errorMessInputStatus}` };
    if (errorMessInputEmpty != "") { errorMessage += `\r- ${errorMessInputEmpty}` };
    return false
  }
};
