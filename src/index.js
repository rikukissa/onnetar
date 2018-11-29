import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/browser";
import App from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import "add-to-homescreen";
import "add-to-homescreen/dist/style/addtohomescreen.css";
const rootEl = document.getElementById("root");

Sentry.init({
  dsn: "https://99098a9cae484b5d9c38a6b5fb385648@sentry.io/1333667"
});

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
  onUpdate: async () => {
    window.location.reload();
  }
});

const hasUsedSiteBefore = Boolean(window.localStorage.getItem("onnetar"));
if (hasUsedSiteBefore) {
  window.addToHomescreen({
    startDelay: 0,
    message: {
      ios:
        "<h3>Moi 😊</h3>Napsauttamatta tuolta voit lisätä Onnettaren kotivalikkoon. Sen jälkeen toimii ihan niin kuin mikä tahansa muukin app 😍",
      android:
        "<h3>Moi 😊</h3>Napsauttamalla tähti-ikonia tai <strong>Lisää aloitusnäytölle -tekstiä</strong> selaimen valikosta, voit lisätä Onnettaren aloitusnäytöllesi. <br /><br /> Sen jälkeen toimii ihan niin kuin mikä tahansa muukin app 😍"
    }
  });
}
