
import React, { Component } from 'react';
import { FormGroup } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import Checkbox from "@mui/material/Checkbox";
import { getJobInfoCandidate } from '../../../../Job/service';
import { saveHApplciantEvaluatingForms } from '../../../service';

export default class EvaluatingForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.happlicantMainId,
            externalJobId: props.externalJobId || 0,
            applicantEvaluatingForm: {},
            isInternal: props.isInternal || "",
            applicantName: props.applicantName,
            scheduleInfo: props.scheduleInfo,
            scaleArray: [],
            scaleValue: "",
            externalJobinfo: [],
            interviewDone: false,
            name: ""
        };
    }
    componentDidMount() {
        if (this.state.isInternal == "Internal Applicant" && this.state.externalJobId == 0) {
            let internalScale = [
                {
                    name: "Worst",
                    checked: true,
                    value: 1
                }, {
                    name: "Below Average",
                    checked: false,
                    value: 2
                }, {
                    name: "Average",
                    checked: false,
                    value: 3
                }, {
                    name: "Good",
                    checked: false,
                    value: 4
                }, {
                    name: "Extra Ordinary",
                    checked: false,
                    value: 5
                }
            ]
            this.setState({ scaleValue: "Worst" })
            this.setState({ scaleArray: internalScale })
        }
        if (this.state.isInternal == "External Applicant" && this.state.externalJobId > 0) {
            this.fetchList();
        }
    }

    fetchList = () => {
        getJobInfoCandidate(this.state.externalJobId).then(res => {

            if (res.status == "OK") {
                this.setState({ externalJobinfo: res.data[0] })
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                this.handleExternalScale()
            }

        })
    }


    handleExternalScale = () => {
        let { externalJobinfo } = this.state;
        let len = externalJobinfo.evaluationScale == 0 ? 10 : externalJobinfo.evaluationScale;
        let externalObj = [{
            name: externalJobinfo.esParameter1,
            checked: true,
            value: 1
        },
        {
            name: externalJobinfo.esParameter2,
            checked: false,
            value: 2
        },
        {
            name: externalJobinfo.esParameter3,
            checked: false,
            value: 3
        },
        {
            name: externalJobinfo.esParameter4,
            checked: false,
            value: 4
        },
        {
            name: externalJobinfo.esParameter5,
            checked: false,
            value: 5
        },
        {
            name: externalJobinfo.esParameter6,
            checked: false,
            value: 6
        },
        {
            name: externalJobinfo.esParameter7,
            checked: false,
            value: 7
        },
        {
            name: externalJobinfo.esParameter8,
            checked: false,
            value: 8
        },
        {
            name: externalJobinfo.esParameter9,
            checked: false,
            value: 9
        },
        {
            name: externalJobinfo.esParameter10,
            checked: false,
            value: 10
        },
        ]
        this.setState({ scaleValue: externalJobinfo.esParameter1 })
        this.setState({ scaleArray: externalObj })

    }



    handleScaleUpdate = (id) => {
        let { scaleArray } = this.state;
        let scaleUpatedData = scaleArray.map((res) => res.value == id ? { ...res, checked: true } : { ...res, checked: false })

        this.setState({ scaleArray: scaleUpatedData })
    }

    // save
    save = (data, action) => {
        let { isInternal, scaleValue, id, scheduleInfo } = this.state;
        let internal = isInternal == "Internal Applicant" ? 1 : 0;
        let evaluatingData = {
            ...data,
            jobId: id,
            isInternal: internal,
            scale: scaleValue,
            reviewerId: scheduleInfo.reviewer != null?scheduleInfo.reviewer.id:0,
            interviewStages: scheduleInfo.interviewStages,
            scheduleStartDate: scheduleInfo.startDate,
            scheduleId: scheduleInfo.id,
            interviewDone: this.state.interviewDone
        }
        // api
        saveHApplciantEvaluatingForms(evaluatingData)
            .then((res) => {
                if (res.status == "OK") {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") {
                    this.props.hideForm();
                }

            })
            .catch((err) => {
                toast.error("Error while saving Job");
            });
    }

    render() {
        let { applicantName, isInternal, scaleArray } = this.state;
        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.applicantEvaluatingForm}
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
                                        Applicant Name
                                    </label>
                                    <p><span>{applicantName}</span> <span style={{ background: "#effbf6", color: "#2db87f", paddingLeft: "10px" }}>{isInternal}</span></p>
                                </div>
                                <div className="col-md-12">
                                    <label>
                                        Score
                                    </label>
                                    <br />
                                    {scaleArray && scaleArray.map((res) => {
                                        return res.name != '' ?
                                            <span key={res.value} style={{ paddingRight: "8px" }}>
                                                <input type="checkbox" name="" id="" value={res.name} checked={res.checked} onChange={(e) => { this.handleScaleUpdate(res.value); this.setState({ scaleValue: res.name }) }} /> <label htmlFor="">{res.name}</label>
                                            </span> : null

                                    })

                                    }

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

                                {/* Interview completed */}
                                <div className="col-md-12">
                                    <FormGroup>
                                        <Checkbox
                                            onChange={(e) => {
                                                this.setState({interviewDone: !this.state.interviewDone})
                                            }}
                                            inputProps={{ "aria-label": "controlled" }}
                                        />
                                        <label>Do you want to complete the interview process? </label>
                                    </FormGroup>
                                </div>


                            </div>
                            {/* save */}
                            <div className="row">
                                <div className="col-md-6">
                                    <input className="btn btn-light hire-close" value={"Cancel"} onClick={this.props.hideForm} />
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