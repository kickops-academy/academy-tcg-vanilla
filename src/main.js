/**
 * @type {HTMLElement}
 */
const APP_MENU = document.querySelector("#menu");

/**
 * @type {HTMLElement}
 */
const APP_MAIN = document.querySelector("#main");

/**
 * @type {string}
 */
const API_URL = "http://localhost:3000";

/**
 * @type {Record<string, string>}
 */
let FILTERS_DATA = {};

/**
 * @type {Proxy<Record<string, string>>}
 */
const FILTERS = new Proxy(FILTERS_DATA, {
  set(target, property, value) {
    target[property] = value;


    APP_MAIN.childNodes.forEach((node) => {
      node.remove();
    });

    if (value) {
      const filtered = POKEMONS.filter((pokemon) => {
        return pokemon.types.includes(value);
      });

      if (filtered.length === 0) {
        const noResults = document.createElement("p");
        noResults.innerText = "No results found";
        APP_MAIN.appendChild(noResults);
      } else {
        filtered.forEach(async (pokemon) => {
          const cardImg = document.createElement("img");
          cardImg.src = `${pokemon.image}/low.png`;
          cardImg.alt = pokemon.name;
          cardImg.addEventListener("load", (evt) => {
            APP_MAIN.appendChild(cardImg);
          });
          cardImg.addEventListener("error", (evt) => {
            console.log("Error loading image:" + pokemon.name);
          });
        });
      }
    }

    return true;
  },
  get(target, property) {
    return target[property];
  }
});

/**
 * @type {Array<Record<string, string>>}
 */
let POKEMON_LIST = [];

/**
 * @type {Proxy<Array<Record<string, string>>>}
 */
const POKEMONS = new Proxy(POKEMON_LIST, {
  set(target, property, value) {
    target[property] = value;

    const total = document.querySelector("#total");
    if (total) {
      total.innerText = target.length;
    }

    return true;
  },
  get(target, property) {
    return target[property];
  } 
});

/**
 * @type {Record<string, string>}
 */
const POKEMON_TYPES = {
  "Normal": "⚪️",
  "Fire": "🔥",
  "Fighting": "🥊",
  "Water": "💧",
  "Flying": "🕊️",
  "Grass": "🌿",
  "Poison": "☠️",
  "Electric": "⚡️",
  "Ground": "🌍",
  "Psychic": "🔮",
  "Rock": "🪨",
  "Ice": "❄️",
  "Bug": "🐛",
  "Dragon": "🐉",
  "Ghost": "👻",
  "Dark": "🌑",
  "Steel": "⚙️",
  "Fairy": "🧚"
};

function createReloadButton() {
  const button = document.createElement("button");
  button.innerText = "Load more pokemons";
  button.addEventListener("click", () => {
    loadPokemons();
  });
  APP_MENU.appendChild(button);
}

function createMenuButton(label, value) {
  const button = document.createElement("button");
  button.innerText = `${value} ${label}`;
  button.addEventListener("click", () => {
    FILTERS.type = label;
  });
  APP_MENU.appendChild(button);
}

/**
 * Carrega uma quantidade específica de cartas de pokémons de uma categoria.
 * 
 * Desafios:
 * - Como podemos melhorar a experiência do usuário ao carregar os pokémons?
 * - Como podemos tratar erros de rede ou falhas na API?
 * - Como podemos verificar se os dados retornados são válidos?
 * - Se o número de parâmetros for maior que 2, isso pode ser problemático, como podemos prevenir isso?
 * - Existe uma forma de validar os parâmetros passados para a função?
 * 
 * @param {*} amount 
 * @param {*} category 
 */
async function loadPokemons(
  amount = 20, 
  category = "Pokemon"
) {
  APP_MAIN.childNodes.forEach((node) => {
    node.remove();
  });

  const message = document.createElement("p");
  message.innerText = "Loading pokemons...";
  APP_MAIN.appendChild(message);
  
  const requestUrl = new URL(`${API_URL}/card/pokemon/random`);
  requestUrl.searchParams.set("amount", amount);
  requestUrl.searchParams.set("category", category);

  // Se o request fetch falhar, o que acontece? Como podemos tratar isso?
  const pokemons = await fetch(requestUrl.toString(), {
    method: "GET"
  });

  const data = await pokemons.json();
  
  // Existe uma forma de verificar se data é um array? Se sim, como?
  if (data && data.length > 0) {
    POKEMONS.push(...data);
  }

  message.innerText = "Pokemons loaded successfully!";
}

function mapCategoriesToMenuButtons() {
  // Existe uma interface melhor para mapear os tipos de Pokémon?
  // Botões são a melhor forma?
  // Como podemos melhorar a usabilidade do menu?
  // Como podemos saber se o usuário clicou em um botão de tipo e indicar isso visualmente?
  Object.entries(POKEMON_TYPES).map(([label, value]) => {
    createMenuButton(label, value);
  });
}

createReloadButton();
mapCategoriesToMenuButtons();
