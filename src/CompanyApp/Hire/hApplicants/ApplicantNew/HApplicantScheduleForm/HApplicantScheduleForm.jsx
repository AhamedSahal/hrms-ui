import React, { Component } from 'react';
import { FormGroup } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import { saveHApplciantScheduleForms } from '../../service';
import EmployeeDropdown from '../../../../ModuleSetup/Dropdown/EmployeeDropdown';
import IconButton from '@mui/material/IconButton';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { BsFillInfoCircleFill, BsChatSquareText } from "react-icons/bs"

// tool tip
const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      width: "150px",
      height: "auto",
      padding: "5px",
      border: "1px solid black"
    },
  }));
export default class HApplicantScheduleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.happlicantMainId || 0,
            applicantScheduleForm: {},
            applicantId: props.applicantId || 0,
            isInternal: props.isInternal || "",
            applicantName: props.applicantName,
            status: "EVALUATING",
            checkStatus: props.status || "",
            testmode: false,
            hiringManagerId : props.hiringManagerId || 0
        };
    }

    save = (data, action) => {
        let scheduleParameter = {...data,applicantId: this.state.id,internal : this.state.isInternal == "internalApplicant"?true:false, hiringManagerId : this.state.hiringManagerId}
        // api
        if(this.state.applicantName == "All"){
            this.props.updateAllSchedule(data,this.state.status);
        }else if(this.state.applicantName == "Seleted") {
            this.props.updateSelectedSchedule(data,this.state.status);
        }else{
        saveHApplciantScheduleForms(scheduleParameter)
            .then((res) => {
                if (res.status == "OK") {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") {
                    if(this.state.checkStatus == "NEW"){
                    this.props.handleStatusUpdate(this.state.applicantId,this.state.isInternal,this.state.status,1,1)    
                    }else{
                        window.location.reload();
                    }  
                }

            })
            .catch((err) => {
                toast.error("Error while saving Job");
            });
        }

    }

    render() {
        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.applicantScheduleForm}
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
                                    <label>Interview Stages  <span style={{ color: "red" }}>*</span></label>
                                    <select
                                     required
                                        className="form-control"
                                        name="interviewStages"
                                        id="interviewStages"
                                        defaultValue={values.interviewStages}
                                        onChange={(e) => {
                                            setFieldValue("interviewStages", e.target.value);
                                        }}
                                    >
                                        <option value="">Select interview</option>
                                        <option value="1">Asssessment - English & General Knowledge Test-Test</option>
                                        <option value="2">Skill Interview-Interview</option>
                                        <option value="3">Behavioural Interview-Interview</option>
                                        <option value="4">HR Interview-Interview</option>
                                        <option value="5">Skill Test-Test</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label>Interview Type  <span style={{ color: "red" }}>*</span></label>
                                    <select
                                    required
                                        className="form-control"
                                        name="interviewType"
                                        id="interviewType"
                                        defaultValue={values.interviewType}
                                        onChange={(e) => {
                                            // this.props.handleScheduleFormUpdate(e.target.value == 1 || e.target.value == 5?1:2, e.target.value)
                                            setFieldValue("interviewType", e.target.value);
                                        }}
                                    >
                                        <option value="">Select interview type</option>
                                        <option value="1">Face-to-Face</option>
                                        <option value="2">Telephonic</option>
                                        <option value="3">Online</option>
                                        <option value="4">Group</option>
                                    </select>
                                </div>

                                <div className="col-md-12" style={{paddingTop: "10px"}}>
                                    <label>Test Type <span style={{ color: "red" }}>*</span></label>
                                    <select
                                    required
                                        className="form-control"
                                        name="testType"
                                        id="testType"
                                        defaultValue={values.testType}
                                        onChange={(e) => {
                                            setFieldValue("testType", e.target.value);
                                            this.setState({testmode: e.target.value == 1?true:false})
                                        }}
                                    >
                                        <option value="">Select interview</option>
                                        <option value="1"> Online Test</option>
                                        <option value="2"> Offline Test</option>

                                    </select>
                                </div>
                                {/* test link */}
                                {this.state.testmode?
                                <div className="col-md-12" style={{paddingTop: "10px"}}>
                                    <FormGroup>
                                        <label>
                                            Test Link <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="testLink" className="form-control" placeholder="Add Test Link" required></Field>
                                        <ErrorMessage name="testLink">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>:null}
                                {/* col 2 */}

                                <div className="col-md-6" style={{ paddingTop: "15px" }}>
                                    <FormGroup>
                                        <label>
                                            Start Date <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field
                                            required
                                            name="startDate"
                                            defaultValue={values.startDate}
                                            className="form-control"
                                            type="date"
                                            onChange={(e) => {
                                                setFieldValue("startDate", e.currentTarget.value);
                                            }}
                                        ></Field>
                                        <ErrorMessage name="startDate">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>

                                </div>

                                <div className="col-md-6" style={{ paddingTop: "15px" }}>
                                    <FormGroup>
                                        <label>Start Time <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field required name="startTime" type="time" className="form-control"></Field>
                                        <ErrorMessage name="startTime">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>

                                </div >
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            End Date <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field
                                            required
                                            name="endDate"
                                            defaultValue={values.endDate}
                                            className="form-control"
                                            type="date"
                                            onChange={(e) => {
                                                setFieldValue("endDate", e.currentTarget.value);
                                            }}
                                        ></Field>
                                        <ErrorMessage name="endDate">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>

                                </div>

                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>End Time <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field required name="endTime" type="time" className="form-control"></Field>
                                        <ErrorMessage name="endTime">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>

                                </div >
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            Reviewer <LightTooltip title="You can able to add a reviewer to review the candidate" placement="top" style={{ margin: "-10px" }}>
                          <IconButton>
                            <BsFillInfoCircleFill size={20} style={{ color: "#1DA8D5" }} />
                          </IconButton>
                        </LightTooltip>
                                        </label>
                                        <Field
                                         required
                                            name="reviewer"
                                            render={(field) => {
                                                return (
                                                    <EmployeeDropdown permission="ORGANIZATION"
                                                        defaultValue={values.reviewer}
                                                        onChange={(e) => {
                                                            setFieldValue("reviewerId", e.target.value);
                                                            setFieldValue("reviewer", { id: e.target.value });
                                                        }}
                                                    ></EmployeeDropdown>
                                                );
                                            }}
                                        ></Field>
                                    </FormGroup>

                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            Location
                                        </label>
                                        <Field
                                            name="location"
                                            className="form-control"
                                            placeholder="location"
                                        ></Field>
                                        <ErrorMessage name="location">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>

                                </div>

                                <div className="col-md-12">
                                    <FormGroup>
                                        <label style={{ whiteSpace: "nowrap" }}>
                                            Comment
                                        </label>
                                        <Field name="comment" className="form-control" placeholder="Add comment" style={{ height: "80px" }}></Field>
                                        <ErrorMessage name="comment">
                                            {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>

                                {/* save */}
                                <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-6">
                                        <input className="btn btn-light hire-close" value={"Cancel"} onClick={this.props.hideScheduleForm} />
                                    </div>
                                    <div className="col-md-6" style={{ display: "flex", justifyContent: "end" }}>
                                        <input type="submit" value="Schedule" className='btn hire-next-btn' />
                                    </div>
                                </div>
                                </div>
                            </div>
                        </Form>
                    )}

                </Formik>

            </div>
        )
    }

}