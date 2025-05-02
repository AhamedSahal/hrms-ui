import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { updateRegularizeData } from './service';
import { convertToUserTimeZone, toDateTime, getReadableDate, convertToUTC, toLocalDate, getCustomizedDate } from '../../../utility';
import { localeData } from 'moment/moment';
//import { LeaveSchema } from './validation';


export default class RegularizeAttendance extends Component {
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
            firstHalf:'',
            secondHalf:'',
            Reason: "",
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
        if (this.state.firstHalf == '') {
            toast.error("First Half Should not be empty");
        }
        if (this.state.secondHalf == '') {
            toast.error("Second Half Should not be empty");
        }
        if (this.state.Reason == '') {
            toast.error("Reason Should not be empty");
        }
        if(this.state.firstHalf != '' && this.state.secondHalf != '' && this.state.Reason != ''){
            let firHalf = convertToUTC(this.state.firstHalf);
            let secHalf = convertToUTC(this.state.secondHalf);
            updateRegularizeData(id, firHalf, secHalf, this.state.Reason, status).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                     this.props.updateList(res.data);
                } else {
                    toast.error(res.message);
                }
    
            }).catch(err => {
                console.error(err);
                toast.error("Error while updating status");
            })

        }
       

    }

    setValidationStatus = (date, setValidation) => {
        const val = `${date}T00:00`;
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
        const { regularize,setValidation } = this.state;
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
                            <td style={{display: "flex", alignItems: "center", marginLeft: "10px", cursor: "pointer"}}><span>{getReadableDate(regularize.date)}</span>{(
                            <div type="checkbox" name="setValidation" onClick={(e) => {
                                this.setState({ setValidation: !this.state.setValidation });
                                  this.setValidationStatus(regularize.date, !this.state.setValidation);    
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
                            <td><input type="datetime-local" className="form-control" id="firstHalf" Value={setValidation ?`${regularize.date} 00:00`:null} required
                                onChange={(e) => { this.setState({ firstHalf:e.target.value}); }}
                            /></td>
                        </tr>
                        <tr>
                            <th>Requested Clock-Out Time</th>
                            <td><input type="datetime-local" className="form-control" id="secondHalf" Value={setValidation ?`${regularize.date} 00:00`:null} required
                                onChange={(e) => { this.setState({ secondHalf: e.target.value }); }}
                            /></td>
                        </tr>
                        <tr>
                            <th>Reason for Regularization</th>
                            <td><input type="text" className="form-control" id="Reason" required
                                onChange={(e) => { this.setState({ Reason: e.target.value }); }}
                            /></td>
                        </tr>
                    </table>
                        <hr />
                        <Anchor onClick={() => {
                            this.updateStatus(regularize.id, "REGULARIZED");
                        }} className="btn btn-success">Regularize</Anchor>
                    </>
                }
            </div>
        )
    }
}
