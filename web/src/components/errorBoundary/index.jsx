import React, { Component } from "react";

class ErrorBoundary extends Component {
    constructor() {
        super();
        this.state = { hasError: false };
    }

    // 接收error info
    static getDerivedStateFromError = () => {
        return {
            hasError: true,
        };
    };

    // 打印log信息
    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        const { hasError } = this.state;
        if (hasError) {
            return this.props.comp;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
