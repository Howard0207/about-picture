import React, { Component, useState } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "antd";
import { ErrorComponent, PageError } from "_components";
import "_less/book";

function B() {
	const [count, setCount] = useState(0);

	if (count > 5) {
		throw Error("stack overflow");
	}

	return (
		<div>
			book
			<div>count: {count}</div>
			<Button
				type="primary"
				onClick={() => {
					setCount(count + 1);
				}}
			>
				add
			</Button>
			<div class="markdown-body">
				<a>小小少年</a>
			</div>
		</div>
	);
}

class Book extends Component {
	constructor() {
		super();
		this.state = {};
	}

	componentDidMount() {}

	render() {
		return (
			<ErrorComponent>
				<B />
			</ErrorComponent>
		);
	}
}
Book.propTypes = {
	history: PropTypes.object.isRequired,
	location: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
};
export default withRouter(Book);
