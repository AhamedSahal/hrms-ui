import React, { Component } from 'react'
import { connect } from 'react-redux';
import { CONSTANT } from '../../../constant';
import { employeeProfilePhotoURL } from '../../../HttpRequest';
import { DropdownService } from './DropdownService';

class EmployeeDropdown extends Component {
    constructor(props) {
        super(props)

    }
    componentDidMount() {
        const { permission } = this.props;
        this.props.getEmployees(permission);
        window.TriggerSelect2();
        window.BindSelect2Event();
        this.props.employees.forEach(employee => {
            this.triggerProfilePhotoLoad(employee.id);
          });
    }
    triggerProfilePhotoLoad = (id)=>{
        employeeProfilePhotoURL(id)
        .then((url) => {
         window.bindProfilePhoto(id,url);
        })
        .catch((error) => {
          console.warn('Error retrieving employee profile photo:', error);
        });
    }
    render() {
        const { excludeId, permission } = this.props;
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control bindSelect2" onChange={this.props.onChange} required={this.props.isRequired}>
                    <option value="">Select Employee</option>
                    {this.props.employees && this.props.employees.filter(e => e.id != excludeId).map((employee, index) => (
                        <option key={index} data-profile-photo-id={employee.id} data-img={CONSTANT.userImage} value={employee.id} selected={this.props.defaultValue == employee.id}>{employee.name}</option>
                    ))}
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
        getEmployees: (permission) => {
            dispatch(DropdownService.getEmployees(permission))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDropdown);
