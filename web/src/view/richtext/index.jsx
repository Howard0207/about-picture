import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import E from "wangeditor";
import { addEvent, removeEvent, debounce } from "_utils";
import "_less/richtext";

class RichText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rich: React.createRef(),
        };
    }

    /**
     * 修改文本框高度
     */
    resizeTextContainer = () => {
        const { rich } = this.state;
        const container = rich.current.querySelector(".w-e-text-container");
        container.style.height = rich.current.offsetHeight - 84 + "px";
    };

    resizeWindowCallBack = debounce(this.resizeTextContainer, 500);

    /**
     * 构建富文本配置
     * @param {type: Object desc: 富文本编辑器实例 } editor
     * @param {type: Object desc: 富文本承载容器DOM } container
     */
    buildRichConfig = (editor, container) => {
        Object.assign(editor.config, {
            height: container.offsetHeight - 84,
            uploadImgServer: "/upload-img",
        });
    };

    componentDidMount() {
        const { rich } = this.state;
        const editor = new E(rich.current);
        this.buildRichConfig(editor, rich.current);
        editor.create();
        addEvent(window, "resize", this.resizeWindowCallBack);
    }

    componentWillUnmount() {
        removeEvent(window, "resize", this.resizeWindowCallBack);
    }

    render() {
        const { rich } = this.state;
        return <div ref={rich} style={{ height: "calc(100% - 80px)" }} className="richText"></div>;
    }
}
// RichText.propTypes = {
//     history: PropTypes.object.isRequired,
//     location: PropTypes.object.isRequired,
//     match: PropTypes.object.isRequired,
// };

export default withRouter(RichText);
