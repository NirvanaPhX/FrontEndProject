var  myNamespace = {};
myNamespace.layer = 0;

window.onload = () => {
    sheetcake.onchange = () => {
        ToggleClassState('imgBlock', 'hidden', false);
        displayOptions('caketype', 'cakearea');
    }

    roundcake.onchange = () => {
        ToggleClassState('imgBlock', 'hidden', false);
        displayOptions('caketype', 'cakearea');
    }

    temp.onclick = () => {
        alert(calculateTotal());
    }

    layer1.onclick = () => {
        myNamespace.layer = 1;
    }
    layer2.onclick = () => {
        myNamespace.layer = 2;
    }
    layer3.onclick = () => {
        myNamespace.layer = 3;
    }

}

// Toggle a class on or off
function ToggleClassState(id, toggleClass, force) {
    var inputElement = document.getElementById(id);
    if (inputElement) {
        // Toggle the Class 
        inputElement.classList.toggle(toggleClass, force);
    }
}

function displayOptions(id, displayId) {
        if(RetrieveRadioButtonValue(id)=="sheetcake") {
           document.getElementById(displayId).innerHTML = `
                <label for="length">Length:</label>
                <input type="number" name="length" id="length" min=30 max=60>
                <label for="width">Width:</label>
                <input type="number" name="width" id="width" min=30 max=45>
                `;
        }
        else if (RetrieveRadioButtonValue(id)=="roundcake") {
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
            // alert(1);
        })
    }
}

function calculateSheetTotal() {
    const base = 30 * 30;
    const additionalRate = 0.02
    let length = RetrieveInputValue('length');
    let width = RetrieveInputValue('width');
    let total = length * width > base ? ((length * width - base) * additionalRate + 18) : 18;

    switch (myNamespace.layer) {
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
            throw console.error();
    }
}

function calculateRoundTotal() {
    const pi = 3.14;
    const base = 3.14 * 15 * 15;
    const additionalRate = 0.02
    let radius = RetrieveInputValue('radius'); 
    let total = 3.14 * radius * radius > base ? ((3.14 * radius * radius - base) * additionalRate + 15) : 15;

    switch (myNamespace.layer) {
        case 1:
            return total;
            break;
        case 2:
           return total * 1.5; 
           break;
        case 3:
           return total * 2; 
           break;
    }
}

function calculateTotal() {
    let total = 0;
    var arrExtra = RetrieveCheckBoxValues('addons');

    const creamCheesingIcing = 5;
    const fruitAlmondsTopping = 7;
    const fruitJamFilling = 4;

    for (let i=0; i<arrExtra.length; i++) {
        if(arrExtra[i] == 'creamCheesingIcing') {total += 5}
        if(arrExtra[i] == 'fruitAlmondsTopping') {total += 7}
        if(arrExtra[i] == 'fruitJamFilling') {total += 4}
    }

    if (RetrieveRadioButtonValue('caketype')=="sheetcake") {
        return calculateSheetTotal() + total; 
    } else {
        return calculateRoundTotal() + total;
    }
}