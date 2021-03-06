let demo = () => {
	let rate = fx(1).from("GBP").to("USD")
	//alert("f1 = $" + rate.toFixed(4))
}

fetch('https://api.exchangeratesapi.io/latest')
.then((resp) => resp.json())
.then((data) => fx.rates = data.rates)
.then(demo)

var newNamespace = {};
newNamespace.ArrayOfCurrency = [];

const createCurrency = (id) => {
	return {
		id
	}
}

//function currencySelected() {
	
// Validate element id and add it to array
function addToCurrencyList(id) {
	let element = document.getElementById(id);
	if (element && element.innerHTML != undefined) {
		newNamespace.ArrayOfCurrency.push(createCurrency(id));	
		createCurrency(id).selected = false;
	} else {
		console.log("Did not find element " + element);
	}
}

//Find all the icons of possible conversion and add them to an array
function populateCurrencyList() {
	addToCurrencyList("eurfig");
	addToCurrencyList("usafig");
	addToCurrencyList("canfig");
	addToCurrencyList("btcfig");
	addToCurrencyList("ethfig");
}

function onclickEvent() {
	for (let i=0; i<newNamespace.ArrayOfCurrency.length; i++) {
		newNamespace.ArrayOfCurrency[i].onclick = () => {
			changeToSelected(newNamespace.ArrayOfCurrency[i]);
		}
	}
}

function changeToSelected(currency) {
	currency.selected = !selected;
	alert("1");
}

// Change the background and border of the selected element
window.onload = () => { 
	populateCurrencyList();
	
	for(var i=0; i<newNamespace.ArrayOfCurrency.length;i++) {
		alert(newNamespace.ArrayOfCurrency[i].id);
		alert(newNamespace.ArrayOfCurrency[i].selected);
	}
	onclickEvent();
//	const demo = document.getElementById("eurfig");
//	demo.onclick = () => {
//		alert("test");
	//}
}	
