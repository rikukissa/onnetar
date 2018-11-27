import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

const rootEl = document.getElementById("root");

ReactDOM.render(<App />, rootEl);

if (module.hot) {
  module.hot.accept("./App", () => {
    const NextApp = require("./App").default;
    ReactDOM.render(<NextApp />, rootEl);
  });
}

ReactDOM.render(<App />, document.getElementById("root"));

console.log("version 7");

serviceWorker.register();
