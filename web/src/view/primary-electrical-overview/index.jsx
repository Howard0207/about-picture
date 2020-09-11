import React, { Component, cloneElement } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "_less/primary-electrical-overview";
import Register from "./component/register";
import { Form, Input, Button, InputNumber, Checkbox } from "antd";
import C, { debounce } from "_utils";
import axios from "_service";
import ElementPainter from "primary-electrical-graphic-system";

let dx = 0;
let dy = 0;
let count = 0;
class ElectricalOverview extends React.Component {
    constructor() {
        super();
        this.state = {
            canvas: React.createRef(),
            componentFormRef: React.createRef(),
            componentList: [],
            selectedComponent: null,
            imgBeforeNextRender: null,
        };
    }

    initCanvas = () => {
        const { canvas } = this.state;
        this.ctx = canvas.current.getContext("2d");
    };

    handleDragStart = (e) => {
        // console.log(e.target);
    };

    onDragEnd = (e) => {
        // console.log(e);
    };

    handleDragEnter = (e) => {
        e.preventDefault();
    };
    handleDrop = (e) => {
        const { canvas, componentList, componentFormRef } = this.state;
        const mouseX = e.pageX;
        const mouseY = e.pageY;
        const { x, y } = canvas.current.getBoundingClientRect();
        const componentX = mouseX - x;
        const componentY = mouseY - y;
        const register = new Register({ positionX: componentX, positionY: componentY });
        register.update({ number: count++ });
        // ---------------
        this.painter.add(register);
        componentList.push(register);
        // ---------------

        // ---------------
        this.painter.render(this.ctx);
        // register.render(this.ctx);
        // ---------------

        this.setState({ componentList, selectedComponent: register }, () => {
            const form = componentFormRef.current;
            const { name, id, positionX, positionY, showBorder } = register;
            form.setFieldsValue({
                name: name,
                id: `${id}`,
                positionX: positionX,
                positionY: positionY,
                showBorder: showBorder,
            });
        });
    };

    // 更新组件表单坐标
    updateSelectedComponentFormPosition = () => {
        const { selectedComponent, componentFormRef } = this.state;
        const { positionX, positionY } = selectedComponent;
        const form = componentFormRef.current;
        form.setFieldsValue({ positionX: positionX, positionY: positionY });
    };

    saveComponentProperties = () => {
        const { selectedComponent, componentFormRef } = this.state;
        const form = componentFormRef.current;
        const formValues = form.getFieldsValue();
        selectedComponent.update(formValues);
        this.updateSelectedComponentRender();
    };

    saveProject = (values) => {
        const { componentList } = this.state;
        axios
            .put("/primary-electrical/project-create", { projectInfo: values, elements: componentList })
            .then((res) => {
                console.log(res);
            });
        console.log(values);
    };

    updateSelectedComponentRender = () => {
        const { selectedComponent } = this.state;
        const imgBeforeNextRender = this.getImgBeforeNextData(selectedComponent);
        this.ctx.clearRect(0, 0, 800, 600);
        setTimeout(() => {
            this.ctx.drawImage(imgBeforeNextRender, 0, 0);
            selectedComponent.render(this.ctx);
        }, 100);
    };

    componentInpuntPositionChange = (type, value) => {
        const positionState = {};
        if (isNaN(value)) {
            return false;
        }
        const { selectedComponent } = this.state;
        const imgBeforeNextRender = this.getImgBeforeNextData(selectedComponent);
        this.ctx.clearRect(0, 0, 800, 600);
        positionState[type] = parseFloat(value);
        selectedComponent.update(positionState);
        setTimeout(() => {
            this.ctx.drawImage(imgBeforeNextRender, 0, 0);
            selectedComponent.render(this.ctx);
        }, 100);
    };

    getImgBeforeNextData = (selectedComponent) => {
        const { canvas, componentList } = this.state;
        const list = componentList.filter((item) => !item.selected);
        this.ctx.clearRect(0, 0, 800, 600);
        list.forEach((item) => {
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
        this.painter = new ElementPainter(canvas.current);

        this.mouse = C.getOffset(canvas.current);
        // this.initCanvas();
        this.updateSelectedComponentFormPosition = debounce(this.updateSelectedComponentFormPosition, 200, false);
        canvas.current.addEventListener("mousedown", (e) => {
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
                    selectedComponent = item;
                    continue;
                }
                item.update({ selected: false });
            }
            if (selectedComponent) {
                imageData = this.getImgBeforeNextData(selectedComponent);
                this.setState({ selectedComponent, imgBeforeNextRender: imageData }, function () {
                    this.updateSelectedComponentFormPosition();
                });
            }
        });
    }

    render() {
        const { canvas, componentList, selectedComponent, componentFormRef } = this.state;
        return (
            <div className="primary-electrical-overview">
                <div className="primary-electrical__project-info">
                    <Form
                        name="basic"
                        className="project-info__form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.saveProject}
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
                        <div className="components__added">
                            <div className="components__added-title">已添加Element</div>
                            <div className="components__list">
                                {componentList.map((item) => {
                                    return (
                                        <div className="added-component" key={Math.random()}>
                                            a
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="components__exist">
                            <div className="components__exist-title">已有Element</div>
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
                    <div className="paint-container">
                        <canvas
                            ref={canvas}
                            width={800}
                            height={600}
                            onDrop={this.handleDrop}
                            onDragOver={this.handleDragEnter}
                        ></canvas>
                    </div>
                    <div className="component__properties">
                        <div className="component_properties-title">
                            <span className="title-text">元件属性</span>
                            <Button type="primary" onClick={this.saveComponentProperties}>
                                保存属性
                            </Button>
                        </div>
                        <Form name="basic" className="component__properties-form" ref={componentFormRef}>
                            <Form.Item label="元件名称：" name="name">
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="元件ID："
                                name="id"
                                rules={[{ required: true, message: "请输入元件ID！" }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item label="显示轮廓：" name="showBorder">
                                <Checkbox style={{ lineHeight: "32px" }} />
                            </Form.Item>
                            <div className="component__properties-position-wrap">
                                <span className="label">元件位置：</span>
                                <Form.Item
                                    label="x"
                                    name="positionX"
                                    rules={[{ required: true, message: "请输入元件坐标！" }]}
                                >
                                    <InputNumber
                                        min={0}
                                        onChange={debounce(this.componentInpuntPositionChange.bind(this, "positionX"))}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="y"
                                    name="positionY"
                                    rules={[{ required: true, message: "请输入元件坐标！" }]}
                                >
                                    <InputNumber
                                        min={0}
                                        onChange={debounce(this.componentInpuntPositionChange.bind(this, "positionY"))}
                                    />
                                </Form.Item>
                            </div>
                        </Form>
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
