import React, { Component } from 'react';
import { FormGroup } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { BsChatSquareText,BsDashCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";


export default class ApplicantEducationForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applicantEducationForm: props.ApplicantWorkExperienceForm || {}

        };

    }



    render() {
        let { index, educationDetails } = this.props;
        return (
            <div style={{ background: "white" }}>
                <div className="row">
                    <div className="col-md-10">
                        <h3>Education {index + 1}</h3>

                    </div>
                    <div className="col-md-2 main_add_btn"><a className='add_applicant_btn' onClick={(e) => { this.props.handleEducationDetailsDelete(index) }}><BsDashCircle size={30} color={"black"} /></a></div>

                </div>
                <br />
                <Formik
                    enableReinitialize={true}
                    initialValues={educationDetails}
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
                                    <label>Education</label>
                                    <select
                                        className="form-control"
                                        name="educationType"
                                        id="educationType"
                                        defaultValue={values.education}
                                        onChange={(e) => {
                                            educationDetails.education = e.target.value;
                                            this.props.updateEduationDetails(educationDetails, index);

                                        }}
                                    >
                                        <option value="">Select </option>
                                        <option value="1">10th grade</option>
                                        <option value="2">12th grade</option>
                                        <option value="3">Bachelors</option>
                                        <option value="4">Masters</option>
                                        <option value="5">Post-graduate</option>
                                        <option value="6">Diploma</option>
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            Degree
                                        </label>
                                        <Field name="degree" className="form-control" placeholder="Degree"
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setFieldValue("degree", value); // Update Formik's state
                                                educationDetails.degree = value; // Update local state
                                                this.props.updateEduationDetails(educationDetails, index); // Notify parent
                                            }}
                                        ></Field>
                                        <ErrorMessage name="degree">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                {/* row 2 */}
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            Specialization
                                        </label>
                                        <Field name="specialization" className="form-control" placeholder="Specialization"
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setFieldValue("specialization", value); // Update Formik's state
                                                educationDetails.specialization = value; // Update local state
                                                this.props.updateEduationDetails(educationDetails, index); // Notify parent
                                            }}
                                        ></Field>
                                        <ErrorMessage name="specialization">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <FormGroup>
                                                <label>
                                                    Score
                                                </label>
                                                <Field name="score" className="form-control" placeholder="Score" type="number"
                                                    onChange={(e) => {
                                                        const value = e.currentTarget.value;
                                                        setFieldValue("score", value); // Update Formik's state
                                                        educationDetails.score = value; // Update local state
                                                        this.props.updateEduationDetails(educationDetails, index); // Notify parent
                                                    }}
                                                ></Field>
                                                <ErrorMessage name="score">
                                                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>

                                        </div>
                                        <div className="col-md-2" style={{ display: "flex", alignItems: "center", fontSize:"x-large" }}>
                                          /
                                        </div>
                                        <div className="col-md-5" style={{ paddingTop: "9px" }}>
                                            <FormGroup>
                                                <label>

                                                </label>
                                                <Field name="scale" className="form-control" placeholder="Scale" type="number"
                                                    onChange={(e) => {
                                                        const value = e.currentTarget.value;
                                                        setFieldValue("scale", value); // Update Formik's state
                                                        educationDetails.scale = value; // Update local state
                                                        this.props.updateEduationDetails(educationDetails, index); // Notify parent
                                                    }}
                                                ></Field>
                                                <ErrorMessage name="scale">
                                                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>

                                    </div>

                                </div>
                                {/* row 3 */}
                                <div className="col-md-12" >
                                    <FormGroup>
                                        <label>
                                            School / Institute
                                        </label>
                                        <Field name="schoolAndCollage" className="form-control" placeholder="School / Institute"
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setFieldValue("schoolAndCollage", value); // Update Formik's state
                                                educationDetails.schoolAndCollage = value; // Update local state
                                                this.props.updateEduationDetails(educationDetails, index); // Notify parent
                                            }}
                                        ></Field>
                                        <ErrorMessage name="schoolAndCollage">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>


                                    </FormGroup>
                                </div>
                                {/* row 4 */}
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            Start Date 
                                        </label>
                                        <Field required placeholder="Select Date" name="startDate" className="form-control" type="date"
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setFieldValue("startDate", value); // Update Formik's state
                                                educationDetails.startDate = value; // Update local state
                                                this.props.updateEduationDetails(educationDetails, index); // Notify parent
                                            }}
                                        ></Field>
                                        <ErrorMessage name="startDate">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>

                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            End Date 
                                        </label>
                                        <Field required placeholder="Select Date" name="endDate" className="form-control" type="date"
                                            onChange={(e) => {
                                                const value = e.currentTarget.value;
                                                setFieldValue("endDate", value); // Update Formik's state
                                                educationDetails.endDate = value; // Update local state
                                                this.props.updateEduationDetails(educationDetails, index); // Notify parent
                                            }}
                                        ></Field>
                                        <ErrorMessage name="endDate">
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