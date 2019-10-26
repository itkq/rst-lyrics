import { Classes } from '@blueprintjs/core';
import * as React from 'react';
import Form from './components/Form';
import Navbar from './components/Navbar';

interface Props {
  query: string;
}

interface State {
  darkTheme: boolean;
}

class App extends React.Component<Props, State> {
  private constructor(props: Props) {
    super(props);

    const darkThemeValue = localStorage.getItem("darkTheme");
    const darkTheme = darkThemeValue !== null && darkThemeValue === "true";
    this.state = { darkTheme };
  }

  public render() {
    document.body.className = this.state.darkTheme ? "bp3-dark" : "bp3-body";
    return (
      <div className={this.themeClass()}>
        <Navbar darkTheme={this.state.darkTheme} toggleFunc={() => { this.toggleTheme(); }} />
        <Form query={this.props.query}/>
      </div>
    );
  }

  // TODO: lambda
  private toggleTheme() {
    if (this.state.darkTheme) {
      localStorage.setItem("darkTheme", "false");
    } else {
      localStorage.setItem("darkTheme", "true");
    }
    this.setState((prevState: State) => {
      return { darkTheme: !prevState.darkTheme };
    });
  }

  private themeClass(): string {
    if (this.isDarkTheme()) {
      return Classes.DARK;
    } else {
      return '';
    }
  }

  private isDarkTheme(): boolean {
    return this.state.darkTheme;
  }
}

export default App;
