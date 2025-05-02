import React, { Component } from 'react'
import { connect } from 'react-redux';
import { CONSTANT } from '../../../constant';
import { DropdownService } from './DropdownService';

class EmployeeMultiDropdown extends Component {
    constructor(props) {
        super(props)

    }
    componentDidMount() {
        this.props.getEmployees();
        window.TriggerSelect2();
        window.BindSelect2Event();
    }

    render() {
        const { excludeId } = this.props;
        return (
            <>
                <select multiple={true} disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control bindSelect2" onChange={this.props.onChange}>
                    <option value="">Select Employee</option>
                    {this.props.employees && this.props.employees.filter(e => e.id != excludeId).map((employee, index) => {
                        return <option key={index} data-img={employee.profilePicture ? `data:image/jpeg;base64,${employee.profilePicture}` : CONSTANT.userImage} value={employee.id} selected={this.props.defaultValue == employee.id}>{employee.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        employees: state.dropdown.employees
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getEmployees: () => {
            dispatch(DropdownService.getEmployees())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeMultiDropdown);
