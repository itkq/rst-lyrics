import React, { createContext, useReducer } from 'react';

type Theme = 'light' | 'dark';

interface State {
  theme: Theme;
}

const initialState = () => {
  const darkThemeValue = localStorage.getItem("darkTheme");

  if (darkThemeValue !== null && darkThemeValue === "true") {
    return { theme: 'dark' };
  } else {
    return { theme: 'light' };
  }
};

const Context = createContext(initialState());
const { Provider } = Context;

const reducer = (state, action) => {
  switch (action.type) {
    case 'light':
      localStorage.setItem("darkTheme", "false");
      return { ...state, theme: 'light' };
    case 'dark':
      localStorage.setItem("darkTheme", "true");
      return { ...state, theme: 'dark' };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer(reducer, initialState());

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { Context, StateProvider };
