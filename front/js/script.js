

//function requeteProduits(){
  fetch("http://localhost:3000/api/products/")
 
    .then(function(res) {
      if (res.ok) {
      return res.json();
      }
  })
  .then (tableauProduits => {ajoutListeProduitsHTML(tableauProduits);

   })
  .catch(function(err) {
    // Une erreur est survenue
    console.log("Erreur N°"+err);
  });  

var i = 0;
let erreur="Non";

/*
while (erreur="Non") {
    //Nouvelles balises 'li' de liste à ajouter 
    let newListe = document.createElement("li");
    newListe.style.listStyleType = "none";

    console.log(tableauProduits)
    let numId = tableauProduits[i]._id;
};
  
*/
/////////////////////////////////////////////////////
////////////////////// FONCTIONS ////////////////////
/////////////////////////////////////////////////////
// --- Requete API sur les criteresProduit du produit suivant numId ----   
function requeteCriteresProduit(numId){
  fetch("http://localhost:3000/api/products/" + numId)
  .then((res) => res.json())
  .then(function(res) {
  })
   .catch(function(err) {
    // Une erreur est survenue
    console.log("Erreur N°"+err)
  });  
};   // Insertion en dynamique de la liste de produits en HTML
    function ajoutListeProduitsHTML(tableauProduits) {
    const parentListes = document.querySelector("#items > a");

    console.log(tableauProduits)
    tableauProduits.forEach (criteresProduit => {
    //Nouvelles balise 'a' à ajouter 
      let newElemListe = document.createElement("li");
    //Insertion avant la derniére liste
      parentListes.appendChild(newElemListe);
      let nomProduit = criteresProduit.name.replace(" ", '&#160');
      newElemListe.innerHTML= "<img src =" + 'criteresProduit.imageUrl' + " alt = " +  nomProduit + ">"
       + ""
      console.log(criteresProduit.name)

    })
      // espaces "normaux" par &nbsp; ou &#160
  };
    

  

  /*
    newListe.innerHTML = "Element" + i + "<strong>Fort</Strong>"

    // Liste N°3 en rouge et gros caractere
    if (i == 3) {
        newListe.style.fontSize = "40px";
        newListe.style.color = "red";
    };

    if (i == 4) {
        //Si i = 4, Liste N° 4 remplace balise 'p' par 'div'
        // dans 'derElemListe'
        elemRemplacement.innerHTML = "Remplace balise p";
        derElemListe.replaceChild(elemRemplacement, elemARemplacer);
        console.log(elemRemplacement.innerHTML);
    };



    };

      //document
      //.querySelector("div>.titles")
      //.addEventListener("click", requeteProduits);


*/





