import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class LeaveTypeReportDropdown extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        const { companyId } = this.props;
        this.props.getLeaveTypeReport(companyId);
    }
    componentDidUpdate(prevProps) {
        if (this.props.companyId !== prevProps.companyId) {
            this.props.getLeaveTypeReport(this.props.companyId);
        }
    }
    
    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control my-2  bindSelect2" onChange={this.props.onChange}>
                    <option value="">Select LeaveType</option>
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
        sourceType: state.dropdown.leaveTypeReport
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getLeaveTypeReport: (companyId) => {
            dispatch(DropdownService.getLeaveTypeReport(companyId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaveTypeReportDropdown);