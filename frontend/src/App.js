import { VariableSizeList as List } from 'react-window';
import React from 'react';
import './App.css';

export default class App extends React.Component {

  state = {
    offset: 0,
    articles:[],
    fetching: false,
    archivedById:{

    }
  }

  
  componentDidMount() {
    this.getArticles();
  }

  handleClick = articleId => () => {
    this.setState({ 
      archivedById: {...this.state.archivedById, [articleId]: true}},
      () => {
        fetch(`/articles/${articleId}`, {method:'DELETE'})
      }
    )
  }

  getArticles = () => {
    if (this.state.fetching === true) return;
    this.setState(
      { fetching: true },
      () => {
        fetch(`/articles?offset=${this.state.offset}`, {method:'GET'})
          .then(res => res.json())
          .then(({ articles }) => {
            this.setState({
              articles: [
                ...this.state.articles,
                ...articles
              ],
              offset: this.state.offset + articles.length
            })
          })
          .then(() => this.setState({ fetching: false }));
      }
    );
  }

  render() {
    const filteredList = this.state.articles.filter(
      a => this.state.archivedById[a.id] === undefined);

    return (
      <div className="App">
        <button onClick={this.getArticles}> ADD MORE ARTICLES! </button>
        <ul>
          {filteredList.map(a => (
            <li onClick={this.handleClick(a.id)} className="link" key={a.id}>
              <a href={a.url}>{a.title}</a>
            </li>
          ))}
        </ul> 





      </div>
    );
  }
}
