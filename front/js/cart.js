fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(datasProduitsAPI => {
    classeBddProduits(datasProduitsAPI);
    initialisation(datasProduitsAPI);
    MajElemHtmlDOMavecPanier(datasProduitsAPI);
    majTotauxQtPrix(datasProduitsAPI);
    suppressionProduit(datasProduitsAPI);
    modifQtProduit(datasProduitsAPI);
    controlSaisieFormulaire();
    controlValidationSaisiesFormulaire();
    btnCommande = document.getElementById("order");// Variable globale, utilisées dans les 2 fonctions suivantes
    actionBtnCd();
    majAffBtCd();
  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("Erreur N°" + err);
    alert("l'erreur" + err + " est survenue sur le serveur. Nous faisons notre possible pour remédier à ce probléme.N'hesitez pas à revenir plus tard sur le site, vous serez les bienvenus.")
  });
//////////////////////////////////////////////////////
////////////////////// FONCTIONS /////////////////////
//////////////////////////////////////////////////////
function initialisation(datasProduitsAPI) {
 // //Définie l'etat des saisie non valides par défaut
 // prenomValide = false; nomValide = false; adresseValide = false;
 // villeValide = false; emailValide = false;
 
// //Initialise les saisies
//  prenom = ""; nom = ""; adresse = "";
//  ville = ""; //email = "";
//  // Récupére le panier déjà existant avec le locaStorage
  panierLinea = localStorage.getItem("panier");
  panierJson = JSON.parse(panierLinea);

  // ***********************************************************************
  // SIMULATION D'UNE EVOLUTION DES PRODUITS SUR LE SERVER 
  // ENCORE CONTENUS DANS LE PANIER QUI N'AURAIT PAS CHANGÉ DEPUIS LONGTEMPS
  //datasProduitsAPI[1]._id = "1234";
  datasProduitsAPI[2].colors[0] = "x";
  // ************************************************************************

  //Verifie si le panier est toujours d'actualité par rapport à 'datasProduitsAPI'
  panierJson.forEach(i => {
    idOk = false; couleurOk = false;
    var j = 0; continuer = true;
    while (j < datasProduitsAPI.length && continuer == true) {
      if (i.codeArt == datasProduitsAPI[j]._id) {
        idOk = true; continuer = false;
      }
      if (j < datasProduitsAPI.length && continuer) {
        j++;
      }
    };
    if (idOk == true) {
      // Si le produit du panier existe bien dans 'datasProduitsAPI'
      // => Vérifie que la couleur existe encore
      var k = 0; continuer = true;
      while (k < datasProduitsAPI[j].colors.length && continuer) {
        if (i.couleur == datasProduitsAPI[j].colors[k]) {
          couleurOk = true; continuer = false;
        }
        if (k < datasProduitsAPI[j].colors.length && continuer) {
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
function MajElemHtmlDOMavecPanier(datasProduitsAPI) {
  var item = 0;
  while (item < panierJson.length) {
    // MAJ des elements HTML du D.O.M pour chaque produit contenu dans le panier 'panierJson'
    // Récupére les données à partir du 'panierJson' issu du localStorage
    id = panierJson[item].codeArt;
    // Affichage de certaines données en fonction de l'évolution du produit par rapport au panier existant
    // 'nomProdHTML', 'couleur' et 'prixProduit' idems à celui contenu dans 'panierJson'
    nomProdHTML = panierJson[item].nomProd;
    couleurHTML = panierJson[item].couleur;
    prixProduit = panierJson[item].prixProduit;
    // Definit le style à ajouter dans l'élément <img> pour définir la bordure de la couleur du canapé
    styleBordureCouleur(panierJson[item].couleur);
    // Recupére l'addresse Url de l'image, et le prix.
    imagePrixAPIsvtId(datasProduitsAPI, id);
    //Par défaut on affiche sans style particulier
    styleNomProdHTML = ""; styleCouleurHTML = "";
    //Si il existe une évolution, on affiche rouge sur fond jaune
    if (panierJson[item].evolution == "Couleur OBSOLETE") {
      //Si la couleur est obsoléte on l'indique avec 'couleurHTML'
      couleurHTML = "La couleur " + panierJson[item].couleur + " est OBSOLETE";
      //Et on l'affiche avec couleur rouge sur fond jaune
      styleCouleurHTML = `style="color: red; font-weight: 800; background-color: yellow; text-align:center;"`;
      //On met le prix du produit à zero pour ne pas influencer le calcul du prix total
      prixProduit = 0;
    }
    else if (panierJson[item].evolution == "Id OBSOLETE") {
      //Si le produit est obsoléte, on l'indique avec 'nomProdHTML'
      nomProdHTML = "Le produit " + panierJson[item].nomProd + " est devenu OBSOLETE";
      //Et on affiche avec couleur rouge sur fond jaune
      styleNomProdHTML = `style="color: red; font-weight: 800; background-color: yellow; text-align:center;"`;
      //On met le prix du produit à zero pour ne pas influencer le calcul du prix total
      prixProduit = 0;
    }
    if (panierJson[item].evolution == "Idem") {
      // Si le produit n'est pas obsoléte => on laisse l'affichage de la Qt du produit
      afficheQtProduit = "";
    }
    else {
      // sinon on masque l'élément HTML concernant la quantité de produit
      afficheQtProduit = `style ="display: none;"`
    }
    qtProduit = panierJson[item].qt;
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
    `<article class="cart__item" data-id="${id}" data-color="${panierJson[item].couleur}">
    <div class="cart__item__img">
     <img src="${imageUrlProduit}" alt="${panierJson[item].nomProd}" ${styleBordureCouleur(panierJson[item].couleur)} >
    </div>
    <div class="cart__item__content">
     <div class="cart__item__content__description">
        <h2 ${styleNomProdHTML}>${nomProdHTML}</h2>
        <p ${styleCouleurHTML}>${couleurHTML}</p>
        <p>${prixProduit} €</p>
     </div>
     <div class="cart__item__content__settings">
       <div class="cart__item__content__settings__quantity">
          <p>Qté : ${panierJson[item].qt}</p>
         <input ${afficheQtProduit} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${panierJson[item].qt}>
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
      }
      majAffBtCd();
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

// Récupére 'imageURLProduit' et 'prixProduit' issus des datas des produits de l'API 'datasProduitsAPI'
// correspondant à 'Id'
function imagePrixAPIsvtId(datasProduitsAPI, id) {
  var i = 0; idTrouvé = false;
  while (i < datasProduitsAPI.length && idTrouvé == false) {
    if (id == datasProduitsAPI[i]._id) {
      imageUrlProduit = datasProduitsAPI[i].imageUrl;
      prixProduit = datasProduitsAPI[i].price;
      idTrouvé = true;
    }
    i++
  }
  if (idTrouvé == false) {
    //Si 'id' n'a pas été trouvé
    //=> Prends par défaut le logo comme image de canapé
    imageUrlProduit = "../images/logo.png";
  };
};

function modifQtProduit(datasProduitsAPI) {
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
      //Pour chaqque produit du panier 'panierJson'
      var i = 0; continuer = true;
      qtProduit = item.valueAsNumber;
      while (i < panierJson.length && continuer == true) {
        if (panierJson[i].codeArt == idDOM && panierJson[i].couleur == couleurDOM) {
          // si l'id et la couleur sont identiques => Renseigne la Qt dans le panier
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
          
          continuer = false;
        };
        i++
      };
      sauvegardePanier();
      majAffBtCd();
      majTotauxQtPrix(datasProduitsAPI);
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
function suppressionProduit(datasProduitsAPI) {
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
          supprItemsNullDsPanier()
          if (panierJson.length == 0){
            localStorage.removeItem("panier");
          }
          continuer = false;
        };
        i++
        if (localStorage.panier == undefined) {
          window.location.href = "../html/index.html"
        }
      };
      majTotauxQtPrix(datasProduitsAPI);
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
function majTotauxQtPrix(datasProduitsAPI) {
  // Calcul des totaux en bouclant avec 'panierJson'
  let totalQt = 0; let totalPrix = 0;
  panierJson.forEach(item => {
    totalQt = totalQt + item.qt;
    // Récupération du prix avec l'id ( = 'codeArt' dans 'dataProduits')
    imagePrixAPIsvtId(datasProduitsAPI, item.codeArt);
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
    btnCommande.title = "Génére la commande"
  }
  else {
    btnCommande.classList = "noHover";
    btnCommande.style.backgroundColor = "grey";
    // Maj de l'infobulle en fonction des erreurs de saisie
    if (messErrQtProduitNul != "" || messErrProdObsolete != "") {
      // Préviens d'abord si le produit et obsoléte et/ou si un produit contient une qt =0
      infoBulle = `*Attention* la commande ne pourra être validée`
      if (messErrProdObsolete != "") {
        infoBulle = `${infoBulle}\r
       - il existe un ou des produit(s) obosoléte(s).`
      }
      if (messErrQtProduitNul != "") {
        infoBulle = `${infoBulle}\r
       - il existe un ou des produit(s) avec Qté = 0 .`
      }
    }
    else {
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
    alert(messErreur);
  };
};
// Verification des saisies effectuées
function validationSaisies() {
  //Verifie qu'il n'y a pas de message d'erreur
  elemMessErrFormulaire = document.querySelectorAll(".cart__order__form__question p");
  messErrSaisieFormIncorrecte = ""; // Par défaut, on considére qu'il n'y a auncun message d'erreur
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
  messErrQtProduitNul = "";//Par défaut toutes les qt de produits sont >0
  panierJson.forEach(item => {
    // Vérifie si tous les produits sont encore d'actualité
    if (item.evolution != "Idem") {
      messErrProdObsolete = "il existe un ou des produit(s) obosoléte(s)";
    }
    // Verifie que tous les produits ont une Qt > 0 
    if (item.qt == 0) {
      messErrQtProduitNul = "il existe un ou des qt de produit(s) = 0";
    }
  });
  // Vérifie que tous les qt de produits sont > 0

  // Réponse en fonction des verifications
  if (messErrProdObsolete == "" && messErrSaisieFormIncorrecte == "" && messErrSaisieVide == "" && messErrQtProduitNul == "") {
    return true
  }
  else {
    //Renseigne les erreurs rencontrées dans l'info bulle du bouton de commande
    messErreur = "La commande ne peut-être envoyée car il reste encore une/des erreur(s) suivante(s):";
    if (messErrProdObsolete != "") { messErreur += `\r- ${messErrProdObsolete}` };
    if (messErrQtProduitNul != "") { messErreur += `\r- ${messErrQtProduitNul}` };
    if (messErrSaisieFormIncorrecte != "") { messErreur += `\r- ${messErrSaisieFormIncorrecte}` };
    if (messErrSaisieVide != "") { messErreur += `\r- ${messErrSaisieVide}` };
    return false
  }
};