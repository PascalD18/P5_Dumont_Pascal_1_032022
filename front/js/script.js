//**************Test**********
 //localStorage.removeItem("panier");
//******************************

//Affiche ou non le lien du panier en fonction de son existance ou non dans localStorage
 affLienPanier();
let bddProduitsServer;
fetch("http://localhost:3000/api/products/")
  .then(function (reponse) {
    if (reponse.ok) {
     return reponse.json();
    }
  })
  .then(function (reponse) {
    bddProduitsServer=reponse;
    // Classe la base de données des produits issue du serveur
    classeBddProduits();
    // Modifie en dynamique l'affichage des prodduits
    majElemsHtmlDOMsvtBddproduits_Meth1();
  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("Erreur N°" + err);
    alert(`l'erreur` + err + ` est survenue sur le serveur.
    Nous faisons notre possible pour remédier à ce probléme.
    N'hesitez pas à revenir plus tard sur le site, vous serez les bienvenus.
    Merci pour votre comprehension.`)
  });
/////////////////////////////////////////
////////////////////// FONCTIONS ////////////////////
/////////////////////////////////////////////////////
function majElemsHtmlDOMsvtBddproduits_Meth1() {
  // Affichage des produits contenus dans 'bddProduitsServer'
  // Methode 1
  // en écrivant directement le HTML correspondant à chaque produit
  // et en y incluant des datas de type `..${[valeurs issues du 'panierJson']}..`
  bddProduitsServer.forEach(item => {
    document.getElementById("items").innerHTML += `
     <a href="../html/product.html?id=${item._id}">
     <article>
      <img src="${item.imageUrl}" alt="${item.name}">
      <h3 class="productName">${item.name}</h3>
      <p class="productDescription">${item.description}</p>
     </article>
     </a>
     `
  });
};
function majElemsHtmlDOMsvtBddproduits_Meth2() {
  // Affichage des produits contenus dans 'bddProduitsServer'
  // Methode 2
  // en utilisant la méthode d'API DOM HTML
  var etape = "Départ"
  bddProduitsServer.forEach(item => {
    if (etape = "Départ") {
      // Balise parent de départ
      var parentListe = document.getElementById("items");
      // Définie une premiére balise 'a' enfant
      var newBaliseA = document.createElement("a");
    }
    else {
      // Redéfinie l'élément 'newBaliseA' précedent comme élément parent
      var parentListe = newBaliseA;
      // Redefinie une nouvelle balise 'a' enfant
      var newBaliseA = document.createElement("a");
    };
    //Ajout elément 'newBaliseA' dans le parent 'parentListe'
    parentListe.appendChild(newBaliseA);
    //Maj du lien pour ouvrir la page 'Product.html' avec le N° 'id' correspondands au produit selectionné
    newBaliseA.href = "../html/product.html?id=" + item._id;
    //Insertion nouvelle balise 'article' dans la balise 'a'
    var parentListe = newBaliseA;
    var newBaliseArticle = document.createElement("article");
    parentListe.appendChild(newBaliseArticle);
    //Remplace l'espace contenu dans le nom du produit par ' '
    // pour que la balise soit correctement dénifie avec ' alt = "[nom du produit]" >'
    nomProduit = item.name;
    newBaliseArticle.innerHTML = "<img src =" + item.imageUrl + ` alt = "` + nomProduit + `" >`;
    // insertion nouvelle balise 'h3' dans la balise 'article' (aprés la balise 'img')
    var newElemListe = document.createElement("h3");
    newBaliseArticle.appendChild(newElemListe);
    newElemListe.classList.add("productName")
    newElemListe.innerHTML = nomProduit
    // insertion nouvelle balise 'p' dans la balise 'article'
    var newElemListe = document.createElement("p");
    newBaliseArticle.appendChild(newElemListe);
    newElemListe.classList.add("productDescription")
    newElemListe.innerHTML = item.description
    var etape = "Suite"
  })
};
