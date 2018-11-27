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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: registration => {
    alert("test");
    registration.update();
    window.location.reload();
  }
});
