var myNamespace = {};
myNamespace.layer = 0;
myNamespace.btnGroup = [];

window.onload = () => {
    BindEventsToField();

    sheetcake.onchange = () => {
        ToggleClassState('imgBlock', 'hidden', false);
        displayOptions('caketype', 'cakearea');
    }

    roundcake.onchange = () => {
        ToggleClassState('imgBlock', 'hidden', false);
        displayOptions('caketype', 'cakearea');
    }

    layer1.onclick = () => {
        myNamespace.layer = 1;
        document.getElementById("layer1").style.background = "#a27d58";
        document.getElementById("layer2").style.background = "white";
        document.getElementById("layer3").style.background = "white";
    }
    layer2.onclick = () => {
        myNamespace.layer = 2;
        document.getElementById("layer2").style.background = "#a27d58";
        document.getElementById("layer1").style.background = "white";
        document.getElementById("layer3").style.background = "white";
    }
    layer3.onclick = () => {
        myNamespace.layer = 3;
        document.getElementById("layer3").style.background = "#a27d58";
        document.getElementById("layer2").style.background = "white";
        document.getElementById("layer1").style.background = "white";
    }


    reset.onclick = () => {
        document.getElementById("cakearea").innerHTML = "";
        ToggleClassState("imgBlock", "hidden", true);
    }

    var myForm = document.getElementById('myForm');
    myForm.onsubmit = () => {
        var w = window.open('order.html', 'Popup_Window', 'toolbar=0, scrollbars=0,menubar=0, resizeable=0,width=500,height=500,left=50%,top=%50');
        this.target = 'Popup_window';
        getInfo();
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

function displayOptions(id, displayId) {
    if (RetrieveRadioButtonValue(id) == "sheetcake") {
        document.getElementById(displayId).innerHTML = `
                <label for="length">Length:</label>
                <input type="number" name="length" id="length" min=30 max=60>
                <label for="width">Width:</label>
                <input type="number" name="width" id="width" min=30 max=45>
                `;
    }
    else if (RetrieveRadioButtonValue(id) == "roundcake") {
        document.getElementById(displayId).innerHTML = `
                <label for="radius">Radius:</label>
                <input type="number" name="radius" id="radius" min=15 max=30>
                `;
    }
}

function addListenerToElement(id, displayId) {
    let element = document.getElementById(id);
    if (element && element.value != undefined) {
        element.addEventListener("click", event => {
            displayOptions(id, displayId)
        })
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

    clientobject.caketype = RetrieveRadioButtonValue("caketype");
    //if (myNamespace.layer != 0) {
        clientobject.cakelayer = myNamespace.layer;
    //}
    //else {
    //    HasFocusEdited("imgBlock", "help-message", "Please choose how many layers you would like");
    //}
    clientobject.arrExtra = RetrieveCheckBoxValues('addons');


    if (clientobject.caketype == "sheetcake") {
        clientobject.length = RetrieveInputValue("length");
        clientobject.width = RetrieveInputValue("width");
    }

    if (clientobject.caketype == "roundcake") {
        clientobject.radius = RetrieveInputValue("radius");
    }

    localStorage.setItem('customer', JSON.stringify(clientobject));
}

