import { Card, Classes, Elevation, Overlay } from '@blueprintjs/core';
import * as React from 'react';

interface Props {
    title: string;
    artist: string;
    composer: string;
    lyricist: string;
    lyric: string;
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

        this.toggleOverlay = this.toggleOverlay.bind(this);
    }

    public render() {
        return (
            <Card interactive={true} elevation={Elevation.TWO} onClick={this.toggleOverlay}>
                <h3>{this.props.title} / {this.props.artist}</h3>
                <p>作曲: {this.props.composer} 作詞: {this.props.lyricist}</p>
                <p>{this.shortLyric()}</p>
                {this.renderOverlay()}
            </Card>
        );
    }

    private renderOverlay() {
        return (
            <Overlay
                className={Classes.OVERLAY_SCROLL_CONTAINER}
                isOpen={this.state.isOpen}
                onClose={this.toggleOverlay}
                hasBackdrop={true}
                enforceFocus={true}
                canEscapeKeyClose={true}
                usePortal={true}
            >
                <Card interactive={false} elevation={Elevation.FOUR}>
                    <h2>{this.props.title} / {this.props.artist}</h2>
                    <p>作曲: {this.props.composer} 作詞: {this.props.lyricist}</p>
                    {this.fullLyric()}
                </Card>
            </Overlay>
        );
    }

    private fullLyric() {
        const lines = this.props.lyric.split('\n').map((line: string, index: number) => {
            return <span key={index}>{line}<br /></span>;
        });
        return (
            <p className={Classes.RUNNING_TEXT}>{lines}</p>
        );
    }

    private shortLyric(): string {
        return this.props.lyric.slice(0, 100) + "...";
    }

    private toggleOverlay() {
        this.setState((prevState: State) => {
            return { isOpen: !prevState.isOpen };
        });
    }
}
