import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class PerformanceTemplateDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getPerformanceTemplates();
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Performance Template</option>
                    {this.props.performanceTemplates && this.props.performanceTemplates.map((template, index) => {
                        return <option key={index} value={template.id} selected={this.props.defaultValue == template.id}>{template.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        performanceTemplates: state.dropdown.performanceTemplates
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getPerformanceTemplates: () => {
            dispatch(DropdownService.getPerformanceTemplates())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PerformanceTemplateDropdown);
