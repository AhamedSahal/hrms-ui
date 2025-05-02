import React, { Component } from "react";
import { getInternalEducationInfo, getInternalWorkExperienceInfo } from "../../service";
import moment from "moment";
import { Modal, Anchor } from 'react-bootstrap';
import { fileDownload } from "../../../../../HttpRequest";

export default class HApplciantInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applicantInformation: props.applicantInformation || {},
            jobId: props.applicantInformation.ejobId || 0,
            internalId: props.applicantInformation.internalId || 0,
            workExperienceData: [],
            educationInformationData: []
        }
    }

    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        if (this.state.internalId != 0) {
            getInternalEducationInfo(this.state.internalId).then(res => {

                if (res.status == "OK") {
                    this.setState({
                        educationInformationData: res.data,

                    })
                }
            })

            getInternalWorkExperienceInfo(this.state.internalId).then(res => {
                if (res.status == "OK") {
                    this.setState({
                        workExperienceData: res.data,

                    })
                }
            })

        }

    }

    render() {
        let { applicantInformation, educationInformationData } = this.state;
        return (
            <div style={{ backgroundColor: '#f5f5f5', padding: "30px" }} className="page-wrapper">

                <div className="row" style={{ border: "2px solid #E7ECF2" }}>
                    <div style={{ borderBottom: "2px solid #E7ECF2" }}>
                        <h4 style={{ paddingTop: "10px" }}>Profile Info</h4>
                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Applicant Name</label>
                                <h5>
                                    <span style={{ padding: "2px", background: "#F2F5F8", borderRadius: "6px" }}>{applicantInformation && applicantInformation.efirstName ? applicantInformation.efirstName : applicantInformation.ifirstName ? applicantInformation.ifirstName : "-"}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Email</label>
                                <h5>
                                    <span>{applicantInformation && applicantInformation.eemail ? applicantInformation.eemail : applicantInformation.iemail ? applicantInformation.iemail : "-"}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Phone</label>
                                <h5>
                                    <span>{applicantInformation && applicantInformation.ephone ? applicantInformation.ephone : applicantInformation.iphone ? applicantInformation.iphone : "-"}</span>
                                </h5>
                            </div>


                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Notice Period(In Days)</label>
                                <h5>
                                    <span>{applicantInformation && applicantInformation.enoticePeriod ? applicantInformation.enoticePeriod : applicantInformation.inoticePeriod ? applicantInformation.inoticePeriod : "-"}</span>
                                </h5>
                            </div>

                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Current Salary</label>
                                <h5>
                                    <span>{applicantInformation && applicantInformation.icurrentSalary ? applicantInformation.icurrentSalary :applicantInformation.ecurrentSalary ? applicantInformation.ecurrentSalary: "-"}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}></div>

                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Expected Salary</label>
                                <h5>
                                    <span>{applicantInformation && applicantInformation.iexpectedSalaryMaximum ? applicantInformation.iexpectedSalaryMaximum : applicantInformation.eexpectedSalary ? applicantInformation.eexpectedSalary : "-"}</span>
                                </h5>
                            </div>

                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Reason For Job Change</label>
                                <h5>
                                    <span>{applicantInformation && applicantInformation.ireasonForJobChange ? applicantInformation.ireasonForJobChange : applicantInformation.ereasonForJobChange ? applicantInformation.ereasonForJobChange : "-"}</span>
                                </h5>
                            </div>

                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Additional Information</label>
                                <h5>
                                    <span>{applicantInformation && applicantInformation.iadditionnalDetails ? applicantInformation.iadditionnalDetails : "-"}</span>
                                </h5>
                            </div>
                            <div className="col-md-12" style={{ padding: "15px" }}>
                            <label>Resume</label>
                            <br />
                        {/* internal */}
                        {this.state.applicantInformation.internalId != null && this.state.applicantInformation.internalId > 0 &&
                    <Anchor onClick={() => {
                        fileDownload(this.state.applicantInformation.internalId, 0, "HIRE_INTERNAL", this.state.applicantInformation.ifileName);
                    }}>
                       <button className="btn hire-next-btn"><i className='fa fa-download'> Download</i></button>  
                    </Anchor>}
                    {/* external */}
                    {this.state.applicantInformation.externalId != null && this.state.applicantInformation.externalId > 0 &&
                    <Anchor onClick={() => {
                        fileDownload(this.state.applicantInformation.externalId, 0, "HIRE_EXTERNAL", this.state.applicantInformation.efileName);
                    }}>
                        <button className="btn hire-next-btn"><i className='fa fa-download'> Download</i></button>  
                    </Anchor>}
                    </div>

                        </div>

                    </div >

                    <div style={{ borderBottom: "2px solid #E7ECF2", borderTop: "2px solid #E7ECF2" }}>
                        <h4 style={{ paddingTop: "10px" }}>Work Experience</h4>
                    </div>
                    <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Total Work Experience</label>
                                <h5>
                                    <span>{applicantInformation && applicantInformation.etotalWorkExperience ? applicantInformation.etotalWorkExperience : applicantInformation.itotalexperienceYear ? `${applicantInformation.itotalexperienceYear}years` : "-"}</span>
                                </h5>
                            </div>
                            <div className="col-md-4" style={{ padding: "15px" }}>
                                <label>Relevant Work Experience</label>
                                <h5>
                                    <span>{applicantInformation && applicantInformation.irelevantExperienceYear ? applicantInformation.irelevantExperienceYear : applicantInformation.erelevantWorkExperience ? `${applicantInformation.erelevantWorkExperience}years` : "-"}</span>
                                </h5>
                            </div>
                        </div>
                    </div>

                    {/* education */}
                    <div className="col-md-12">
                        {educationInformationData.length > 0 && educationInformationData.map((res,i) => {
                          return <div className="row">
                            <div style={{ borderBottom: "2px solid #E7ECF2", borderTop: "2px solid #E7ECF2" }}>
                             <h4 style={{ paddingTop: "10px" }}>Educational Information {i+1}</h4>
                               
                            </div>
                                <div className="col-md-4" style={{ padding: "15px" }}>
                                    <label htmlFor="">Education</label>
                                    <h5>{res.education == 1?"10th grade":res.education == 2?"12th grade":res.education == 3?"Bachelors":res.education == 4? "Masters":res.education == 5?"Post-graduate":res.education == 6?"Diploma": "-"}</h5>
                                </div>
                                <div className="col-md-4" style={{ padding: "15px" }}>
                                    <label htmlFor="">Specialization</label>
                                    <h5>{res.specialization}</h5>
                                </div>
                                <div className="col-md-4" style={{ padding: "15px" }}>
                                    <label htmlFor="">School/Collage Name</label>
                                    <h5>{res.schoolAndCollage}</h5>
                                </div>
                                <div className="col-md-4" style={{ padding: "15px" }}>
                                    <label htmlFor="">Score</label>
                                    <h5>{res.score}.{res.scale}</h5>
                                </div>
                                <div className="col-md-4" style={{ padding: "15px" }}>
                                    <label htmlFor="">Completed Date</label>
                                    <h5>{moment(res.endDate).format("ll") }</h5>
                                </div>
                            </div>
                        })
                        }
                    </div>

                </div>
            </div>
        )
    }
}
