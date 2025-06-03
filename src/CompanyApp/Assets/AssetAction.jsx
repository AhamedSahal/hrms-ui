import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown'; 
import { returnAsset } from './service'; 
import { getReadableDate } from '../../utility';


export default class AssetsAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            AssetsAction: props.AssetsAction || {
                id: 0,
                returnDate: "",
                reasonOfReturn:"",
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
                    remarks: "",
                    employeeId: 0

                }
            })
        }
        return null;
    }
    updateAsset = (id) => {  
     
        if(this.state.returnDate == undefined || this.state.returnDate == "" ){
            toast.error("Return Date should not be empty.");
        }
      
        else if(this.state.reasonOfReturn == "" || this.state.reasonOfReturn == undefined ){
            toast.error("Reason of Return should not be empty");
        }else if(this.state.reasonOfReturn == "Others" && (this.state.remarks == "" || undefined)){
            toast.error("Add a comment");
        }
        else{ 
            returnAsset(id,this.state.returnDate,this.state.reasonOfReturn, this.state.remarks).then(res => {
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
                toast.error("Error while returning assets");
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
                    <th>Reason for Return<span style={{ color: "red" }}>*</span></th>
                        <td>
                              <FormGroup>
                                                                        
                                    <select id="reasonOfReturn" className="form-control" name="reasonOfReturn"
                                     onChange={e => {
                                        this.setState(
                                            {
                                                reasonOfReturn:e.target.value
                                            }
                                        )

                                            }}>
                                            <option value="Select Reason">Select Reason</option>
                                            <option value="Replacement">Replacement</option>
                                            <option value="Termination">Termination</option>
                                            <option value="Repair">Repair</option>
                                            <option value="Others">Others Reasons</option>
                                    </select>
                             </FormGroup>
                        </td>
                                                               

                    </tr>

                    <tr>
                        <th>Add your comment<span style={{ color: "red" }}>{this.state.reasonOfReturn == "Others"?'*':''}</span></th>
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
                       this.updateAsset(AssetsAction.id);
                    }} className="btn btn-primary">Return</Anchor>
                    &nbsp;
                </>}

            </div>
        )
    }
}
