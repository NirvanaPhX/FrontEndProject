extra = [];
var caketype, cakelength, cakewidth, layer, cakeradius;

window.onload = () => {

    BindPageToId("caketype", "./CakeTypeSelection.html");

    BindEventsToField();

    BindPageToId("invoice", "./Invoice.html");

    myForm.onsubmit = () => {
        displayInfo(getInfo(), "order")
    }
}

function BindEventsToField() {
    AddFocusEvent("fname", "help-message");
    AddFocusEvent("lname", "help-message");
    AddFocusEvent("address", "help-message");
    AddFocusEvent("postalCode", "help-message");
    AddFocusEvent("tel", "help-message");
    AddFocusEvent("email", "help-message");
}

function AddFocusEvent(id, message) {
    let element = document.getElementById(id);
    element.onfocus = () => {
        HasFocus(id, message);
    }
    element.onblur = () => {
        LostFocus(id, message);
    }
}

function getInfo() {
    var clientobject = {};

    clientobject.fname = RetrieveInputValue("fname");
    clientobject.lname = RetrieveInputValue("lname");
    clientobject.address = RetrieveInputValue("address");
    clientobject.postalCode = RetrieveInputValue("postalCode");
    clientobject.tel = RetrieveInputValue("tel");
    clientobject.email = RetrieveInputValue("email");

    clientobject.caketype = caketype;
    clientobject.cakelayer = layer;
    clientobject.arrExtra = extra;


    if (clientobject.caketype == "sheetcake") {
        clientobject.length = cakelength;
        clientobject.width = cakewidth;
    }

    if (clientobject.caketype == "roundcake") {
        clientobject.radius = cakeradius;
    }

    return clientobject;
}


function BindPageToId(id, requestedPage) {
    var element = document.getElementById(id);
    if (!element) {
        console.log("Cannot find element with id " + id);
        return;
    }

    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState != 4) {
            return;
        }
        switch (xhr.status) {
            case 200:
                var text = ParseTextAsHTML(xhr.responseText, 'body', true);
                // var text = ParseBody(xhr.responseText);
                element.innerHTML = text;
                break;
            case 404:
                let msg404 = `<h1>Page Not Found.</h1>`;
                element.innerHTML = msg404;
                console.log(requestedPage + "cannot be found.");
                break;
            case 500:
                let serverError = `Server error, please try again later`;
                element.innerHTML = serverError;
                console.log(serverError);
                break;
            default:
                var unknownStatus = `Not handled status ${xhr.status}.`;
                console.log(unknownStatus);
                break;
        }
    }
    var useAsync = true;
    xhr.open("GET", requestedPage, useAsync);
    xhr.send();
}

function ParseTextAsHTML(rawHTML, id, stripJavaScript) {
    var returnString = "";
    // see https://www.w3schools.com/xml/xml_parser.asp 
    // and see https://www.w3schools.com/xml/dom_intro.asp
    var parser = new DOMParser();
    if (parser) {
        var xmlDoc = parser.parseFromString(rawHTML, "text/html");
        if (xmlDoc && xmlDoc.body !== undefined && id !== undefined) {
            switch (id) {
                case 'body':
                    returnString = xmlDoc.body.innerHTML;
                    break;
                case 'head':
                    returnString = xmlDoc.head.innerHTML;
                    break;
                default:
                    var XMLFragment = xmlDoc.getElementsByTagName(id);
                    if (XMLFragment && XMLFragment.length > 0) {
                        returnString = XMLFragment[0].innerHTML;
                    }
                    else {
                        // XML has an error in it
                        console.log(`HTML document has an improperly closed tag such as a <br>, an <img> etc.`);
                    }
                    break;
            }
        }
    }
    else {
        console.log(`Cannot parse fragment as XML`);
        console.log(rawXML);
    }
    if (stripJavaScript) {
        const scriptTagClose = '</script>';
        // see https://www.w3schools.com/jsref/jsref_search.asp
        var startPoint = returnString.search(/<script/i);
        while (startPoint > 0) {
            // see https://www.w3schools.com/jsref/jsref_indexof.asp
            var endPoint = returnString.toLowerCase().indexOf(scriptTagClose, startPoint + 2);
            // see https://www.w3schools.com/jsref/jsref_substring.asp
            if (endPoint > 0) {
                returnString = returnString.substring(0, startPoint) + returnString.substring(endPoint + scriptTagClose.length + 1);
            }
            else {
                returnString = returnString.substring(0, startPoint)
            }
            // Are there any more script tags in the HTML?
            startPoint = returnString.search(/<script>/i);
        }
    }
    return returnString;
}
//#endregion

function displayInfo(clientobject, displayId) {
    let total=0;

    var HTMLFragment = `
        <h1>Order Details:</h1>
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
            if (clientobject.arrExtra[i] == 'creamCheesingIcing') { total += creamCheesingIcing }
            if (clientobject.arrExtra[i] == 'fruitAlmondsTopping') { total += fruitAlmondsTopping }
            if (clientobject.arrExtra[i] == 'fruitJamFilling') { total += fruitJamFilling }
        }
        return total;
    }
}

function calculateSheetTotal(clientobject) {
    const base = 30 * 30;
    const additionalRate = 0.02
    let total = clientobject.length * clientobject.width > base ? ((clientobject.length * clientobject.width - base) * additionalRate + 18) : 18;

    switch (clientobject.cakelayer) {
        case "1":
            return total;
            break;
        case "2":
            return total * 1.5;
            break;
        case "3":
            return total * 2;
            break;
        default:
            console.log("Didn't choose cakelayer.");
    }
}

function calculateRoundTotal(clientobject) {
    const pi = 3.14;
    const base = 3.14 * 15 * 15;
    const additionalRate = 0.02
    let total = 3.14 * clientobject.radius * clientobject.radius > base ? ((3.14 * clientobject.radius * clientobject.radius - base) * additionalRate + 15) : 15;

    switch (clientobject.cakelayer) {
        case "1":
            return total;
            break;
        case "2":
            return total * 1.5;
            break;
        case "3":
            return total * 2;
            break;
        default:
            console.log("Didn't choose cakelayer.")
    }
}
