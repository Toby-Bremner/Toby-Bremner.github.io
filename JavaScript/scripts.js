let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
let pokemonRepository = (function () {
  let pokemonList = [];

  return {
    add: function (pokemon) {
      if (
        typeof pokemon === "object" &&
        "name" in pokemon &&
        "detailsUrl" in pokemon
      ) {
        pokemonList.push(pokemon);
      } else {
        console.log("Pokemon is not correct");
      }
    },
    getAll: function () {
      return pokemonList;
    },

    addListItem: function (pokemon) {
      let pokemonList = document.querySelector(".pokemon-list");
      let listPokemon = document.createElement("li");
      let button = document.createElement("button");
      button.innerText = pokemon.name;
      button.classList.add("button-class");
      listPokemon.appendChild(button);
      pokemonList.appendChild(listPokemon);
      pokemonRepository.addNewListener(button, pokemon);
    },
    //new code below for assignment 1.6
    addNewListener: function (button, pokemon) {
      button.addEventListener("click", function (event) {
        pokemonRepository.showDetails(pokemon);
      });
    },
    showDetails: function (pokemon) {
      console.log(pokemon);
    },

    loadList: function () {
      return fetch(apiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (json) {
          json.results.forEach(function (item) {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url,
            };
            pokemonRepository.add(pokemon);
          });
        })
        .catch(function (e) {
          console.error(e);
        });
    },
    loadDetails: function (pokemon) {
      let url = pokemon.detailsUrl;
      return fetch(url)
        .then(function (response) {
          return response.json();
        })
        .then(function (details) {
          pokemon.imageUrl = details.sprites.front_default;
          pokemon.height = details.height;
          pokemon.weight = details.weight;
          pokemon.types = details.types.map((type) => type.type.name).join(",");
          pokemon.abilities = details.abilities
            .map((ability) => ability.ability.name)
            .join(",");
        })
        .catch(function (e) {
          console.error(e);
        });
    },
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
