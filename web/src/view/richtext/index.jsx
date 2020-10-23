import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Font from "@ckeditor/ckeditor5-font/src/font";
// import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import "_less/richtext";

class RichText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rich: React.createRef(),
        };
    }

    componentDidMount() {
        const { rich } = this.state;
        console.log(ClassicEditor.defaultConfig);
        ClassicEditor.create(rich.current, {
            fontColor: {
                colors: ["#fff", "#000", "#EEECE1"],
            },
            plugins: [Font],
            toolbar: ["fontColor"],
        })
            .then((editor) => {
                window.editor = editor;
            })
            .catch((error) => {
                console.error("There was a problem initializing the editor.", error);
            });
    }

    render() {
        const { rich } = this.state;
        return <div ref={rich}></div>;
    }
}
RichText.propTypes = {
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(RichText);
