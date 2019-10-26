import { Button, Callout, Card, FormGroup, InputGroup, Intent, Spinner, Tag } from '@blueprintjs/core';
// @ts-ignore
import * as Rails from 'rails-ujs';
import * as React from 'react';
import BottomScrollListener from 'react-bottom-scroll-listener';

import Lyric from './Lyric';

interface Props {
  query: string;
}

interface State {
  query: string;
  loading: boolean;
  loadingMore: boolean;
  errorMessage: string;
  searchData?: SearchData;
  hits: HitData[];
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

export default class Form extends React.Component<Props, State> {
  private constructor(props: Props) {
    super(props);

    this.state = {
      query: this.props.query,
      loading: false,
      loadingMore: false,
      errorMessage: '',
      searchData: undefined,
      hits: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleOnDocumentBottom = this.handleOnDocumentBottom.bind(this);
  }

  public render() {
    return (
      <div>
        <Card interactive={false}>
          <FormGroup label="Query" helperText="Hit enter key to search">
            <InputGroup id="query" placeholder="Type anything" value={this.state.query} onChange={this.handleChange} onKeyDown={this.handleKeyDown} rightElement={this.renderResultsTag()} />
          </FormGroup>
          <Button intent={Intent.PRIMARY} icon="search" text="Search" onClick={this.handleClick} />
          {this.renderSpinner()}
          {this.renderErrorMessage()}
        </Card>
        <div id="lyric-portal" />
        {this.renderLyrics()}
        {this.renderMoreSpinner()}
        <BottomScrollListener offset={300} debounce={100} onBottom={this.handleOnDocumentBottom} />
      </div>
    );
  }

  public componentDidMount() {
    this.loadInit();
  }

  private renderLyrics() {
    if (!this.isSearchResultAvailable()) {
      return null;
    }

    return this.state.hits.map((hitData: HitData, index: number) => {
      return (
        <Lyric key={index} hitData={hitData} />
      );
    });
  }

  private renderErrorMessage() {
    if (this.state.errorMessage !== '') {
      return (
        <Callout intent={Intent.DANGER} style={{ marginTop: '15px' }}>
          {this.state.errorMessage}
        </Callout>
      );
    } else {
      return null;
    }
  }

  private renderSpinner(loading = this.state.loading) {
    if (loading) {
      return (
        <div style={{ marginTop: '15px' }}>
          <Spinner intent={Intent.PRIMARY} size={35} />
        </div>
      );
    } else {
      return null;
    }
  }

  private renderMoreSpinner() {
    return this.renderSpinner(this.state.loadingMore);
  }

  private renderResultsTag() {
    if (!this.isSearchResultAvailable() || this.state.loading) {
      return undefined;
    }

    return (
      <Tag minimal={true}>{this.state.searchData!.nbHits} Hits</Tag>
    );
  }

  private async loadInit() {
    this.setState({ loading: true, errorMessage: '' });
    this.load(this.state.query, 0);
  }

  private async loadMore() {
    if (this.hasMorePage() && !this.state.loadingMore) {
      this.setState({ loadingMore: true, errorMessage: '' });
      this.load(this.state.query, this.state.searchData!.page + 1);
    }
  }

  private async load(query: string, page: number) {
    try {
      const searchData = await this.search(query, page);
      this.setState((prevState: State) => {
        const hits = page === 0 ? searchData.hits : prevState.hits.concat(searchData.hits);
        return { searchData, hits };
      });
    } catch (e) {
      this.setState({ errorMessage: e.toString() });
    } finally {
      this.setState({ loading: false, loadingMore: false });
    }
  }

  private async search(query: string, page: number): Promise<SearchData> {
    const body = new FormData();
    body.append(Rails.csrfParam()!, Rails.csrfToken()!);
    body.append('query', query);
    body.append('page', page.toString());

    const resp = await fetch(`/jsapi/search`, { method: 'POST', body }).catch((e) => {
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

  private hasMorePage(): boolean {
    if (!this.isSearchResultAvailable()) {
      return false;
    }

    const searchData = this.state.searchData!;
    return searchData.page < searchData.nbPages - 1;
  }

  private handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ query: evt.target.value });
  }

  private handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    if (evt.keyCode === ENTER_KEY) {
      this.loadInit();
    }
  }

  private handleClick() {
    this.loadInit();
  }

  private handleOnDocumentBottom() {
    this.loadMore();
  }
}
