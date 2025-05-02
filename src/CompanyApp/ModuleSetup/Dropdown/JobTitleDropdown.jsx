import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class JobTitleDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getJobTitle();
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Job Title</option>
                    {this.props.jobTitle && this.props.jobTitle.map((jobTitle, index) => {
                        return <option key={index} value={jobTitle.id} selected={this.props.defaultValue == jobTitle.id}>{jobTitle.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        jobTitle: state.dropdown.jobTitle
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getJobTitle: () => {
            dispatch(DropdownService.getJobTitle())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(JobTitleDropdown);
