import { Button, Card, Classes, Dialog, Divider } from '@blueprintjs/core';
import React, { useState } from 'react';

import { HitData } from './Form';

interface Props {
  hitData: HitData;
}

export default function Lyric(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function renderOverlay() {
    return (
      <Dialog className={Classes.OVERLAY_SCROLL_CONTAINER} isOpen={isOpen} onClose={handleClick} portalContainer={document.getElementById('lyric-portal')!}>
        <Card>
          <h3>{renderTitle()} / {renderArtist()}</h3>
          <p>作曲: {renderComposer()} 作詞: {renderLyricist()}</p>
          <Divider />
          <p className="bp3-running-text">{renderLyric()}</p>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={handleClick}>Close</Button>
            </div>
          </div>
        </Card>
      </Dialog>
    );
  }

  function handleClick() {
    setIsOpen(!isOpen);
  }

  function renderTitle() {
    return escapeEm(props.hitData._highlightResult.title.value);
  }

  function renderArtist() {
    return escapeEm(props.hitData._highlightResult.artist.value);
  }

  function renderComposer() {
    return escapeEm(props.hitData._highlightResult.composer.value);
  }

  function renderLyricist() {
    return escapeEm(props.hitData._highlightResult.lyricist.value);
  }

  function renderShortLyric() {
    if (isSnippetLyricAvailable()) {
      return escapeEm(props.hitData._snippetResult.lyric.value);
    } else {
      return props.hitData.lyric.split("\n").slice(0, 2).join(" ") + " ... ";
    }
  }

  function renderLyric() {
    return escapeEm(convertNewLine(props.hitData._highlightResult.lyric.value));
  }

  function convertNewLine(text: string) {
    return text.replace(/\n/g, '<br />');
  }

  function isSnippetLyricAvailable() {
    return props.hitData._snippetResult.lyric.matchLevel !== "none";
  }

  function escapeEm(text: string) {
    // FIXME: Should stop inline style
    const style = "color: #070101; background-color: #f8ee7a; font-weight: bold;";
    const replacedText = text.replace(/<em>/g, `<em style="${style}">`);
    return <span dangerouslySetInnerHTML={{ __html: replacedText }} />;
  }

  return (
    <div>
      <Card interactive={true} onClick={handleClick}>
        <h3>{renderTitle()} / {renderArtist()}</h3>
        <p>作曲: {renderComposer()} 作詞: {renderLyricist()}</p>
        <p className="bp3-running-text">{renderShortLyric()}</p>
      </Card>
      {renderOverlay()}
    </div>
  );
}
