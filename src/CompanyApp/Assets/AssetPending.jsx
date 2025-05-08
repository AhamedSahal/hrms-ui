import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown'; 
import { returnAsset,getAssetHistory, getAssetLatestHistory, acceptReturn, acceptAsset,cancelReturn, cancelAllocation } from './service'; 
import { getReadableDate, getEmployeeId, getUserType, verifyEditPermission, verifyViewPermission } from '../../utility';
import { Button, Stack } from '@mui/material';

const loggedInUserId = getEmployeeId();
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';

export default class AssetPending extends Component {
    constructor(props) {
        super(props)

        this.state = {
            AssetsAction: props.AssetsAction || {
                id: 0,
                returnDate: "",
                reasonOfReturn:"",
                remarks: "",
                employeeId: 0,
                confidentiality: "",
                integrity: "",
                availability: "",
            },
            AssetLatestHistory:{}
        }
    }

    componentDidMount(){
        this.getAssetLatestHistory(this.state.AssetsAction.category?.id,this.state.AssetsAction.assets?.id,this.state.AssetsAction.serialno)
    }

    getAssetLatestHistory(categoryName,assetName,serialno){
        
       verifyViewPermission("Manage Assets") &&  getAssetLatestHistory(categoryName,assetName,serialno).then(res => {
            if (res.status == "OK") {
                 
                this.setState(
                    {
                        AssetLatestHistory:res.data
                    }
                )
              
            } else {
                toast.error(res.message);
            }
        }).catch(err => {
            toast.error("Error while getting Asset History");
        })
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
                    employeeId: 0,
                    confidentiality: "",
                    integrity: "",
                    availability: "",

                }
            })
        }

        return null;
    }
    updateAsset = (currentTask) => {  
        //asset Accept block - return or assign
        if(currentTask=="Accept"){
             //asset Accept block - return 
        if(this.state.AssetsAction.pendingStatus == "RETURN" && isCompanyAdmin){

            if( this.state.confidentiality == "" || this.state.confidentiality == undefined) {
                toast.error("Confidentiality should not be empty.");
            }else if(this.state.integrity == "" || this.state.integrity == undefined ){
                toast.error("Integrity should not be empty");
            }else if(this.state.availability == "" || this.state.availability == undefined ){
                toast.error("Availability should not be empty");
            }else if(this.state.remarks == "" || this.state.remarks == undefined){
                toast.error("Add a comment");
            }
            else{ 
                verifyEditPermission("Manage Assets") &&  acceptReturn(this.state.AssetsAction.id, this.state.confidentiality,this.state.integrity,this.state.availability).then(res => {
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
         }else if(this.state.AssetsAction.pendingStatus == "ALLOCATE"){
             //asset Accept block - assign
             console.log("am here mari")
            if(this.state.remarks == "" || this.state.remarks == undefined){
                toast.error("Add a comment");
            }
            else{ 
                verifyEditPermission("Manage Assets") &&  acceptAsset(this.state.AssetsAction.id).then(res => {
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
            }}
        }else{
             //asset reject block - return or assign
                if(this.state.AssetsAction.pendingStatus == "RETURN"){
                    //asset reject block - return
                    if(this.state.remarks == "" || this.state.remarks == undefined){
                        toast.error("Add a comment");
                    }
                    else{ 
                        verifyEditPermission("Manage Assets") &&  cancelReturn(this.state.AssetsAction.id).then(res => {
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
                            toast.error("Error while cancelling returning asset");
                        }) }
                    
                }else if(this.state.AssetsAction.pendingStatus == "ALLOCATE"){
                   //asset reject block - assign
                    if(this.state.remarks == "" || this.state.remarks == undefined){
                        toast.error("Add a comment");
                    }
                    else{
                        verifyEditPermission("Manage Assets") &&  cancelAllocation(this.state.AssetsAction.id).then(res => {
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
                            toast.error("Error while cancelling allocating asset");
                        })
                    }
                    }
            }
    }
       
    render() {
        const { AssetsAction, AssetLatestHistory } = this.state; 
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
                  
                   {AssetsAction.pendingStatus == "ALLOCATE" &&
                    <>
                    <tr>
                        <th>Assigned On</th>
                        <td>{getReadableDate(AssetsAction.assignDate)}</td>
                    </tr>

                    {isCompanyAdmin &&
                         <tr>
                         <th>Assigned To</th>
                         <td>{AssetsAction.employee?.name}</td>
                        </tr>
                    }

                   
                         <tr>
                         <th>Assigned By</th>
                         <td>{AssetsAction.assignedEmp?.name}</td> 
                        </tr>
                    
                    </>
                   }
                    
                    <tr>
                        <th>Previous Owner</th>
                        <td>{AssetsAction.pEmployee?.name? AssetsAction.pEmployee?.name : '-'}</td>
                    </tr>
                   
                   
                    {AssetsAction.pendingStatus == "RETURN" &&
                    <>
                         <tr>
                         <th>Reason of Return</th>
                         <td>{AssetLatestHistory.reasonOfReturn}</td> 
                        </tr>
                  
                         <tr>
                         <th>Comments About Return</th>
                         <td>{AssetsAction.remarks ? AssetsAction.remarks : "-"}</td> 
                        </tr>
                        </>}
                     
                        {AssetsAction.pendingStatus == "RETURN" && isCompanyAdmin &&
                         <>
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
                    </>
                    }

                    <tr>
                            <th>Add your comments{this.state.returnDate != "" && <> <span style={{ color: "red" }}>*</span></>}</th>
                            <td>
                                <FormGroup>
                                    <input name="remarks"  type="text" className="form-control" defaultvalue={AssetsAction.remarks}  onChange={e => {

                                        this.setState({
                                            remarks: e.target.value
                                        });
                                    }} ></input>

                                </FormGroup>
                            </td>
                    </tr>
                </table>
                    <hr />

                    <Stack direction="row" spacing={1}>
                    {(AssetsAction.pendingStatus == "ALLOCATE" || (AssetsAction.pendingStatus == "RETURN" && isCompanyAdmin)) &&
                        <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                            this.updateAsset("Accept");
                        }} variant="contained" color="success">
                            Accept
                        </Button>
                        }
                        
                        <Button sx={{ textTransform: 'none' }} size="small" onClick={() => {
                            this.updateAsset("Decline");
                        }} variant="contained" color="error">
                           {(AssetsAction.pendingStatus == ("RETURN") && isCompanyAdmin)?'Decline':AssetsAction.pendingStatus == "ALLOCATE"?'Decline':'Cancel'} 
                        </Button>
                    </Stack>
                </>}
            </div>
        );
    }
}









