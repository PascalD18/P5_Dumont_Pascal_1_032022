  
 testjson={
     test:"Essai"
 } 


  // Sauvegarde test
  testLinea = JSON.stringify(testjson);
  localStorage.setItem("test", testLinea);

  window.location.href = "../html/index.html";

  // localStorage.removeItem("test");

//if  (localStorage.bddProduits != undefined){
  // Récupération si bdd déjà en cours
  //        bddLinea= localStorage.getItem("bddProduits");
          //Conversion en format json
  //        bddJson = JSON.parse(bddLinea);
//}
        
          