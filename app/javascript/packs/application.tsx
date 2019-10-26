import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./application.css";

// @ts-ignore
import * as Rails from 'rails-ujs';
Rails.start();

import App from "./App";

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById('app')!;
  if (app) {
    const elem = <App query={app.dataset.query!} />;
    ReactDOM.render(elem, app);
  }
});
