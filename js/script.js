let menu;
let modal = document.querySelector("#modal");
let filter = "alle";
const url = "https://spreadsheets.google.com/feeds/list/1cAqkDsR47rgBQSuukBgDbAvSEqFL5-HIcXBbo4SgzDw/od6/public/values?alt=json";


document.addEventListener("DOMContentLoaded", loadJSON);

async function loadJSON() {
	const JSONData = await fetch(url);
	menu = await JSONData.json();
	addEventListenersToButtons();
	visMenu();
}

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
			clone.querySelector("article").addEventListener("click", () => visDetaljer(drink));
			list.appendChild(clone);
		}
	})
}

function visDetaljer(drink) {
	modal.style.display = "block";
	modal.querySelector("h2").textContent = drink.gsx$name.$t;
	modal.querySelector(".lang").textContent = drink.gsx$long.$t;
	modal.querySelector(".oprindelse").textContent = drink.gsx$origin.$t;
	modal.querySelector("img").src = "img/" + drink.gsx$image.$t + ".jpg";
}

document.querySelector("#close").addEventListener("click", () => modal.style.display = "none");

// Ved klik udenfor modal lukkes den
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}

function addEventListenersToButtons() {
	document.querySelectorAll(".filter").forEach((btn) => {
		btn.addEventListener("click", filterBtns);
	})
}

function filterBtns() {
	filter = this.dataset.kategori;
	document.querySelector(".heading").textContent = this.textContent;
	document.querySelectorAll(".filter").forEach((btn) => {
		btn.classList.remove("active");
	})
	this.classList.add("active");
	visMenu();
}
