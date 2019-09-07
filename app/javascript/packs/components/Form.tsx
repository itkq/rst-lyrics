import { Button, Card, FormGroup, InputGroup, Intent } from '@blueprintjs/core';
import * as React from 'react';

import Lyric from './Lyric';

interface State {
    query: string;
    lyrics: LyricData[];
}

const ENTER_KEY = 13;

interface LyricData {
    title: string;
    artist: string;
    composer: string;
    lyricist: string;
    lyric: string;
}

export default class Form extends React.Component<{}, State> {
    private constructor(props: {}) {
        super(props);

        this.state = {
            query: '',
            lyrics: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    public render() {
        return (
            <div>
                <Card interactive={false}>
                    <FormGroup label="Query" helperText="Hit enter key to search">
                        <InputGroup id="query" placeholder="Type anything" onChange={this.handleChange} onKeyDown={this.handleKeyDown}/>
                    </FormGroup>
                    <Button intent={Intent.PRIMARY} icon="search" text="Search" onClick={this.handleClick}/>
                </Card>
                {this.renderLyrics()}
            </div>
        );
    }

    private renderLyrics() {
        return this.state.lyrics.map((lyric: LyricData, index: number) => {
            return (
                <Lyric key={index} title={lyric.title} artist={lyric.artist} composer={lyric.composer} lyricist={lyric.lyricist} lyric={lyric.lyric} />
            );
        });
    }

    private handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ query: evt.target.value });
    }

    private handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
        if (evt.keyCode === ENTER_KEY) {
            this.request();
        }
    }

    private handleClick() {
        this.request();
    }

    private request() {
        if (this.state.query === '') {
            return;
        }

        // TODO
    }
}
