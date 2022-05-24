//Déclare l'ojet json  = Panier des produits
let cartJson;

// Déclare la validation par regex
let ValidRegex;

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
    MajElemHtmlDOMavecPanier();
    modifqtProduct();
    suppressionProduit();
    calcTotalQtPrices();
    affEtatBtnCdSvtProduitsEtFormulaire();
  })
  .catch(function (err) {
    // Affiche l'erreur de l'API
    alert(`l'erreur` + err + ` est survenue sur le serveur.
    Nous faisons notre possible pour remédier à ce probléme.
    N'hesitez pas à revenir plus tard sur le site, vous serez les bienvenus.
    Merci pour votre comprehension.`)
  });

// Controle chaque saisie du formulaire  en temps réel 
controlSaisieFormulaire();
// Vérifie et identifie les erreurs de sasies et l'état de remplissage du formulaire
ControlSaisieSiPerteFocus();
// Déclenche la commande si le panier est à jour, et correctement renseigné
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

  // Verifie si le panier n'a pas de produits obsoletes par rapport à 'dataProductsServer'
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

      // Si le produit du panier existe bien dans 'dataProductsServer'
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
function MajElemHtmlDOMavecPanier() {
  var item = 0;
  elemsHtmlProducts="";
  while (item < cartJson.length) {


    // 1) Preparation des données avant la modification en dynamique
    // 1-1) Chargement des données d'origine à partir du 'cartJson' issu du localStorage
    id = cartJson[item].codeArt;

    // Définition par défaut des éléments HTML, concernant nom, couleur, et selection Qt
    nameProductHtml = cartJson[item].nameProd;
    colorHtml= cartJson[item].color;
    priceProduct = cartJson[item].priceProduct;
    classElemSelectQtProd = `class = "itemQuantity"`;
    classElemNameProduct ="";
    classElemColorProduct ="";

    //    Definit le style à ajouter dans l'élément <img> pour définir la bordure de la couleur du canapé
    styleBordureCouleur(cartJson[item].color);

    //    Charge l'addresse Url de l'image, et le prix.
    picturePriceApiDepId(id);

    // 1-2) MAJ du style et modification éventuelle des données d'origines précédentes 
    //      en fonction de la proprieté 'evolution' 
    if (cartJson[item].evolution == "Couleur OBSOLETE") {

    //   1-2-1) Cas ou il existe une évolution, uniquement sur la couleur => Modification de 'colorHtml'
    //    => 1-2-1-1) On indique que la couleur est obsoléte
      colorHtml = "La couleur " + cartJson[item].color + " est OBSOLETE";

      //       1-2-1-2) On ajoute la classe "obsolete", pour que l'élément 'colorHtml' soit rouge sur fond jaune
      classElemColorProduct = `class = "obsolete"`;

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

  // Modifie le HTML dans le D.O.M, en 1 fois, en insérant tous les éléments contenus dans 'elemsHtmlProducts'
  document.querySelector("#cart__items").innerHTML = elemsHtmlProducts;
}

// Concaténe les élements HTML concernant les produits du panier dans 'elemsHtmlProducts'
function updateElemHtmlWithCart(item) {
   elemsHtmlProducts+=
    `<article class="cart__item" data-id="${id}" data-color="${cartJson[item].color}">
    <div class="cart__item__img">
     <img src="${pictureUrlProduct}" alt="${cartJson[item].nameProd}" ${styleBordureCouleur(cartJson[item].color)} >
    </div>
    <div class="cart__item__content">
     <div class="cart__item__content__description">
        <h2 ${classElemNameProduct}>${nameProductHtml}</h2>
        <p ${classElemColorProduct}>${colorHtml}</p>
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
function ControlSaisieSiPerteFocus() {
  // A chaque sortie de focus
  // Vérifie la sasie des champs du formulaire, et si non ok, affiche un message d'erreur.
  document.addEventListener("focusout", even => {
    even.preventDefault();
    elemFocusPerdu = even.target;
    idElemFocusPerdu = even.target.id;
    if (idElemFocusPerdu != undefined && idElemFocusPerdu != '') {
      verifSaisieFormulaire(even.target);
    }
    affEtatBtnCdSvtProduitsEtFormulaire();
  });
};
function verifSaisieFormulaire(elemSaisieFormulaire) {
  //Identification de l'élement en cours de saisie
  idElemSaisieFormulaire = elemSaisieFormulaire.id;
  if (idElemSaisieFormulaire != undefined && idElemSaisieFormulaire != '') {
    // Ne verifie que les saisies du formulaire
    if (idElemSaisieFormulaire == "firstName" || idElemSaisieFormulaire == "lastName") {
      // Saisie 'Prénom' ou 'Nom'
      // Teste la saisie avec la méthode regex
      compRegex = /(^[A-Z]{1})([a-z]*)(?![A-Z])\D$/g;
      // Mémorise le Prenom ou le Nom
      if (idElemSaisieFormulaire == "firstName") { prenom = elemSaisieFormulaire.value };
      if (idElemSaisieFormulaire == "lastName") { nom = elemSaisieFormulaire.value };
      valideSvtRegex(elemSaisieFormulaire, elemSaisieFormulaire.value, compRegex);
      // Met à jour le message d'erreur correspondant à la saisie du formulaire
      if (ValidRegex == false && elemSaisieFormulaire.value != "") {
        elemMessErrSaisie.innerText =
          "Saisie du prénom incorrecte.Le prénom doit commencer par une lettre majuscule, puis ne doit contenir uniquement que des lettres minuscules.";
      } else {
        elemMessErrSaisie.innerText = "";
      }
    } else if (idElemSaisieFormulaire == "address") {
      // Saisie adresse
      // Teste la saisie avec la méthode regex
      compRegex = /^[0-9a-zA-Z\:,-]+[^<>?%¤!$#²*§£µ€\\\^\]\[\]\{\}~]+$/g;
      // Mémorise l'adresse
      adresse = elemSaisieFormulaire.value;
      valideSvtRegex(elemSaisieFormulaire, adresse, compRegex);
      // Met à jour le message d'erreur correspondant à la saisie du formulaire
      if (ValidRegex == false && elemSaisieFormulaire.value != "") {
        elemMessErrSaisie.innerText =
          "Saisie adresse incorrecte.Eviter les caractéres spéciaux suivants : <>?%¤!$#²*§£µ€\^[]{}~";
      } else {
        // Sinon, efface le message d'erreur 
        elemMessErrSaisie.innerText = "";
      }
    } else if (idElemSaisieFormulaire == "city") {
      //Saisie Ville
      // Teste la saisie avec la méthode regex
      compRegex = /^[0-9]{5}\ [A-Z]([a-z]*\D)$/g;
      // Mémorise la ville
      ville = elemSaisieFormulaire.value;
      valideSvtRegex(elemSaisieFormulaire, ville, compRegex);
      if (ValidRegex == false && elemSaisieFormulaire.value != "") {
        //Si saisie 'Ville' non valide => Affiche le message d'erreur
        elemMessErrSaisie.innerText =
          "Saisie de la ville incorrecte.La ville doit commencer par son N° de code postal (5 chiffres),puis espace, puis le nom de la ville doit être du même type que 'Prénom' ou 'Nom";
      } else {
        // Sinon, efface le message d'erreur 
        elemMessErrSaisie.innerText = "";
      }
    } else if (idElemSaisieFormulaire == "email") {
      // Saisie email
      // Teste la saisie avec la méthode regex
      compRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      // Mémorise l'email
      email = elemSaisieFormulaire.value;
      valideSvtRegex(elemSaisieFormulaire, email, compRegex)
      if (ValidRegex == false && elemSaisieFormulaire.value != "") {
        //Si saisie 'Email' non valide => Affiche le message d'erreur
        elemMessErrSaisie.innerText =
          "Saisie email incorrecte.Commence par 2 groupes de letrre et/ou chiffres contenant 1 ou des '.' non à suivre , séparés par '@', puis se termine avec '.' puis 2 ou 3 letrres.";
      } else {
        // Sinon, efface le message d'erreur 
        elemMessErrSaisie.innerText = "";
      }
    };
  };
};
// Controle les saisies dans les champs du formulaire
function controlSaisieFormulaire() {
  document.addEventListener("input", even => {
    //Saisie d'un digit dans un element 'input'
    even.preventDefault();
    // Verification digit par digit de la saisie d'un champs du formulaire 
    verifSaisieFormulaire(even.target);
    affEtatBtnCdSvtProduitsEtFormulaire();
  });

}
// affiche la saisie en cours en vert ou rouge selon la validité
function valideSvtRegex(elem, contenuSaisie, compRegex) {
  //Par défaut, efface le message d'erreur correspondant
  elemMessErrSaisie = document.getElementById(elem.id + "ErrorMsg");
  elemMessErrSaisie.innerText = "";
  // Teste le caractere saisi
  if (compRegex.test(contenuSaisie) || contenuSaisie == "") {
    // Si OK => Colore la saisie en vert
    elem.style.color = "green";
    return ValidRegex = true;
  } else {
    // Si non OK avec une saisie non vide => Colore la saisie en rouge
    elem.style.color = "red";
    return ValidRegex = false;
  };
};

// Récupére 'pictureUrlProduct' et 'priceProduct' issus des datas des produits de l'API 'dataProductsServer'
// correspondant à 'Id'
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
    //Si 'id' n'a pas été trouvé
    //=> Prends par défaut le logo comme image de canapé
    pictureUrlProduct = "../images/logo.png";
  };
};

// Modifie la QT d'un produit
function modifqtProduct() {
  selectQt = document.querySelectorAll('div.cart__item__content__settings__quantity>input')
  selectQt.forEach(item => {
    item.addEventListener("change", even => {
      even.preventDefault();
      // Recherche de l'id 'idDOM' et de la couleur 'couleurODM' correspondants dans le D.O.M
      // Recuperation de l'element du D.O.M contenant les 'data-id' et 'data-color'
      elemProdCorresondant = even.target.closest("section>article");
      // Recupération de l'id et de la couleur depuis le D.O.M via le dataset 
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
          // si l'id et la couleur sont identiques => MAJ de la Qt dans le panier
          cartJson[i].qt = qtProduct
          // MAJ de la Qt dans le HTML du D.O.M
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
      affEtatBtnCdSvtProduitsEtFormulaire();
      calcTotalQtPrices();
    });
  });
};
function styleBordureCouleur(couleur) {
  // => Ajoute la bordure de l'image pour completer la modification du D.O.M
  if (couleur.includes("/")) {
    
    // 1) Si 'couleur' contient '/' => Cas produit bicolor
    // 1-1) Définition 1ére couleur
    posiSep = couleur.indexOf("/");
    premCouleur = couleur.substring(0, posiSep)

    // 1-2) Définition couleur suivante
    couleurSvt = couleur.substring(posiSep + 1, couleur.length)
    defBordureImage = ` style= "border-style: solid; border-right-color: ` + premCouleur + `; border-left-color: ` + premCouleur + `;
     border-top-color: `+ couleurSvt + `; border-bottom-color: ` + couleurSvt + `; border-width: 15px;"`
  } else {

    // 2) bordure continue si couleur unique
    defBordureImage = ` style= "border: solid ` + couleur + `; border-width: 15px;`
  }
  return defBordureImage + ` padding: 10px;"`
};

// Supprime un produit
function suppressionProduit() {
  document.querySelectorAll('.deleteItem').forEach(item => {
    item.addEventListener("click", even => {
      even.preventDefault();
      // Recherche de l'id 'idDOM' et de la couleur 'couleurODM' correspondants dans le D.O.M
      // Recuperation de l'element du D.O.M correspondant au produit à supprimer
      elemSuppr = even.target.closest("section>article");
      // Recupération de l'id et de la couleur depuis le D.O.M via le dataset 
      idDOM = elemSuppr.dataset.id;
      colorDom = elemSuppr.dataset.color;
      // Suppression de l'element dans le D.O.M
      elemSuppr.remove();
      // Suppresion du produit corresondant dans 'cartJson'
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
      affEtatBtnCdSvtProduitsEtFormulaire();
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
  let totalQt = 0; let totalPrix = 0;
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
function affEtatBtnCdSvtProduitsEtFormulaire() {
  if (SaisiePanierOk()) {
    btnCommande.classList = "yesHover";
    btnCommande.style.backgroundColor = "#2c3e50";
    btnCommande.title = "Génére la commande"
  } else {
    btnCommande.classList = "noHover";
    btnCommande.style.backgroundColor = "grey";
    // Maj de l'infobulle en fonction des erreurs de saisie
    if (messErrqtProductNul != "" || messErrProdObsolete != "") {
      // Préviens d'abord si le produit et obsoléte et/ou si un produit contient une qt =0
      infoBulle = `*Attention* la commande ne pourra être validée`
      if (messErrProdObsolete != "") {
        infoBulle = `${infoBulle}\r
       - il existe un ou des produit(s) obosoléte(s).`
      }
      if (messErrqtProductNul != "") {
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
function requeteInfoCd() {
  if (SaisiePanierOk()) {
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
    alert(messErreur);
  };
};

function SaisiePanierOk() {
  if (cartJson == undefined) {
    return
  }
  // Renvoie l'etat de validation du formulaire
  // => true si ok ou false si le formulaire n'est pas correctement renseigné
  // Verifie qu'il n'y a pas de message d'erreur
  elemMessErrFormulaire = document.querySelectorAll(".cart__order__form__question p");
  messErrSaisieFormIncorrecte = ""; // Par défaut, on considére qu'il n'y a auncun message d'erreur
  // Vérifie si il existe un message d'erreur concernant une saisie de formulaire
  elemMessErrFormulaire.forEach(even => {
    if (even.innerText != "") {
      // Si au moins un message est affiché => Les saisies du formulaire ne sont pas valides
      messErrSaisieFormIncorrecte = "Il reste une/des saisie(s) non correctement renseignée(s)."
    }
  });

  // Vérifie si il n'y a aucune saisie de renseignée
  champsSaisies = document.querySelectorAll(".cart__order__form__question input");
  messErrSaisieVide = ""; // Par défaut, on considére que toutes les saisies sont faites.
  champsSaisies.forEach(even => {
    if (even.value == '') {
      // Si au moins un message est affiché => Les saisies du formulaire ne sont pas valides
      messErrSaisieVide = "Il reste une/des saisie(s) à renseigner."
    }
  });
  messErrProdObsolete = "";//Par défaut pas d'evolution avant verification
  messErrqtProductNul = "";//Par défaut toutes les qt de produits sont >0
  cartJson.forEach(item => {
    // Vérifie si tous les produits sont encore d'actualité
    if (item.evolution != "Idem") {
      messErrProdObsolete = "il existe un ou des produit(s) obosoléte(s)";
    }
    // Verifie que tous les produits ont une Qt > 0 
    if (item.qt == 0) {
      messErrqtProductNul = "il existe un ou des qt de produit(s) = 0";
    }
  });
  // Réponse en fonction des verifications
  if (messErrProdObsolete == "" && messErrSaisieFormIncorrecte == "" && messErrSaisieVide == "" && messErrqtProductNul == "") {
    return true
  } else {
    //Renseigne les erreurs rencontrées dans l'info bulle du bouton de commande
    messErreur = "La commande ne peut-être envoyée car il reste encore une/des erreur(s) suivante(s):";
    if (messErrProdObsolete != "") { messErreur += `\r- ${messErrProdObsolete}` };
    if (messErrqtProductNul != "") { messErreur += `\r- ${messErrqtProductNul}` };
    if (messErrSaisieFormIncorrecte != "") { messErreur += `\r- ${messErrSaisieFormIncorrecte}` };
    if (messErrSaisieVide != "") { messErreur += `\r- ${messErrSaisieVide}` };
    return false
  }
};