import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class HSourceTypeDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getSourceType();
    }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control my-2  bindSelect2" onChange={this.props.onChange}>
                    <option value="">Select SourceType</option>
                    {this.props.sourceType && this.props.sourceType.map((project, index) => {
                        return <option key={index} value={project.id} selected={this.props.defaultValue == project.id}>{project.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        sourceType: state.dropdown.sourceType
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getSourceType: () => {
            dispatch(DropdownService.getSourceType())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HSourceTypeDropdown);