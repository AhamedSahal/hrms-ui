import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, FormGroup } from 'reactstrap';
// import { deleteOwners, getOwners, saveOwner } from './service';
import { getReadableDate, verifyOrgLevelViewPermission } from '../../../utility';
import LeaveMultiApproval from './LeaveMultiApproval';
import { confirmAlert } from 'react-confirm-alert';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { updateMultiApprovalPermission, getMultiApprovalPermission, getMultiApprovalcompanyMenu } from './service';

export default class MultiApprove extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editable: true,
            moduleId: '',
            approverCount: 0,
            leaveArray: [],
            companyMenuInfo: [],
            ownersData: {},
            companyApproval: false,
            multiApprovalStatus: false
        }
    }
    componentDidMount() {
        this.fetchList();
        this.fetchData();
    }

    fetchList = () => {
        if (verifyOrgLevelViewPermission("Module Setup Owner")) {
            getMultiApprovalPermission().then(res => {
                if (res.status === 'OK') {
                    this.setState({
                        companyApproval: res.data,
                        multiApprovalStatus: res.data
                    });
                } else {
                 
                }
            }).catch(error => { console.log("Error: " + error); });


        };
    }

    fetchData = () => {
        if (verifyOrgLevelViewPermission("Module Setup Owner")) {
            // company menu
            getMultiApprovalcompanyMenu().then(res => {
                if (res.status === 'OK') {
                    this.setState({
                        companyMenuInfo: res.data,
                    });
                } else {
                    console.log("Error: " + res.error);
                }
            }).catch(error => { console.log("Error: " + error); });


        };
    }


    

    save = () => {
        updateMultiApprovalPermission(this.state.multiApprovalStatus).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.fetchList();
            } else {
                toast.error(res.message);
            }
        }).catch(err => {
            toast.error("Please select the Employee to add Owner");
        })
    }
    handleEmployeeIdChange = (e) => {
        const newValue = e;
        this.setState({ moduleId: newValue });
    }

    render() {

        return (
            <>

                <div className="mt-4 page-container content container-fluid">
                    {/* /Page Header */}
                    <div className="row">
                        {verifyOrgLevelViewPermission("Module Setup Owner") &&
                            <div className="col-md-12">
                                {/* active */}
                                <div className="tablePage-header" style={{ marginTop: "0px" }}>
                                <div className='row pageTitle-section' style={{padding:"5px"}}>
                                    <div className="col-md-4" >
                                        <h5 className="tablePage-title">Multi Approval</h5>
                                     
                                    </div>
                                </div>
                                </div>
                                <div>
                                <div className="col-md-12" style={{ display: "flex", alignItems: "center"}}>
                                          <h5>Company Approval Active/Inactive <span style={{ color: "red",paddingRight: "20px" }}> * </span> </h5>
                                        <div type="checkbox" name="" onClick={e => {
                                            this.setState({ multiApprovalStatus: this.state.multiApprovalStatus ? false : true })
                                        }} >

                                            <i className={`fa fa-2x ${this.state.multiApprovalStatus
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}></i>
                                        </div>  
                                    </div>
                                    <div style={{paddingLeft: "11PX"}}>
                                        <input type="button"  className="btn btn-primary" value={"Save"} onClick={this.save} />
                                        </div> 
                                    </div>
                                    
                                {/* active */}


                                <div style={{ paddingLeft: "100px" }}>
                                    {this.state.companyApproval && this.state.companyMenuInfo.length > 0 && this.state.companyMenuInfo.map((res) => (
                                        <>

                                            {res.name == "Leave" && <div className="row" style={{ marginTop: "60px" }}>
                                                <div className="col-md-12">
                                                    <LeaveMultiApproval approverCount={this.state.approverCount} ></LeaveMultiApproval>
                                                </div>
                                            </div>}
                                        </>
                                    ))}
                                </div>

                            </div>
                        }
                        {!verifyOrgLevelViewPermission("Module Setup Owner") && <AccessDenied></AccessDenied>}
                    </div>
                </div>


            </>
        )
    }
}
