import React, { Component } from "react";
import { FormGroup } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
// import { getHireJobApplicantField, getSystemFieldInfo, getApplicantInfo } from "../../Job/service";
import { BsFillCaretDownFill } from "react-icons/bs";
import Checkbox from "@mui/material/Checkbox";
import FileUploader from "./FileUploader";
import { toast } from "react-toastify";
// import { saveHExternalApplicantForms,saveHApplicantForms } from "../service";
import { saveHExternalApplicantForms,saveHApplicantForms } from "./service";
import { getHireJobApplicantField, getSystemFieldInfo, getApplicantInfo } from "./service";



export default class JobCandidateApplicantForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            jobId: props.jobId,
            candidateJobApplicantInfo: props.jobInfo || {},
            showForm: false,
            job: [],
            q: "",
            page: 0,
            size: 10,
            applicantSize: 50,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            systemField: [],
            jobApplicantField: [],
            applicantField: []
        };
    }

    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        // job applicant field
        getHireJobApplicantField(this.state.q, this.state.page, this.state.applicantSize, this.state.sort, this.state.jobId).then(res => {
            if (res.status == "OK") {
                this.setState({ jobApplicantField: res.data.list });
               
            }
        })

        //   system field
        getSystemFieldInfo().then((res) => {
            if (res.status == "OK") {
               
                this.setState({ systemField: res.data });
            }
        });

        //   applicant field
        getApplicantInfo().then((res) => {
            if (res.status == "OK") {
               
                this.setState({ applicantField: res.data });
            }
        });
    }


    save = (data, action) => {
        const { jobApplicantField,candidateJobApplicantInfo } = this.state;
     

        let candidateForm = { ...data, file: !this.state.resumeUploade?null:this.state.resumeUploade, file1: !this.state.certificateUploade?null:this.state.certificateUploade,jobId:this.state.jobId,id:0,hiringManagerId:candidateJobApplicantInfo.hiringManagerId,hiringManagerName:candidateJobApplicantInfo.hiringManagerName,jobProfile:candidateJobApplicantInfo.jobProfile}
        if (!this.state.resumeUploade) {
            toast.error("Please Upload Resume")
        } else {
        saveHExternalApplicantForms(candidateForm)
            .then((res) => {
                if (res.status == "OK") {
                    // toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") {
                    this.applicantInfo(res.data.id)
                }
            })
            .catch((err) => {
                toast.error("Error while saving Job");
            });
        }
    }

    // save applicant
    applicantInfo = (id) => {
            // applicant
            let applicantParameters = {
                applicantId: id,
                internalOrExternal: false
            }
            saveHApplicantForms(applicantParameters)
            .then((res) => {
                if (res.status == "OK") {
                    // toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") {
                    this.props.handleResponsForm()
                }

            })
            .catch((err) => {
                toast.error("Error while saving Job");
            });

    }


    handleFileUpload = (file) => {
       
        this.setState({ resumeUploade: file })

    }
    handleCertificateUpload = (file) => {
        
        this.setState({ certificateUploade: file })
    }

    render() {
        const { jobApplicantField, applicantField } = this.state;
        let jobApplicantFieldBoolean = true;
        let defaultFields = ["First Name", "Last Name", "Email", "Resume"]
        return (
            <div style={{ padding: "70px" }}>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.candidateJobApplicantInfo}
                    onSubmit={this.save}
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
                        <Form autoComplete="off" >
                            <div className="row" style={{ padding: "10px", border: "2px solid #E7ECF2", background: "#fff" }}>
                                <h4>Application Form</h4>
                                <div className="row">
                                    <div className="col-md-12">
                                        <label htmlFor="">Resume <span style={{ color: "red" }}>*</span></label>
                                        <FileUploader
                                            onFileUpload={this.handleFileUpload}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <FormGroup>
                                            <label>
                                                First Name <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field
                                                name="firstName"
                                                required
                                                className="form-control"
                                                placeholder="Enter First Name"
                                            ></Field>
                                            <ErrorMessage name="firstName">
                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>

                                    </div>
                                    <div className="col-md-4">
                                        <FormGroup>
                                            <label>
                                                Middle Name
                                            </label>
                                            <Field
                                                name="middleName"
                                                className="form-control"
                                                placeholder="Enter Middle Name"
                                            ></Field>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-4">
                                        <FormGroup>
                                            <label>
                                                Last Name
                                            </label>
                                            <Field
                                                name="lastName"
                                                className="form-control"
                                                placeholder="Enter Last Name"
                                            ></Field>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <FormGroup>
                                            <label>
                                                Email
                                            </label>
                                            <Field
                                                name="email"
                                                className="form-control"
                                                readonly
                                            ></Field>
                                            <ErrorMessage name="email">
                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                </div>
                            </div>

                            {/* candidate form using hjobapplicant */}
                            {applicantField.map((applicantField) => (
                                <div style={{ padding: "10px 0 10px 0" }}>
                                    {jobApplicantFieldBoolean = true}
                                    <div className="row" style={{ border: "2px solid #E7ECF2", background: "#fff" }}>
                                        <div className="col-md-12" style={{ padding: "0" }}>
                                            <a className="collaps-btn" style={{ background: "none" }}>
                                                <a
                                                    className="collapstag"
                                                    data-bs-toggle="collapse"
                                                    href={`#${applicantField.fieldName.replace(/ /g, '')}`}
                                                    role="button"
                                                    aria-expanded="false"
                                                    aria-controls="collapseExample"
                                                >
                                                    <div className="row" style={{padding: "5px"}}>
                                                        <div className="col-md-10">
                                                            <h4 className="collapse-para">{applicantField.fieldName}</h4>
                                                        </div>
                                                        <div
                                                            className="col-md-2"

                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "end",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <BsFillCaretDownFill
                                                                size={15}
                                                                style={{ color: "black" }}
                                                            />
                                                        </div>
                                                    </div>
                                                </a>
                                            </a>
                                        </div>
                                        {/* body */}
                                        <div className="collapse" id={applicantField.fieldName.replace(/ /g, '')} style={{ borderTop: "2px solid #E7ECF2" }}>
                                            {/* row 1 */}
                                            <div className="row" style={{ padding: "10px" }}>
                                                {jobApplicantField.map((jobApplicantdata, index) => (
                                                    <>
                                                        {jobApplicantdata.applicant.id == applicantField.id && jobApplicantdata.active && !defaultFields.includes(jobApplicantdata.fieldName) ?
                                                            <>
                                                                {jobApplicantdata.fieldName == "Ceritifications" ?
                                                                    <div className="col-md-12">
                                                                        <label htmlFor="">{jobApplicantdata.fieldName}</label>
                                                                        <FileUploader
                                                                            onFileUpload={this.handleCertificateUpload}
                                                                        />
                                                                    </div>
                                                                    : <div className="col-md-6">
                                                                        {jobApplicantFieldBoolean = false}
                                                                        <FormGroup>
                                                                            <label>
                                                                                {jobApplicantdata.fieldName} {jobApplicantdata.required ? <span style={{ color: "red" }}>*</span> : null}
                                                                            </label>
                                                                            <Field
                                                                                name={jobApplicantdata.fieldName.replace(/ /g, '')}
                                                                                required={jobApplicantdata.required}
                                                                                className="form-control"
                                                                                placeholder={jobApplicantdata.fieldName}
                                                                            ></Field>

                                                                        </FormGroup>
                                                                    </div>}</>
                                                            : jobApplicantFieldBoolean && index === jobApplicantField.length - 1 && <label style={{ display: "flex", justifyContent: "center" }}>No Data Found</label>}
                                                    </>
                                                ))}


                                            </div>

                                        </div>

                                    </div>

                                </div>
                            ))}

                            <div style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                                <input
                                    type="submit"
                                    className="btn hire-next-btn"
                                    value={`Submit`}
                                />
                            </div>


                        </Form>
                    )}
                </Formik>



            </div>
        )
    }
}