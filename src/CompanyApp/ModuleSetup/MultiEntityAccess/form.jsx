import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getCompanyList, save } from './service';
import CompanyDropDownByAdmin from '../Dropdown/CompanyDropDownByAdmin';
import { getCompanyId } from '../../../utility';
import EmployeeDropDownByCompany from '../Dropdown/EmployeeDropDownByCompany';
import RoleDropdownByCompanyId from '../Dropdown/RoleDropdownByCompanyId';
import { MultiEntityAccessValidation } from './validation';

export default class MultiEntityAccessForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            multiEntityAccess: props.multiEntityAccess.id > 0 ? props.multiEntityAccess : {
                id: 0,
                companyId: '',
                employeeId: '',
                accessCompanyId: '',
                roleId: '',
            },
            company: getCompanyId(),
            companyList: {},
        }
    }
    componentDidMount() {
            this.fetchList();
        }
        fetchList = () => {
            getCompanyList(this.state.company,false).then(res => {
                if (res.status == "OK") {
                    this.setState({
                        companyList: res.data,
                    })
                }
            })
        }
    save = (data, action) => {
        action.setSubmitting(true);
        save(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving multiEntityAccess");

            action.setSubmitting(false);
        })
    }
    handleCompanyIdChange = (e) => {
        const newValue = e.target.value;
        this.setState(prevState => ({
            multiEntityAccess: {
                ...prevState.multiEntityAccess,
                companyId: newValue,
                employeeId: '',
                accessCompanyId: ''
            }
        }), () => {
            console.log("Updated State:", this.state.multiEntityAccess);
        });
    };

    handleEmployeeIdChange = (e) => {
        const newValue = e.target.value;
        this.setState(prevState => ({
            multiEntityAccess: {
                ...prevState.multiEntityAccess,
                employeeId: newValue
            }
        }));
    };
    handleAccessCompanyIdChange = (id) => {
        const newValue = id;
        this.setState(prevState => ({
            multiEntityAccess: {
                ...prevState.multiEntityAccess,
                accessCompanyId: newValue,
                roleId:'',
            }
        }));
    };
    render() {
        const { multiEntityAccess, company,companyList } = this.state;
        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={multiEntityAccess}
                    onSubmit={this.save}
                    validationSchema={MultiEntityAccessValidation}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                        setSubmitting
                        /* and other goodies */
                    }) => (
                        <Form autoComplete='off'>
                            <FormGroup>
                                <label> Company</label>
                                <Field name="companyId" className="form-control"
                                    render={field => {
                                        return <CompanyDropDownByAdmin
                                            onChange={this.handleCompanyIdChange}
                                            defaultValue={multiEntityAccess.companyId}
                                            companyId={company}
                                            allCompany={false}
                                            readOnly={multiEntityAccess.id > 0}
                                        ></CompanyDropDownByAdmin>
                                    }}
                                ></Field>
                                <ErrorMessage name="companyId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                            </FormGroup>
                            {multiEntityAccess.companyId && (
                                <FormGroup>
                                    <label> Employee
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="employeeId" className="form-control"
                                        render={field => {
                                            return <EmployeeDropDownByCompany
                                                onChange={this.handleEmployeeIdChange}
                                                defaultValue={multiEntityAccess.employeeId}
                                                companyId={multiEntityAccess.companyId}
                                                readOnly={multiEntityAccess.id > 0}
                                            ></EmployeeDropDownByCompany>
                                        }}
                                    ></Field>
                                    <ErrorMessage name="employeeId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            )}
                            {multiEntityAccess.companyId && multiEntityAccess.employeeId && (
                                <FormGroup>
                                    <label>Access Company <span style={{ color: "red" }}>*</span></label>
                                    <Field name="accessCompanyId">
                                        {({ field, form }) => (
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Company Name</th>
                                                        <th>Action</th>
                                                        <th>Role</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {(Array.isArray(companyList) ? companyList : []).filter(comp => Number(comp.id) !== Number(multiEntityAccess.companyId)) 
                                                        .map(comp => ( 
                                                    <tr key={comp.id}>
                                                            <td>{comp.name}</td>
                                                            <td>
                                                                <input type="checkbox" name="accessCompanyId" value={comp.id} checked={values.accessCompanyId === comp.id}
                                                                    onChange={()=>{this.handleAccessCompanyIdChange(comp.id)}} defaultValue={multiEntityAccess.accessCompanyId}
                                                                />
                                                            </td>
                                                            <td>
                                                            {/* Show Role Dropdown only for the selected company */}
                                                            {values.accessCompanyId === comp.id && (<>
                                                                <Field name="roleId">
                                                                    {field => (
                                                                        <RoleDropdownByCompanyId 
                                                                            required
                                                                            companyId={comp.id}  // Pass the selected companyId
                                                                            defaultValue={multiEntityAccess.roleId} 
                                                                            onChange={e => setFieldValue("roleId", e.target.value)}
                                                                        />
                                                                    )}
                                                                </Field>
                                                                <ErrorMessage name="roleId">
                                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                </ErrorMessage>
                                                                </>
                                                            )}
                                                        </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </Field>    
                                    <ErrorMessage name="accessCompanyId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            )}
                            <input type="submit" className="btn btn-primary" value={this.state.multiEntityAccess.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}
