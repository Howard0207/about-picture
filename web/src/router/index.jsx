import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { ConfigProvider } from "antd";
import { RouteWithSubRoutes } from "_components";
import zhCN from "antd/es/locale/zh_CN";
import "core-js/stable";
import "regenerator-runtime/runtime";
import "_less/index.less";
import routes from "./router-config";

function RouterConfig() {
    return (
        <ConfigProvider locale={zhCN}>
            <BrowserRouter>
                <Switch>
                    {routes.map((route) => {
                        console.log(route);
                        return <RouteWithSubRoutes key={route.path} {...route} />;
                    })}
                </Switch>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default RouterConfig;
