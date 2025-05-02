import React, { Component } from "react";
import { getScheduleListbyAplicant, getEvaluatingInfo } from "../../service";
import moment from "moment";
import EmployeeListColumn from "../../../../Employee/employeeListColumn";

export default class HApplicantEvaluationHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            applicantInformation: props.applicantInformation || {},
            scheduleInfo: [],
            evaluationInfo: []

        }
    }

    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        getEvaluatingInfo(this.state.applicantInformation.id).then(res => {
            if (res.status == "OK") {
                this.setState({ evaluationInfo: res.data })
            }
        })
    }

    render() {
        let { evaluationInfo,applicantInformation} = this.state;
        return (
            <div>
                   <div className="row" style={{paddingLeft: "29px"}}>
                    <div className="col-md-8">
                        <div className="row"  style={{ border: "2px solid #E7ECF2" }}>
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
                            </div>
                    </div>
                </div>
              

            <div style={{ backgroundColor: '#f5f5f5', padding: "30px" }} className="page-wrapper">
                {evaluationInfo.length > 0?evaluationInfo.map((res,index) => {

                    return <div className="row" style={{ border: "10px solid #E7ECF2" }}>
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-8" style={{ padding: "5px" }}>
                                    <h4><span>{index+1}</span> {res.interviewStages == 1 ? "Asssessment - English & General Knowledge Test-Test" : res.interviewStages == 2 ? "Skill Interview-Interview" : res.interviewStages == 3 ? "Behavioral Interview-Interview" : res.interviewStages == 4 ? "HR Interview-Interview" : res.interviewStages == 5 ? "Skill Test-Test" : "-"}</h4></div>
                                <div className="col-md-4" style={{ display: "flex", justifyContent: "flex-end", padding: "5px" }}>
                                    <h5> {moment(res.startDate).format("ll")}</h5>
                                </div>
                                <div className="col-md-4" style={{ padding: "5px" }}>
                                    <label htmlFor="">Interviewer</label>
                                    {/* <h5> {res.reviewer.name}</h5> */}
                                   <h5 style={{color: "black"}}>{res.reviewerName != null?res.reviewerName:"-"}</h5>
                                </div>
                                <div className="col-md-4" style={{ padding: "5px" }}>
                                    <label htmlFor="">Result</label>
                                    <h5>{res.scale?res.scale:"-"}</h5>
                                </div>
                                <div className="col-md-6" style={{ padding: "5px" }}>
                                    <label htmlFor="">Comment</label>
                                    <h5>{res.comment?res.comment:"-"}</h5>
                                </div>

                            </div>



                        </div>

                    </div>
                }):null}
            </div>
            </div>

        )
    }
}