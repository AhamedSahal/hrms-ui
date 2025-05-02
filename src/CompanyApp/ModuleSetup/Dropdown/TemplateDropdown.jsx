import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class TemplateDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getTemplates();
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Template</option>
                    {this.props.templates && this.props.templates.map((template, index) => {
                        return <option key={index} value={template.id} selected={this.props.defaultValue == template.id}>{template.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        templates: state.dropdown.templates
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getTemplates: () => {
            dispatch(DropdownService.getTemplates())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TemplateDropdown);
