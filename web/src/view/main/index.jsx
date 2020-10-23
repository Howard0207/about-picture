import React, { PureComponent } from "react";
import { withRouter, Switch } from "react-router-dom";
import { Layout, Menu, Dropdown, Skeleton, Badge, Avatar } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined, BookFilled } from "@ant-design/icons";
import { RouteWithSubRoutes } from "_components";
import { SiderMenu } from "./components";
import "_less/main";
const { Header, Content, Sider, Footer } = Layout;

const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
            </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                3rd menu item
            </a>
        </Menu.Item>
        <Menu.Item danger>a danger item</Menu.Item>
    </Menu>
);

class Main extends PureComponent {
    constructor(props) {
        super();
        this.state = {
            collapsed: false,
            routes: props.routes,
        };
    }

    toggle = () => {
        this.setState({ collapsed: !this.state.collapsed });
    };

    render() {
        const { collapsed, routes } = this.state;
        return (
            <Layout className="main">
                <Sider trigger={null} collapsible width={256} collapsed={collapsed}>
                    <div className={collapsed ? "main__sider-logo main__sider-logo--collapsed" : "main__sider-logo"}>
                        <img src="https://preview.pro.ant.design/static/logo.f0355d39.svg" alt="" />
                        <div className="main__sider-slogan">Realize Idea</div>
                    </div>
                    <SiderMenu />
                </Sider>
                <Layout className="site-layout">
                    <Header className="main__header" theme="light">
                        <div className="main__header--left">
                            {collapsed ? (
                                <MenuUnfoldOutlined className="trigger" onClick={this.toggle} />
                            ) : (
                                <MenuFoldOutlined className="trigger" onClick={this.toggle} />
                            )}
                        </div>
                        <div className="main__header--right">
                            <Dropdown overlay={menu} placement="bottomCenter">
                                <Badge count={1}>
                                    <Avatar
                                        size={40}
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                    />
                                </Badge>
                            </Dropdown>
                        </div>
                    </Header>
                    <Content style={{ margin: "24px 16px 0" }}>
                        <Switch>
                            {routes.map((route) => {
                                return <RouteWithSubRoutes key={route.path} {...route} />;
                            })}
                        </Switch>
                        <Footer style={{ textAlign: "center" }}>copyright @ 2019 清科优能</Footer>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default withRouter(Main);
