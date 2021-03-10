
var newNamespace = {};
newNamespace.ArrayOfFromCurrency = [];
newNamespace.ArrayOfToCurrency = [];
newNamespace.time = null;

const createCurrency = (id, symbol, selected) => {
	return {
		id,
		symbol,
		selected
	}
}

function findSelected(list) {
	for (let i = 0; i < list.length; i++) {
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
		for (let i = 0; i < list.length; i++) {
			if (list[i].id != currency.id) {
				list[i].selected = false;
				document.getElementById(list[i].id).style.background = "#0071eb";
			}
		}
	}
}

function addListenerToArray(list, displayId, id1, id2) {
	let rate;
	for (let i = 0; i < list.length; i++) {
		document.getElementById(list[i].id).addEventListener("click", event => {
			changeToSelected(list[i], list, displayId);
			let element1 = document.getElementById(id1);
			let element2 = document.getElementById(id2);
			if (element1 && element2 && (element1.value != 0 || element2.value != 0)) {
				rate = findRate();
				element2.value = (element1.value * rate).toFixed(2);
			}
			UpdateElement("updaterate", `The rate is <em>${rate}</em>`);
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
			var time = new Date(newNamespace.time * 1000);
			UpdateElement("updatetime", `The rate was updated at <em>${time}</em>`);
			UpdateElement("updaterate", `The rate is <em>${rate}</em>`);
			UpdateElement("otherinfo", `The rate is updated every hour.`);
		})
	}
}

function UpdateElement(id, newValue) {
	var elementOnForm = document.getElementById(id);
	if (elementOnForm && elementOnForm.innerHTML !== undefined) {
		elementOnForm.innerHTML = newValue;
	}
	else {
		console.log(`Could not field id '${id}' to update innerHTML\n${newValue}`);
	}
}

function findRate() {
	var rate = 1.0;
	var currencyFrom = findSelected(newNamespace.ArrayOfFromCurrency);
	var currencyTo = findSelected(newNamespace.ArrayOfToCurrency);

	if (currencyFrom.symbol && currencyTo.symbol) {
		fetchData();
	}

	// if 
	try {
		return fx(1).from(currencyFrom.symbol).to(currencyTo.symbol);
	} catch {
		setUpDefaultRate();
		return fx(1).from(currencyFrom.symbol).to(currencyTo.symbol);
	}
}

function fetchData() {
	// Fetch data through Open Exchange Rates API
	fetch('https://openexchangerates.org/api/latest.json?app_id=74c88ee76ec040979bc2b7841b5b5813')
		//Convert data to JSON format
		.then((resp) => resp.json())
		//Update rates in money.js to current rates
		.then((data) => {
			fx.rates = data.rates;
			fx.base = data.base;
			//Grap timestamp
			newNamespace.time = data.timestamp;
		})
		.catch((reason) => {
			console.log("Handle rejected promise (${reason}) here.");
		})
}

function setUpDefaultRate() {

	fx.rates = {
		CAD: 1.26541,
		ETH: 0.00061,
		BTC: 0.000020207795,
		USD: 1,
		EUR: 0.839201
	};
	fx.base = 'USD';
}

// Change the background and border of the selected element
window.onload = () => {
	populateCurrencyList();

	addListenerToArray(newNamespace.ArrayOfFromCurrency, "FromHidden", "from", "to");
	addListenerToArray(newNamespace.ArrayOfToCurrency, "ToHidden", "from", "to");

	fetchData();
	setUpDefaultRate();

	addListenerToInput("from", "to");
}
