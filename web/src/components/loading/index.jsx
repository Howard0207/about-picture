import React from "react";
import { Spin } from "antd";
// import '_less/components/loading';
import loaderr from "_static/images/load-err.png";
const Loading = (className) => (props) => {
    if (props.error) {
        return (
            <div className="load-error">
                <img src={loaderr} alt="网络不稳定" className="load-error__img" />
                <p className="load-error__info">网络好像不太稳定！</p>
            </div>
        );
    } else {
        return (
            <div className={`loadable-loading ${className}`}>
                <Spin size="large" tip="Loading..." />
            </div>
        );
    }
};

export default Loading;
