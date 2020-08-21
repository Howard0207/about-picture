import React, { PureComponent } from "react";
import { withRouter, Switch } from "react-router-dom";
import { Layout, Skeleton } from "antd";
import { Loading, RouteWithSubRoutes } from "_components";
import { Menu } from "./components";
import Loadable from "react-loadable";
import "_less/main";
const { Header, Content, Sider, Footer } = Layout;

const Compress = Loadable({
    loader: () => import(/* webpackPrefetch: true */ "../picture/compress"),
    loading: Loading("loadable-loading__page"),
});

const routes = [
    {
        path: "/",
        exact: true,
        component: Compress,
    },
    {
        path: "*",
        component: <div>ssss</div>,
    },
];

class Main extends PureComponent {
    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            <Layout className="main">
                <Sider trigger={null} collapsible width={256}>
                    <div className="main__sider-logo">
                        <img src="https://preview.pro.ant.design/static/logo.f0355d39.svg" alt="" />
                        <div>Realize Idea</div>
                    </div>
                    <Menu />
                </Sider>
                <Layout className="site-layout">
                    <Header className="header" theme="light">
                        <div className="header-left">
                            {/* <img src={defaultLogo} alt="logo" className="header-left-logo" /> */}
                        </div>
                    </Header>
                    <Content style={{ margin: "24px 16px 0" }}>
                        <Switch>
                            {routes.map((route) => (
                                <RouteWithSubRoutes key={route.path} {...route} />
                            ))}
                        </Switch>
                        <Footer style={{ textAlign: "center" }}>copyright @ 2019 清科优能</Footer>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default withRouter(Main);
