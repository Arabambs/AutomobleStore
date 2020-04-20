import Framework7 from 'framework7/framework7.esm.bundle';
import $$ from 'dom7';
import firebase from 'firebase/app';
import app from "./F7App.js";
import 'firebase/database';
import 'firebase/auth';



$$("#tab2").on("tab:show", () => {
    //put in firebase ref here
    const sUser = firebase.auth().currentUser.uid;
    firebase.database().ref("crudItems/" + sUser).on("value", (snapshot) =>{
        const oItems = snapshot.val();
        console.log(oItems);
        const aKeys = Object.keys(oItems);
        $$("#automobileList").html("");
        for(let n = 0; n < aKeys.length; n++){
            if(oItems[aKeys[n]].datePurchased != null){
               let sCard=`
               <div class="card">
              <img src="${oItems[aKeys[n]].img}" style="height:200px;width:200px; border-radius: 27px;"/>
               <div class="card-content card-content-padding"><strike>${oItems[aKeys[n]].item}</strike></div>
               <div class="card-content card-content-padding"><strike>${oItems[aKeys[n]].model}</strike></div>
               <div class="card-content card-content-padding"><strike>${oItems[aKeys[n]].price}</strike></div>
               <ul ><button id="add_${aKeys[n]}" type="submit" class="button button-active btn-liquid  change">I want this.</button>
               <br>
               <br>
        
               <button id="delete_${aKeys[n]}" type="submit" class="button button-active btn-liquid del">I don't Want this</button>
               
               </ul>           
               </div>
               `
               $$("#automobileList").append(sCard);
            }
            else{
                let sCard=`
                <div class="card">
               <img src="${oItems[aKeys[n]].img}" style="height:200px;width:200px; border-radius: 27px;"/>
                <div class="card-content card-content-padding">${oItems[aKeys[n]].item}</div>
                <div class="card-content card-content-padding">${oItems[aKeys[n]].model}</div>
                <div class="card-content card-content-padding">${oItems[aKeys[n]].price}</div>
                <ul><button id="add_${aKeys[n]}" type="submit" class="button button-active btn-liquid change">I want this.</button>
                <br>
                <br>
                <button id="delete_${aKeys[n]}" type="submit" class="button button-active btn-liquid del">I don,t Want this</button>
                </ul>           
                </div>
                `
                $$("#automobileList").append(sCard);
            }
           
        }
    });

});

function hasClass(elem, className) {
    return elem.classList.contains(className);
}
document.getElementById("automobileList").addEventListener("click", (evt) =>{
    if(hasClass(evt.target,"change")){
        const sUser = firebase.auth().currentUser.uid;
        const today = new Date();
        const purchaseDate = today.getDate() +"-"+ (today.getMonth() + 1) +"-"+today.getFullYear();
        firebase.database().ref("crudItems/" + sUser + "/" + evt.target.id.replace("add_","")).update({datePurchased: purchaseDate});
        document.getElementById(evt.target.id).disabled = true;
    }
    else if(hasClass(evt.target,"del")){
        const sUser = firebase.auth().currentUser.uid;
        firebase.database().ref("crudItems/"+sUser+"/"+evt.target.id.replace("delete_","")).remove();
    }
});

$$(".my-sheet").on("submit", e => {
    //submitting a new note
    e.preventDefault();
    const oData = app.form.convertToData("#addItem");
    const sUser = firebase.auth().currentUser.uid;
    const sId = new Date().toISOString().replace(".", "_");
    firebase.database().ref("crudItems/" + sUser + "/" + sId).set(oData);
    app.sheet.close(".my-sheet", true);
});