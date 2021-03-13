window.onload = () => {
    let customerinfostring = localStorage.getItem('customer');
    let customerinfo = JSON.parse(customerinfostring);
    let customerinfoobject = {};

    customerinfoobject.fname = customerinfo.fname;
    customerinfoobject.lname = customerinfo.lname;
    customerinfoobject.address = customerinfo.address;
    customerinfoobject.postalCode = customerinfo.postalCode;
    customerinfoobject.tel = customerinfo.tel;
    customerinfoobject.email = customerinfo.email;

    customerinfoobject.caketype = customerinfo.caketype;
    customerinfoobject.cakelayer = customerinfo.cakelayer;
    customerinfoobject.arrExtra = customerinfo.arrExtra;


    if (customerinfo.caketype == "sheetcake") {
        customerinfoobject.length = customerinfo.length;
        customerinfoobject.width = customerinfo.width;
    }

    if (customerinfo.caketype == "roundcake") {
        customerinfoobject.radius = customerinfo.radius;
    }

    displayInfo(customerinfoobject, "order");
}


function displayInfo(clientobject, displayId) {
    let total=0;

    var HTMLFragment = `
      <span class="row-firstname">${clientobject.fname} ${clientobject.lname}</span><br>
      <span class="row-address">${clientobject.address}</span><br>
      <span class="row-postalcode">${clientobject.postalCode}</span><br>
      <span class="row-tel">${clientobject.tel}</span><br>
      <span class="row-email">${clientobject.email}</span><br><br>
      <h2>Your order:</h2><br>`;

    if (clientobject.caketype == "sheetcake") {
        total = calculateSheetTotal(clientobject);
        HTMLFragment += `<span>Sheet cake ${clientobject.length}*${clientobject.width} 
        with ${clientobject.cakelayer} layers:............. ${OutputAsCurrency(new Number(total.toFixed(2)))}
        </span><br>`;
    }
    if (clientobject.caketype == "roundcake") {
        total = calculateRoundTotal(clientobject);
        HTMLFragment += `<span>Round cake ${clientobject.radius}cm with
        ${clientobject.cakelayer} layers:............. ${OutputAsCurrency(total.toFixed(2))}
        </span><br>`;
    }

    if (clientobject.arrExtra != undefined) {
        for (let i = 0; i < clientobject.arrExtra.length; i++) {
            if (clientobject.arrExtra[i] == 'creamCheesingIcing') {
                HTMLFragment += `
            <span>Cream Cheessing Icing:.............................${OutputAsCurrency(5)}</span><br>`;
            }
            if (clientobject.arrExtra[i] == 'fruitAlmondsTopping') {
                HTMLFragment += `
            <span>Fruit and Almond Topping:........................${OutputAsCurrency(7)}</span><br>`;
            }
            if (clientobject.arrExtra[i] == 'fruitJamFilling') {
                HTMLFragment += `
            <span>Fruit Jam Filling.........................................${OutputAsCurrency(7)}</span><br>`;
            }
        }
    }
    HTMLFragment += `<div id="total">Total:........................................................
     ${OutputAsCurrency((total + calculateAddon(clientobject)).toFixed(2))}</div>`;
    let element = document.getElementById(displayId);
    if (element) {
        element.innerHTML = HTMLFragment;
    }
    else {
        console.log("Cannot find element " + displayId);
    }
}

function calculateAddon(clientobject) {
    let total = 0;

    const creamCheesingIcing = 5;
    const fruitAlmondsTopping = 7;
    const fruitJamFilling = 4;

    if (clientobject.arrExtra != undefined) {
        for (let i = 0; i < clientobject.arrExtra.length; i++) {
            if (clientobject.arrExtra[i] == 'creamCheesingIcing') { total += 5 }
            if (clientobject.arrExtra[i] == 'fruitAlmondsTopping') { total += 7 }
            if (clientobject.arrExtra[i] == 'fruitJamFilling') { total += 4 }
        }
        return total;
    }
}

function calculateSheetTotal(clientobject) {
    const base = 30 * 30;
    const additionalRate = 0.02
    let total = clientobject.length * clientobject.width > base ? ((clientobject.length * clientobject.width - base) * additionalRate + 18) : 18;

    switch (clientobject.cakelayer) {
        case 1:
            return total;
            break;
        case 2:
            return total * 1.5;
            break;
        case 3:
            return total * 2;
            break;
        default:
            document.getElementById("order").innerHTML = `
            <div class="missingInfo">
            <h1>Hey <span class="name">${clientobject.fname}</span></h1>
            <h2>You missed how many layers you would like</h2>
            <h2>Please go back and choose.</h2>
            </div>
            <div class="icon">
            <img src="img/grin-squint-tears.svg" alt="grin squint tears icon">
            </div>`;
    }
}

function calculateRoundTotal(clientobject) {
    const pi = 3.14;
    const base = 3.14 * 15 * 15;
    const additionalRate = 0.02
    let total = 3.14 * clientobject.radius * clientobject.radius > base ? ((3.14 * clientobject.radius * clientobject.radius - base) * additionalRate + 15) : 15;

    switch (clientobject.cakelayer) {
        case 1:
            return total;
            break;
        case 2:
            return total * 1.5;
            break;
        case 3:
            return total * 2;
            break;
        default:
            document.getElementById("order").innerHTML = `
            <div class="missingInfo">
            <h1>Hey <span class="name">${clientobject.fname}</span></h1>
            <h2>You missed how many layers you would like</h2>
            <h2>Please go back and choose.</h2>
            </div>
            <div class="icon">
            <img src="img/grin-squint-tears.svg" alt="grin squint tears icon">
            </div>`;
    }
}