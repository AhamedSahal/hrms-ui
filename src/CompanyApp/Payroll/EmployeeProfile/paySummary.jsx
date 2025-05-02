import React, { Component } from 'react'
import { toLocalDateTime,toLocalDate,formatDate } from '../../../utility'

export default class PaySummary extends Component {

    componentDidMount (){
        console.log("summaryData",this.props.summaryData)
    }
    render() {
        let {summaryData} = this.props
        return (
            <div className="EmpProfile-home-page">
                <div className="mr-4 EmpProfileCenter">
                    <div style={{ textAlign: '-webkit-left' }}  >

                        <div className="mt-3 gnInfo-general-info-card">
                            <div className="gnInfo-card-header">
                                <span className="gnInfo-card-title">General Info</span>
                            </div>
                            <div class="row">
                                <div class="col">
                                    <div className="gnInfodetail">
                                        <span className="gnInfolabel">Designation</span>
                                        <span className="gnInfovalue">{summaryData?.designation == null?"-":summaryData?.designation}</span>
                                    </div>
                                </div>
                                <div class="col">
                                    <div className="gnInfodetail">
                                        <span className="gnInfolabel">Department</span>
                                        <span className="gnInfovalue">{summaryData?.department == null?"-":summaryData?.department}</span>
                                    </div>
                                </div>
                                <div class="w-100"></div>
                                {/* <div class="col">
                                    <div className="gnInfodetail">
                                        <span className="gnInfolabel">Job Type</span>
                                        <span className="gnInfovalue">Full Time</span>
                                    </div>

                                </div> */}
                                
                               
                                <div class="col">
                                    <div className="gnInfodetail">
                                        <span className="gnInfolabel">Date Of Joining</span>
                                        <span className="gnInfovalue">{summaryData?.dateOfJoining == null?"-":formatDate(summaryData?.dateOfJoining)}</span>
                                    </div>

                                </div>
                                <div class="col">
                                    <div className="gnInfodetail">
                                        <span className="gnInfolabel">Salary Type</span>
                                        <span className="gnInfovalue">{summaryData?.salaryType == null?"-":summaryData?.salaryType}</span>
                                    </div>

                                </div>
                                <div class="w-100"></div>
                                {/* <div class="col">
                                    <div className="gnInfodetail">
                                        <span className="gnInfolabel">Home Country</span>
                                        <span className="gnInfovalue">Dubai</span>
                                    </div>

                                </div> */}
                                <div class="col">
                                    <div className="gnInfodetail">
                                        <span className="gnInfolabel">Reporting Manager</span>
                                        <span className="gnInfovalue">{summaryData?.reportingManager == null?"-":summaryData?.reportingManager}</span>
                                    </div>

                                </div>
                                <div class="col">
                                    <div className="gnInfodetail">
                                        <span className="gnInfolabel">Grade</span>
                                        <span className="pay-gradestyle gnInfovalue">{summaryData?.gradeName == null?"-":summaryData?.gradeName}</span>
                                    </div>
                                </div>
                                {/* <div className="mt-3 gnInfo-card-header">
                                    <span className="gnInfo-card-title">Legal Info</span>
                                </div>

                                <div class="col">
                                    <div className="gnInfodetail">
                                        <span className="gnInfolabel">Emirates ID</span>
                                        <span className="gnInfovalue">786-5458-585</span>
                                    </div>
                                </div>
                                <div class="col">
                                    <div className="gnInfodetail">
                                        <span className="gnInfolabel">Labour Card</span>
                                        <span className="gnInfovalue"> 28890</span>
                                    </div>
                                </div>
                                <div class="w-100"></div>
                                <div class="col">
                                    <div className="gnInfodetail">
                                        <span className="gnInfolabel">Passport</span>
                                        <span className="gnInfovalue"> 455586</span>
                                    </div>
                                </div> */}
                            </div>

                        </div>

                    </div>
                </div>
                <div className="EmpProfileRight">
                    <div  >
                        <div className="mt-3 ctc-breakup-card">
                            <div className="ctc-card-header">
                                <span className="ctc-card-title">Salary Breakup</span> <br />
                                <span className="ctc-revision-date">Revised on {formatDate(summaryData?.modifiedOn)}</span>
                            </div>
                            <div className="ctc-card-details">
                                <div className="ctc-detail-row">
                                    <span className="ctclabel">Basic Salary</span>
                                    <span className="ctcvalue">{summaryData?.basicSalary}</span>
                                </div>
                                <div className="ctc-detail-row">
                                    <span className="ctclabel">Allowance</span>
                                    <span className="ctcvalue">{summaryData?.allowance}</span>
                                </div>

                                <div className="ctc-detail-row ctc-net-pay">
                                    <span className="ctclabel">Net Pay</span>
                                    <span className="ctcvalue">{summaryData?.netSalary == null?"-":summaryData?.netSalary}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bank-card">
                            <div className="bank-header">
                                <span className="ctc-card-title">Bank Info</span> <br />
                            </div>
                            <div className="bank-details">
                                <div className="bank-detail">
                                    <span className="bank-label">Bank name</span>
                                    <div className="bank-value" style={{width: '100px',overflowX:'auto'}}>{summaryData?.bankName == null?"-":summaryData?.bankName}</div>
                                </div>
                                <div className="bank-detail">
                                    <span className="bank-label">IBAN</span>
                                    <div className="bank-value" style={{width: '100px',overflowX:'auto'}}>{summaryData?.ibanNumber == null?"-":summaryData?.ibanNumber}</div>
                                </div>
                                <div className="bank-detail">
                                    <span className="bank-label">Account number</span>
                                    <div className="bank-value" style={{width: '100px',overflowX:'auto'}}>{summaryData?.ibanNumber == null?"-":summaryData?.ibanNumber}</div>
                                </div>
                                <div className="bank-detail">
                                    <span className="bank-label">Branch Name</span>
                                    <div className="bank-value" style={{width: '100px',overflowX:'auto'}}>{summaryData?.branchLocation == null?"-":summaryData?.branchLocation}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
