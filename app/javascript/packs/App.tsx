import { Classes } from '@blueprintjs/core';
import * as React from 'react';
import Form from './components/Form';
import Navbar from './components/Navbar';

interface State {
  darkTheme: boolean;
}

class App extends React.Component<{}, State> {
  private constructor(props: any) {
    super(props);

    const darkTheme = localStorage.getItem("darkTheme");
    if (darkTheme !== null && darkTheme === "true") {
      this.state = { darkTheme: true };
    } else {
      this.state = { darkTheme: false };
    }
  }

  public render() {
    document.body.className = this.state.darkTheme ? "bp3-dark" : "bp3-body";
    return (
      <div className={this.themeClass()}>
        <Navbar darkTheme={this.state.darkTheme} toggleFunc={() => { this.toggleTheme(); }} />
        <Form />
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
