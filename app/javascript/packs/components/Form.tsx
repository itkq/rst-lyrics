import { Button, Callout, Card, FormGroup, InputGroup, Intent, Spinner, Tag } from '@blueprintjs/core';
import * as React from 'react';

import Lyric from './Lyric';

interface State {
  query: string;
  searchData?: SearchData;
  loading: boolean;
  errorMessage: string;
}

const ENTER_KEY = 13;

interface SearchData {
  hits: HitData[];
  nbHits: number;
  page: number;
  nbPages: number;
  hitsPerPage: number;
}

export interface HitData {
  title: string;
  artist: string;
  composer: string;
  lyricist: string;
  lyric: string;
  _highlightResult: ResultDict;
  _snippetResult: ResultDict;
}

interface ResultDict {
  [index: string]: Result;
}

interface Result {
  value: string;
  matchLevel: string;
  matchedWords: string;
}

export default class Form extends React.Component<{}, State> {
  private constructor(props: {}) {
    super(props);

    this.state = {
      query: '',
      searchData: undefined,
      loading: false,
      errorMessage: '',
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
            <InputGroup id="query" placeholder="Type anything" onChange={this.handleChange} onKeyDown={this.handleKeyDown} rightElement={this.renderResultsTag()} />
          </FormGroup>
          <Button intent={Intent.PRIMARY} icon="search" text="Search" onClick={this.handleClick} />
          {this.renderSpinner()}
          {this.renderErrorMessage()}
        </Card>
        <div id="lyric-portal" />
        {this.renderLyrics()}
      </div>
    );
  }

  public componentDidMount() {
    this.load();
  }

  // TODO: implement paging
  private renderLyrics() {
    if (!this.isSearchResultAvailable()) {
      return null;
    }

    return this.state.searchData!.hits.map((hitData: HitData, index: number) => {
      return (
        <Lyric key={index} hitData={hitData} />
      );
    });
  }

  private renderErrorMessage() {
    const style = {
      marginTop: '15px',
    };

    if (this.state.errorMessage !== '') {
      return (
        <Callout intent={Intent.DANGER} style={style}>
          {this.state.errorMessage}
        </Callout>
      );
    } else {
      return null;
    }
  }

  private renderSpinner() {
    if (this.state.loading) {
      return (
        <Spinner intent={Intent.PRIMARY} size={Spinner.SIZE_SMALL} />
      );
    } else {
      return null;
    }
  }

  private renderResultsTag() {
    if (!this.isSearchResultAvailable() || this.state.loading) {
      return undefined;
    }

    return (
      <Tag minimal={true}>{this.state.searchData!.nbHits} Hits</Tag>
    );
  }

  private async load() {
    try {
      this.setState({ loading: true, errorMessage: '' });
      const searchData = await this.search(this.state.query);
      this.setState({ searchData });
    } catch (e) {
      this.setState({ errorMessage: e.toString() });
    } finally {
      this.setState({ loading: false });
    }
  }

  private async search(query: string, page = 0): Promise<SearchData> {
    const q = `?query=${encodeURIComponent(query)}&page=${page}`;
    const resp = await fetch(`/jsapi/search${q}`).catch((e) => {
      throw new Error(`Networking error (status: ${e})`);
    });

    const searchData: SearchData = await resp.json().catch((e) => {
      throw new Error(`Received unexpecetd status code (status: ${resp.status})`);
    });

    return searchData;
  }

  private isSearchResultAvailable(): boolean {
    return typeof this.state.searchData !== 'undefined';
  }

  private handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ query: evt.target.value });
  }

  private handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    if (evt.keyCode === ENTER_KEY) {
      this.load();
    }
  }

  private handleClick() {
    this.load();
  }
}
