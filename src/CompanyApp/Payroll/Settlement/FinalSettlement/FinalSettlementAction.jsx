import { name } from 'file-loader';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { FormGroup } from 'reactstrap';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getReadableDate } from '../../../../utility';
import { updateSettlement } from './service';


export default class FinalSettlementAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            FinalSettlement: props.FinalSettlement || {
                id: 0,
                employeeId: 0,
                resignationDate: "",
                lwd: "",
                doj: "",
                pendingsalary: "0",
                noofdays: 0,
                currMonthSalary: "0",
                totalamount: "",
                noticePeriod: "0",
                gratuity: "",
                annualLeaveSalary: "",
                pendingsalarydays: "",
                currMonthSalarydays: "",
                noticePaydays: "",
                gratuitydays: "",
                annualleavedays: "",
                otherPayments: 0,
                otherPaymentsRemarks: "",
                otherDeductions: 0,
                otherDeductionsRemarks: "",
                noticePeriodRemarks: "",
                pendingsalaryRemarks: "",
                currMonthSalaryRemarks: "",
                salperday: ""
            },
            status: "PAID"
        }
    }
    hideForm = () => {
        this.setState({
            showForm: false
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.FinalSettlement && nextProps.FinalSettlement != prevState.FinalSettlement) {
            return ({ FinalSettlement: nextProps.FinalSettlement })
        } else if (!nextProps.FinalSettlement) {
            return prevState.FinalSettlement || ({
                FinalSettlement: {
                    id: 0,
                    employeeId: 0,
                    resignationDate: "",
                    lwd: "",
                    doj: "",
                    pendingsalary: "0",
                    noofdays: 0,
                    currMonthSalary: "0",
                    totalamount: "",
                    noticePeriod: "0",
                    gratuity: "",
                    annualLeaveSalary: "",
                    pendingsalarydays: "",
                    currMonthSalarydays: "",
                    noticePaydays: "",
                    gratuitydays: "",
                    otherPayments: 0,
                    otherPaymentsRemarks: "",
                    otherDeductions: 0,
                    otherDeductionsRemarks: "",
                    annualleavedays: "",
                    noticePeriodRemarks: "",
                    pendingsalaryRemarks: "",
                    currMonthSalaryRemarks: "",
                    salperday: ""
                },
                status: "PAID"
            })
        }

        return null;
    }
    updateStatus = (id) => {
        let { otherPayments, otherDeductions } = this.state;
        otherPayments = this.state.otherPayments != undefined ? this.state.otherPayments : 0;
        otherDeductions = this.state.otherDeductions != undefined ? this.state.otherDeductions : 0;
        updateSettlement(id, this.state.pendingsalary, this.state.currMonthSalary, this.state.noticePeriod, this.state.pendingsalarydays,
            this.state.currMonthSalarydays, this.state.noticePaydays, otherPayments, this.state.otherPaymentsRemarks,
            otherDeductions, this.state.otherDeductionsRemarks, this.state.pendingsalaryRemarks, this.state.currMonthSalaryRemarks,
            this.state.noticePeriodRemarks).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    // this.props.updateList(res.data);
                } else {
                    toast.error(res.message);
                }

            }).catch(err => {
                console.error(err);
                toast.error("Error while updating status");
            })
    }

    handlePendingSalaryvalues = (salpday, pensalarydays) => {
        let { pendingsalarytotal } = this.state;
        pendingsalarytotal = (salpday * pensalarydays);
        this.setState({
            pendingsalary: pendingsalarytotal,
        });
    }
    handlecurrmonthsalaryvalues = (salpday, cursalarydays) => {
        let { currsalarytotal } = this.state;
        currsalarytotal = (salpday * cursalarydays);
        this.setState({
            currMonthSalary: currsalarytotal,
        });
    }
    handlenoticepayvalues = (salpday, noticepaydays) => {
        let { noticesalarytotal } = this.state;
        noticesalarytotal = (salpday * noticepaydays);
        this.setState({
            noticePeriod: noticesalarytotal,
        });
    }
    render() {
        const { FinalSettlement } = this.state;
        return (
            <div>
                {FinalSettlement && <> <table className="table">
                    <tbody>
                        <tr>
                            <th className='thd'  >Resignation/Termination Date</th>
                            <td></td><td></td>
                            <td className='thd'  >{getReadableDate(FinalSettlement.resignationDate)}</td>
                        </tr>
                        <tr>
                            <th className='thd'  >Last Working Date</th>
                            <td></td><td></td>
                            <td>{getReadableDate(FinalSettlement.lwd)}</td>
                        </tr>
                        <tr>
                            <th className='thd' >Notice Days</th>
                            <td></td><td></td>
                            <td>{FinalSettlement.noofdays}</td>
                        </tr>
                        <tr>
                            <th>Annual Leave</th>
                            <td></td>
                            <th className="th" style={{ paddingLeft: "-50px", width: "20px" }} >Days <td style={{ fontWeight: "lighter" }}> {FinalSettlement.annualleavedays}</td>  </th>
                            <th className="th" style={{ paddingLeft: "-50px", width: "20px" }} >Amount <td style={{ fontWeight: "lighter" }}> {FinalSettlement.annualLeaveSalary}</td>  </th>
                        </tr>
                        <tr>
                            <th>Gratuity</th>
                            <td></td>
                            <th className="th" style={{ width: "20px" }} >Days <td style={{ fontWeight: "lighter" }}>{FinalSettlement.gratuitydays} </td>  </th>
                            <th className="th" style={{ width: "20px" }} >Amount <td style={{ fontWeight: "lighter" }}>{FinalSettlement.gratuity}</td>  </th>
                        </tr>
                        <tr>
                            <th className='total' style={{ width: "40px" }}>Total Accrual</th>
                            <td></td><td></td>
                            <td>{FinalSettlement.totalamount}</td>
                        </tr>
                        <tr>
                            <th className='thd' style={{ width: "40px" }}>Pending Salary </th>
                            <td style={{ width: "50%" }}>
                                <div><FormGroup style={{ width: "75%", display: "inline-block" }}>
                                    <input name="pendingsalarydays" type="text" className="form-control" autoComplete='off' placeholder='Days'
                                        onChange={(e) => {
                                            this.setState({
                                                pendingsalarydays: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                                    <a href="#" style={{ width: "25%", display: "inline-block", fontSize: "35px", color: "black", paddingLeft: "5px" }} title="Press here for calculation"
                                        className="las la-play-circle" onClick={() => {
                                            this.handlePendingSalaryvalues(FinalSettlement.salperday, this.state.pendingsalarydays);
                                        }} > </a></div>
                            </td>
                            <td style={{ width: "25%" }}>
                                <FormGroup>
                                    <input name="pendingsalary" type="text" className="form-control" autoComplete='off' placeholder='Amount' defaultValue={this.state.pendingsalary}
                                        onChange={(e) => {
                                            this.setState({
                                                pendingsalary: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                            </td>
                            <td style={{ width: "25%" }}>
                                <FormGroup>
                                    <input name="pendingsalaryRemarks" type="text" className="form-control" autoComplete='off' placeholder='Remarks'
                                        onChange={(e) => {
                                            this.setState({
                                                pendingsalaryRemarks: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                            </td>
                        </tr>
                        <tr>
                            <th className='thd' style={{ width: "40px" }}>Current Month <br />Salary</th>
                            <td style={{ width: "50%" }}>
                                <div><FormGroup style={{ width: "75%", display: "inline-block" }}>
                                    <input name="currMonthSalarydays" type="text" className="form-control" autoComplete='off' placeholder='Days'
                                        onChange={(e) => {
                                            this.setState({
                                                currMonthSalarydays: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                                    <a href="#" style={{ width: "25%", display: "inline-block", fontSize: "35px", color: "black", paddingLeft: "5px" }} title="Press here for calculation"
                                        className="las la-play-circle" onClick={() => {
                                            this.handlecurrmonthsalaryvalues(FinalSettlement.salperday, this.state.currMonthSalarydays);
                                        }} > </a></div> </td>
                            <td style={{ width: "25%" }}>
                                <FormGroup>
                                    <input name="currMonthSalary" type="text" className="form-control" autoComplete='off' placeholder='Amount' defaultValue={this.state.currMonthSalary}
                                        onChange={(e) => {
                                            this.setState({
                                                currMonthSalary: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                            </td>
                            <td style={{ width: "25%" }}>
                                <FormGroup>
                                    <input name="currMonthSalaryRemarks" type="text" className="form-control" autoComplete='off' placeholder='Remarks'
                                        onChange={(e) => {
                                            this.setState({
                                                currMonthSalaryRemarks: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                            </td>
                        </tr>
                        <tr>
                            <th className='thd' style={{ width: "40px" }}>Notice Period</th>
                            <td>  <div><FormGroup style={{ width: "75%", display: "inline-block" }}>
                                <input name="noticePaydays" type="text" className="form-control" autoComplete='off' placeholder='Days'
                                    onChange={(e) => {
                                        this.setState({
                                            noticePaydays: e.target.value
                                        });
                                    }} /> </FormGroup>
                                <a href="#" style={{ width: "25%", display: "inline-block", fontSize: "35px", color: "black", paddingLeft: "5px" }} title="Press here for calculation"
                                    className="las la-play-circle" onClick={() => {
                                        this.handlenoticepayvalues(FinalSettlement.salperday, this.state.noticePaydays);
                                    }} > </a></div> </td>
                            <td style={{ width: "25%" }}>
                                <FormGroup>
                                    <input name="noticePeriod" type="text" className="form-control" autoComplete='off' placeholder='Amount' defaultValue={this.state.noticePeriod}
                                        onChange={(e) => {
                                            this.setState({
                                                noticePeriod: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                            </td>
                            <td style={{ width: "25%" }}>
                                <FormGroup>
                                    <input name="noticePeriodRemarks" type="text" className="form-control" autoComplete='off' placeholder='Remarks'
                                        onChange={(e) => {
                                            this.setState({
                                                noticePeriodRemarks: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                            </td>
                        </tr>
                        <tr>
                            <th className='thd'>Other Payments</th>
                            <td></td>
                            <td>
                                <FormGroup>
                                    <input name="otherPayments" type="text" className="form-control" autoComplete='off' defaultValue={FinalSettlement.otherPayments}
                                        onChange={(e) => {
                                            this.setState({
                                                otherPayments: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                            </td>
                            <td>
                                <FormGroup>
                                    <input name="otherPaymentsRemarks" type="text" className="form-control" autoComplete='off' placeholder='Comments'
                                        onChange={(e) => {
                                            this.setState({
                                                otherPaymentsRemarks: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                            </td>
                        </tr>
                        <tr>
                            <th className='thd' style={{ width: "40px" }}>Other Deductions</th>
                            <td><b style={{ fontWeight: "bolder" }}>( - )</b></td>
                            <td>
                                <FormGroup>
                                    <input name="otherDeductions" type="text" className="form-control" autoComplete='off' defaultValue={FinalSettlement.otherDeductions}
                                        onChange={(e) => {
                                            this.setState({
                                                otherDeductions: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                            </td>
                            <td>
                                <FormGroup>
                                    <input name="otherDeductionsRemarks" type="text" className="form-control" autoComplete='off' placeholder='Comments'
                                        onChange={(e) => {
                                            this.setState({
                                                otherDeductionsRemarks: e.target.value
                                            });
                                        }} />
                                </FormGroup>
                            </td>
                        </tr>
                    </tbody>
                </table>

                    <hr />
                    <Anchor onClick={() => {
                        this.updateStatus(FinalSettlement.id);
                    }} className="btn btn-primary">Update</Anchor>
                </>}

            </div>
        )
    }
}
