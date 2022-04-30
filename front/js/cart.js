// Variables globales
btnCommande = document.getElementById("order");
initialisation();
//neutraliseToucheEntree();
MajElemsDOMavecPanier();
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
function neutraliseToucheEntree() {
  document.addEventListener("keypress", even => {
    even.preventDefault();
    controlValidationSaisiesFormulaire()
  });
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
        prenom=even.target.value;
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
        nom=even.target.value;
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
        adresse=even.target.value;
        if (valideSvtRegex(elemFocusPerdu, adresse, compRegex) == false) {
        //Si saisie 'Adresse' non valide => Affiche le message d'erreur
          elemMessErrSaisie.innerText =
            "Saisie adresse incorrecte.Eviter les caractéres spéciaux suivants : <>?%¤!$#²*§£µ€\^[]{}~";
        }
        else {
        // Sinon, efface le message d'erreur 
          elemMessErrSaisie.innerText= "";
        }
        majAffBtCd();
      }
      if (idElemFocusPerdu == "city") {
        compRegex = /^[0-9]{5}\ [A-Z]([a-z]*\D)$/g;
        ville=even.target.value;
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
        email=even.target.value;
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
// Controle les sasies dans les champs du formulaire
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
        prenom=elemSaisieInput.value;
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
// Verifie la saisie avec la methode regex
function valideSvtRegex(elem, contenuSaisie, compRegex) {
  //Par défaut, efface le message d'erreur correspondant
  elemMessErrSaisie = document.getElementById(elem.id + "ErrorMsg");
  elemMessErrSaisie.innerText="";
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
    dataURLProduits = JSON.parse(bddProduitsLinea);
  };

  // Récupére le panier existant
  panierLinea = localStorage.getItem("panier");
  panierJson = JSON.parse(panierLinea);

  //Trie dans l'ordre alphabétique des noms des produits du panier
  panierJson.sort(function (a, b) {
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });
};
function MajElemsDOMavecPanier() {
  // Affichage de tous les produits du panier
  var i = 0;
  while (i < panierJson.length) {
    MajElemsDOMparProduit(i);
    i++
  };
};
// recherche l'image correspondant au produit dans la base Json 'dataURLProduis' depuis le serveur
function ImageNomPrixProduitSvtId(id) {
  var i = 0; continuer = true; imageUrlProduit = ""
  while (i < dataURLProduits.length && imageUrlProduit == "") {
    if (id == dataURLProduits[i]._id) {
      imageUrlProduit = dataURLProduits[i].imageUrl;
      // nomProduit = dataURLProduits[i].name;
      //  nomProduit = nomProduit.replace(" ", "_");
      prixProduit = dataURLProduits[i].price;
    }
    i++
  }
};
// MAJ des elements du D.O.M avec un produit
function MajElemsDOMparProduit(item) {
  // Récupére les données à partir du 'panierJson' issu du localStorage
  id = panierJson[item].codeArt;
  couleur = panierJson[item].couleur;
  qtProduit = panierJson[item].qt;
  // recupére l'addresse Url de l'image, le Nom du produit, et le prix.
  ImageNomPrixProduitSvtId(id);
  // l'insertion dans l'élément id='cart__item'
  parent = document.getElementById("cart__items");
  enfant = document.createElement("article");
  enfant.classList = "cart__item";
  // Met à jour l'id et la couleur dnas le D.O.M via les classes 'data-...'
  enfant.dataset.id = id;
  enfant.dataset.color = couleur;
  parent.appendChild(enfant);
  parent_1 = enfant;
  enfant = document.createElement("div");
  enfant.classList = "cart__item__img";
  //insert l'élément' image avec bordure correspondant à la couleur
  bordureProduitSvtCouleur(couleur)
  enfant.innerHTML = "<img src =" + imageUrlProduit + ` alt =` + panierJson[item].nomProd + defBordureImage
  parent_1.appendChild(enfant);
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content"
  parent_1.appendChild(enfant);
  //parent_1_1=document.querySelector("#cart__items article>div.cart__item__content");
  parent_1_1 = enfant;
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__description";
  parent_1_1.appendChild(enfant);
  // parent_1_1_1=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__description");
  parent_1_1_1 = enfant;
  enfant = enfant = document.createElement("h2");
  enfant.innerHTML = panierJson[item].nomProd;
  parent_1_1_1.appendChild(enfant);
  enfant = document.createElement("p");
  enfant.innerHTML = couleur;
  parent_1_1_1.appendChild(enfant);
  enfant = document.createElement("p");
  enfant.innerHTML = prixProduit + " €";
  parent_1_1_1.appendChild(enfant);

  // parent_1_1=document.querySelector("#cart__items article>div.cart__item__content");
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__settings";
  parent_1_1.appendChild(enfant);

  //parent_1_1_2=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings");
  parent_1_1_2 = enfant;
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__settings__quantity";
  parent_1_1_2.appendChild(enfant);

  //parent_1_1_2_1=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings>div.cart__item__content__settings__quantity");
  parent_1_1_2_1 = enfant;
  parent_1_1_2_1.innerHTML = "<p>Qté : " + qtProduit + "</p>";
  parent_1_1_2_1.innerHTML = parent_1_1_2_1.innerHTML + `<input type="number" classe="itemQuantity" name="itemQuantity" min="1" max="100"value=` + qtProduit + ">";
  //parent_1_1_2=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings");
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__settings__delete";
  parent_1_1_2.appendChild(enfant);

  //parent_1_1_2_2=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__settings>div.cart__item__content__settings__delete");
  parent_1_1_2_2 = enfant;
  enfant = document.createElement("p");
  enfant.classList = "deleteItem";
  enfant.innerHTML = "Supprimer";
  parent_1_1_2_2.appendChild(enfant);
};
function modifQtProduit() {
  // Modification du panier en fonction de l'element 'Supprimer' cliqué dans le D.O.M
  selectQt = document.querySelectorAll('div.cart__item__content__settings__quantity>input')
  selectQt.forEach(item => {
    item.addEventListener("change", even => {
      even.preventDefault();
      // Recherche de l'id 'idDOM' et de la couleur 'couleurODM' correspondants dans le D.O.M
      // Recuperation de l'element du D.O.M correspondant au produit à supprimer
      elemProdCorresondant = even.target.closest("section>article");
      // Recupération de l'id et de la couleur depuis le D.O.M via le dataset 
      idDOM = elemProdCorresondant.dataset.id;
      couleurDOM = elemProdCorresondant.dataset.color;
      // Modification de la qt du produit corresondant dans 'panierJson'
      var i = 0; continuer = true;
      qtProduit = item.valueAsNumber;
      while (i < panierJson.length && continuer == true) {
        if (panierJson[i].codeArt == idDOM && panierJson[i].couleur == couleurDOM) {
          panierJson[i].qt = qtProduit
          // MAJ de la Qt dans le D.O.M
          enfant = even.target.closest("section>article>div>div>div");
          enfant.children[0].innerHTML = "Qté : " + qtProduit;

          sauvegardePanier();
          continuer = false;
        };
        i++
      };
      majTotauxQtPrix();
    });
  });
};
function bordureProduitSvtCouleur() {
  // ajoute la bordure de l'image pour completer la modification du D.O.M
  if (couleur.includes("/")) {
    //Si 'couleur' contient '/' => Cas produit bicolor
    //Définition 1ére couleur
    posiSep = couleur.indexOf("/");
    premCouleur = couleur.substring(0, posiSep)
    // Définition couleur suivante
    couleurSvt = couleur.substring(posiSep + 1, couleur.length)
    defBordureImage = ` style= "border-style: solid; border-right-color: ` + premCouleur + `; border-left-color: ` + premCouleur + `;
     border-top-color: `+ couleurSvt + `; border-bottom-color: ` + couleurSvt + `; border-width: 15px;`
  }
  else {
    // 1 bordure continue si couleur unique
    defBordureImage = ` style= "border: solid ` + couleur + `; border-width: 15px;`
  }

  defBordureImage = defBordureImage + ` padding: 10px;" />`

};
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
    });
  })
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
  if (saisiesValides()) {
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
function formulaireComplet() {
  //Vérifie si le formulaire est complétement renseigné
  if (prenom != "" && nom != "" && adresse != "" && ville != "" && email != "") {
    return true;
  }
  else {
    alert("Le formulaire doit être complétement renseigné avant de commander.");
    return false;
  };
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
  if (saisiesValides() && formulaireComplet()) {
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
  else if (formulaireComplet()) {
    //Si il existe une ou des sasie(s) non valides, et que le formulaire est complétement renseigné
    alert("Une ou des saisie(s) ne sont pas correctement renseignées.")
  };
};
// Verification des saisies effectuées
function saisiesValides() {
  //Verifie qu'il n'y a pas de message d'erreur
  messErreur = document.querySelectorAll(".cart__order__form__question p");
  aucunMessErreur = true; // Par défaut, on considére qu'il n'ya auncun message d'erreur
  messErreur.forEach(even => {
    if (even.innerText != "") {
      // Si au moins un message est affiché => Les saisies du formulaire ne sont pas valides
      aucunMessErreur = false
    }
  });
  // Vérifie si il n'y a aucune saisie de renseignée
  champsSaisies = document.querySelectorAll(".cart__order__form__question input");
  toutesSaisieFaites = true; // Par défaut, on considére que toutes les saisies sont faites.
  champsSaisies.forEach(even => {
    if (even.value == '') {
      // Si au moins un message est affiché => Les saisies du formulaire ne sont pas valides
      toutesSaisieFaites = false
    }
  });
  if (aucunMessErreur == true && toutesSaisieFaites == true) {
    return true
  }
  else {
    return false
  }
};