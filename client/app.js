import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "typeface-roboto";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { lightBlue, pink } from "@material-ui/core/colors";
import { AppContainer } from "react-hot-loader"; // eslint-disable-line
import { Provider } from "mobx-react";
import App from "./views/App";
import { AppState, TopicStore } from "./store/store";

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    accept: pink,
    type: "light",
  },
});
const initialState = window.__INITIAL__STATE__ || {}; // eslint-disable-line
let root = document.getElementById("root");
let appState = new AppState(initialState.appState);
let topicStore = new TopicStore(initialState.topicStore);
const renderMethod = module.hot ? ReactDom.render : ReactDom.hydrate;
const render = Componet => {
  ReactDom.hydrate(
    <div>
      <AppContainer>
        <Provider appState={appState} topicStore={topicStore}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <Componet />
            </ThemeProvider>
          </BrowserRouter>
        </Provider>
      </AppContainer>
    </div>,
    root,
  );
};
render(App);
// hot-reload
if (module.hot) {
  module.hot.accept("./views/App", () => {
    let nextApp = require("./views/App").default; //eslint-disable-line
    render(nextApp);
  });
}
