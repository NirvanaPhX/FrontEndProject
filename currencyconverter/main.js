
var newNamespace = {};
newNamespace.ArrayOfFromCurrency = [];
newNamespace.ArrayOfToCurrency = [];

const createCurrency = (id, symbol, selected) => {
	return {
		id,
		symbol,
		selected
	}
}

function findSelected(list) {
	for (let i=0; i<list.length; i++) {
		if (list[i].selected) {
			return list[i];
		}
	}
}
	
// Validate element id and add it to array
function addToCurrencyList(id, symbol, selected, list) {
	let element = document.getElementById(id);
	if (element && element.innerHTML != undefined) {
		list.push(createCurrency(id, symbol, selected));	
	} else {
		console.log("Did not find element " + element);
	}
}

//Find all the icons of possible conversion and add them to an array
function populateCurrencyList() {
	addToCurrencyList("eurfigf", "EUR", false, newNamespace.ArrayOfFromCurrency);
	addToCurrencyList("usafigf", "USD", false, newNamespace.ArrayOfFromCurrency);
	addToCurrencyList("canfigf", "CAD", true, newNamespace.ArrayOfFromCurrency);
	addToCurrencyList("btcfigf", "BTC", false, newNamespace.ArrayOfFromCurrency);
	addToCurrencyList("ethfigf", "ETH", false, newNamespace.ArrayOfFromCurrency);
	addToCurrencyList("eurfigt", "EUR", false, newNamespace.ArrayOfToCurrency);
	addToCurrencyList("usafigt", "USD", true, newNamespace.ArrayOfToCurrency);
	addToCurrencyList("canfigt", "CAD", false, newNamespace.ArrayOfToCurrency);
	addToCurrencyList("btcfigt", "BTC", false, newNamespace.ArrayOfToCurrency);
	addToCurrencyList("ethfigt", "ETH", false, newNamespace.ArrayOfToCurrency);
}

function changeToSelected(currency, list, displayId) {
	if (!currency.selected) {
		currency.selected = true; 
		document.getElementById(currency.id).style.background = "rgb(10, 20, 110)";
		document.getElementById(displayId).innerHTML = `<h2>${currency.symbol}</h2>`; 
		for (let i=0; i<list.length; i++) {
			if (list[i].id != currency.id) {
				list[i].selected = false;
				document.getElementById(list[i].id).style.background = "#0071eb";
			}
		}
	}
}

function addListenerToArray(list, displayId, id1, id2) {
	for (let i=0; i<list.length; i++) {
		document.getElementById(list[i].id).addEventListener("click", event => {
			changeToSelected(list[i], list, displayId);
			let element1 = document.getElementById(id1);
			let element2 = document.getElementById(id2);
			if (element1 && element2 && (element1.value != 0 || element2.value !=0) ) {
				let rate = findRate();
				element2.value = (element1.value * rate).toFixed(2);
				
			}
		})
	}
}

function addListenerToInput(id1, id2) {
	let element1 = document.getElementById(id1);
	let element2 = document.getElementById(id2);
	if (element1 && element2 && element1.value != undefined && element2.value != undefined) {
		element1.addEventListener("change", event => {
			let rate = findRate();
			element2.value = (element1.value * rate).toFixed(2);
		})
	}
}

function findRate() {
	var currencyFrom = findSelected(newNamespace.ArrayOfFromCurrency); 
	var currencyTo = findSelected(newNamespace.ArrayOfToCurrency); 
	
	if (currencyFrom.symbol && currencyTo.symbol) {
		// Fetch the current rates from the following API
		fetch('https://openexchangerates.org/api/latest.json?app_id=74c88ee76ec040979bc2b7841b5b5813')
		// Convert data to JSON format
		.then((resp) => resp.json())
		// Update rates in money.js to current rates
		.then((data) => fx.rates = data.rates)
		// Apply the rate
	}

	return fx(1).from(currencyFrom.symbol).to(currencyTo.symbol);
}

function setUpDefaultRate() {
	fx.rates = {
		CAD: 1.26541,
		ETH: 0.00061,
		BTC: 0.000020207795,
		USD: 1,
		EUR: 0.839201
	}
	fx.base = 'USD';
}
	


// Change the background and border of the selected element
window.onload = () => { 
	populateCurrencyList();
	
	addListenerToArray(newNamespace.ArrayOfFromCurrency, "FromHidden", "from", "to");
	addListenerToArray(newNamespace.ArrayOfToCurrency, "ToHidden", "to", "from");

	setUpDefaultRate();

	fetch('https://openexchangerates.org/api/latest.json?app_id=74c88ee76ec040979bc2b7841b5b5813')
	.then((resp) => resp.json())
	.then((data) => fx.rates = data.rates)

	fx.append('ETH', 0.00061);
		
	addListenerToInput("from", "to");
	addListenerToInput("to", "from");
}	
