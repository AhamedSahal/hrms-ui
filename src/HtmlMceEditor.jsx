import React, { Component } from 'react';

export default class HtmlMceEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contentLoaded: false
        };
    }

    componentDidMount() {
        window.ApplyMCEEditor();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.contentLoaded && !prevState.contentLoaded) {
            return { contentLoaded: true };
        }
        return { contentLoaded: false };
    }

    render() {
        const { value, onChange, name, disabled } = this.props;
        return (
            <>
                <input
                    name={name}
                    className="mceEditor mt-4"
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                    value={value}
                />
            </>
        );
    }
}
