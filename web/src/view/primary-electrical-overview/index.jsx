import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "_less/primary-electrical-overview";
import Register from "./component/register";
import { Form, Input, Button } from "antd";
class ElectricalOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvas: React.createRef(),
        };
    }

    initCanvas = () => {
        const { canvas } = this.state;
        this.ctx = canvas.current.getContext("2d");
    };

    handleDragStart = (e) => {
        console.log("dragstart -----------------------------------------------");
        console.log(e.target);
    };

    onDragEnd = (e) => {
        console.log("dragend -----------------------------------------------");
        console.log(e);
    };

    handleDragEnter = (e) => {
        e.preventDefault();
        // if (this.props.canDragIn) {
        //     this.setState({
        //         in: true,
        //     });
        // }
    };
    handleDrop = (e) => {
        const { canvas } = this.state;
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        const { x, y } = canvas.current.getBoundingClientRect();
        const componentX = mouseX - x;
        const componentY = mouseY - y;
        const register = new Register({ positionX: componentX, positionY: componentY });
        register.render(this.ctx);
        console.log("drop -------------------------------------------------");
        console.log(e);
        console.log(canvas.current.getBoundingClientRect());
    };
    componentDidMount() {
        this.initCanvas();
    }

    render() {
        const { canvas } = this.state;
        return (
            <div className="primary-electrical-overview">
                <div className="primary-electrical__project-info">
                    <Form
                        name="basic"
                        className="project-info__form"
                        initialValues={{
                            remember: true,
                        }}
                        // onFinish={onFinish}
                        // onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            label="项目名称："
                            name="projectName"
                            rules={[{ required: true, message: "请输入项目名称" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="项目ID："
                            name="projectId"
                            rules={[{ required: true, message: "请输入项目ID！" }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="primary-electrical__edit">
                    <div className="components-container">
                        <div className="added-component">a</div>
                        <div className="added-component">b</div>
                        <div className="added-component">c</div>
                        <div className="added-component">d</div>
                    </div>
                    <div className="paint-container">
                        <canvas
                            ref={canvas}
                            width={800}
                            height={600}
                            onDrop={this.handleDrop}
                            onDragOver={this.handleDragEnter}
                        ></canvas>
                    </div>
                    <div className="options-container">
                        <div
                            className="component"
                            draggable
                            onDragStart={this.handleDragStart}
                            onDragEnd={this.onDragEnd}
                        >
                            as
                        </div>
                        <div
                            className="component"
                            draggable
                            onDragStart={this.handleDragStart}
                            onDragEnd={this.onDragEnd}
                        >
                            bs
                        </div>
                        <div
                            className="component"
                            draggable
                            onDragStart={this.handleDragStart}
                            onDragEnd={this.onDragEnd}
                        >
                            cs
                        </div>
                        <div
                            className="component"
                            draggable
                            onDragStart={this.handleDragStart}
                            onDragEnd={this.onDragEnd}
                        >
                            ds
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
ElectricalOverview.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};
export default withRouter(ElectricalOverview);
