import React, { Component } from 'react'
import { connect } from 'react-redux';
import { CONSTANT } from '../../../constant';
import { employeeProfilePhotoURL } from '../../../HttpRequest';
import { DropdownService } from './DropdownService';

class EmployeeDropDownByCompany extends Component {
    constructor(props) {
        super(props)
        this.state = {
            blobUrls: {}
        };
    }
    componentDidMount() {
        const { companyId } = this.props;
        this.props.getEmployeeByCompany(companyId);
        window.TriggerSelect2();
        window.BindSelect2Event();
        this.loadProfilePhotos();
    }
    componentDidUpdate(prevProps) {
        const employeesChanged = prevProps.employees !== this.props.employees;
        if(this.props.refresh || this.props.companyId !== prevProps.companyId) {
            this.props.getEmployeeByCompany(this.props.companyId);
        }
        if (employeesChanged) {
            this.clearBlobUrls();
            this.loadProfilePhotos();
        }
    }
    componentWillUnmount() {
        this.clearBlobUrls();
    }
    clearBlobUrls = () => {
        Object.values(this.state.blobUrls).forEach(url => {
            if (url && url.startsWith('blob:')) {
                URL.revokeObjectURL(url);
            }
        });
        this.setState({ blobUrls: {} });
    }
    
    loadProfilePhotos = () => {
        if (this.props.employees && this.props.employees.length > 0) {
            const { excludeId } = this.props;
            const employeesToShow = this.props.employees.filter(e => e.id != excludeId);
            
            employeesToShow.forEach(employee => {
                employeeProfilePhotoURL(employee.id)
                    .then((url) => {
                        if (url && url.startsWith('blob:')) {
                            this.setState(prevState => ({
                                blobUrls: {
                                    ...prevState.blobUrls,
                                    [employee.id]: url
                                }
                            }));
                        }
                        window.bindProfilePhoto(employee.id, url);
                    })
                    .catch((error) => {
                        console.warn('Error retrieving employee profile photo:', error);
                    });
            });
        }
    }
    render() {
        const { excludeId,title } = this.props;
        return (
            <>
                <select disabled={this.props.readOnly} defaultValue={this.props.defaultValue} className="form-control bindSelect2" onChange={this.props.onChange}>
                    <option value="">{title ? title : 'Select Employee'}</option>
                    {this.props.employees && this.props.employees.filter(e => e.id != excludeId).map((employee, index) => (
                        <option key={`${employee.id}-${index}`} data-profile-photo-id={employee.id} data-img={CONSTANT.userImage} 
                            value={employee.id} selected={this.props.defaultValue == employee.id}>
                            {employee.name} </option>
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
        getEmployeeByCompany: (companyId) => {
            dispatch(DropdownService.getEmployeeByCompany(companyId))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDropDownByCompany);