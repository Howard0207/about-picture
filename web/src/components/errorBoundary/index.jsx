import React, { Component } from "react";
import { PageError } from "_components";
class ErrorBoundary extends Component {
	constructor() {
		super();
		this.state = { hasError: false, error: null };
	}

	// 接收error info
	static getDerivedStateFromError = () => {
		return {
			hasError: true,
		};
	};

	// 打印log信息
	componentDidCatch(_, errorInfo) {
		this.setState({ error: JSON.stringify(errorInfo) });
	}

	render() {
		const { hasError, error } = this.state;
		if (hasError) {
			if (this.props.comp) {
				return this.props.comp;
			}
			const errorInfo = { title: "页面异常", description: [error] };
			return <PageError errorInfo={errorInfo} />;
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
