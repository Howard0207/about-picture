const { createRef } = require("react");
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "antd";
import "_less/book";

class Book extends Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return <div></div>;
    }
}
Book.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};
export default withRouter(Book);
