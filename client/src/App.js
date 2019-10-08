import React, { Component } from 'react';

import logo from './logo.svg';

import './App.css';

class MainThemes extends Component {
    
    render() {
        return (
            <ul className="MainThemes">
              <li><a href="/hardware">Hardware</a></li>
              <li><a href="/windows">Windows</a></li>
              <li><a href="/internet">Internet</a></li>
            </ul>
        );
    };
};

class MainTheme extends Component {
    
    render() {
        return (
            <ul> {
                  this.props.questions.map(
                      (item, index) => <li key={ 'is-symptom-' + index }>
                          <details> <summary>{ item.symptom } </summary>
                              <ol> {
                                    item.solutions.map(
                                        ( solution, id ) => <li key={ 'is-symptom-' + index + '-solution-' + id }>{ solution }</li>
                                    )
                              } </ol>
                            </details>
                          </li>
                  )
            } </ul>
        );
    };
};


class App extends Component {
    state = {
        theme: '',
        question: '',
        responseToPost: '',
        responseQuestion: []
    };

    stateChangeTheme = v => this.setState(
        { theme: v },
        async () => {
            const response = await fetch('/api/theme', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ theme: v }),
            });
            const body = await response.json();
            this.setState({ responseQuestion : body });
        }
    )

    componentDidMount() {
        this.callApi()
            .then(res => this.setState({ response: res.express }))
            .catch(err => console.log(err));
    }

    callApi = async () => {
        const theme = window.location.pathname.split('/')[1]
        if ( theme  ) { this.stateChangeTheme( theme ) }
        else {
            const response = await fetch( this.state.theme ? '/api/theme' : '/api/hello' );
            const body = await response.json();

            if (response.status !== 200) throw Error(body.message);

            return body;
        }
    };
    
    handleSubmit = async e => {
        e.preventDefault();
        if ( this.state.question ){
            const response = await fetch('/api/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: this.state.question }),
            });
            const body = await response.text();

            this.setState({ responseToPost: body });
        }
    };

    render() {
        return (
            <div className="App">
              <header className="App-header">
                <a href="/">
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <form onSubmit={this.handleSubmit}>
                  { this.state.theme && <span> { this.state.theme }: </span> }
                  <input
                    type="text"
                    placeholder="WTF"
                    value={ this.state.question }
                    onChange={ e => this.setState({ question: e.target.value }) }
                    />
                    <button>Submit</button>
                </form>
              </header>
              <main>
                { this.state.theme ? <MainTheme questions={ this.state.responseQuestion }/>  : <MainThemes />  }
              </main>
            </div>
        );
    }
}

export default App;
