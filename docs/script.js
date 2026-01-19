const DATA_URL = "data.json"; // path to your NDJSON file
const IMAGE_PATH = "images/";
const PLACEHOLDER_IMG = "images/placeholder.png";

// fetch the NDJSON file and parse each line
async function fetchCards() {
    try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error("Failed to fetch data.json");
        const text = await res.text();

        // split by lines and parse each JSON line
        const lines = text.split("\n").filter(line => line.trim().length > 0);
        const cards = lines.map(line => JSON.parse(line));
        return cards;
    } catch (err) {
        console.error(err);
        return [];
    }
}

// create card element
function createCardElement(card) {
    const div = document.createElement("div");
    div.className = "card";

    // image
    const img = document.createElement("img");
    img.src = card.Image ? IMAGE_PATH + card.Image : PLACEHOLDER_IMG;
    img.onerror = () => img.src = PLACEHOLDER_IMG;
    div.appendChild(img);

    // display ID
    const idEl = document.createElement("p");
    idEl.innerHTML = `<strong>ID:</strong> ${card.ID}`;
    div.appendChild(idEl);

    return div;
}

// render all cards
async function renderCards() {
    const container = document.getElementById("card-grid");
    container.innerHTML = "";
    const cards = await fetchCards();
    cards.forEach(card => {
        const cardEl = createCardElement(card);
        container.appendChild(cardEl);
    });
}

renderCards();
