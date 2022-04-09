fetch("http://localhost:3000/api/products/")

  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(tableauProduits => {
    // Recuperation du panier avec localStorage
    panierLinea = localStorage.getItem("panier");
    panierJson = JSON.parse(panierLinea);
    dataURLProduits = tableauProduits;

    MajElemsDOMavecPanier();
    majTotauxQtPrix();
    modifQtProduit();
    suppressionProduit();
    saisieEmail();
    saisieCodePostalEtVille();


  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("Erreur N°" + err);
  })
// Si appui sur la touche 'Entrée' => Declenche une tentative d'envoie de la commande
document.onkeydown = function (evt) {
  if (evt.key == 'Enter') {
    requeteInfoCd();
  }
};


//////////////////////////////////////////////////////
////////////////////// FONCTIONS /////////////////////
//////////////////////////////////////////////////////
function MajElemsDOMavecPanier() {
  // Affichage de tous les produits du panier
  var i = 0;
  while (i < panierJson.length) {
    if (panierJson[i] != null) {
      MajElemsDOMparProduit(i);
    };
    i++
  };
};
// recherche l'image correspondant au produit dans la base Json 'dataURLProduis' depuis le serveur
function ImageNomprixProduitSvtId(id) {
  var i = 0; continuer = true; imageUrlProduit = ""
  while (i < dataURLProduits.length && imageUrlProduit == "") {
    if (id == dataURLProduits[i]._id) {
      imageUrlProduit = dataURLProduits[i].imageUrl;
      nomProduit = dataURLProduits[i].name;
      nomProduit = nomProduit.replace(" ", "_");
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
  ImageNomprixProduitSvtId(id);
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
  //insert l'élément' image
  enfant.innerHTML = "<img src =" + imageUrlProduit + ` alt =` + nomProduit + ">";
  parent_1.appendChild(enfant);
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content";
  parent_1.appendChild(enfant);

  //parent_1_1=document.querySelector("#cart__items article>div.cart__item__content");
  parent_1_1 = enfant;
  enfant = document.createElement("div");
  enfant.classList = "cart__item__content__description";
  parent_1_1.appendChild(enfant);

  // parent_1_1_1=document.querySelector("#cart__items article>div.cart__item__content>div.cart__item__content__description");
  parent_1_1_1 = enfant;
  enfant = enfant = document.createElement("h2");
  enfant.innerHTML = nomProduit;
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
      even.prevenDefault();
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
    ImageNomprixProduitSvtId(item.codeArt);
    totalPrix = totalPrix + item.qt * prixProduit;
  });
  // Mise à jour des totaux de Qt et prix dans le D.O.M
  elemTotalQt = document.getElementById("totalQuantity");
  elemTotalQt.innerHTML = totalQt;
  elemTotalPrix = document.getElementById("totalPrice");
  elemTotalPrix.innerHTML = totalPrix;
}
// Verification le la saisie de l'email
function saisieEmail() {
  texteSaisi = document.getElementById("email")
  texteSaisi.addEventListener("input", function (even) {
    even.preventDefault();
    contenu = even.target.value;
    // Teste la saisie en cours
    test = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(contenu);
    if (test == true) {
      // Saisie email en cours = valide
      even.target.style.color = "green";
      emailValidel = true;
    }
    else {
      // Saisie email en cours = non valide
      even.target.style.color = "red";
      emailValide = false;
    }
  });
  texteSaisi.addEventListener("change", even => {
    if (emailValide == false) {
      alert("L'adresse mail n'est pas correcte");
    };
  });
};
// Verification le la saisie de l'email
function saisieCodePostalEtVille() {
  texteSaisi = document.getElementById("city")
  texteSaisi.addEventListener("input", function (even) {
    even.preventDefault();
    // Teste la saisie en cours
    test = /^[0-9]{5}\s\w+/.test(even.target.value);
    saisieValide = "";
    if (test == true) {
      // Saisie email en cours = valide
      even.target.style.color = "green";
      villeValide = true;
    }
    else {
      // Saisie email en cours = non valide
      even.target.style.color = "red";
      villeValide = false;
    }
  });
  texteSaisi.addEventListener("change", even => {
    even.preventDefault();
    if (villeValide == false) {
      document.getElementById("cityErrorMsg").innerHTML = "Veuillez saisir en commencant par le N° de code postal + espace,suivi du nom de la ville";
    }
    else {
      document.getElementById("cityErrorMsg").innerHTML = "";
    };
  });
};
function boutonCd() {
  BtnCommande = document.getElementById("order")
  BtnCommande.addEventListener("click", even => {
    e.preventDefault()
    requeteInfoCd();
  })
}

function requeteInfoCd() {
  console.log("Reverification + envoie de la commande")
  // verification des données de contact

  // Création du tablleau array 'produxtsID'

  let productsID = [];
  panierJson.forEach(produit => {
    productsID.push(produit.codeArt);
  });

  // Création du tableau 'order' à envoyer en POST
  //const order = {};
  order = {
    contact: {
      firstName: "Pascal",
      lastName: "Dumont",
      address: "8 rue du canal",
      city: "1990 Developole",
      email: "nomprenom@orange.fr"
    },
    products: productsID
  };
  //envoie de l'info commande 'order' au serveur

  fetch("http://localhost:3000/api/products/order", {

    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  })
    .then((response) => {
      if (response.ok) {
        //test=JSON.stringify(response.json())
        return response.json();

      }
    })
    .catch(function (err) {
      // Une erreur est survenue
      console.log("Erreur N°" + err);
    })


  fetch("http://localhost:3000/api/products/order")
   .then((resp) => {
    if (resp.ok) {
      respjson = resp.json();
       return respjson;

    } else {
      alert("erreur")
    }
  })

}

