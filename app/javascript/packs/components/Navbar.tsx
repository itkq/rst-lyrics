import { Alignment, Button, Navbar as BPNavbar } from '@blueprintjs/core';
import * as React from 'react';

interface Props {
    toggleFunc: () => void;
    darkTheme: boolean;
}

interface State {
    darkTheme: boolean;
}

type ThemeIcon = "flash" | "moon";

class App extends React.Component<Props, State> {
    private constructor(props: any) {
        super(props);
        this.state = {
            darkTheme: this.props.darkTheme,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    public render() {
        return (
            <BPNavbar>
                <BPNavbar.Group align={Alignment.LEFT}>
                    <BPNavbar.Heading>rst-lyrics</BPNavbar.Heading>
                </BPNavbar.Group>
                <BPNavbar.Group align={Alignment.RIGHT}>
                    <Button className="bp3-minimal" icon={this.themeIcon()} onClick={this.handleClick}/>
                </BPNavbar.Group>
            </BPNavbar>
        );
    }

    private handleClick() {
        this.setState((prevState: State) => {
            return { darkTheme: !prevState.darkTheme };
        });
        this.props.toggleFunc();
    }

    private themeIcon(): ThemeIcon {
        if (this.isDarkTheme()) {
            return "flash";
        } else {
            return "moon";
        }
    }

    private isDarkTheme() {
        return this.state.darkTheme;
    }
}

export default App;
