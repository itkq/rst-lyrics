import { Button, Card, Classes, Dialog, Divider } from '@blueprintjs/core';
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

    this.handleClick = this.handleClick.bind(this);
  }

  public render() {
    return (
      <div>
        <Card interactive={true} onClick={this.handleClick}>
          <h3>{this.renderTitle()} / {this.renderArtist()}</h3>
          <p>作曲: {this.renderComposer()} 作詞: {this.renderLyricist()}</p>
          <p className="bp3-running-text">{this.renderShortLyric()}</p>
        </Card>
        {this.renderOverlay()}
      </div>
    );
  }

  private renderOverlay() {
    return (
      <Dialog className={Classes.OVERLAY_SCROLL_CONTAINER} isOpen={this.state.isOpen} onClose={this.handleClick} portalContainer={document.getElementById('lyric-portal')!}>
        <Card>
          <h3>{this.renderTitle()} / {this.renderArtist()}</h3>
          <p>作曲: {this.renderComposer()} 作詞: {this.renderLyricist()}</p>
          <Divider />
          <p className="bp3-running-text">{this.renderLyric()}</p>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={this.handleClick}>Close</Button>
            </div>
          </div>
        </Card>
      </Dialog>
    );
  }

  private handleClick() {
    this.setState((prevState: State) => {
      return { isOpen: !prevState.isOpen };
    });
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

  private renderShortLyric() {
    if (this.isSnippetLyricAvailable()) {
      return this.escapeEm(this.props.hitData._snippetResult.lyric.value);
    } else {
      return this.props.hitData.lyric.split("\n").slice(0, 2).join(" ") + " ... ";
    }
  }

  private renderLyric() {
    return this.escapeEm(this.convertNewLine(this.props.hitData._highlightResult.lyric.value));
  }

  private convertNewLine(text: string) {
    return text.replace(/\n/g, '<br />');
  }

  private isSnippetLyricAvailable() {
    return this.props.hitData._snippetResult.lyric.matchLevel !== "none";
  }

  private escapeEm(text: string) {
    // FIXME: Should stop inline style
    const style = "color: #070101; background-color: #f8ee7a; font-weight: bold;";
    const replacedText = text.replace(/<em>/g, `<em style="${style}">`);
    return <span dangerouslySetInnerHTML={{ __html: replacedText }} />;
  }
}
