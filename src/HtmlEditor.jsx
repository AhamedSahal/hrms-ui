import React, { Component } from 'react';
export default class HtmlEditor extends Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate() {
        window.TriggerSummerNote();
    }

    render() {
        const { defaultValue, onChange, name } = this.props;
        return (<textarea className="summernote" name={name} onInput={e => {
            console.log({ val: e.target.value });
            onChange(e.target.value)
        }} value={defaultValue}></textarea>
        )
    }
}
