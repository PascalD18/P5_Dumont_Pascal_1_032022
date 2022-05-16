//localStorage.removeItem("panier");

fetch("http://localhost:3000/api/products/")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (datasProduitsAPI) {
    classeBddProduits(datasProduitsAPI)
    majElemsHtmlDOMsvtBddproduits(datasProduitsAPI);
    affLienPanier();
  })
  .catch(function (err) {
    // Une erreur est survenue
    console.log("Erreur N°" + err);
    alert("l'erreur" + err + " est survenue sur le serveur. Nous faisons notre possible pour remédier à ce probléme.N'hesitez pas à revenir plus tard sur le site, vous serez les bienvenus.")
  })
/////////////////////////////////////////
////////////////////// FONCTIONS ////////////////////
/////////////////////////////////////////////////////
function majElemsHtmlDOMsvtBddproduits(datasProduitsAPI) {
  //Modification des elements HTML avec la methode `..${[valeurs issues du 'panierJson']}..`
  datasProduitsAPI.forEach(item => {
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
function xmajElemsHtmlDOMsvtBddproduits(datasProduitsAPI) {
  // Insertion en dynamique des elements HTML
  var etape = "Départ"
  datasProduitsAPI.forEach(item => {
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
