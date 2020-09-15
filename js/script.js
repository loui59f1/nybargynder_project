// Definere variabler
let menu;
let modal = document.querySelector("#modal");
let filter = "alle";
const url = "https://spreadsheets.google.com/feeds/list/1cAqkDsR47rgBQSuukBgDbAvSEqFL5-HIcXBbo4SgzDw/od6/public/values?alt=json";

// Venter på alt indhold er loadet --> funktion loadJSON
document.addEventListener("DOMContentLoaded", loadJSON);

// Funktion der henter indhold/data fra Google Sheet --> visMenu
async function loadJSON() {
	const JSONData = await fetch(url);
	menu = await JSONData.json();
	addEventListenersToButtons();
	visMenu();
}

// Funktion der sætter data fra Google Sheet ind i #liste (list variabel) template
function visMenu() {
	const list = document.querySelector("#liste");
	const template = document.querySelector("template");
	// Tømmer sektion for indhold
	list.innerHTML = "";
	// Loop igennem indhold og filtrerer
	menu.feed.entry.forEach(drink => {
		if (filter == "alle" || filter == drink.gsx$kategori.$t) {
			console.log(drink);
			const clone = template.cloneNode(true).content;
			clone.querySelector("h2").textContent = drink.gsx$name.$t;
			clone.querySelector("img").src = "img/" + drink.gsx$image.$t + ".jpg";
			clone.querySelector(".kort").textContent = drink.gsx$short.$t;
			clone.querySelector(".oprindelse").textContent = "Oprindelse: " + drink.gsx$origin.$t;

			// Når man klikker på article/drink vil funktionen visDetaljer (modal/popup) kaldes
			clone.querySelector("article").addEventListener("click", () => visDetaljer(drink));
			list.appendChild(clone);
		}
	})
}

// Denne funktion sætter vores drink info ind i den klargjorte modal sektion
function visDetaljer(drink) {
	modal.style.display = "block";
	modal.querySelector("h2").textContent = drink.gsx$name.$t;
	modal.querySelector(".lang").textContent = drink.gsx$long.$t;
	modal.querySelector(".oprindelse").textContent = drink.gsx$origin.$t;
	modal.querySelector("img").src = "img/" + drink.gsx$image.$t + ".jpg";
}

// Ved klik på krydset lukkes popup/modal
document.querySelector("#close").addEventListener("click", () => modal.style.display = "none");

// Ved klik udenfor modal lukkes den også - kode fundet online.
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

// Ved klik på alle filter knapper, kaldes filterBtns funktionen
function addEventListenersToButtons() {
	document.querySelectorAll(".filter").forEach((btn) => {
		btn.addEventListener("click", filterBtns);
	})
}

// Denne funktion filtrere på indholdet ved at kigge på dataset og holde op mod kategorien på drinks
function filterBtns() {
	filter = this.dataset.kategori;
	document.querySelector(".heading").textContent = this.textContent;
	document.querySelectorAll(".filter").forEach((btn) => {
		btn.classList.remove("active");
	})
	this.classList.add("active");
	visMenu();
}
