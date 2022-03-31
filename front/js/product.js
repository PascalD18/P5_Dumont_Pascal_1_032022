fetch("http://localhost:3000/api/products/")

    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    //.then (tableauProduits => {ajoutListeProduitsHTML(tableauProduits)})
   .then (console.log("Bonjour1"))


    .catch(function (err) {
        // Une erreur est survenue
        console.log("Erreur N°" + err);
    });
console.log("Bonjour");
console.log(criteresProduit)
