window.onload = () => {
    sheetcake.change() = ()=> {
        ToggleClassState('', 'hidden', true);
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