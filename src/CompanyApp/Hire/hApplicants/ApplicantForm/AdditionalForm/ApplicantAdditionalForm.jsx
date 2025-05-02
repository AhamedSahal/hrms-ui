
import React, { Component } from 'react';
import { FormGroup } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { BsChatSquareText, BsPlusCircle, BsDashCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";


export default class ApplicantAdditionalForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            applicantAdditionalForm: props.ApplicantWorkExperienceForm || {},
            skillsetDetails: props.skillSet || [],
            achievementsDetails: props.achievementDetails || []
        };
    }


    // handle add skills set
    addSkillSet = () => {
           // validation
           let { skillsetDetails } = this.state;
           let skillValidation = false;
           if (skillsetDetails.length > 0) {
            skillValidation = skillsetDetails[skillsetDetails.length - 1].skillSet == "";
           }
           if (!skillValidation) {
            let temp = this.state.skillsetDetails;
            temp.push({
                id: 0,
                skillSet: "",
                years: 0
            })
            this.setState({ skillsetDetails: temp })
           }else{
            toast.error("Please Provide Skillset")
           }
       

    }

    handleskillsetDelete = (index) => {
        let { skillsetDetails } = this.state;
        let skillSetFilter = skillsetDetails.filter((res, i) => {
            if (index != i) {
                return { ...res }
            }
        })
        this.setState({ skillsetDetails: skillSetFilter })
       

    }

    handlesAchievementDetailsDelete = (index) => {
        let { achievementsDetails } = this.state;
        let achievementDetailsFilter = achievementsDetails.filter((res, i) => {
            if (index != i) {
                return { ...res }
            }
        })
        this.setState({ achievementsDetails: achievementDetailsFilter })
        

    }

    // update skill set in additionalForm
    updateSkillSetAdditionalForm = (updatedSkillSet, index) => {
        let { skillsetDetails } = this.state;
        skillsetDetails[index] = updatedSkillSet;
        this.setState({ skillsetDetails: skillsetDetails })
    }

    // update achievementDetails
    updateAchievementDetailsAdditionalForm = (updateAchievementDetails, index) => {
        let { achievementsDetails } = this.state;
        achievementsDetails[index] = updateAchievementDetails;
        this.setState({ achievementsDetails: achievementsDetails })
    }

    // handle add achievementDetails

    addAchievementDetails = () => {
          // validation
          let { achievementsDetails } = this.state;
          let achievementValidation = false;
          if (achievementsDetails.length > 0) {
            achievementValidation = achievementsDetails[achievementsDetails.length - 1].achievementDetails == "";
          }
          // check validation
        if (!achievementValidation) {
            let temp = this.state.achievementsDetails;
            temp.push({
                id: 0,
                achievementDetails: "",
                date: ""
            })
            this.setState({ achievementsDetails: temp })    

        }else{
            toast.error("Please Provide Achievement Details")
        }
      
    }

    render() {
        let { skillsetDetails, achievementsDetails } = this.state;
        return (
            <div style={{ background: "white" }}>
                <br />
                {skillsetDetails && skillsetDetails.length > 0 && skillsetDetails.map((res, index) => {
                    return <Formik
                        enableReinitialize={true}
                        initialValues={res}
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
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <FormGroup>
                                                    <label>
                                                        Skill Set
                                                    </label>
                                                    <Field name="skillSet" className="form-control" placeholder="Skill Set"
                                                        onChange={(e) => {
                                                            res.skillSet = e.currentTarget.value;
                                                            this.updateSkillSetAdditionalForm(res, index)
                                                            this.props.updateSkillSet(res, index);
                                                        }}
                                                    ></Field>
                                                    <ErrorMessage name="skillSet">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>

                                            <div className="col-md-4">
                                                <FormGroup>
                                                    <label>
                                                        Years
                                                    </label>
                                                    <Field name="years" className="form-control" placeholder="Years" type="number"
                                                        onChange={(e) => {
                                                            res.years = e.currentTarget.value;
                                                            this.updateSkillSetAdditionalForm(res, index)
                                                            this.props.updateSkillSet(res, index);
                                                        }}
                                                    ></Field>
                                                    <ErrorMessage name="years">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-2 main_add_btn">{index != 0?<a className='add_applicant_btn' onClick={(e) => {
                                                this.handleskillsetDelete(index);
                                                this.props.handleskillDelete(index);
                                            }
                                            }><BsDashCircle size={30} color='#55687d' /></a>:null}</div>
                                            {skillsetDetails.length - 1 == index ?
                                                <div className="col-md-2 main_add_btn"><a className='add_applicant_btn' onClick={this.addSkillSet}><BsPlusCircle size={30} /></a></div>
                                                : null}
                                        </div>


                                    </div>
                                </div>

                            </Form>
                        )}
                    </Formik>
                })}

                {/* form 2 */}
                {achievementsDetails && achievementsDetails.length > 0 && achievementsDetails.map((res, index) => {
                    return <Formik
                        enableReinitialize={true}
                        initialValues={res}
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
                            <Form>
                                <div className="row">
                                    {/* row 2 */}
                                    <div className="col-md-12">
                                        <div className="row">

                                            <div className="col-md-4">
                                                <FormGroup>
                                                    <label style={{ whiteSpace: "nowrap" }}>
                                                        Achievement Details
                                                    </label>
                                                    <Field name="achievementDetails" className="form-control" placeholder="Achievement Details"
                                                        onChange={(e) => {
                                                            res.achievementDetails = e.currentTarget.value;
                                                            this.updateAchievementDetailsAdditionalForm(res, index)
                                                            this.props.updateAchievementDetails(res, index);
                                                        }}
                                                    ></Field>
                                                    <ErrorMessage name="achievementDetails">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>

                                            <div className="col-md-4" >
                                                <FormGroup>
                                                    <label>
                                                        Date
                                                    </label>
                                                    <Field name="date" className="form-control" placeholder="Date" type="date"
                                                        onChange={(e) => {
                                                            res.date = e.currentTarget.value;
                                                            this.updateAchievementDetailsAdditionalForm(res, index)
                                                            this.props.updateAchievementDetails(res, index);
                                                        }}
                                                    ></Field>
                                                    <ErrorMessage name="date">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-2 main_add_btn">{index != 0?<a className='add_applicant_btn' onClick={(e) => {
                                                this.handlesAchievementDetailsDelete(index);
                                                this.props.handleAchievementDelete(index);
                                            }}><BsDashCircle size={30} color='#55687d' /></a>:null}</div>
                                            {achievementsDetails.length - 1 == index ?
                                                <div className="col-md-2 main_add_btn"><a className='add_applicant_btn' onClick={this.addAchievementDetails}><BsPlusCircle size={30} /></a></div>
                                                : null}
                                        </div>


                                    </div>

                                </div>

                            </Form>
                        )}

                    </Formik>
                })}

            </div>
        );
    }

}