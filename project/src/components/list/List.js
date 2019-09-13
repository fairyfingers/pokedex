import React from 'react';
import Axios from 'axios';

class List extends React.Component {
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
            localStorage.setItem(lSFieldNames.forPokemonList, JSON.stringify(res.data.results));
            localStorage.setItem(lSFieldNames.forRequestDate, new Date());
        }
    }

    render() {
        return (
            /** Input for typing pokemon's name one's interested in */
            <input type="text" name="search" placeholder="Search field..." />
        );
    }
}

export default List;