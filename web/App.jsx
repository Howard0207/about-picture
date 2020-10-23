import { hot } from "react-hot-loader/root";
import React from "react";
import ReactDom from "react-dom";
import "core-js/stable";
import "regenerator-runtime/runtime";
import "_less/index.less";
import RouterConfig from "./src/router";

const App = hot(RouterConfig);
ReactDom.render(<App />, document.querySelector("#app"));
