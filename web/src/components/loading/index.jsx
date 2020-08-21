import React from "react";
import { Spin } from "antd";
// import '_less/components/loading';

const Loading = (className) => () => (
    <div className={`loadable-loading ${className}`}>
        <Spin size="large" tip="Loading..." />
    </div>
);

export default Loading;
