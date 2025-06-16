import React, { Component } from 'react';
import { FormGroup } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { BsChatSquareText, BsDashCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";


export default class ApplicantWorkExperienceForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applicantWorkExperience: props.workExperience || {},
            active: false

        };
    }


    render() {
        let { index, workExperience } = this.props;
        return (
            <div style={{ background: "white" }}>
                <div className="row">
                    <div className="col-md-10">
                        <h3>Experience {index + 1}</h3>
                    </div>
                    <div className="col-md-2 main_add_btn"><a className='add_applicant_btn' onClick={(e) => { this.props.handleWorkExperienceDelete(index) }}><BsDashCircle size={30} color={"black"} /></a></div>

                </div>

                <br />
                <Formik
                    enableReinitialize={true}
                    initialValues={workExperience}
                    onSubmit={this.save}
                // validationSchema={LeaveTypeSchema}
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
                        setSubmitting,
                        /* and other goodies */
                    }) => (
                        <Form autoComplete="off">
                            <div className="row">
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            Employer Name
                                        </label>
                                        <Field name="employerName" className="form-control" placeholder="Employer Name"
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setFieldValue("employerName", value); // Update Formik's state
                                                workExperience.employerName = value; // Update local state
                                                this.props.updateWorkExperience(workExperience, index); // Notify parent
                                            }}
                                            required
                                        ></Field>
                                        <ErrorMessage name="employerName">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>

                                <div className="col-md-6">
                                    <label>Employment Type</label>
                                    <select
                                        className="form-control"
                                        name="employmentType"
                                        id="employmentType"
                                        defaultValue={values.employmentType}
                                        onChange={(e) => {
                                            workExperience.employmentType = Number(e.target.value);
                                            this.props.updateWorkExperience(workExperience, index);
                                        }}
                                    >
                                        <option value="">Select Employment Type</option>
                                        <option value="1">Full Time</option>
                                        <option value="2">Probation</option>
                                        <option value="3">Intern</option>
                                        <option value="4">Contract</option>
                                        <option value="5">Part Time</option>
                                        <option value="6">Permanent</option>
                                        <option value="7">Commission</option>
                                        <option value="8">Freelancer</option>
                                        <option value="9">Agency Resource</option>
                                        <option value="10">Temporary</option>
                                        <option value="11">Consultant</option>
                                        <option value="12">Apprentice</option>
                                    </select>
                                </div>
                                {/* row 2 */}
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            Designation
                                        </label>
                                        <Field name="designation" className="form-control" placeholder="Designation"
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setFieldValue("designation", value); // Update Formik's state
                                                workExperience.designation = value; // Update local state
                                                this.props.updateWorkExperience(workExperience, index); // Notify parent
                                            }}
                                        ></Field>
                                        <ErrorMessage name="designation">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            Location
                                        </label>
                                        <Field name="location" className="form-control" placeholder="Location"
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setFieldValue("location", value); // Update Formik's state
                                                workExperience.location = value; // Update local state
                                                this.props.updateWorkExperience(workExperience, index); // Notify parent
                                            }}
                                        ></Field>
                                        <ErrorMessage name="location">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                {/* row 3 */}
                                <div className="col-md-12" >
                                    <FormGroup>
                                        <div style={{ display: "flex", alignItems: "center" }}>
                                            <Checkbox
                                                onChange={(e) => {
                                                    let { active } = this.state;
                                                    this.setState({ active: !active })
                                                    workExperience.currentlyWorking = !active;
                                                    this.props.updateWorkExperience(workExperience, index);
                                                }}
                                                inputProps={{ "aria-label": "controlled" }}
                                            />
                                            <label style={{ paddingTop: "10px" }}>I currently work in this role</label>

                                        </div>


                                    </FormGroup>
                                </div>
                                {/* row 4 */}
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            Start date <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field required placeholder="Select Date" name="startDate" className="form-control" type="date"
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setFieldValue("startDate", value); // Update Formik's state
                                                workExperience.startDate = value; // Update local state
                                                this.props.updateWorkExperience(workExperience, index); // Notify parent
                                            }}
                                        ></Field>
                                        <ErrorMessage name="startDate">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>

                                {/* end date */}
                                <div className="col-md-6">
                                    {!this.state.active && <FormGroup>
                                        <label>
                                            End date <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field placeholder="Select Date" name="endDate" className="form-control" type="date"
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setFieldValue("endDate", value); // Update Formik's state
                                                workExperience.endDate = value; // Update local state
                                                this.props.updateWorkExperience(workExperience, index); // Notify parent
                                            }}
                                        ></Field>
                                        <ErrorMessage name="endDate">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>}
                                </div>
                                {/* row 5 */}
                                <div className="col-md-12">
                                    <FormGroup>
                                        <label style={{ whiteSpace: "nowrap" }}>
                                            Roles And Responsibilities
                                        </label>
                                        <Field name="rolesAndResponsibilities" className="form-control" placeholder="Enter roles and responsibilities associated with job" style={{ height: "80px" }}
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setFieldValue("rolesAndResponsibilities", value); // Update Formik's state
                                                workExperience.rolesAndResponsibilities = value; // Update local state
                                                this.props.updateWorkExperience(workExperience, index); // Notify parent
                                            }}
                                        ></Field>
                                        <ErrorMessage name="rolesAndResponsibilities">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>

                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }

}