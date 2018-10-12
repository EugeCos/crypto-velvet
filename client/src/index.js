import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

// ------------REDUX------------
import { store } from "./store";
import { Provider } from "react-redux";

// ----------MATERIAL UI-----------
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider>
      <Router>
        <App />
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
