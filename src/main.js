const APP_MENU = document.querySelector("#menu");
const APP_STAGE = document.querySelector("#stage");
const APP_FILTER_NAME = document.querySelector("#filter-name");

const APP_LOADER = document.querySelector("#loader");
APP_LOADER.classList.add("hidden");

const STORE = {};
const APP_STORE = new Proxy(STORE, {
  set(target, prop, value) {
    target[prop] = value;

    if (prop === "type") {
      APP_FILTER_NAME.innerHTML = value
        ? `Filter: ${value}`
        : `No filter applied`;

      if (value) {
        loadPokemonByType(value);
      } else {
        APP_STAGE.innerHTML = "No cards.";
      }
    }

    if (prop === "cards") {
      console.log(`Setting cards:`, value);
      renderCards(value);
    }

    return true;
  },
});

const POKEMON_TYPES = {
  Colorless: "⚪️",
  Darkness: "🌑",
  Dragon: "🐉",
  Fairy: "🧚",
  Fighting: "🥊",
  Fire: "🔥",
  Grass: "🌿",
  Lightning: "⚡️",
  Metal: "⚙️",
  Psychic: "🔮",
  Water: "💧",
};

function renderCards(cards) {
  APP_STAGE.innerHTML = "";
  cards.forEach((card) => {
    const cardImage = document.createElement("img");
    cardImage.src = `${card.image}/low.png`;
    cardImage.alt = card.name;
    cardImage.addEventListener("load", () => {
      APP_STAGE.appendChild(cardImage);
    });
    cardImage.addEventListener("error", () => {
      console.error(`Failed to load image for card: ${card.name}`);
    });
  });
}

async function loadPokemonByType(type) {
  APP_LOADER.classList.remove("hidden");

  try {
    const response = await fetch(
      `http://localhost:3000/card/pokemon/${type}?amount=8`,
      {
        method: "GET",
      }
    );

    const cardData = await response?.json();
    if (Array.isArray(cardData)) {
      // Clear APP_CARDS before adding new data
      APP_STORE.cards = cardData;
    }
  } catch (err) {
    console.error(`Error loading Pokémon of type ${type}:`, err);
  } finally {
    APP_LOADER.classList.add("hidden");
  }
}

function generateButton(type, icon) {
  const button = document.createElement("button");
  button.textContent = `${icon} ${type}`;
  button.addEventListener("click", () => {
    if (APP_STORE.type === type) {
      APP_STORE.type = null;
    } else {
      APP_STORE.type = type;
    }
  });
  APP_MENU.appendChild(button);
}

function mapTypesToButtons() {
  Object.entries(POKEMON_TYPES).forEach(([type, icon]) => {
    console.log(`Mapping type: ${type} with icon: ${icon}`);
    generateButton(type, icon);
  });
}

function bootstrap() {
  mapTypesToButtons();
}

bootstrap();
