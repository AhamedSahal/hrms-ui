import React, { Component } from 'react'
import { connect } from 'react-redux';
import { CONSTANT } from '../../../constant';
import { employeeProfilePhotoURL } from '../../../HttpRequest';
import { DropdownService } from './DropdownService';

class EmployeeDropDownByAdmin extends Component {
    constructor(props) {
        super(props)
        
    }
    componentDidMount() {
        const { companyId } = this.props;
        this.props.getEmployeeByAdmin(companyId);
        window.TriggerSelect2();
        window.BindSelect2Event();
    }
    componentDidUpdate(prevProps) {
        if (this.props.companyId !== prevProps.companyId) {
            this.props.getEmployeeByAdmin(this.props.companyId);
        }
    }
    triggerProfilePhotoLoad = (id) => {
        employeeProfilePhotoURL(id)
            .then((url) => {
                window.bindProfilePhoto(id, url);
            })
            .catch((error) => {
                console.warn('Error retrieving employee profile photo:', error);
            });
    }
    render() {
        const { excludeId, readOnly, companyEmployees, defaultValue, onChange } = this.props;
        return (
            <>
                <select disabled={readOnly} defaultValue={defaultValue} className="form-control bindSelect2" onChange={onChange}>
                    <option value="">Select Employee</option>
                    {companyEmployees && companyEmployees.filter(e => e.id != excludeId).map((employee, index) => {
                        this.triggerProfilePhotoLoad(employee?.id)
                        return <option key={index} data-profile-photo-id={employee.id} data-img={CONSTANT.userImage} value={employee.id} selected={defaultValue == employee.id}>{employee.name}</option>
                    })}
                </select>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        companyEmployees: state.dropdown.companyEmployees
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getEmployeeByAdmin: (companyId) => {
            dispatch(DropdownService.getEmployeeByAdmin(companyId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDropDownByAdmin);
