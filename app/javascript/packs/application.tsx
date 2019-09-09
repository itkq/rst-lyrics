import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./application.css";

// @ts-ignore
import * as Rails from 'rails-ujs';
Rails.start();

import App from "./App";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById('app')!;
  ReactDOM.render(<App />, app);
});
