import React, { useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Menu } from "antd";
import Icon, { PictureOutlined, BranchesOutlined } from "@ant-design/icons";
const { SubMenu } = Menu;
const defaultMenu = [
    {
        name: "图库",
        path: "picture",
        icon: PictureOutlined,
        child: [
            {
                name: "相册",
                path: "/",
                child: [],
            },
            {
                name: "图片压缩",
                path: "/book",
                child: [],
            },
        ],
    },
    {
        name: "一次图",
        path: "/primary-electrical-overview",
        icon: BranchesOutlined,
        child: [
            {
                name: "项目列表",
                path: "/electrical-overview",
                child: [],
            },
        ],
    },
];
function SiderMenu(props) {
    const [menu, setMenu] = useState(defaultMenu);
    const history = useHistory();
    const getMenu = (menuList) => {
        return menuList.map((item) => {
            if (item.child.length > 0) {
                return (
                    <SubMenu key={item.path} title={item.name} icon={<Icon component={item.icon} />}>
                        {getMenu(item.child)}
                    </SubMenu>
                );
            }
            return <Menu.Item key={item.path}>{item.name}</Menu.Item>;
        });
    };

    const handleMenuClick = ({ key }) => {
        history.push(key);
    };

    useEffect(() => {}, []);
    return (
        <Menu
            theme="dark"
            onClick={handleMenuClick}
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
