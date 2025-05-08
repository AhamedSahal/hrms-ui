import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { updateRegularizeStatus } from './service';
import { convertToUserTimeZone, toDateTime, getReadableDate, convertToUTC,toLocalDateTime,formatDateTime } from '../../../utility';


export default class RegularizationAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            regularize: props.regularize || {
                id: 0,
                employeeId: props.employeeId,
                date: props.date,
                settingClockIn: props.settingClockIn,
                settingClockOut: props.settingClockOut,
                systemClockIn: props.systemClockIn,
                systemClockOut: props.systemClockOut,
                actualInTimeBeforeRegularize: props.actualInTimeBeforeRegularize,
                actualOutTimeBeforeRegularize: props.actualOutTimeBeforeRegularize,



            },
            firstHalf: '',
            secondHalf: '',
            Reason: "",
            editValidation: false,
            setValidation:false,
            status: props.status || "APPROVED",
        }
    }
   
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.regularize && nextProps.regularize != prevState.regularize) {
            return ({ regularize: nextProps.regularize })
        } else if (!nextProps.regularize) {
            return ({
                regularize: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                    date: nextProps.date,
                    settingClockIn: nextProps.settingClockIn,
                    settingClockOut: nextProps.settingClockOut,
                    systemClockIn: nextProps.systemClockIn,
                    systemClockOut: nextProps.systemClockOut,
                    actualInTimeBeforeRegularize: nextProps.actualInTimeBeforeRegularize,
                    actualOutTimeBeforeRegularize: nextProps.actualOutTimeBeforeRegularize,
                    firstHalf: nextProps.firstHalf | '',
                    secondHalf: nextProps.secondHalf | '',
                    Reason: nextProps.Reason | '',
                }
            })
        }

        return null;
    }
    updateStatus = (id, status) => {
        let { regularize,editValidation,Reason } = this.state;

    //    EDIT  true alleast onec colunm should change
    if(editValidation && this.state.firstHalf == '' && this.state.secondHalf == ''){
        toast.error("Atleast one column should be change");
    }else{
        if(status == "REJECTED" && Reason == ''){
            toast.error("Please update the reason");
        }else{
        let firHalf = convertToUTC(this.state.firstHalf == ''?regularize.regularizedInTime:this.state.firstHalf);
        let secHalf = convertToUTC(this.state.secondHalf == ''?regularize.regularizedOutTime:this.state.secondHalf);
        updateRegularizeStatus(id, firHalf, secHalf, this.state.Reason == ""?regularize.regularizationRemarks:this.state.Reason, status,this.state.editValidation).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                window.location.reload();
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            console.error(err);
            toast.error("Error while updating status");
        })
    }
}
}
setValidationStatus = (date, setValidation) => {
    
    const val = `${getReadableDate(date)} 00:00`;
    if (setValidation) {
        this.setState({
            firstHalf: val,
            secondHalf: val
        });
        console.log("setValidation",setValidation);
    } else {
        this.setState({
            firstHalf: '',
            secondHalf: ''
        });
    }
};

    render() {
        const { regularize, setValidation } = this.state;
        return (
            <div>
                {regularize &&
                    
                    <><table className="table">
                        <tr>
                            <th>Employee</th>
                            <td>{regularize.employee?.name}</td>
                        </tr>
                        <tr>
                        <th>Date</th>
                        <td style={{display: "flex", alignItems: "center", marginLeft: "10px", cursor: "pointer"}}><span>{getReadableDate(regularize.date)}</span>{this.state.editValidation && (
                            <div type="checkbox" name="setValidation" onClick={(e) => {
                                this.setState({ setValidation: !this.state.setValidation });
                                this.setValidationStatus(regularize.date,!this.state.setValidation);
                            }}><i className={`fa fa-2x ${this.state.setValidation ? "fa-toggle-on text-success" : "fa-toggle-off text-danger"}`}></i>
                            </div>
                        )}
                        </td>
                    </tr>
                        <tr>
                            <th>Assigned Shift</th>
                            <td>{regularize.settingClockIn != null ? convertToUserTimeZone(toDateTime(regularize.date, regularize.settingClockIn)) : "-"} - {regularize.settingClockOut != null ? convertToUserTimeZone(toDateTime(regularize.date, regularize.settingClockOut)) : "-"} </td>
                        </tr>
                       
                        <tr>
                            <th>Recorded Clock-In Time & Recorded Clock-Out Time</th>
                            <td>{regularize.actualInTimeBeforeRegularize != null ? convertToUserTimeZone(regularize.actualInTimeBeforeRegularize) : "-"} - {regularize.actualOutTimeBeforeRegularize != null ? convertToUserTimeZone(regularize.actualOutTimeBeforeRegularize) : "-"}</td>
                        </tr>
                        <tr>
                            <th>System Reason</th>
                            <td>{regularize.systemReason}</td>
                        </tr>
                        <tr>
                            <th>Requested Clock-In Time</th>
                            <td>{formatDateTime(toLocalDateTime(regularize.regularizedInTime))}</td>
                        </tr>
                        <tr>
                            <th>Requested Clock-Out Time</th>
                            <td>{formatDateTime(toLocalDateTime(regularize.regularizedOutTime))}</td>
                        </tr>
                        <tr>
                            <th>Reason for Regularization</th>
                            <td>{regularize.regularizationRemarks}</td>
                        </tr>
                        {/* input */}
                        <tr>
                        <th>Do you want to edit</th>
                        <td>
                            {/* Edit check box */}
                            <div type="checkbox" name="editValidation" onClick={e => {
                                this.setState({editValidation: !this.state.editValidation})
                            }} >

                                <i className={`fa fa-2x ${this.state.editValidation
                                    ? 'fa-toggle-on text-success' :
                                    'fa fa-toggle-off text-danger'}`}></i>
                            </div>
                        </td>
                        </tr>
                        {/* Hide input field */}
                         
                        {this.state.editValidation && <tr>
                            <th>Requested Clock-In Time</th>
                            <td><input type="datetime-local" className="form-control" id="firstHalf" Value={setValidation ?`${regularize.date} 00:00`:null} required
                                onChange={(e) => { this.setState({ firstHalf: e.target.value }); }}
                            /></td>
                        </tr>}
                        {this.state.editValidation && <tr>
                           <th>Requested Clock-Out Time</th>
                            <td><input type="datetime-local" className="form-control" id="secondHalf" Value={setValidation ?`${regularize.date} 00:00`:null} required
                                onChange={(e) => { this.setState({ secondHalf: e.target.value }); }}
                            /></td>
                        </tr>
                        }
                        <tr>
                            <th>Reason for Regularization</th>
                            <td><input type="text" className="form-control" id="Reason" required
                                onChange={(e) => { this.setState({ Reason: e.target.value }); }}
                            /></td>
                        </tr>
                    </table>
                        <hr />
                        <div className="row">
                        <div className="col-md-2">
                        <Anchor onClick={() => {
                            this.updateStatus(regularize.id, "APPROVED");
                        }} className="btn btn-success">Approve</Anchor>

                        </div>
                        {!this.state.editValidation &&  <div className="col-md-2">
                        <Anchor onClick={() => {
                            this.updateStatus(regularize.id, "REJECTED");
                        }} className="btn btn-danger" style={{padding : "3px 10px"}}>Reject</Anchor> 
                        </div>}
                        </div>
                     
                     
                    </>
                }
            </div>
        )
    }
}
