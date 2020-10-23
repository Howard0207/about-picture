import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import img from "_static/images/404.png";
import loaderr from "_static/images/load-err.png";
import "_less/404";

class NotFound extends Component {
    constructor(props) {
        super(props);
    }

    go = () => {
        this.props.history.push("/");
    };

    render() {
        return (
            <div className="not-found">
                <div className="not-found__info">
                    <img src={img} alt="404" width={400} />
                    <p className="paragraph1">哎呀！</p>
                    <p className="paragraph2">您访问的网页被打翻了</p>
                </div>
                <div className="not-found__route">
                    <div className="tip" onClick={this.go}>
                        返回首页
                    </div>
                    <div className="bar"></div>
                </div>
            </div>
        );
    }
}
export default withRouter(NotFound);
