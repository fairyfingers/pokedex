import React from 'react';
import Axios from 'axios';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    // this.state = { name: 'igglybuff' };
    this.state = { 
      selected: null, 
      pokemonList: [],
      displayedPokemons: [], 
      types: [],
      stats: [],
      mainSprite: null
    };
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

  async _fetchPokemonInfo() {
    // does not fetch anything if there is no selected name
    if (!this.state.selected) return;
 
    const res = await Axios.get(`https://pokeapi.co/api/v2/pokemon/${this.state.selected}`);
    this.setState({ record: res.data });
    this.setState({ types: res.data.types });
    this.setState({ stats: res.data.stats.reverse() });
    this.setState({ mainSprite: res.data.sprites['front_default'] });
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

  async handleClick(event, name) {
    this.setState({ selected: name }, async () => {
      await this._fetchPokemonInfo();
    });
  }

  displayInfo() {
    if (this.state.selected) {
      return (
        <div className="right-side">
            <div className="header">
              <img src={this.state.mainSprite} alt={this.state.selected} />
              <h1 className="title">{this.state.selected}</h1>
            </div>
            <h3>Types:</h3>
            {this.state.types.map((element, index) => {
                return (
                    <li key={index}>{element.type.name}</li>
                );
            })}
  
            <h3>Base Stats:</h3>
            {this.state.stats.map((element, index) => {
                return (
                    <li key={index}>{element.base_stat} {element.stat.name}</li>
                );
            })}
          </div>
      )
    } else return (
      <p className="tip">Chose a name to display some info :)</p>
    );
  }

  render() {
    return (
      <div>
        <div className="left-side">
          {/** Input for typing pokemon's name one's interested in */}
          <input type="text"
          placeholder="Search field..."
          onChange={(e) => this.handleResearch(e)}
          />

          <ul>
              {this.state.displayedPokemons.map((item, index) => {
                  return (
                      <li key={index} onClick={(e) => this.handleClick(e, item.name)}>
                        <span className="link">{item.name}</span>
                      </li>
                  );
              })}
          </ul>
        </div>
        <div className="right-side">
          {this.displayInfo()}
        </div>
      </div>
    );
  }
}

export default App;
