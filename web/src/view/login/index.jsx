import React, { PureComponent } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Login extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return <div className="login">login</div>;
    }
}

Login.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};
export default withRouter(Login);
