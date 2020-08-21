import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Menu } from "antd";
import React, { useEffect, useState } from "react";
const { SubMenu } = Menu;
const defaultMenu = [
    {
        name: "图库",
        path: "picture",
        icon: "",
        child: [
            {
                name: "相册",
                path: "/gallery",
                child: [],
            },
            {
                name: "图片压缩",
                path: "/compress",
                child: [],
            },
        ],
    },
];
function SiderMenu(props) {
    const [menu, setMenu] = useState(defaultMenu);

    const getMenu = (menuList) => {
        return menuList.map((item) => {
            if (item.child.length > 0) {
                return (
                    <SubMenu key={item.path} title={item.name}>
                        {getMenu(item.child)}
                    </SubMenu>
                );
            }
            return <Menu.Item key={item.path}>{item.name}</Menu.Item>;
        });
    };

    const handleClick = (item) => {
        console.log(item);
    };

    useEffect(() => {}, []);
    return (
        <Menu
            theme="dark"
            onClick={handleClick}
            style={{ width: 256 }}
            // defaultOpenKeys={["sub1"]}
            // selectedKeys={[this.state.current]}
            mode="inline"
        >
            {getMenu(menu)}
        </Menu>
    );
}
SiderMenu.propTypes = {};
export default withRouter(SiderMenu);