fetch("http://localhost:3000/api/products/")
  //Remise à jour de localStorage pour la Bdd des produits issue du serveur
  //Afin de comparer tous les produits du panier en localStorage

  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(tableauProduits => {
    classeBddProduits(tableauProduits);
  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("Erreur N°" + err);
    alert("l'erreur" + err + " est survenue sur le serveur. Nous faisons notre possible pour remédier à ce probléme.N'hesitez pas à revenir plus tard sur le site, vous serez les bienvenus.")

  })
// Variables globales
btnCommande = document.getElementById("order");
initialisation();
MajElemHtmlDOMavecPanier();
majTotauxQtPrix();
modifQtProduit();
suppressionProduit();
controlSaisieFormulaire();
controlValidationSaisiesFormulaire();
actionBtnCd()
majAffBtCd()
//////////////////////////////////////////////////////
////////////////////// FONCTIONS /////////////////////
//////////////////////////////////////////////////////
function initialisation() {
  //Définie l'etat des saisie non valides par défaut
  prenomValide = false; nomValide = false; adresseValide = false;
  villeValide = false; emailValide = false;
  //Initialise les saisies
  prenom = ""; nom = ""; adresse = "";
  ville = ""; email = "";
  // Récupére la base de donnée des produits avec le locaStorage
  // Récupération de la bdd de tous les produits
  if (localStorage.bddProduits != null) {
    bddProduitsLinea = localStorage.getItem("bddProduits");
    BddServProduits = JSON.parse(bddProduitsLinea);
  };
  // Récupére le panier existant
  panierLinea = localStorage.getItem("panier");
  panierJson = JSON.parse(panierLinea);

  // ** TEMPORAIRE **
  // ** SIMULATION D'UNE EVOLUTION DES PRODUITS SUR LE SERVER DANS LE CAS OU LE PANIER N'A PAS CHANGÉ DEPUIS LONGTEMPS **

  BddServProduits[2]._id = "1234";
  BddServProduits[5].colors[1] = "x";
  // ****

  //Verifie si le panier est toujours d'actualité par rapport à 'BddServProduits'
  panierJson.forEach(i => {
    idOk = false; couleurOk = false; styleAffQTProduit = ``;
    var j = 0; continuer = true;
    while (j < BddServProduits.length && continuer == true) {
      if (i.codeArt == BddServProduits[j]._id) {
        idOk = true; continuer = false;
      }
      if (j < BddServProduits.length && continuer) {
        j++;
      }
    };
    if (idOk == true) {
      // Si le produit du panier existe bien dans 'bddServProduits'
      // => Vérifie que la couleur existe encore
      var k = 0; continuer = true;
      while (k < BddServProduits[j].colors.length && continuer) {
        if (i.couleur == BddServProduits[j].colors[k]) {
          couleurOk = true; continuer = false;
        }
        if (k < BddServProduits[j].colors.length && continuer) {
          k++;
        }

      }
    }
    //Maj de l'évoution eventuelle du produit dans la propriété 'evolution'
    if (idOk && couleurOk) {
      i.evolution = "Idem";
    }
    else if (idOk && couleurOk == false) {
      i.evolution = "Couleur OBSOLETE";
    }
    else if (idOk == false) {
      i.evolution = "Id OBSOLETE";
    }
  });
  sauvegardePanier();
};
function MajElemHtmlDOMavecPanier() {
  var item = 0;
  while (item < panierJson.length) {
    // MAJ des elements HTML du D.O.M pour chaque produit contenu dans le panier 'panierJson'
    // Récupére les données à partir du 'panierJson' issu du localStorage
    id = panierJson[item].codeArt;
    // Affichage de la couleur en fonction de l'évolution du produit par rapport au panier existant
    // 'NomProd', 'couleur' et 'prixProduit' idems à celui contenu dans 'panierJson'
    nomProd = panierJson[item].nomProd;
    couleur = panierJson[item].couleur;
    prixProduit = panierJson[item].prixProduit;
    // Definit le style à ajouter dans l'élément <img> pour définir la bordure de la couleur du canapé
    styleBordureCouleur(couleur);
    //Par défaut on affiche sans style couleur rouge sur fond jaune
    styleNomProdObsolete = ""; styleCouleurObsolete = "";
    commentCouleur=panierJson[item].couleur;
    //Si il existe une évolution, on affiche rouge sur fond jaune
    if (panierJson[item].evolution == "Couleur OBSOLETE") {
      //Sinon, on indique que la couleur est obsolete
      commentCouleur = "La couleur " + panierJson[item].couleur + " est OBSOLETE";
      //Pour afficher le couleur avec couleur rouge sur fond jaune
      styleCouleurObsolete = `style="color: red; font-weight: 800; background-color: yellow; text-align:center;"`;
      prixProduit = 0;
    }
    else if (panierJson[item].evolution == "Id OBSOLETE") {
      nomProd = "Le produit " + panierJson[item].nomProd + " est devenu OBSOLETE";
      //Pour afficher le nom du produit avec couleur rouge sur fond jaune
      styleNomProdObsolete = `style="color: red; font-weight: 800; background-color: yellow; text-align:center;"`;
      prixProduit = 0;
    }
    if (panierJson[item].evolution == "Idem") {
      styleAffQTProduit = "";
    }
    else {
      styleAffQTProduit = `style ="display: none;"`
    }
    qtProduit = panierJson[item].qt;
    // Recupére l'addresse Url de l'image, le Nom du produit, et le prix.
    ImageNomPrixProduitSvtId(id);
    // Methode 1 avec création, maj, et insertion des éléments concernant chaque produit
    // (d'aprés le cours 'modifiez le DOM' )
    //**MajElemHtmlDOMavecPanierMeth1(item)
    // Méthode 2, en écrivant directement tous les éléments concernant chaque produit
    MajElemHtmlDOMavecPanierMeth2(item)
    item++
  };
}
function MajElemHtmlDOMavecPanierMeth1(item) {
  // Affichage du produit 'panierJson[item]'
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
  enfant.dataset.color = couleur;
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
  enfant.innerHTML = "<img src =" + imageUrlProduit + " alt =" + panierJson[item].nomProd + defBordureImage
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
  if (panierJson[item].nomProd.includes("OBSOLETE")) {
    // Si le produit est obsolete
    // => Affiche 'OBSOLETE' en rouge sur fond jaune
    produitOk = false;
    enfant.style = "color: red; font-weight: 800; background-color: yellow; text-align:center;"
  }
  enfant.innerHTML = panierJson[item].nomProd;
  parent_1_1_1.appendChild(enfant);
  // On obtient:
  //<h2>[Nom du produit]</h2>
  // Ajoute l'élément <p> dans cet élément <div> et renseigne la couleur
  enfant = document.createElement("p");
  if (panierJson[item].couleur.includes("OBSOLETE")) {
    // Affiche 'OBSOLETE' en rouge sur fond jaune si la couleur est obsolete
    produitOk = false;
    enfant.style = "color: red; font-weight: 800; background-color: yellow; text-align:center;"
  }
  enfant.innerHTML = panierJson[item].couleur;
  parent_1_1_1.appendChild(enfant);
  //On obtient:
  //<p>[couleur]</p>
  // Ajoute l'élément <p> dans cet élément <div> et renseigne le prix
  enfant = document.createElement("p");
  if (produitOk == true) {
    enfant.innerHTML = prixProduit + " €";
  }
  else {
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
  enfant.innerHTML = "Qté : " + qtProduit;
  parent_1_1_2_1.appendChild(enfant);
  // On obtient:
  //<p>[quantité] : </p>
  // Ajoute l'éléménet <input> dans 
  enfant = document.createElement("input");
  enfant.type = "number";
  enfant.classList = "itemQuantity";
  enfant.name = "itemQuantity";
  enfant.min = "1"; enfant.max = "100";
  enfant.value = qtProduit;
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
function MajElemHtmlDOMavecPanierMeth2(item) {
  // Mise a jour des elements HTML du D.O.M concernant les produits
  // en écrivant en une seule fois tous les éléments en une fois concernant chaque produit
  //  test = productJson.codeArt;
  document.querySelector("#cart__items").innerHTML +=
    `<article class="cart__item" data-id="${id}" data-color="${couleur}">
    <div class="cart__item__img">
     <img src="${imageUrlProduit}" alt="${panierJson[item].nomProd}" ${styleBordureCouleur(panierJson[item].couleur)} >
    </div>
    <div class="cart__item__content">
     <div class="cart__item__content__description">
        <h2 ${styleNomProdObsolete}>${nomProd}</h2>
        <p ${styleCouleurObsolete}>${commentCouleur}</p>
        <p>${prixProduit} €</p>
     </div>
     <div class="cart__item__content__settings">
       <div class="cart__item__content__settings__quantity">
          <p>Qté : ${panierJson[item].qt}</p>
         <input ${styleAffQTProduit} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${panierJson[item].qt}>
       </div>
       <div class="cart__item__content__settings__delete">
         <p class="deleteItem">Supprimer</p>
       </div>
     </div>
    </div>
  </article>`

}
// A chaque sortie de focus
// Vérifie la sasie des champs du formulaire, et si non ok, affiche un message d'erreur.
function controlValidationSaisiesFormulaire() {
  document.addEventListener("focusout", even => {
    even.preventDefault();
    elemFocusPerdu = even.target;
    idElemFocusPerdu = even.target.id;
    if (idElemFocusPerdu != undefined && idElemFocusPerdu != '') {
      //Vérifie uniquement les saisies du formulaire qui ont perdu le focus
      if (idElemFocusPerdu == "firstName" || idElemFocusPerdu == "lastName") {
        compRegex = /(^[A-Z]{1})([a-z]*)(?![A-Z])\D$/g;
        prenom = even.target.value;
        if (valideSvtRegex(elemFocusPerdu, prenom, compRegex) == false) {
          //Si saisie 'Prenom' ou 'Nom' non valide => Affiche le message d'erreur
          elemMessErrSaisie.innerText =
            "Saisie du prénom incorrecte.Le prénom doit commencer par une lettre majuscule, puis ne doit contenir uniquement que des lettres minuscules.";
        }
        else {
          // Sinon, efface le message d'erreur 
          elemMessErrSaisie.innerText = "";
        }
        majAffBtCd();
      }
      if (idElemFocusPerdu == "lastName") {
        compRegex = /(^[A-Z]{1})([a-z]*)(?![A-Z])\D$/g;
        nom = even.target.value;
        if (valideSvtRegex(elemFocusPerdu, nom, compRegex) == false) {
          //Si saisie 'Prenom' ou 'Nom' non valide => Affiche le message d'erreur
          elemMessErrSaisie.innerText =
            "Saisie du nom incorrecte.Le prénom doit commencer par une lettre majuscule, puis ne doit contenir uniquement que des lettres minuscules.";
        }
        else {
          // Sinon, efface le message d'erreur 
          elemMessErrSaisie.innerText = "";
        }
        majAffBtCd();
      }
      if (idElemFocusPerdu == "address") {
        compRegex = /^[0-9a-zA-Z\:,-]+[^<>?%¤!$#²*§£µ€\\\^\]\[\]\{\}~]+$/g;
        adresse = even.target.value;
        if (valideSvtRegex(elemFocusPerdu, adresse, compRegex) == false) {
          //Si saisie 'Adresse' non valide => Affiche le message d'erreur
          elemMessErrSaisie.innerText =
            "Saisie adresse incorrecte.Eviter les caractéres spéciaux suivants : <>?%¤!$#²*§£µ€\^[]{}~";
        }
        else {
          // Sinon, efface le message d'erreur 
          elemMessErrSaisie.innerText = "";
        }
        majAffBtCd();
      }
      if (idElemFocusPerdu == "city") {
        compRegex = /^[0-9]{5}\ [A-Z]([a-z]*\D)$/g;
        ville = even.target.value;
        if (valideSvtRegex(elemFocusPerdu, ville, compRegex) == false) {
          //Si saisie 'Ville' non valide => Affiche le message d'erreur
          elemMessErrSaisie.innerText =
            "Saisie de la ville incorrecte.La ville doit commencer par son N° de code postal (5 chiffres),puis espace, puis le nom de la ville doit être du même type que 'Prénom' ou 'Nom";
        }
        else {
          // Sinon, efface le message d'erreur 
          elemMessErrSaisie.innerText = "";
        }
        majAffBtCd();
      }
      if (idElemFocusPerdu == "email") {
        compRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        email = even.target.value;
        if (valideSvtRegex(elemFocusPerdu, email, compRegex) == false) {
          //Si saisie 'Email' non valide => Affiche le message d'erreur
          elemMessErrSaisie.innerText =
            "Saisie email incorrecte.Commence par 2 groupes de lettres et/ou chiffres, séparés par '@', puis se termine avec '.' puis 2 ou 3 letrres.";
        }
        else {
          // Sinon, efface le message d'erreur 
          elemMessErrSaisie.innerText = "";
        }
        majAffBtCd();
      }
    }
  });
};
// Controle les saisies dans les champs du formulaire
function controlSaisieFormulaire() {
  document.addEventListener("input", even => {
    //Saisie d'un digit dans un element 'input'
    even.preventDefault();
    //Identification de l'élement en cours de saisie
    elemSaisieInput = even.target;
    idElemSaisieInput = elemSaisieInput.id;
    if (idElemSaisieInput != undefined && idElemSaisieInput != '') {
      if (idElemSaisieInput == "firstName" || idElemSaisieInput == "lastName") {
        // Saisie 'Prénom' ou 'Nom'
        // Teste la sasie avec la méthode regex
        compRegex = /(^[A-Z]{1})([a-z]*)(?![A-Z])\D$/g;
        prenom = elemSaisieInput.value;
        valideSvtRegex(elemSaisieInput, elemSaisieInput.value, compRegex)
      }
      else if (idElemSaisieInput == "address") {
        compRegex = /^[0-9a-zA-Z\:,-]+[^<>?%¤!$#²*§£µ€\\\^\]\[\]\{\}~]+$/g;
        valideSvtRegex(elemSaisieInput, elemSaisieInput.value, compRegex);
      }
      else if (idElemSaisieInput == "city") {
        compRegex = /^[0-9]{5}\ [A-Z]([a-z]*\D)$/g;
        valideSvtRegex(elemSaisieInput, elemSaisieInput.value, compRegex);
      }
      else if (idElemSaisieInput == "email") {
        compRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        valideSvtRegex(elemSaisieInput, elemSaisieInput.value, compRegex);
      };
    };
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
    return true;
  }
  else {
    // Si non OK avec une saisie non vide => Colore la saisie en rouge
    elem.style.color = "red";
    return false;
  };
};

// recherche l'image correspondant au produit dans la base Json 'BddServProduits' depuis le serveur
function ImageNomPrixProduitSvtId(id) {
  var i = 0; continuer = true; imageUrlProduit = ""
  while (i < BddServProduits.length && imageUrlProduit == "") {
    if (id == BddServProduits[i]._id) {
      imageUrlProduit = BddServProduits[i].imageUrl;
      prixProduit = BddServProduits[i].price;
    }
    i++
  }
  if (imageUrlProduit == "") {
    // Si l'Url du produit n'est plus retrouvée avec son 'id'
    // Cela signifie que le produit n'existe plus dans la base de donnée du serveur
    // Affiche le logo canapé
    imageUrlProduit = "../images/logo.png";
  }
};

function modifQtProduit() {
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
      couleurDOM = elemProdCorresondant.dataset.color;
      // pour chaqque produit du panier 'panierJson'
      var i = 0; continuer = true;
      qtProduit = item.valueAsNumber;
      while (i < panierJson.length && continuer == true) {
        if (panierJson[i].codeArt == idDOM && panierJson[i].couleur == couleurDOM) {
          // si l'id et la couleur sont identiques => Renseigne la Qt
          panierJson[i].qt = qtProduit
          // MAJ de la Qt dans le HTML du D.O.M
          // Récupére l'élément parent contenant l'enfant <p>
          elem = even.target.closest("section>article>div>div>div");
          //Recherche l'enfant <p> contenu dans l'élément parent
          for (let enfant of elem.children) {
            if (enfant.nodeName = 'p') {
              // Maj de la Qt
              enfant.innerText = "Qté : " + qtProduit;
            }
          }
          sauvegardePanier();
          continuer = false;
        };
        i++
      };
      majTotauxQtPrix();
    });
  });
};
function styleBordureCouleur(couleur) {
  // =>Ajoute la bordure de l'image pour completer la modification du D.O.M
  if (couleur.includes("/")) {
    //Si 'couleur' contient '/' => Cas produit bicolor
    //Définition 1ére couleur
    posiSep = couleur.indexOf("/");
    premCouleur = couleur.substring(0, posiSep)
    // Définition couleur suivante
    couleurSvt = couleur.substring(posiSep + 1, couleur.length)
    defBordureImage = ` style= "border-style: solid; border-right-color: ` + premCouleur + `; border-left-color: ` + premCouleur + `;
     border-top-color: `+ couleurSvt + `; border-bottom-color: ` + couleurSvt + `; border-width: 15px;"`
  }
  else {
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
      couleurDOM = elemSuppr.dataset.color;
      // Suppression de l'element dans le D.O.M
      elemSuppr.remove();
      // Suppresion du produit corresondant dans 'panierJson'
      var i = 0; continuer = true;
      while (i < panierJson.length && continuer == true) {
        if (panierJson[i].codeArt == idDOM && panierJson[i].couleur == couleurDOM) {
          delete panierJson[i];
          supprItemsNullDsPanier();
          continuer = false;
        };
        i++
        if (panierJson.length == 0) {
          window.location.href = "../html/index.html"
        }
      };
      majTotauxQtPrix();
      majAffBtCd();
    });
  });
};
// Sauvedarde en local du panier
function sauvegardePanier() {
  panierLinea = JSON.stringify(panierJson);
  localStorage.setItem("panier", panierLinea);
};
function supprItemsNullDsPanier() {
  // Supprime definitivement les items effacés ( = 'null' ) dans le panier 'panierJson'
  panierLinea = JSON.stringify(panierJson);
  var i = 0;
  while (panierLinea.indexOf(`,null`) > 0 || panierLinea.indexOf(`null,`) > 0 || panierLinea.indexOf(`null`) > 0) {
    panierLinea = panierLinea.replace(`,null`, "");
    panierLinea = panierLinea.replace(`null,`, "");
    panierLinea = panierLinea.replace(`null`, "");
    i++
  };
  panierJson = JSON.parse(panierLinea);
  sauvegardePanier();
};
function majTotauxQtPrix() {
  // Calcul des totaux en bouclant avec 'panierJson'
  let totalQt = 0; let totalPrix = 0;
  panierJson.forEach(item => {
    totalQt = totalQt + item.qt;
    // Récupération du prix avec l'id ( = 'codeArt' dans 'dataProduits')
    ImageNomPrixProduitSvtId(item.codeArt);
    totalPrix = totalPrix + item.qt * prixProduit;
  });
  // Mise à jour des totaux de Qt et prix dans le D.O.M
  elemTotalQt = document.getElementById("totalQuantity");
  elemTotalQt.innerHTML = totalQt;
  elemTotalPrix = document.getElementById("totalPrice");
  elemTotalPrix.innerHTML = totalPrix;
}
function majAffBtCd() {
  // Affiche l'état du bouton de commande, suivant l'état de validité du formulaire.
  if (validationSaisies()) {
    btnCommande.classList = "yesHover";
    btnCommande.style.backgroundColor = "#2c3e50";
    btnCommande.title = ""
  }
  else {
    btnCommande.classList = "noHover";
    btnCommande.style.backgroundColor = "grey";
    btnCommande.title = "Renseigner le formulaire avant de valider la commande."
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
  if (validationSaisies()) {
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
    panierJson.forEach(produit => {
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
        // Une erreur est survenue
        console.log("Erreur N°" + err);
      });
  }
  else {
    //Affichage des erreurs rencontrées qui empeche l'envoie de la commande
    messErreur="La commande ne peut-être envoyée car il reste encore une/des erreur(s) suivante(s):";
    if (messEtatEvolution != ""){messErreur+=`\r- ${messEtatEvolution}`};
    if (messEtatMessErreur != ""){messErreur+=`\r- ${messEtatMessErreur}`};
    if (messEtatSaisiesVides != ""){messErreur+=`\r- ${messEtatSaisiesVides}`};
    alert(messErreur)
  };
};
// Verification des saisies effectuées
function validationSaisies() {
  //Verifie qu'il n'y a pas de message d'erreur
  messErreur = document.querySelectorAll(".cart__order__form__question p");
  messEtatMessErreur = ""; // Par défaut, on considére qu'il n'y a auncun message d'erreur
  messErreur.forEach(even => {
    if (even.innerText != "") {
      // Si au moins un message est affiché => Les saisies du formulaire ne sont pas valides
      messEtatMessErreur = "Il reste une/des saisie(s) non correctement renseignée(s)."
    }
  });
  // Vérifie si il n'y a aucune saisie de renseignée
  champsSaisies = document.querySelectorAll(".cart__order__form__question input");
  messEtatSaisiesVides = ""; // Par défaut, on considére que toutes les saisies sont faites.
  champsSaisies.forEach(even => {
    if (even.value == '') {
      // Si au moins un message est affiché => Les saisies du formulaire ne sont pas valides
      messEtatSaisiesVides = "Il reste une/des saisie(s) à renseigner."
    }
  });
  // Vérifie si tous les produits sont encore d'actualité
  messEtatEvolution = "";//Par défaut pas d'evolution avant verification
  panierJson.forEach(item => {
    if (item.evolution != "Idem") {
      messEtatEvolution = "Un ou des produits sont devenus obsolétes";
    }
  });
  // Réponse en fonction des verifications
  if (messEtatEvolution =="" && messEtatMessErreur =="" && messEtatSaisiesVides == "") {
    return true
  }
  else {
    return false
  }
};