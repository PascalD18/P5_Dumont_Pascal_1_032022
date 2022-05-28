// Lecture du N° 'id' avec l'URL envoyé par la page 'index.html'
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const orderID = urlParams.get('orderID');

// affiche le N° de commande via l'URL envoyé par la page 'cart.html'
document.getElementById("orderId").innerText=orderID;

// Supprime le panier du localStorage
localStorage.removeItem("cart");