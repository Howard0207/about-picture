import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import errorImg from "_static/images/error.png";
import "_less/pageError";

function ErrorInfo(props) {
	const { errorInfo } = props;
	const { title, description } = errorInfo;
	const formatDesc = () => {
		if (description) {
			try {
				const desc = JSON.parse(description);
				return Object.keys(desc).map((key) => {
					const errInfo = desc[key].split("\n");
					return { [key]: errInfo };
				});
			} catch (error) {
				if (typeof description === "string") {
					return description;
				}
				return "未知错误";
			}
		}
	};

	const descFormatted = formatDesc();
	return (
		<div className="errorInfo">
			<img className="errorImg" src={errorImg} alt="error" />
			<div className="title">{title}</div>
			{descFormatted && (
				<div className="description">
					<p className="label">异常信息：</p>
					{Array.isArray(descFormatted) && descFormatted ? (
						descFormatted.map((obj) => {
							return Object.keys(obj).map((key) => {
								return (
									<div className="error">
										<p className="label">{key}:</p>
										{obj[key].map((text) => (text ? <p className="content">{text.trim()}</p> : null))}
									</div>
								);
							});
						})
					) : (
						<p className="content">{descFormatted}</p>
					)}
				</div>
			)}
		</div>
	);
}

ErrorInfo.propTypes = {
	errorInfo: PropTypes.object.isRequired,
};

export default withRouter(ErrorInfo);
