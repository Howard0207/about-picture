import React, { Component, cloneElement } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "_less/primary-electrical-overview";
// import Element from "./component/register";
import { Form, Input, Button, InputNumber, Checkbox, message } from "antd";
import C, { debounce } from "_utils";
import axios from "_service";
import ElementPainter, { Element } from "primary-electrical-graphic-system";
const CancelToken = axios.CancelToken;
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
			selectedElement: null,
			imgBeforeNextRender: null,
			cancelToken: null,
		};
	}

	// 拖拽开始
	handleDragStart = (e) => {
		// console.log(e.target);
	};

	// 拖拽结束
	onDragEnd = (e) => {
		// console.log(e);
	};

	// 进入拖拽放置区域
	handleDragEnter = (e) => {
		e.preventDefault();
	};

	// 拖拽放下
	handleDrop = (e) => {
		const { canvas, componentList, componentFormRef } = this.state;
		const mouseX = e.pageX;
		const mouseY = e.pageY;
		const { x, y } = canvas.current.getBoundingClientRect();
		const componentX = mouseX - x;
		const componentY = mouseY - y;
		const register = new Element({ positionX: componentX, positionY: componentY });
		register.update({ number: count++ });
		// ---------------
		this.painter.add(register);
		componentList.push(register);
		// ---------------

		// ---------------
		this.painter.render();
		// register.render(this.ctx);
		// ---------------

		this.setState({ componentList, selectedElement: register }, () => {
			this.updateSelectedElementForm(register.state);
		});
	};

	// 更新组件表单坐标
	updateSelectedElementForm = (elementState) => {
		const { componentFormRef } = this.state;
		const form = componentFormRef.current;
		const { name, id, positionX, positionY } = elementState;
		form.setFieldsValue({ name, id: `${id}`, positionX: positionX, positionY: positionY });
	};

	saveComponentProperties = () => {
		const { selectedElement, componentFormRef } = this.state;
		const form = componentFormRef.current;
		const formValues = form.getFieldsValue();
		selectedElement.update(formValues);
		this.updateSelectedComponentRender();
	};

	saveProject = (values) => {
		const { componentList } = this.state;
		axios.put("/primary-electrical/project-create", { projectInfo: values, elements: componentList }).then((res) => {
			console.log(res);
		});
		console.log(values);
	};

	updateSelectedComponentRender = () => {
		const { selectedElement } = this.state;
		const imgBeforeNextRender = this.getImgBeforeNextData(selectedElement);
		this.ctx.clearRect(0, 0, 800, 600);
		setTimeout(() => {
			this.ctx.drawImage(imgBeforeNextRender, 0, 0);
			selectedElement.render(this.ctx);
		}, 100);
	};

	// 元件属性更改
	elementStateChange = (type, value) => {
		const positionState = {};
		if (isNaN(value)) {
			return false;
		}
		const { selectedElement } = this.state;
		const imgBeforeNextRender = this.getImgBeforeNextData(selectedElement);
		this.ctx.clearRect(0, 0, 800, 600);
		positionState[type] = parseFloat(value);
		selectedElement.update(positionState);
		setTimeout(() => {
			this.ctx.drawImage(imgBeforeNextRender, 0, 0);
			selectedElement.render(this.ctx);
		}, 100);
	};

	updateElement = (type) => {
		const { componentFormRef, selectedElement } = this.state;
		const form = componentFormRef.current;
		const value = form.getFieldValue(type);
		if (Object.prototype.hasOwnProperty.call(selectedElement.state, type)) {
			selectedElement.state[type] = value;
			console.log(selectedElement.state);
			this.painter.update(selectedElement.state);
		}
	};

	getImgBeforeNextData = (selectedElement) => {
		const { canvas, componentList } = this.state;
		const list = componentList.filter((item) => !item.selected);
		this.ctx.clearRect(0, 0, 800, 600);
		list.forEach((item) => {
			item.render(this.ctx);
		});
		const data = canvas.current.toDataURL();
		selectedElement.render(this.ctx);
		const img = new Image();
		img.src = data;
		return img;
	};

	triggerRemoveElement = () => {
		const res = this.painter.remove();
		if (!res) {
			message.warning("当前没有选中要删除的元件！");
		}
	};

	// testCancelToken = () => {
	//     const { cancelToken } = this.state;
	//     axios
	//         .get("/primary-electrical/testCancelToken", {
	//             cancelToken,
	//         })
	//         .then((res) => {
	//             console.log(res);
	//         })
	//         .catch((response) => {
	//             if (axios.isCancel(response)) {
	//                 console.log(response);
	//             }
	//         });
	// };

	// cancelCancelToken = () => {
	//     console.log("我已经执行");
	//     this.cancel("取消请求");
	// };

	componentDidMount() {
		const { canvas } = this.state;
		// const cancelToken = new CancelToken((c) => {
		//     this.cancel = c;
		// });
		// this.setState({ cancelToken });
		this.painter = new ElementPainter(canvas.current);
		this.painter.subscribe("elementRemove", (elementState) => {
			const { componentList } = this.state;
			const newList = componentList.filter((item) => item.state.id !== elementState.id);
			this.setState({ componentList: newList });
			return elementState;
		});
		this.painter.subscribe(
			"update",
			debounce((elementState) => {
				const { componentList } = this.state;
				const current = componentList.filter((item) => item.state.id === elementState.id);
				if (current[0]) {
					Object.assign(current[0].state, elementState);
					this.updateSelectedElementForm(current[0].state);
				}
				return elementState;
			}, 100)
		);

		this.painter.subscribe("activeElement", (elementState) => {
			const { componentList } = this.state;
			const current = componentList.filter((item) => item.state.id === elementState.id);
			if (current[0]) {
				this.setState({ selectedElement: current[0] });
				this.updateSelectedElementForm(current[0].state);
			}
			return elementState;
		});
	}

	componentWillUnmount() {
		// console.log("我已经执行 unmount");
		// this.cancel("取消请求");
	}

	render() {
		const { canvas, componentList, selectedElement, componentFormRef } = this.state;
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
							<div className="components__exist-list">
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
					<div className="paint-container">
						<canvas ref={canvas} width={800} height={600} onDrop={this.handleDrop} onDragOver={this.handleDragEnter}></canvas>
					</div>
					<div className="component__properties">
						<div className="component_properties-title">
							<span className="title-text">元件属性</span>
							<Button type="primary" onClick={this.saveComponentProperties}>
								保存属性
							</Button>
							{/* <Button type="primary" onClick={this.testCancelToken}>
                                保存test
                            </Button>
                            <Button type="primary" onClick={this.cancelCancelToken}>
                                取消test请求
                            </Button> */}
							<Button type="primary" onClick={this.triggerRemoveElement}>
								删除当前元件
							</Button>
						</div>
						<Form name="basic" className="component__properties-form" ref={componentFormRef}>
							<Form.Item label="元件名称：" name="name">
								<Input onChange={debounce(this.updateElement.bind(this, "name"), 1000)} />
							</Form.Item>
							<Form.Item label="元件ID：" name="id" rules={[{ required: true, message: "请输入元件ID！" }]}>
								<Input onChange={debounce(this.updateElement.bind(this, "id"), 1000)} />
							</Form.Item>
							<Form.Item label="显示轮廓：" name="showBorder">
								<Checkbox style={{ lineHeight: "32px" }} />
							</Form.Item>
							<div className="component__properties-position-wrap">
								<span className="label">元件位置：</span>
								<Form.Item label="x" name="positionX" rules={[{ required: true, message: "请输入元件坐标！" }]}>
									<InputNumber min={0} onChange={debounce(this.updateElement.bind(this, "positionX"), 1000)} />
								</Form.Item>
								<Form.Item label="y" name="positionY" rules={[{ required: true, message: "请输入元件坐标！" }]}>
									<InputNumber min={0} onChange={debounce(this.updateElement.bind(this, "positionY"), 1000)} />
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
