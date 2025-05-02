import React, { Component } from 'react'
import { connect } from 'react-redux';
import { DropdownService } from './DropdownService';

class LeaveTypeDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            employeeId: props.employeeId,
            oldEmployeeId : 0
        }

    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.employeeId && nextProps.employeeId != prevState.employeeId) {
            return ({ employeeId: nextProps.employeeId });
        }
        return ({ employeeId: "" })
    }

    componentDidMount() {
        if (this.props.employeeId) { 
            this.props.getLeaveTypes(this.props.employeeId);
        } 
    }
 
    componentDidUpdate(prevProps, prevState) {
        const { employeeId, oldEmployeeId } = this.state;
        const { leaveTypes } = this.props;
        if (employeeId) {
            if(leaveTypes && leaveTypes.length > 0 && oldEmployeeId==employeeId){
                return;
            }
            this.setState({
                oldEmployeeId : employeeId
              }, () => {
                this.props.getLeaveTypes(employeeId);
              });
           
        }
    }

    onChange = (e)=> {
        const { leaveTypes } = this.props;
        var leaveType = leaveTypes.find(item => item.id === parseInt(e.target.value));
        var attachmentRequired = leaveType?.attachmentRequired;
        var halfDay = leaveType?.halfDay;
        this.props.setFieldValue("leaveTypeId", e.target.value);
        this.props.setFieldValue("leaveType", e.target.value);
        this.props.onChange(e.target.value, attachmentRequired, halfDay);
    }

    render() {
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control" onChange={this.onChange}>
                    <option value="" >Select Leave Type</option>
                    {this.props.leaveTypes && this.props.leaveTypes.map((leaveType, index) => {
                        return <option key={index} value={leaveType.id} selected={this.props.defaultValue == leaveType.id} halfDay={leaveType.halfDay} attachmentRequired={leaveType.attachmentRequired}>{leaveType.name} </option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        leaveTypes: state.dropdown.leaveTypes
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getLeaveTypes: (employeeId) => {
            dispatch(DropdownService.getLeaveTypes(employeeId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(LeaveTypeDropdown);
