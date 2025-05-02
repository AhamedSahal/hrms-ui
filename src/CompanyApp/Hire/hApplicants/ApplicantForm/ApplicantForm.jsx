
import React, { Component } from 'react';
import { FormGroup } from "reactstrap";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { BsFileEarmarkRichtext, BsFillCaretDownFill, BsPlusCircle, BsPersonVcard, BsArchive, BsFillMortarboardFill, BsFileEarmarkPlus } from "react-icons/bs";
import { toast } from "react-toastify";
import { ApplicantTypeSchema } from './validation';
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
import FileUploader from '../hApplicantForm/FileUploader';
import HSourceTypeDropdown from '../../../ModuleSetup/Dropdown/HSourceTypeDropdown';
import ApplicantEducationForm from './ApplicantEducationForm/ApplicantEducationForm';
import ApplicantAdditionalForm from './AdditionalForm/ApplicantAdditionalForm';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import ApplicantWorkExperienceForm from './ApplicantWorkExperienceForm/ApplicantWorkExperienceForm';
import { saveHInternalApplicantForms, saveHApplicantForms, saveHInternalWorkExperienceForms, saveHInternalEducationForms, saveHInternalAdditionInfoForms } from '../service';


export default class ApplicantForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applicantForm: props.applicantForm || {},
            workExperience: [],
            educationDetails: [],
            skillSet: [],
            achievementDetails: [],
            draft: false
        };
    }

    componentDidMount() {
        this.addWorkExperience();
        this.addEducationDeatails();
        this.addSkillSet();
        this.addAchievementDetails();
    }

    // resume Upload
    handleFileUpload = (file) => {
        this.setState({ resumeUpload: file })

    }


    // handle add skills set
    addSkillSet = () => {
        let temp = this.state.skillSet;
        temp.push({
            id: 0,
            skillSet: "",
            years: 0
        })
        this.setState({ skillSet: temp })

    }

    // handle add achievementDetails
    addAchievementDetails = () => {
        let temp = this.state.achievementDetails;
        temp.push({
            id: 0,
            achievementDetails: "",
            date: ""
        })
        this.setState({ achievementDetails: temp })
    }



    // handle addWorkExperience 
    addWorkExperience = () => {
        let { workExperience } = this.state;
        let WorkExperienceValidation = false;
        if (workExperience.length > 0) {
            WorkExperienceValidation = workExperience[workExperience.length - 1].employerName == "";
        }
        if (!WorkExperienceValidation) {
            let temp = this.state.workExperience;
            temp.push({
                id: 0,
                employerName: "",
                employmentType: 0,
                designation: "",
                location: "",
                currentlyWorking: false,
                startDate: "",
                endDate: "",
                rolesAndResponsibilities: ""
            })
            this.setState({ workExperience: temp })
        } else {
            toast.error("Please Provide Employee name")
        }

    }

    // handle add education
    addEducationDeatails = () => {
        // validation
        let { educationDetails } = this.state;
        let educationDetailValidation = false;
        if (educationDetails.length > 0) {
            educationDetailValidation = educationDetails[educationDetails.length - 1].education == "";
        }
        // check validation
        if (!educationDetailValidation) {
            let temp = this.state.educationDetails;
            temp.push({
                id: 0,
                education: "",
                degree: "",
                specialization: "",
                score: "",
                scale: "",
                schoolAndCollage: "",
                startDate: "",
                endDate: ""
            })
            this.setState({ educationDetails: temp })

        } else {
            toast.error("Please Provide Education")
        }

    }

    // update Work Experience
    updateWorkExperience = (updatedWorkExperience, index) => {
        let { workExperience } = this.state;
        workExperience[index] = updatedWorkExperience;
        this.setState({ workExperience: workExperience })
    }

    // update skill set
    updateSkillSet = (updatedSkillSet, index) => {
        let { skillSet } = this.state;
        skillSet[index] = updatedSkillSet;
        this.setState({ skillSet: skillSet })
    }

    // update achievementDetails
    updateAchievementDetails = (updateAchievementDetails, index) => {
        let { achievementDetails } = this.state;
        achievementDetails[index] = updateAchievementDetails;
        this.setState({ achievementDetails: achievementDetails })
    }

    // update education details
    updateEduationDetails = (updateEduationDetails, index) => {
        let { educationDetails } = this.state;
        educationDetails[index] = updateEduationDetails;
        this.setState({ educationDetails: educationDetails })
    }


    // delete work experience
    handleWorkExperienceDelete = (index) => {
        let { workExperience } = this.state;
        let workExperienceFilter = workExperience.filter((res, i) => {
            if (index != i) {
                return { ...res }
            }
        })
        this.setState({ workExperience: workExperienceFilter })
    }

    // delete education deatails
    handleEducationDetailsDelete = (index) => {
        let { educationDetails } = this.state;
        let educationDetailsFilter = educationDetails.filter((res, i) => {
            if (index != i) {
                return { ...res }
            }
        })
        this.setState({ educationDetails: educationDetailsFilter })
    }


    // handle skill Delete
    handleskillDelete = (index) => {
        let { skillSet } = this.state;
        let skillSetFilter = skillSet.filter((res, i) => {
            if (index != i) {
                return { ...res }
            }
        })
        this.setState({ skillSet: skillSetFilter })

    }

    handleAchievementDelete = (index) => {
        let { achievementDetails } = this.state;
        let achievementDetailsFilter = achievementDetails.filter((res, i) => {
            if (index != i) {
                return { ...res }
            }
        })
        this.setState({ achievementDetails: achievementDetailsFilter })

    }



    // save
    save = (data, action) => {
        let InternalApplicantData = { ...data, file: !this.state.resumeUpload ? null : this.state.resumeUpload, draft: this.state.draft,id:0 };
        if (!this.state.resumeUpload) {
            toast.error("Please Upload Resume")
        } else {
            saveHInternalApplicantForms(InternalApplicantData)
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

    // applicantInfo

    applicantInfo = (id) => {
        let { workExperience, educationDetails, achievementDetails, skillSet } = this.state;
        if (workExperience.length > 0 && workExperience[0].employerName != "") {
            workExperience.map((res) => {
                let workExperienceParameter = { ...res, internalApplicantId: id }
                saveHInternalWorkExperienceForms(workExperienceParameter)
                    .then((res) => {
                        if (res.status == "OK") {
                            // toast.success(res.message);
                        } else {
                            toast.error(res.message);
                        }

                    })
                    .catch((err) => {
                        toast.error("Error while saving Job");
                    });
            })

        }
        // education
        if (educationDetails.length > 0 && educationDetails[0].education !== "") {
            educationDetails.map((res) => {
                let educationDetailsParameter = { ...res, internalApplicantId: id }
                saveHInternalEducationForms(educationDetailsParameter)
                    .then((res) => {
                        if (res.status == "OK") {
                            // toast.success(res.message);
                        } else {
                            toast.error(res.message);
                        }

                    })
                    .catch((err) => {
                        toast.error("Error while saving Job");
                    });

            })
        }

        // additional details
        let skillLen = skillSet.length;
        let achievementLen = achievementDetails.length;
        // skill
        if (skillLen >= achievementLen && skillSet[0].skillSet != "") {
            skillSet.map((res, skillindex) => {
                let achievementDetailsData = skillindex <= achievementLen ? achievementDetails[skillindex] : null;
                let additionalDetailParameter = { ...res, ...achievementDetailsData, internalApplicantId: id }

                // api
                saveHInternalAdditionInfoForms(additionalDetailParameter)
                    .then((res) => {
                        if (res.status == "OK") {
                            // toast.success(res.message);
                        } else {
                            toast.error(res.message);
                        }

                    })
                    .catch((err) => {
                        toast.error("Error while saving Job");
                    });

            })

        }

        // achievement
        if (achievementLen > skillLen && achievementDetails[0].achievementDetails != "") {
            achievementDetails.map((res, achievementDetailsIndex) => {
                let skillSetData = achievementDetailsIndex <= skillLen ? skillSet[achievementDetailsIndex] : null
                let additionalDetailParameter = { ...res, ...skillSetData, internalApplicantId: id }
                // api
                saveHInternalAdditionInfoForms(additionalDetailParameter)
                    .then((res) => {
                        if (res.status == "OK") {
                            // toast.success(res.message);
                        } else {
                            toast.error(res.message);
                        }

                    })
                    .catch((err) => {
                        toast.error("Error while saving Job");
                    });
            })

        }

        // applicant
        let applicantParameters = {
            applicantId: id,
            internal: true
        }
        saveHApplicantForms(applicantParameters)
            .then((res) => {
                if (res.status == "OK") {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") {
                    window.location.href = "/app/company-app/hire/applicants"
                }

            })
            .catch((err) => {
                toast.error("Error while saving Job");
            });

    }



    render() {
        let { workExperience, educationDetails, achievementDetails, skillSet } = this.state
        return (
            <div style={{ padding: "60px" }}>
                <br />
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.applicantForm}
                    onSubmit={this.save}
                validationSchema={ApplicantTypeSchema}
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
                                {/* Main col 1 */}
                                <div className="col-md-6" style={{ height: "600px", overflowY: "scroll" }}>
                                    {/* form 1 */}
                                    <div className="row" style={{ padding: "10px", border: "2px solid #E7ECF2", background: "#fff" }}>
                                        <div className="col-md-12" style={{ borderBottom: "2px solid #E7ECF2" }}>
                                            <h4><BsFileEarmarkRichtext /> Job Information</h4>

                                        </div>


                                        {/* row 1 */}
                                        <div className="row">
                                        <div className="col-md-12">
                                            <br />
                                            <FormGroup>
                                                <label>
                                                    Job Profile
                                                </label>

                                                <Field name="jobProfile" className="form-control" placeholder="Enter job profile"></Field>
                                                <ErrorMessage name="jobProfile">
                                                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        {/* row 2 */}
                                        {/* col 1 */}
                                        <div className="col-md-6">
                                            <FormGroup>
                                                <label>
                                                    Recruiter Tagged <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field
                                                    name="recruiterId"
                                                    render={(field) => {
                                                        return (
                                                            <EmployeeDropdown
                                                                defaultValue={values.recruiter?.id}
                                                                onChange={(e) => {
                                                                    setFieldValue("recruiterId", e.target.value);
                                                                    setFieldValue("recruiter", { id: e.target.value });
                                                                }}
                                                            ></EmployeeDropdown>
                                                        );
                                                    }}
                                                ></Field>
                                            </FormGroup>
                                        </div>
                                        {/* col 2 */}
                                        <div className="col-md-6">
                                            <FormGroup>
                                                <label>
                                                    Date of Application
                                                </label>
                                                <Field placeholder="Select Date" name="dateOfApplicantion" className="form-control" type="date"></Field>
                                                <ErrorMessage name="dateOfApplicantion">
                                                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        {/* row 3 */}
                                        {/* col 1 */}
                                        <div className="col-md-6">
                                            {/* source type */}
                                            <label style={{ margin: "0" }}>Source Type <span style={{ color: "red" }}>*</span></label>
                                            <FormGroup>
                                                <Field
                                                    className="form-control"
                                                    name="sourceType"
                                                    render={(field) => {
                                                        return (
                                                            <HSourceTypeDropdown
                                                                defaultValue={values.sourceType?.id}
                                                                required
                                                                onChange={(e) => {
                                                                    setFieldValue("sourceType", e.target.value);
                                                                    setFieldValue("sourceTypeId", { id: e.target.value });
                                                                }}
                                                            ></HSourceTypeDropdown>
                                                        );
                                                    }}
                                                ></Field>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-6">
                                            <FormGroup>
                                                <label>
                                                    Source Name <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field
                                                    name="sourceName"
                                                    required
                                                    className="form-control"
                                                    placeholder="Enter source name"
                                                ></Field>
                                                <ErrorMessage name="sourceName">
                                                    {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>

                                        </div>
                                    </div>
                                    </div>
                                    <br />
                                    {/* form 2 */}
                                    <div className="row" style={{ padding: "10px", border: "2px solid #E7ECF2", background: "#fff" }}>
                                        <div className="col-md-12" style={{ padding: "0" }}>
                                            {/* head */}
                                            <div className="collaps-btn" style={{ background: "none" }}>
                                                <a
                                                    className="collapstag"
                                                    data-bs-toggle="collapse"
                                                    href={`#profileInformation`}
                                                    role="button"
                                                    aria-expanded="false"
                                                    aria-controls="collapseExample"
                                                >
                                                    <div className="row">
                                                        <div className="col-md-10">
                                                            <h4 className="collapse-para"><BsPersonVcard /> Profile Information</h4>
                                                        </div>
                                                        {/* icon */}
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
                                            </div>

                                            {/* body */}
                                            <div className="collapse" id="profileInformation" style={{ padding: "10px", borderTop: "2px solid #E7ECF2" }}>
                                                <div className="row">
                                                    <br />
                                                    {/* row 1 */}
                                                    <div className="col-md-3">

                                                        <label>Salutation</label>
                                                        <select
                                                            className="form-control"
                                                            name="salutation"
                                                            id="salutation"
                                                            defaultValue={values.salutation}
                                                            onChange={(e) => {
                                                                setFieldValue("salutation", e.target.value);
                                                            }}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="1">Mr.</option>
                                                            <option value="2">Mrs.</option>
                                                            <option value="3">Miss</option>
                                                            <option value="4">Dr.</option>
                                                            <option value="5">Ms.</option>
                                                            <option value="5">Prof.</option>
                                                            <option value="5">Rev.</option>
                                                        </select>

                                                    </div>
                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label>
                                                                First Name <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="firstName" className="form-control" placeholder="eg. Waylon" required></Field>
                                                            <ErrorMessage name="firstName">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label style={{ whiteSpace: "nowrap" }}>
                                                                Middle Name
                                                            </label>
                                                            <Field name="middleName" className="form-control" placeholder="eg. Mike"></Field>
                                                            <ErrorMessage name="middleName">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label>
                                                                Last Name
                                                            </label>
                                                            <Field name="lastName" className="form-control" placeholder="eg. Dalton"></Field>
                                                            <ErrorMessage name="lastName">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>

                                                    {/* row 2 */}
                                                    <div className="col-md-12">
                                                        <FormGroup>
                                                            <label>
                                                                Email <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <Field name="email" className="form-control" placeholder="Enter Email" required></Field>
                                                            <ErrorMessage name="email">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>

                                                    {/* row 3 */}
                                                    <div className="col-md-12">
                                                        <FormGroup>
                                                            <label>
                                                                LinkedIn Url
                                                            </label>
                                                            <Field name="linkedInUrl" className="form-control" placeholder="LinkedIn Url"></Field>
                                                            <ErrorMessage name="linkedInUrl">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>

                                                    {/* row 4 */}
                                                    <div className="col-md-6">
                                                        <FormGroup>
                                                            <label>
                                                                Phone
                                                            </label>
                                                            <Field  name="phone" className="form-control" placeholder="Phone Number" type="number"></Field>
                                                            <ErrorMessage name="phone">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <FormGroup>
                                                            <label>
                                                                Location
                                                            </label>
                                                            <Field
                                                                name="branchId"
                                                                render={(field) => {
                                                                    return (
                                                                        <BranchDropdown
                                                                            required
                                                                            defaultValue={values.branch?.id}
                                                                            onChange={(e) => {
                                                                                setFieldValue("branchId", e.target.value);
                                                                                setFieldValue("branch", { id: e.target.value });
                                                                            }}
                                                                        ></BranchDropdown>
                                                                    );
                                                                }}
                                                            ></Field>
                                                            <ErrorMessage name="branchId">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>

                                                    {/* row 5 */}

                                                    <div className="col-md-5">
                                                        <FormGroup>
                                                            <label>
                                                                Current Salary
                                                            </label>
                                                            <Field name="currentSalary" className="form-control" placeholder="Current Salary" type="number"></Field>
                                                            <ErrorMessage name="currentSalary">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>

                                                    {/* row 6 */}

                                                    <div className="col-md-3">
                                                        <FormGroup>
                                                            <label style={{ whiteSpace: "nowrap" }}>
                                                                Expected Salary
                                                            </label>
                                                            <Field name="expectedSalaryMinimum" className="form-control" placeholder="Minimum" type="number"></Field>
                                                            <ErrorMessage name="expectedSalaryMinimum">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>

                                                    </div>
                                                    <div className="col-md-1" style={{ display: "flex", alignItems: "center" }}>_</div>
                                                    <div className="col-md-3" style={{ paddingTop: "8px" }}>
                                                        <FormGroup>
                                                            <label style={{ whiteSpace: "nowrap" }}>

                                                            </label>
                                                            <Field name="expectedSalaryMaximum" className="form-control" placeholder="Maximum" type="number"></Field>
                                                            <ErrorMessage name="expectedSalaryMaximum">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>

                                                    </div>

                                                    {/* row 7 */}
                                                    <div className="col-md-6">
                                                        <FormGroup>
                                                            <label style={{ whiteSpace: "nowrap" }} >
                                                                Notice Period (in days)
                                                            </label>
                                                            <Field name="noticePeriod" className="form-control" placeholder="Notice Period" type="number"></Field>
                                                            <ErrorMessage name="noticePeriod">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>

                                                    </div>

                                                    {/* row 8 */}
                                                    <div className="col-md-12">
                                                        <FormGroup>
                                                            <label style={{ whiteSpace: "nowrap" }}>
                                                                Reason For Job Change
                                                            </label>
                                                            <Field name="reasonForJobChange" className="form-control" placeholder="Reason For Job Change" style={{ height: "80px" }}></Field>
                                                            <ErrorMessage name="reasonForJobChange">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>

                                                    </div>

                                                    {/* row 9 */}
                                                    <div className="col-md-12">
                                                        <FormGroup>
                                                            <label style={{ whiteSpace: "nowrap" }}>
                                                                Additional Details
                                                            </label>
                                                            <Field name="additionalDetails" className="form-control" placeholder="Additional Details" style={{ height: "80px" }}></Field>
                                                            <ErrorMessage name="additionalDetails">
                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>

                                                    </div>

                                                    {/* row 10 */}
                                                    <div className="col-md-12">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <label style={{ whiteSpace: "nowrap" }}>
                                                                    Total Work Experience
                                                                </label>
                                                                <div className="row">
                                                                    <div className="col-md-5">
                                                                        <FormGroup>
                                                                            <label style={{ whiteSpace: "nowrap" }}>
                                                                                Year(s)
                                                                            </label>
                                                                            <Field name="totalExperienceYear" className="form-control" placeholder="Years" type="number"></Field>
                                                                            <ErrorMessage name="totalExperienceYear">
                                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                                            </ErrorMessage>
                                                                        </FormGroup>

                                                                    </div>
                                                                    <div className="col-md-1" style={{ display: "flex", alignItems: "center" }}>_</div>
                                                                    <div className="col-md-5">
                                                                        <FormGroup>
                                                                            <label style={{ whiteSpace: "nowrap" }}>
                                                                                Month(s)
                                                                            </label>
                                                                            <Field name="totalExperienceMonth" className="form-control" placeholder="Months" type="number"></Field>
                                                                            <ErrorMessage name="totalExperienceMonth">
                                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                                            </ErrorMessage>
                                                                        </FormGroup>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="col-md-6">
                                                                <label style={{ whiteSpace: "nowrap" }}>
                                                                    Relevant Work Experience
                                                                </label>
                                                                <div className="row">
                                                                    <div className="col-md-5">
                                                                        <FormGroup>
                                                                            <label style={{ whiteSpace: "nowrap" }}>
                                                                                Year(s)
                                                                            </label>
                                                                            <Field name="relevantExperienceYear" className="form-control" placeholder="Years" type="number"></Field>
                                                                            <ErrorMessage name="relevantExperienceYear">
                                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                                            </ErrorMessage>
                                                                        </FormGroup>

                                                                    </div>
                                                                    <div className="col-md-1" style={{ display: "flex", alignItems: "center" }}>_</div>
                                                                    <div className="col-md-5">
                                                                        <FormGroup>
                                                                            <label style={{ whiteSpace: "nowrap" }}>
                                                                                Month(s)
                                                                            </label>
                                                                            <Field name="relevantExperienceMonth" className="form-control" placeholder="Months" type="number"></Field>
                                                                            <ErrorMessage name="relevantExperienceMonth">
                                                                                {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                                            </ErrorMessage>
                                                                        </FormGroup>
                                                                    </div>
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>




                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                    <br />

                                    {/* form 3 */}
                                    <div className="row" style={{ padding: "10px", border: "2px solid #E7ECF2", background: "#fff" }}>
                                        <div className="col-md-12" style={{ padding: "0" }}>
                                            {/* head */}
                                            <div className="collaps-btn" style={{ background: "none" }}>
                                                <a
                                                    className="collapstag"
                                                    data-bs-toggle="collapse"
                                                    href="#workExperience"
                                                    role="button"
                                                    aria-expanded="false"
                                                    aria-controls="collapseExample"
                                                >
                                                    <div className="row">
                                                        <div className="col-md-10">
                                                            <h4 className="collapse-para"><BsArchive /> Work Experience</h4>
                                                        </div>
                                                        {/* icon */}
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
                                            </div>


                                            {/* body */}
                                            <div className="collapse" id="workExperience" style={{ padding: "10px", borderTop: "2px solid #E7ECF2" }}>
                                                {workExperience && workExperience.length > 0 && workExperience.map((res, index) => {
                                                    return <ApplicantWorkExperienceForm workExperience={res} index={index} updateWorkExperience={this.updateWorkExperience} handleWorkExperienceDelete={this.handleWorkExperienceDelete}></ApplicantWorkExperienceForm>
                                                })}
                                                {/* add work expirence */}
                                                <div className='main_add_btn'>
                                                    <a className='add_applicant_btn' onClick={this.addWorkExperience} ><BsPlusCircle /> Add more experience</a>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <br />

                                    {/* form 4 */}
                                    <div className="row" style={{ padding: "10px", border: "2px solid #E7ECF2", background: "#fff" }}>
                                        <div className="col-md-12" style={{ padding: "0" }}>
                                            {/* head */}
                                            <div className="collaps-btn" style={{ background: "none" }}>
                                                <a
                                                    className="collapstag"
                                                    data-bs-toggle="collapse"
                                                    href="#education"
                                                    role="button"
                                                    aria-expanded="false"
                                                    aria-controls="collapseExample"
                                                >
                                                    <div className="row">
                                                        <div className="col-md-10">
                                                            <h4 className="collapse-para"><BsFillMortarboardFill /> Education</h4>
                                                        </div>
                                                        {/* icon */}
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
                                            </div>


                                            {/* body */}
                                            <div className="collapse" id="education" style={{ padding: "10px", borderTop: "2px solid #E7ECF2" }}>
                                                {educationDetails && educationDetails.length > 0 && educationDetails.map((res, index) => {
                                                    return <ApplicantEducationForm index={index} educationDetails={res} updateEduationDetails={this.updateEduationDetails} handleEducationDetailsDelete={this.handleEducationDetailsDelete}></ApplicantEducationForm>
                                                })}
                                                {/* add education details */}
                                                <div className='main_add_btn'>
                                                    <a className='add_applicant_btn' onClick={this.addEducationDeatails} ><BsPlusCircle /> Add more education</a>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <br />

                                    {/* form 5 */}
                                    <div className="row" style={{ padding: "10px", border: "2px solid #E7ECF2", background: "#fff" }}>
                                        <div className="col-md-12" style={{ padding: "0" }}>
                                            {/* head */}
                                            <div className="collaps-btn" style={{ background: "none" }}>
                                                <a
                                                    className="collapstag"
                                                    data-bs-toggle="collapse"
                                                    href="#additionalDetails"
                                                    role="button"
                                                    aria-expanded="false"
                                                    aria-controls="collapseExample"
                                                >
                                                    <div className="row">
                                                        <div className="col-md-10">
                                                            <h4 className="collapse-para"><BsFileEarmarkPlus /> Additional Details</h4>
                                                        </div>
                                                        {/* icon */}
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
                                            </div>


                                            {/* body */}
                                            <div className="collapse" id="additionalDetails" style={{ padding: "10px", borderTop: "2px solid #E7ECF2" }}>
                                                <ApplicantAdditionalForm updateSkillSet={this.updateSkillSet} updateAchievementDetails={this.updateAchievementDetails} achievementDetails={achievementDetails} skillSet={skillSet} handleskillDelete={this.handleskillDelete} handleAchievementDelete={this.handleAchievementDelete}></ApplicantAdditionalForm>
                                            </div>

                                        </div>
                                    </div>



                                </div>
                                {/* Main col 2 */}
                                <div className="col-md-6" style={{ position: "sticky" }}>
                                    <label htmlFor="">Upload Resume <span style={{ color: "red" }}>*</span></label>
                                    <FileUploader
                                        onFileUpload={this.handleFileUpload}
                                    />
                                </div>
                            </div>
                            {/* save */}
                            <br />
                            <div className="row">
                                <div className="col-md-3" style={{ padding: "0" }}>
                                    <input type="submit" className="btn" value={"Save as draft"} style={{ width: "auto", border: "2px solid #E7ECF2" }}
                                        onClick={(e) => {
                                            this.setState({ draft: true })
                                        }}
                                    />
                                </div>
                                <div className="col-md-3" style={{ display: "flex", justifyContent: "end" }}>
                                    <input type="submit" value="Apply" className='btn hire-next-btn' />
                                </div>
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>
        );
    }

}