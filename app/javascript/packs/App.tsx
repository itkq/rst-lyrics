import { Classes } from '@blueprintjs/core';
import React, { useContext } from 'react';
import Form from './components/Form';
import Navbar from './components/Navbar';
import { Context } from './context';

interface Props {
  query: string;
}

interface State {
  darkTheme: boolean;
}

export default function App(props) {
  const { state } = useContext(Context);

  function bodyClassName() {
    return state.theme === 'light' ? 'bp3-body' : 'bp3-dark';
  }

  function themeClass() {
    return state.theme === 'light' ? '' : Classes.DARK;
  }

  document.body.className = bodyClassName();
  return (
    <div className={themeClass()}>
      <Navbar />
      <Form query={props.query} />
    </div>
  );
}
