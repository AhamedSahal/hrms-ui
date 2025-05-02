import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class SectionDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getSection();
    }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Section</option>
                    {this.props.section && this.props.section.map((section, index) => {
                        return <option key={index} value={section.id} selected={this.props.defaultValue == section.id}>{section.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        section: state.dropdown.section
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getSection: () => {
            dispatch(DropdownService.getSection())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SectionDropdown);
