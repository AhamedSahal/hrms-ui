import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class EmploymentStatusDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        this.props.getEmploymentStatus();
    }
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.props.onChange}>
                    <option value="">Select Employment Status</option>
                    {this.props.employmentStatus && this.props.employmentStatus.map((employmentStatus, index) => {
                        return <option key={index} value={employmentStatus.id} selected={this.props.defaultValue == employmentStatus.id}>{employmentStatus.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        employmentStatus: state.dropdown.employmentStatus
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getEmploymentStatus: () => {
            dispatch(DropdownService.getEmploymentStatus())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EmploymentStatusDropdown);
