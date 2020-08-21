import { hot } from "react-hot-loader/root";
import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Loadable from "react-loadable";
import { ConfigProvider } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import Loading from "_components/loading";
import "core-js/stable";
import "regenerator-runtime/runtime";
import "_less/index.less";

const Login = Loadable({
    loader: () => import(/* webpackPrefetch: true */ "./src/view/login"),
    loading: Loading("loadable-loading__app"),
});

const Main = Loadable({
    loader: () => import(/* webpackPrefetch: true */ "./src/view/main"),
    loading: Loading("loadable-loading__app"),
});

function RouterConfig() {
    return (
        <ConfigProvider locale={zhCN}>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route path="/">
                        <Main />
                    </Route>
                </Switch>
            </BrowserRouter>
        </ConfigProvider>
    );
}

const App = hot(RouterConfig);
ReactDom.render(<App />, document.querySelector("#app"));
