/*fetch("http://localhost:3000/api/products/")

    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    })
    .catch(function (err) {
        // Une erreur est survenue
        console.log("Erreur N°" + err);
    });
console.log(criteresProduit)
*/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');

console.log(id);


