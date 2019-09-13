import React from 'react';
import Axios from 'axios';

class List extends React.Component {
    constructor() {
        super();
        this.state = { pokemonList: [], displayedPokemons: [] };
    }

    // fetches pokemon list only when mounted
    async componentDidMount() {
        await this._fetchPokemonList();
    }

    async _fetchPokemonList() {
        // pokemon-list-related local storage field names
        const lSFieldNames = {
            forPokemonList: 'PL_pokemonList', // stores pokemon list
            forRequestDate: 'PL_requestedAt' // stores last request date
        };

        // retrieves last request execution date
        const executionDate = new Date(localStorage.getItem(lSFieldNames.forRequestDate));

        // only requests API if last request was made more than an hour ago
        if (executionDate && new Date().getHours() - executionDate.getHours() >= 1) {
            const res = await Axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=1000');
            this.setState({ pokemonList: res.data.results });

            // locally stores data
            localStorage.setItem(lSFieldNames.forPokemonList, JSON.stringify(res.data.results));
            localStorage.setItem(lSFieldNames.forRequestDate, new Date());
        }
        else this.setState({ pokemonList: JSON.parse(localStorage.getItem(lSFieldNames.forPokemonList)) });
    }

    handleResearch(event) {
        // resets research if user typed less than 2 chars
        if (!(event.target.value.length >= 2)) {
            this.setState({ displayedPokemons: [] });
            return;
        };

        let toDisplay = this.state.pokemonList.filter(pokemon => pokemon.name.startsWith(event.target.value));
        this.setState({ displayedPokemons: toDisplay });
    }

    render() {
        return (
            <div>
                {/** Input for typing pokemon's name one's interested in */}
                <input type="text"
                placeholder="Search field..."
                onChange={(e) => this.handleResearch(e)}
                />

                <ul>
                    {this.state.displayedPokemons.map((item, index) => {
                        return (<li key={index}>{item.name}</li>)
                    })}
                </ul>
            </div>
        );
    }
}

export default List;