import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown'; 
import { updateAsset } from './service'; 
import { getReadableDate } from '../../utility';


export default class AssetsAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            AssetsAction: props.AssetsAction || {
                id: 0,
                returnDate: "",
                confidentiality: "",
                integrity: "",
                availability: "",
                remarks: "",
                employeeId: 0

            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.AssetsAction && nextProps.AssetsAction != prevState.AssetsAction) {
            return ({ AssetsAction: nextProps.AssetsAction })
        } else if (!nextProps.AssetsAction) {
            return ({
                AssetsAction: {
                    id: 0,
                    returnDate: "",
                    confidentiality: "",
                    integrity: "",
                    availability: "",
                    remarks: "",
                    employeeId: 0

                }
            })
        }

        return null;
    }
    updateAsset = (id,assignDate) => {  
        let assignedDate = new Date(assignDate).getTime();
        let returnedDate = new Date(this.state.returnDate).getTime(); 
        if(this.state.returnDate == undefined){
            toast.error("Return Date should be empty.");
        }
        else if(assignedDate > returnedDate) {
            toast.error("Return Date should be less than assigned date.");
        } 
        else if( this.state.returnDate != "" && this.state.remarks == undefined) {
            toast.error("Comments should not be empty.");
        }
        else{ 
            updateAsset(id,this.state.returnDate,this.state.AssetsAction.confidentiality ?? "",this.state.AssetsAction.integrity ?? "",this.state.AssetsAction.availability ?? "", this.state.remarks).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message); 
                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") {
                    setTimeout(function () {
                        window.location.reload()
                      }, 6000)
                }
            }).catch(err => { 
                toast.error("Error while updating assets");
            })
        }
    }
    render() {
        const { AssetsAction } = this.state; 
        return (
            <div>
                {AssetsAction && <> <table className="table">
                     <tr>
                        <th>Asset Name</th>
                        <td>{AssetsAction.assets?.name}</td>
                    </tr>
                    <tr>
                        <th>Category</th>
                        <td>{AssetsAction.category?.name}</td>
                    </tr>
                    <tr>
                        <th>Serial No</th>
                        <td>{AssetsAction.serialno}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>{AssetsAction.isStatus == "APPROVED" ? "Allocated" : "Available"}</td>
                    </tr>
                    <tr>
                        <th>Assigned To</th>
                        <td>{AssetsAction.employee?.name}</td>
                    </tr>
                    <tr>
                        <th>Assigned On</th>
                        <td>{getReadableDate(AssetsAction.assignDate)}</td>
                    </tr>
                    <tr>
                        <th>Previous Owner</th>
                        <td>{AssetsAction.pEmployee?.name}</td>
                    </tr>
                    <tr>
                            <th>Date Returned<span style={{ color: "red" }}>*</span></th>
                            <td>
                                <FormGroup>
                                    <input name="returnDate"  type="date" className="form-control" defaultvalue={AssetsAction.returnDate} onChange={e => {

                                        this.setState({
                                            returnDate: e.target.value
                                        });
                                    }}></input>

                                </FormGroup>
                            </td>
                    </tr>
                    <tr>
                            <th>Confidentiality</th>
                            <td>
                                <FormGroup>  
                                        <select id="confidentiality" className="form-control" name="confidentiality"
                                            onChange={e => {
                                                this.setState({
                                                    confidentiality: e.target.value
                                                }); 
                                            }} defaultValue={AssetsAction.confidentiality}>
                                            <option value="">Select Confidentiality</option>
                                            <option value="0">High</option>
                                            <option value="1">Medium</option>
                                            <option value="2">Low</option>
                                        </select> 
                                </FormGroup>
                            </td>
                    </tr>
                    <tr>
                            <th>Integrity</th>
                            <td>
                                <FormGroup>  
                                        <select id="integrity" className="form-control" name="integrity"
                                            onChange={e => {
                                                this.setState({
                                                    integrity: e.target.value
                                                }); 
                                            }} defaultValue={AssetsAction.integrity}>
                                            <option value="">Select Integrity</option>
                                            <option value="0">High</option>
                                            <option value="1">Medium</option>
                                            <option value="2">Low</option>
                                        </select> 
                                </FormGroup>
                            </td>
                    </tr>
                    <tr>
                            <th>Availability</th>
                            <td>
                                <FormGroup>  
                                        <select id="availability" className="form-control" name="availability"
                                            onChange={e => {
                                                this.setState({
                                                    availability: e.target.value
                                                }); 
                                            }} defaultValue={AssetsAction.availability}>
                                            <option value="">Select Availability</option>
                                            <option value="0">High</option>
                                            <option value="1">Medium</option>
                                            <option value="2">Low</option>
                                        </select> 
                                </FormGroup>
                            </td>
                    </tr>
                    <tr>
                            <th>Add your comments {this.state.returnDate != "" && <> <span style={{ color: "red" }}>*</span></>}</th>
                            <td>
                                <FormGroup>
                                    <input name="remarks"  type="text" className="form-control" defaultvalue={AssetsAction.remarks} onChange={e => {

                                        this.setState({
                                            remarks: e.target.value
                                        });
                                    }}></input>

                                </FormGroup>
                            </td>
                    </tr>
                </table>
                    <hr />
                    <Anchor onClick={() => {
                       this.updateAsset(AssetsAction.id,AssetsAction.assignDate);
                    }} className="btn btn-primary">Deactivate</Anchor>
                    &nbsp;
                </>}

            </div>
        )
    }
}
