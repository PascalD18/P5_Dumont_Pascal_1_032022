// Valeur de controle par default
initialisation();
neutraliseToucheEntree();
MajElemsDOMavecPanier();
majTotauxQtPrix();
modifQtProduit();
suppressionProduit();
saisiePrenom();
saisieNom();
saisieAdresse();
saisieCodePostalEtVille();
saisieEmail();
saisieCodePostalEtVille();
actionBtnCd()
affBtnCd()
//////////////////////////////////////////////////////
////////////////////// FONCTIONS /////////////////////
//////////////////////////////////////////////////////
function neutraliseToucheEntree() {
  document.addEventListener("keypress", even => {
    if (even.key == "Enter") {
      even.preventDefault();
    }
    // Evite de reinitialiser le formulaire
  });
};
function initialisation() {

  // Initialise l'état de la saisie
  prenomValide = false; nomValide = false; adresseValide = false;
  villeValide = false; emailValide = false;
  // Récupére la base de donnée des produits avec le locaStorage
  // Récupération de la bdd de tous les produits
  if (localStorage.bddProduits != null) {
    bddProduitsLinea = localStorage.getItem("bddProduits");
    dataURLProduits = JSON.parse(bddProduitsLinea);
  };

  // Récupére le panier existant
  panierLinea = localStorage.getItem("panier");
  panierJson = JSON.parse(panierLinea);
};
//Trie dans l'ordre alphabétique des noms des produits du panier
panierJson.sort(function (a, b) {
  if (a.name < b.name) {
    return -1;
  } else {
    return 1;
  }
});

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
// Verification de la saisie du Prenom
function saisiePrenom() {
  textePrenom = document.getElementById("firstName")
  textePrenom.addEventListener("input", function (even) {
    even.preventDefault();
    //Efface le message d'erreur à chaque saisie de caractére
    document.getElementById("firstNameErrorMsg").innerHTML = "";
    // Teste le caractere saisi
    prenomValide = /(^[A-Z]{1})([a-z]*)(?![A-Z])\D$/g.test(even.target.value);
    prenom = even.target.value;
    if (prenomValide == true) {
      // Si OK => Colore la saisie en vert
      even.target.style.color = "green";
    }
    else {
      // Si non OK => Colore la saisie en rouge
      even.target.style.color = "red";
    }
    affBtnCd();
  });
  affMessErrSaisiesNonValides(textePrenom)
};
function saisieNom() {
  texteSaisi = document.getElementById("lastName")
  texteSaisi.addEventListener("input", function (even) {
    even.preventDefault();
    //Efface le message d'erreur à chaque saisie de caractére
    document.getElementById("lastNameErrorMsg").innerHTML = "";
    // Teste le caractere saisi
    nomValide = /(^[A-Z]{1})([a-z]*)(?![A-Z])\D$/g.test(even.target.value);
    nom = even.target.value;
    if (nomValide == true) {
      // Si OK => Colore la saisie en vert
      even.target.style.color = "green";
    }
    else {
      // Si non OK => Colore la saisie en rouge
      even.target.style.color = "red";
    }
    affBtnCd();
  });
  affMessErrSaisiesNonValides(texteSaisi)
};
// Verification de l'adresse'
function saisieAdresse() {
  texteSaisi = document.getElementById("address")
  texteSaisi.addEventListener("input", function (even) {
    even.preventDefault();
    //Efface le message d'erreur à chaque saisie de caractére
    document.getElementById("addressErrorMsg").innerHTML = "";
    // Teste le caractere saisi
    adresseValide = /^[0-9a-zA-Z\:,-]+[^<>?%¤!$#²*§£µ€\\\^\]\[\]\{\}~]+$/g.test(even.target.value);
    adresse = even.target.value;
    if (adresseValide == true) {
      // Si OK => Colore la saisie en vert
      even.target.style.color = "green";
    }
    else {
      // Si non OK => Colore la saisie en rouge
      even.target.style.color = "red";
    }
    affBtnCd();
  });
  affMessErrSaisiesNonValides(texteSaisi)
};
// Verification le la saise du N° code Postal + Nom de la ville
function saisieCodePostalEtVille() {
  texteSaisi = document.getElementById("city")
  texteSaisi.addEventListener("input", function (even) {
    even.preventDefault();
    //Efface le message d'erreur à chaque saisie de caractére
    document.getElementById("cityErrorMsg").innerHTML = "";
    // Teste le caractére saisi ( 5 chiffres + espace + lettres)
    villeValide = /^[0-9]{5}\s\w+/g.test(even.target.value);
    ville = even.target.value;
    if (villeValide) {
      //Si OK => Colore en vert la saisie
      even.target.style.color = "green";
      villeValide = true;
    }
    else {
      //Si non OK => Colore en rouge la saisie
      even.target.style.color = "red";
    }
    affBtnCd();
  });
  affMessErrSaisiesNonValides(texteSaisi)
};
// Verification de la saisie de l'email
function saisieEmail() {
  texteSaisi = document.getElementById("email")
  texteSaisi.addEventListener("input", function (even) {
    even.preventDefault();
    //Efface le message d'erreur à chaque saisie de caractére
    document.getElementById("emailErrorMsg").innerHTML = "";
    // Teste le caractére saisi
    emailValide = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(even.target.value);
    email = even.target.value;
    if (emailValide) {
      //Si OK => Colore en vert la saisie
      even.target.style.color = "green";
    }
    else {
      //Si non OK => Colore en rouge
      even.target.style.color = "red";
    }
    affBtnCd();
  });
  affMessErrSaisiesNonValides(texteSaisi)
};
function affBtnCd() {
  // Affiche l'état du bouton de commande
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
function affMessErrSaisiesNonValides(texteSaisi) {
  // A à chaque validation d'une saisie d'un champ du formulaire ( avec touche 'Tab')
  // Si saisie invalide => Affiche un message d'erreur correspondant à la saisie
  texteSaisi.addEventListener("change", even => {
    even.preventDefault();
    // Affiche le(s) message(s) d'erreur si il existe une ou des saisies incorrectes
    // Verifie saisie du prénom
    if (texteSaisi.id == "firstName") {
      if (prenomValide == false) {
        document.getElementById("firstNameErrorMsg").innerHTML = "Saisie du prénom incorrecte.Commencer par une lettre majuscule, en ne saisissant que des lettres.";
      }
      else {
        document.getElementById("firstNameErrorMsg").innerHTML = "";
      };
    };
    // Verifie saisie du Nom
    if (texteSaisi.id == "lastName") {
      if (nomValide == false) {
        document.getElementById("lastNameErrorMsg").innerHTML = "Saisie du nom incorrecte.Commencer par une lettre majuscule, en ne saisissant que des lettres.";
      }
      else {
        document.getElementById("lastNameErrorMsg").innerHTML = "";
      };
    };
    // Verifie saisie adresse
    if (texteSaisi.id == "address") {
      if (adresseValide == false) {
        document.getElementById("addressErrorMsg").innerHTML = "Saisie adresse incorrecte.Eviter les caractéres spéciaux suivants : <>?%¤!$#²*§£µ€\^[]{}~";
      }
      else {
        document.getElementById("addressErrorMsg").innerHTML = "";
      };
    };
    // Verifie saisie de la ville
    if (texteSaisi.id == "city") {
      if (villeValide == false) {
        document.getElementById("cityErrorMsg").innerHTML = "Saisie adresse incorrecte.Eviter les caractéres spéciaux";
      }
      else {
        document.getElementById("cityErrorMsg").innerHTML = "";
      };
    };
    // Verifie saisie email
    if (texteSaisi.id == "email") {
      if (emailValide == false) {
        document.getElementById("emailErrorMsg").innerHTML = "Saisie email incorrecte";
      }
      else {
        document.getElementById("emailErrorMsg").innerHTML = "";
      };
    };
  });
};
function actionBtnCd() {
  btnCommande = document.getElementById("order");
  btnCommande.addEventListener("keypress", even => {
    even.preventDefault();
    requeteInfoCd();
  })
  btnCommande.addEventListener("click", even => {
    even.preventDefault();
    requeteInfoCd();
  });
};
function requeteInfoCd() {
  if (saisiesValides()) {
    // Création de l'objet 'Contact'
    contact={
      "firstName" : prenom,
      "lastName" : nom,
      "address" : adresse,
      "city" : ville,
      "email" : email
    }
    // Création du tableasu array 'products'
    let productsID = [];
    panierJson.forEach(produit => {
      productsID.push(produit.codeArt);
    });
    // Regroupement dans l'objet 'order'
    order = {
      "contact" : contact,
      "products" : productsID
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
    alert("Le formulaire n'est pas valide.")
  };
};
// Verification des saisies effectuées
function saisiesValides() {
  if (prenomValide && nomValide && adresseValide && villeValide && emailValide) {
   return true
  }
  else {
    return false;
  }
};