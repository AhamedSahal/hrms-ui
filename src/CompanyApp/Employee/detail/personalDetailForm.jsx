import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Modal, Anchor } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { BLOOD_GROUP, GENDER, MARITAL_STATUS } from '../../../Constant/enum';
import { getEmployeeId, getOrDefault, getReadableDate, getUserType, verifyEditPermission } from '../../../utility';
import EnumDropdown from '../../ModuleSetup/Dropdown/EnumDropdown';
import LanguageDropdown from '../../ModuleSetup/Dropdown/LanguageDropdown';
import NationalityDropdown from '../../ModuleSetup/Dropdown/NationalityDropdown';
import ReligionDropdown from '../../ModuleSetup/Dropdown/ReligionDropdown';
import { getPersonalInformation, updatePersonalInformation } from './service';
import { EmployeeSchema } from '../validation';
;

const { Header, Body, Footer, Dialog } = Modal;
export default class PersonalDetailEmployeeForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editable: false,
            id: props.employeeId || 0,
            employee: {
                languages: [],
                id: 0
            }
        }
    }

    componentDidMount() {
        getPersonalInformation(this.state.id).then(res => {
            let employee = res.data;
            if (res.status == "OK") {
                employee.dob = employee?.dob?.substr(0, 10);
                this.setState({ employee })
            }
        })
    }

    save = (data, action) => {
        const capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        };

        data.firstName = capitalizeFirstLetter(data.firstName);
        data.lastName = capitalizeFirstLetter(data.lastName);
        data.middleName = data.middleName ? capitalizeFirstLetter(data.middleName) : '';
        data.fatherName = data.fatherName ? capitalizeFirstLetter(data.fatherName) : '';
        data["dob"] = data["dob"] == "" ? "" : new Date(data["dob"]);
        action.setSubmitting(true);
        updatePersonalInformation(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.setState({
                    editable: false,
                    employee: res.data
                })
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving personal detail");

            action.setSubmitting(false);
        })
    }
    render() {
        let { editable, employee } = this.state;
        const isEditAllowed = verifyEditPermission("Peoples My Team");
        if (editable && !isEditAllowed) {
            editable = true;
        }
        employee.languages = employee.employeeLanguages ? employee.employeeLanguages.map(v => v.id) : [];
        employee.nationalityId = !employee.nationalityId ? employee.nationality?.id || 0 : employee.nationalityId;
        employee.religionId = !employee.religionId ? employee.religion?.id || 0 : employee.religionId;
        employee.phone = getOrDefault(employee.phone, "");
        employee.gender = getOrDefault(employee.gender, "NA");
        employee.bloodGroup = getOrDefault(employee.bloodGroup, "NA");
        employee.maritalStatus = getOrDefault(employee.maritalStatus, "NA");
        employee.dob = getOrDefault(employee.dob, "");
        return (
            <>
                <div className="pt-3 col-md-6 d-flex">
                    <div className="card profile-box flex-fill">
                        <div className="card-body">
                            <h3 className="card-title">Personal Information {!editable && <Anchor style={{ borderRadius: "50%" }} className="btn btn-success btn-sm" onClick={() => {
                                this.setState({ editable: true })
                            }}><i className="fa fa-edit"></i></Anchor>}</h3>

                            <ul className="personal-info">
                                <li>
                                    <div className="title">Name</div>
                                    <div className="text">{employee.firstName} {employee.middleName} {employee.lastName}</div>
                                </li>
                                <li>
                                    <div className="title">Father Name</div>
                                    <div className="text">{employee.fatherName ? employee.fatherName : "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Email</div>
                                    <div className="text">{employee.email ? employee.email : "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Phone</div>
                                    <div className="text">{employee.phone ? employee.phone : "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Date of Birth</div>
                                    <div className="text">{getReadableDate(employee.dob) ? getReadableDate(employee.dob) : "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Gender</div>
                                    <div className="text">{employee.gender != "NA" ? employee.gender : "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Blood Group</div>
                                    <div className="text">{employee.bloodGroup != "NA" ? employee.bloodGroup : "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Marital Status</div>
                                    <div className="text">{employee.maritalStatus != "NA" ? employee.maritalStatus : "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Nationality</div>
                                    <div className="text">{employee.nationality?.name ? employee.nationality?.name : "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Religion</div>
                                    <div className="text">{employee.religion?.name ? employee.religion?.name : "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Language</div>
                                    <div className="text">{employee.employeeLanguages ? employee.employeeLanguages && employee.employeeLanguages.map(l => {
                                        return l.name;
                                    }).join(',') : "-"}</div>
                                </li>
                                <li>
                                    <div className="title">Total Experience</div>
                                    <div className="text">{employee.totalExperience ? employee.totalExperience : "-"} </div>
                                </li>
                            </ul>

                        </div>
                    </div>
                </div>

                <Modal enforceFocus={false} size={"xl"} show={editable} onHide={() => { this.setState({ editable: false }) }}>
                    <Header closeButton>
                        <h5 className="modal-title">Edit Personal Information</h5>
                    </Header>
                    <Body>
                        <Formik
                            enableReinitialize={true}
                            initialValues={this.state.employee}
                            onSubmit={this.save}
                            validationSchema={EmployeeSchema}
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
                                    <div className="row">
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>First Name
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly={!editable} name="firstName" className="form-control"></Field>
                                                <ErrorMessage name="firstName">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Middle Name

                                                </label>
                                                <Field readOnly={!editable} name="middleName" className="form-control"></Field>
                                                <ErrorMessage name="middleName">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Last Name
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly={!editable} name="lastName" className="form-control"></Field>
                                                <ErrorMessage name="lastName">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>

                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Father Name  </label>
                                                <Field readOnly={!editable} name="fatherName" className="form-control"></Field>
                                                <ErrorMessage name="fatherName">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>

                                            </FormGroup>
                                        </div>

                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Email
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field name="email" className="form-control" readOnly="readOnly"></Field>
                                            </FormGroup>
                                        </div>

                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Phone
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly={!editable} name="phone" type="number" className="form-control"></Field>
                                                <ErrorMessage name="phone">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Date of Birth
                                                </label>
                                                <Field readOnly={!editable} name="dob" type="date" className="form-control"></Field>
                                                <ErrorMessage name="dob">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>

                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Gender
                                                </label>
                                                <Field readOnly={!editable} name="gender" className="form-control"
                                                    render={field => {
                                                        return <EnumDropdown readOnly={!editable} label={"GENDER"} enumObj={GENDER} defaultValue={values.gender} onChange={e => {
                                                            setFieldValue("gender", e.target.value)
                                                        }}>
                                                        </EnumDropdown>
                                                    }}
                                                ></Field>
                                                <ErrorMessage name="gender">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>

                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Blood Group
                                                </label>
                                                <Field readOnly={!editable} name="bloodGroup" className="form-control"
                                                    render={field => {
                                                        return <EnumDropdown readOnly={!editable} label={"Blood Group"} enumObj={BLOOD_GROUP} defaultValue={values.bloodGroup} onChange={e => {
                                                            setFieldValue("bloodGroup", e.target.value)
                                                        }}>
                                                        </EnumDropdown>
                                                    }}
                                                ></Field>
                                                <ErrorMessage name="bloodGroup">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Marital Status
                                                </label>
                                                <Field readOnly={!editable} name="maritalStatus" className="form-control"
                                                    render={field => {
                                                        return <EnumDropdown readOnly={!editable} label={"Marital Status"} enumObj={MARITAL_STATUS} defaultValue={values.maritalStatus} onChange={e => {
                                                            setFieldValue("maritalStatus", e.target.value)
                                                        }}>
                                                        </EnumDropdown>
                                                    }}
                                                ></Field>
                                                <ErrorMessage name="maritalStatus">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>


                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Nationality
                                                </label>
                                                <Field readOnly={!editable} name="nationalityId" render={field => {
                                                    return <NationalityDropdown readOnly={!editable} defaultValue={values.nationality?.id} onChange={e => {
                                                        setFieldValue("nationalityId", e.target.value)
                                                    }}></NationalityDropdown>
                                                }}></Field>
                                                <ErrorMessage name="nationalityId">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>


                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Religion
                                                </label>
                                                <Field readOnly={!editable} name="religionId" render={field => {
                                                    return <ReligionDropdown readOnly={!editable} defaultValue={values.religion?.id} onChange={e => {
                                                        setFieldValue("religionId", e.target.value)
                                                    }}></ReligionDropdown>
                                                }}></Field>
                                                <ErrorMessage name="religionId">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>

                                        <div className="col-md-8">
                                            <FormGroup>
                                                <label>Language
                                                </label>
                                                <Field readOnly={!editable} name="languages" render={field => {
                                                    return <LanguageDropdown readOnly={!editable} defaultValue={values.languages} onChange={e => {
                                                        const { checked, value } = e.target;
                                                        if (checked) {
                                                            setFieldValue("languages", [...values.languages, parseInt(value)]);
                                                        } else {
                                                            setFieldValue(
                                                                "languages",
                                                                values.languages.filter((v) => v != value)
                                                            );
                                                        }
                                                    }}></LanguageDropdown>
                                                }}></Field>
                                                <ErrorMessage name="languages">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Total Experience
                                                </label>
                                                <Field readOnly={!editable}  name="totalExperience"  min="0" className="form-control"></Field>
                                                <ErrorMessage name="totalExperience">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                    </div>
                                    <input disabled={!editable} type="submit" className="btn btn-primary" value={this.state.employee?.id > 0 ? "Update" : "Save"} />
                                    &nbsp;
                                    <Anchor onClick={() => { this.setState({ editable: false }) }} className="btn btn-secondary btn-sm" ><span>Cancel</span></Anchor>
                                </Form>
                            )
                            }
                        </Formik>
                    </Body>
                </Modal>
            </>

        )
    }
}
