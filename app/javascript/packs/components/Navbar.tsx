import { Alignment, Button, Navbar as BPNavbar } from '@blueprintjs/core';
import React, { useContext } from 'react';
import { Context } from '../context';

type ThemeIcon = "flash" | "moon";

export default function Navbar() {
  const { state, dispatch } = useContext(Context);

  function themeIcon() {
    if (state.theme === 'light') {
      return "moon";
    } else {
      return "flash";
    }
  }

  function handleClick() {
    const type = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type });
  }

  return (
    <BPNavbar>
      <BPNavbar.Group align={Alignment.LEFT}>
        <BPNavbar.Heading>rst-lyrics</BPNavbar.Heading>
      </BPNavbar.Group>
      <BPNavbar.Group align={Alignment.RIGHT}>
        <Button className="bp3-minimal" icon={themeIcon()} onClick={handleClick} />
      </BPNavbar.Group>
    </BPNavbar>
  );
}
