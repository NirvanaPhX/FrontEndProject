function slideshow() {
    var i;
    var x = document.getElementsByClassName("Slides");

    for(i=0; i<x.length; i++) {
        x[i].getElementsByClassName.display = "none";
    }
    index++;
    if (index > x.length) {index = 1}
    x[index].style.display = "block";
    setTimeout(slideshow, 5000);
}

window.onload() = () => {
    var index = 0;
    slideshow();
}