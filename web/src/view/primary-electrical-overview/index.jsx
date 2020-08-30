import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "_less/primary-electrical-overview";
import Register from "./component/register";
import { Form, Input, Button } from "antd";
import C from "_utils";

let dx = 0;
let dy = 0;
let count = 0;
class ElectricalOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            canvas: React.createRef(),
            componentList: [],
            selectedComponent: null,
            imgBeforeNextRender: null,
        };
    }

    initCanvas = () => {
        const { canvas } = this.state;
        this.ctx = canvas.current.getContext("2d");
    };

    handleDragStart = e => {
        console.log(e.target);
    };

    onDragEnd = e => {
        console.log(e);
    };

    handleDragEnter = e => {
        e.preventDefault();
    };
    handleDrop = e => {
        const { canvas, componentList } = this.state;
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        const { x, y } = canvas.current.getBoundingClientRect();
        const componentX = mouseX - x;
        const componentY = mouseY - y;
        const register = new Register({ positionX: componentX, positionY: componentY });
        register.update({ number: count++ });
        componentList.push(register);
        register.render(this.ctx);
        this.setState({ componentList });
    };

    moveBallFn = () => {
        const { selectedComponent, imgBeforeNextRender } = this.state;
        if (imgBeforeNextRender) {
            this.ctx.clearRect(0, 0, 800, 600);
            this.ctx.drawImage(imgBeforeNextRender, 0, 0);
            selectedComponent.positionX = this.mouse.x - dx;
            selectedComponent.positionY = this.mouse.y - dy;
            selectedComponent.render(this.ctx);
        }
    };

    upBallFn = () => {
        const { canvas } = this.state;
        this.setState({ imgBeforeNextRender: null });
        canvas.current.removeEventListener("mousemove", this.moveBallFn);
    };

    getImgBeforeNextData = selectedComponent => {
        const { canvas, componentList } = this.state;
        const list = componentList.filter(item => !item.selected);
        this.ctx.clearRect(0, 0, 800, 600);
        list.forEach(item => {
            item.render(this.ctx);
        });
        const data = canvas.current.toDataURL();
        selectedComponent.render(this.ctx);
        const img = new Image();
        img.src = data;
        return img;
    };

    componentDidMount() {
        const { canvas, componentList } = this.state;

        this.mouse = C.getOffset(canvas.current);

        this.initCanvas();

        canvas.current.addEventListener("mousedown", e => {
            e.preventDefault();
            let selectedComponent = null;
            let imageData = null;
            for (let item of componentList) {
                if (item.isPoint(this.mouse)) {
                    dx = this.mouse.x - item.positionX;
                    dy = this.mouse.y - item.positionY;
                    canvas.current.addEventListener("mousemove", this.moveBallFn);
                    canvas.current.addEventListener("mouseup", this.upBallFn);
                    item.update({ selected: true });
                    imageData = this.getImgBeforeNextData(item);
                    selectedComponent = item;
                }
                item.update({ selected: false });
            }
            this.setState({ selectedComponent, imgBeforeNextRender: imageData });
        });
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
                        <Form.Item label="项目名称：" name="projectName" rules={[{ required: true, message: "请输入项目名称" }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="项目ID：" name="projectId" rules={[{ required: true, message: "请输入项目ID！" }]}>
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
                        <canvas ref={canvas} width={800} height={600} onDrop={this.handleDrop} onDragOver={this.handleDragEnter}></canvas>
                    </div>
                    <div className="options-container">
                        <div className="component" draggable onDragStart={this.handleDragStart} onDragEnd={this.onDragEnd}>
                            as
                        </div>
                        <div className="component" draggable onDragStart={this.handleDragStart} onDragEnd={this.onDragEnd}>
                            bs
                        </div>
                        <div className="component" draggable onDragStart={this.handleDragStart} onDragEnd={this.onDragEnd}>
                            cs
                        </div>
                        <div className="component" draggable onDragStart={this.handleDragStart} onDragEnd={this.onDragEnd}>
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
