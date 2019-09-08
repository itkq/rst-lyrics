import { Card } from '@blueprintjs/core';
import * as React from 'react';

import { HitData } from './Form';

interface Props {
    hitData: HitData;
}

interface State {
    isOpen: boolean;
}

export default class Lyric extends React.Component<Props, State> {
    private constructor(props: Props) {
        super(props);

        this.state = {
            isOpen: false,
        };
    }

    public render() {
        // TODO: Interactive card

        return (
            <div>
                <Card interactive={false}>
                    <h3>{this.renderTitle()} / {this.renderArtist()}</h3>
                    <p>作曲: {this.renderComposer()} 作詞: {this.renderLyricist()}</p>
                    <p className="bp3-running-text">{this.renderLyric()}</p>
                </Card>
            </div>
        );
    }

    private renderTitle() {
        return this.escapeEm(this.props.hitData._highlightResult.title.value);
    }

    private renderArtist() {
        return this.escapeEm(this.props.hitData._highlightResult.artist.value);
    }

    private renderComposer() {
        return this.escapeEm(this.props.hitData._highlightResult.composer.value);
    }

    private renderLyricist() {
        return this.escapeEm(this.props.hitData._highlightResult.lyricist.value);
    }

    private renderLyric() {
        return this.escapeEm(this.props.hitData._highlightResult.lyric.value);
    }

    private escapeEm(text: string) {
        // FIXME: Should stop inline style
        const style = "color: #070101; background-color: #f8ee7a; font-weight: bold;";
        const replacedText = text.replace(/<em>/g, `<em style="${style}">`);
        return <span dangerouslySetInnerHTML={{__html: replacedText}} />;
    }
}
