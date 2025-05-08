import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { updateStatus,updateBetifitListAction } from './service';

export default class BenefitApprovalAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            remark: "",
            benefitActionInfo: props.benefitActionInfo || {},
            benefitApproval: props.benefitApproval || {
                id: 0,
                employeeId: props.employeeId,
                claimamount: props.claimamount || "0",
            },
            status: props.status || "APPROVED"
        }
    }
    hideForm = () => {
        this.setState({
            showForm: false
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.benefitApproval && nextProps.benefitApproval != prevState.benefitApproval) {
            return ({ benefitApproval: nextProps.benefitApproval })
        } else if (!nextProps.benefitApproval) {
            return ({
                benefitApproval: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                    claimamount: this.props.claimamount || "0",
                },
                status: this.props.status || "APPROVED"
            })
        }

        return null;
    }

    updateStatus = (id, status) => {
        if(status == "REJECTED" && this.state.remark == ""){
            toast.error("Remark Is Required");
        }else{
            if(this.state.claimamount > 0 || status == "REJECTED"){
            updateBetifitListAction(id, status, this.state.claimamount?this.state.claimamount:0,this.state.remark,this.state.benefitActionInfo.id).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                
                    window.location.reload()
                 
            } else {
                toast.error(res.message);
            }


        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }else{
        toast.error("Claim Amount Is Required");
    }
    }
    }

    render() {
        const { benefitApproval,benefitActionInfo } = this.state;
        return (
            <div>

                {benefitApproval && <> <table className="table table-borderless">
                    <tbody>
                        <tr>
                            <th>Grades</th>
                            <td>{benefitApproval.grades1Id?.name ?? "-"}</td>
                           

                        </tr>
                        <tr>
                          
                        <th>Benefit Name</th>
                            <td>{benefitApproval.name ?? "-"}</td>

                        </tr>
                        <tr>
                            <th>Max Benefit Limit</th>
                            <td> {benefitApproval.maxemployee ?? "-"}</td>
                            
                        </tr>
                        <tr>
                        <th>Balance Amount</th>
                            <td> {benefitApproval.balanceAmount?benefitApproval.balanceAmount: benefitApproval.maxemployee?benefitApproval.maxemployee:"-" }</td>
                        </tr>
                        <tr>
                            <th>Requested Claim Amount</th>
                            <td> {benefitActionInfo.requestClaimedAmount ?? "-"}</td>
                            
                        </tr>
                        <tr>
                            <th>Approved Claim Amount</th>
                            <td>
                                <FormGroup>
                                    <input name="claimamount" type="text" className="form-control" defaultvalue={benefitApproval.claimamount} onChange={e => {

                                        this.setState({
                                            claimamount: e.target.value
                                        });
                                    }}></input>

                                </FormGroup>
                            </td>
                          
                        </tr>
                        <tr>
                        <th>Remark</th>
                            <td>
                                <FormGroup>
                                    <input name="remark" className="form-control" onChange={(e) => this.setState({remark: e.target.value})} ></input>
                                </FormGroup>
                            </td>
                        </tr>
                    </tbody>

                </table>
                    <hr />
                    <Anchor onClick={() => {
                        this.updateStatus(benefitApproval.id, benefitApproval.paymenttype == 0 ? "SENT_TO_PAYROLL" : "APPROVED");
                    }} className="btn btn-primary" style={{height: "38px"}}>{benefitApproval.paymenttype == 0 ? "Sent To Payroll" : "Approve Claim"}</Anchor>
                    &nbsp;
                    <Anchor onClick={() => {
                        this.updateStatus(benefitApproval.id, "REJECTED");
                    }} className="btn btn-danger">Reject</Anchor>
                </>}

            </div>
        )
    }
}
