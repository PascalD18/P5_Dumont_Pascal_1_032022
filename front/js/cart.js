//Définition des variables globales
//Déclare la variable l'ojet json  = Panier des produits
let cartJson;
// Déclare la validation par regex
let ValidRegex;
// Déclare l'élément correspondant comme bouton de commande 
const btnCommande = document.getElementById("order");
// Charge la base de donnée des produits 'bddProuitsServer depuis l'API
// Si l'utilisateur ouvre directement la page 'cart.html' concernant le panier.
// et que entre-temps les produits ont évolués sur le serveur
// => Si cette base de données reste en locaStorage, une évolution éventuelle des produits
// sur le server, ne sera pas prise en compte.
fetch("http://localhost:3000/api/products/")
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then(response => {
    dataProductsServer = response;
    // Définie 'cartJson' à partir de localStorage
    // En ajoutant la propriété 'evolution' pour prendre en compte les produits qui peuvent être devenus obsolétes
    // Définie également 'btnCommande' qui sera utilisé dans des fonctions à venir
    initialization();
    // Classe la base de données des produits issue du serveur
    sortDataProducts();
    // Affiche en dynamique les produits dans le html du D.O.M
    MajElemHtmlDOMavecPanier();
    // Detecte la modification de la qt d'un produit
    // et la met à jour dans le panier 'cartJson'
    modifqtProduct();
    // Detecte la suppression d'un produit 
    // Le supprimme du html du D.OM et également dans le panier 'cartJson'
    suppressionProduit();
    // Calcule et affiche le prix total de tous les produits du panier
    majTotauxQtPrix();
    // Gére l'affichage du bouton commande en fonction de :
    // - l'etat des saisies du formulaire
    // - Si il existe d'éventuels prouits obsolétes contenus dans le panier 'cartJson'
    // - Si les qt des produits du paniers sont tous >0
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
  //   dataProductsServer[2].colors[0] = "x";
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
function MajElemHtmlDOMavecPanier() {
  var item = 0;
  while (item < cartJson.length) {

    // Pour chaque produit contenu dans le panier 'cartJson', MAJ des elements HTML du D.O.M
    // 1) Preparation des données avant la modification en dynamique
    // 1-1) Chargement des données d'origine à partir du 'cartJson' issu du localStorage
    id = cartJson[item].codeArt;

    //    Affichage de certaines données en fonction de l'évolution du produit par rapport au panier existant
    //    'nameProductHtml', 'couleur' et 'priceProduct' idems à celui contenu dans 'cartJson'
    nameProductHtml = cartJson[item].nameProd;
    couleurHTML = cartJson[item].color;
    priceProduct = cartJson[item].priceProduct;

    //    Definit le style à ajouter dans l'élément <img> pour définir la bordure de la couleur du canapé
    styleBordureCouleur(cartJson[item].color);

    //    Charge l'addresse Url de l'image, et le prix.
    picturePriceApiDepId(id);

    // 1-2) MAJ du style et modification éventuelle des données d'origines précédentes 
    //      en fonction de la proprieté 'evolution'
    //      Par défaut on affiche sans style particulier
    stylenameProductHtml = ""; styleCouleurHTML = "";

    //   1-2-1) Cas ou il existe une évolution, uniquement sur la couleur => Modification de 'couleurHTML'
    //    => 1-2-1-1) On indique que la couleur est obsoléte
    if (cartJson[item].evolution == "Couleur OBSOLETE") {
      couleurHTML = "La couleur " + cartJson[item].color + " est OBSOLETE";

      //       1-2-1-2) On utilise un style de couleur rouge sur fond jaune
      styleCouleurHTML = `style="color: red; font-weight: 800; background-color: yellow; text-align:center;"`;

      //       1-2-1-3) On met le prix du produit à zero pour ne pas influencer le calcul du prix total
      priceProduct = 0;
    } else if (cartJson[item].evolution == "Id OBSOLETE") {

      //    1-2-2) Cas ou le produit est obsoléte
      //    => 1-2-2-1) Modification de 'nameProductHtml'
      nameProductHtml = "Le produit " + cartJson[item].nameProd + " est devenu OBSOLETE";

      //        1-2-2-2) On utilise un style de couleur rouge sur fond jaune
      stylenameProductHtml = `style="color: red; font-weight: 800; background-color: yellow; text-align:center;"`;

      //      1-2-2-3) On met le prix du produit à zero pour ne pas influencer le calcul du prix total
      priceProduct = 0;
    }
    //      1-2-2-4) Affichage du la selection de la qt ( element <input>)
    //               uniquement si le produit n'est pas obosoléte
    if (cartJson[item].evolution == "Idem") {

      //      1-2-2-4-1) Si le produit n'est pas obsoléte => Pas de masquage de la selection de qt
      masqueSelectQtProd = "";
    } else {
      //      1-2-2-4-2) Sinon on masque l'élément HTML concernant la selection des qt 
      //                 Ne masque pas la qt d'origne, et évite de la modifier
      masqueSelectQtProd = `style ="display: none;"`
    }
    //      1-2-2-5) Charge la qt du produit 
    qtProduct = cartJson[item].qt;

    // 2) Modification dynamique avec la prise en compte des données
    //    définies et chargées en fonction des datas contenues dans le panier
    updateElemHtmlWithCart(item)
    item++
  };
}
function MajElemHtmlDOMavecPanierMeth1(item) {
  // Affichage du produit 'cartJson[item]'
  // en utilisant la méthode d'API DOM HTML
  // Par défaut, considére le produit non obsoléte
  produitOk = true;
  // Avec la méthode de manipulation des éléments du HTML dans le D.O.M
  // Ajoute l'élément <article> dans <Section id="cart__items">
  parent = document.getElementById("cart__items");
  enfant = document.createElement("article");
  enfant.classList = "cart__item";
  parent.appendChild(enfant);
  // => on obtient :
  // <article class="cart__item">
  // </article> 
  // Renseigne 'id' et 'color' dans la balise <article> avec [data-]
  enfant.dataset.id = id;
  enfant.dataset.color = couleurHTML;
  // On obtient :
  // <article class="cart__item" data-id="[id]" data-color ="[couleur]">
  // Ajoute l'élément <div> dans l'élément <article>
  parent_1 = enfant;
  enfant = document.createElement("div");
  enfant.classList = "cart__item__img";
  parent_1.appendChild(enfant);
  // On obtient:
  // <div class="cart__item__img">
  // </div>
  // Maj url de l'image et style css de la bordure de couleur = 'defBordureImage' dans l'élément <img>
  enfant.innerHTML = "<img src =" + pictureUrlProduct + " alt =" + cartJson[item].nameProd + defBordureImage
  // Ajoute un 2éme élément <div> dans l'élément  <article>
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content"
  parent_1.appendChild(enfant);
  // On obtient :
  // <div class ="cart__item__content>
  // </div>
  parent_1_1 = enfant;
  // Ajoute un élément <div> dans cet 'élément <div>
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__description";
  parent_1_1.appendChild(enfant);
  // On obtient :
  // <div class ="cart__item__content_description>
  // </div>
  parent_1_1_1 = enfant;
  // Ajoute l'élément <h2> dans cet élément <div> et renseigne le nom du produit
  enfant = enfant = document.createElement("h2");
  if (cartJson[item].nameProd.includes("OBSOLETE")) {
    // Si le produit est obsolete
    // => Affiche 'OBSOLETE' en rouge sur fond jaune
    produitOk = false;
    enfant.style = "color: red; font-weight: 800; background-color: yellow; text-align:center;"
  }
  enfant.innerHTML = cartJson[item].nameProd;
  parent_1_1_1.appendChild(enfant);
  // On obtient:
  //<h2>[Nom du produit]</h2>
  // Ajoute l'élément <p> dans cet élément <div> et renseigne la couleur
  enfant = document.createElement("p");
  if (cartJson[item].color.includes("OBSOLETE")) {
    // Affiche 'OBSOLETE' en rouge sur fond jaune si la couleur est obsolete
    produitOk = false;
    enfant.style = "color: red; font-weight: 800; background-color: yellow; text-align:center;"
  }
  enfant.innerHTML = cartJson[item].color;
  parent_1_1_1.appendChild(enfant);
  //On obtient:
  //<p>[couleur]</p>
  // Ajoute l'élément <p> dans cet élément <div> et renseigne le prix
  enfant = document.createElement("p");
  if (produitOk) {
    enfant.innerHTML = priceProduct + " €";
  } else {
    enfant.innerHTML = 0 + " €";
  }
  parent_1_1_1.appendChild(enfant);
  // On obtient:
  // <p>[prix en €]</p>
  // Ajoute un élément <div> dans l'élément <div class="cart__item__content">
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__settings";
  parent_1_1.appendChild(enfant);
  // On obtient :
  // <div class="cart__item__content__settings">
  //</div>
  // Ajout d'un l'élément <div> dans cet élément
  parent_1_1_2 = enfant;
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__settings__quantity";
  parent_1_1_2.appendChild(enfant);
  // On obtient:
  // <div class="cart__item__content__settings__quantity>
  //</div>
  // Ajout d'un l'élément <p> dans cet élément
  parent_1_1_2_1 = enfant;
  enfant = document.createElement("p");
  enfant.innerHTML = "Qté : " + qtProduct;
  parent_1_1_2_1.appendChild(enfant);
  // On obtient:
  //<p>[quantité] : </p>
  // Ajoute l'éléménet <input> dans 
  enfant = document.createElement("input");
  enfant.type = "number";
  enfant.classList = "itemQuantity";
  enfant.name = "itemQuantity";
  enfant.min = "1"; enfant.max = "100";
  enfant.value = qtProduct;
  parent_1_1_2_1.appendChild(enfant);
  // Ajoute un élement <div> dans l'élément <div> de classe 'cart__item__content__settings'
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__settings__delete";
  parent_1_1_2.appendChild(enfant);
  // on obtient:
  //<div class="cart__item__content__settings__delete
  //<div>
  //Ajoute un élément <p> dans cet élément <div>
  parent_1_1_2_2 = enfant;
  enfant = document.createElement("p");
  enfant.classList = "deleteItem";
  enfant.innerHTML = "Supprimer";
  parent_1_1_2_2.appendChild(enfant);
  //On obtient:
  // <p class="deleteItem">Supprimer</p>
};
function updateElemHtmlWithCart(item) {
  // Mise a jour des elements HTML du D.O.M concernant les produits
  // en écrivant directement le HTML et en y insérant les datas corresdant à chaque produit contenu dans le panier
  document.querySelector("#cart__items").innerHTML +=
    `<article class="cart__item" data-id="${id}" data-color="${cartJson[item].color}">
    <div class="cart__item__img">
     <img src="${pictureUrlProduct}" alt="${cartJson[item].nameProd}" ${styleBordureCouleur(cartJson[item].color)} >
    </div>
    <div class="cart__item__content">
     <div class="cart__item__content__description">
        <h2 ${stylenameProductHtml}>${nameProductHtml}</h2>
        <p ${styleCouleurHTML}>${couleurHTML}</p>
        <p>${priceProduct} €</p>
     </div>
     <div class="cart__item__content__settings">
       <div class="cart__item__content__settings__quantity">
          <p>Qté : ${cartJson[item].qt}</p>
         <input ${masqueSelectQtProd} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cartJson[item].qt}>
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

function modifqtProduct() {
  // Modification du panier en fonction de l'element 'Supprimer' cliqué dans le D.O.M
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
      majTotauxQtPrix();
    });
  });
};
function styleBordureCouleur(couleur) {
  // => Ajoute la bordure de l'image pour completer la modification du D.O.M
  if (couleur.includes("/")) {
    //Si 'couleur' contient '/' => Cas produit bicolor
    //Définition 1ére couleur
    posiSep = couleur.indexOf("/");
    premCouleur = couleur.substring(0, posiSep)
    // Définition couleur suivante
    couleurSvt = couleur.substring(posiSep + 1, couleur.length)
    defBordureImage = ` style= "border-style: solid; border-right-color: ` + premCouleur + `; border-left-color: ` + premCouleur + `;
     border-top-color: `+ couleurSvt + `; border-bottom-color: ` + couleurSvt + `; border-width: 15px;"`
  } else {
    // 1 bordure continue si couleur unique
    defBordureImage = ` style= "border: solid ` + couleur + `; border-width: 15px;`
  }
  return defBordureImage + ` padding: 10px;"`
};

//**  */};
function suppressionProduit() {
  // Modification du panier en fonction de l'element 'Supprimer' cliqué dans le D.O.M
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
      majTotauxQtPrix();
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
function majTotauxQtPrix() {
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
function affEtatBtnCdSvtProduitsEtFormulaire() {
  // Affiche l'état du bouton de commande, suivant l'état de validité du formulaire.
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