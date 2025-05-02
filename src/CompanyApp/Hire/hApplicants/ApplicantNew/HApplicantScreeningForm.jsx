import React, { Component } from 'react';
import { FormGroup } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
import { saveHApplciantScreeningForms } from '../service';

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

export default class HApplicantScreeningForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.happlicantMainId,
            applicantScreeningForm: {},
            applicantId: props.applicantId || 0,
            isInternal: props.isInternal || "",
            applicantName: props.applicantName,
            status: "SCREENING"

        };
    }

    save = (data,action) => {
        if(this.state.applicantName == "All"){
            this.props.updateStatus(data,this.state.status);
        }else if (this.state.applicantName == "Seleted"){
               this.props.updateSelectedScreening(data,this.state.status);
        }
        else{
        let screeningFormParameter = {...data, applicantName: this.state.applicantName, applicantId: this.state.id}
        // api
        saveHApplciantScreeningForms(screeningFormParameter)
        .then((res) => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                this.props.handleStatusUpdate(this.state.applicantId,this.state.isInternal,this.state.status,1,1);
            }

        })
        .catch((err) => {
            toast.error("Error while saving Job");
        });
    }
    }

    render() {
        let { applicantName } = this.state;
        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.applicantScreeningForm}
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
                                {/*  applicant name */}
                                <div className="col-md-12">
                                    <label>
                                        Applicant name
                                    </label>
                                    <h5><span style={{padding: "2px",background: "#F2F5F8", borderRadius: "6px"}}>{applicantName}</span></h5>
                                </div>

                                {/* Reviewer */}
                                <div className="col-md-12">
                                    <FormGroup>
                                        <label>
                                            Reviewer <LightTooltip title="You can able to add a reviewer to screening the candidate" placement="top" style={{ margin: "-10px" }}>
                          <IconButton>
                            <BsFillInfoCircleFill size={20} style={{ color: "#1DA8D5" }} />
                          </IconButton>
                        </LightTooltip>
                                        </label>
                                        <Field
                                            name="reviewer"
                                            render={(field) => {
                                                return (
                                                    <EmployeeDropdown permission="ORGANIZATION"
                                                        defaultValue={values.reviewer?.id}
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

                                {/* Comment */}
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


                            </div>
                            {/* save */}
                            <div className="row">
                                <div className="col-md-6">
                                <input className="btn btn-light hire-close" value={"Cancel"} onClick={this.props.hideForm}/>
                                </div>
                                <div className="col-md-6" style={{ display: "flex", justifyContent: "end" }}>
                                    <input type="submit" value="Send" className='btn hire-next-btn' />
                                </div>
                            </div>
                        </Form>
                    )}

                </Formik>

            </div>
        )
    }

}