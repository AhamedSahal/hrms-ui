import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { multiApprovalLeaveSchema } from './multiApprovalLeaveSchema';
import { saveMultiApprovalMaster, saveMultiApprovallist, getMultiApprovalMaster,getMultiApprovalMasterList,saveMultiApprovalPatch } from './service';


export default class LeaveMultiApproval extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fromDate: "",
            toDate: "",
            arrowIcon: false,
            approverCount: 1,
            moveToNextLevelStatus: false,
            moveToNextLevelCount: 0,
            leaveData: [],
            leaveType: {},
            moduleName: "leave",
            multiApprovalMasterId: 0,
            viewPage: true,
            leaveModuleValidation: false,
            multiApproveMasterData: []

        }
    }

    componentDidMount() {
        this.fetchList();

    }

    fetchList = () => {
        getMultiApprovalMaster().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    leaveData: res.data,
                    approverCount: res.data.length,
                    
                })
            } 
        })

        // multi approve master list
        getMultiApprovalMasterList().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    multiApprovalMasterId: res.data.id,
                    multiApproveMasterData: res.data,
                    leaveModuleValidation:res.data.moduleIsActive
                })
            }
        })

    }

    addRecord(count) {
        let tmp = [];
        if (count <= 6) {


            this.setState({
                approverCount: count
            })
            this.setState({ leaveData: [] })
            for (let i = 0; i < count; i++) {
                tmp.push({
                    id: i + 1,
                    approverType: "",
                    autoApprovalStatus: false,
                    moveToNextLevelStatus: false,
                    moveToNextLevelCount: null,
                    autoApproveDaysCount: null,
                });
            }
            this.setState({
                leaveData: tmp,

            });
        } else {
            this.setState({
                approverCount: 0
            })
            toast.error("Approvers should be less than or equal to 6");
        }
    }



    updateState = (updatedLeave, index) => {
        let { leaveData } = this.state;
        leaveData[index] = updatedLeave;
        this.setState({
            leaveData: leaveData
        });
    }

    // master record update
    handleMasterRecordUpdate = () => {
        

        if (this.state.multiApprovalMasterId == 0) {
            let multiApprovalMaster = {
                id: 0,
                moduleName: "Leave",
                noofApprovers: this.state.leaveData.length
            }
            saveMultiApprovalMaster(multiApprovalMaster).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.fetchList();
                } else {
                    toast.error(res.message);
                } 
            }).catch(err => {
                toast.error("Error while saving Leave Type");

            })
        } else{
            saveMultiApprovalPatch(this.state.multiApprovalMasterId,!this.state.leaveModuleValidation).then((res) => {
                if (res.status == "OK") {
                  toast.success(res.message);
                  this.fetchList();
                } else {
                  toast.error(res.message);
                }
              })
        }

    }

    save = (data, action) => {
       
        let adminValidation = true;
        for (let i = 0; i < this.state.leaveData.length - 1; i++) {
            if (this.state.leaveData[i].approverType == "2") {
                adminValidation = false;
            }
        }
        if (adminValidation) {
            
                this.getMultiApprovalList(this.state.multiApprovalMasterId)
            
        } else {
            toast.error("Owner/Admin should be the last approver");
        }
    }

    // multi approval list
    getMultiApprovalList = (id) => {

        let multiApprovallist = {
            multiApprovalMasterId: id,
            multiApprovalList: this.state.leaveData,
            leaveModuleValidation: this.state.leaveModuleValidation
        }
        saveMultiApprovallist(multiApprovallist).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            } if (res.status == "OK") {
             
            }
        }).catch(err => {
            toast.error("Error while saving Leave Type");

        })




    }
    render() {
        let { leaveData } = this.state;
        return (
            <div>
                <div className='profileFormHead' >
                    <div className='profileFormHeadContent'>
                        <h3 className='dvlp-left-align'>Leave Module</h3>
                        <div className='dvlp-right-align'>
                            {/* leave module active inactive */}
                            <div type="checkbox" name="leaveModuleValidation" onClick={
                                this.handleMasterRecordUpdate
                                } >

                                <i className={`fa fa-2x ${this.state.leaveModuleValidation
                                    ? 'fa-toggle-on text-success' :
                                    'fa fa-toggle-off text-danger'}`}></i>
                            </div>

                            <i onClick={() => this.setState({ arrowIcon: this.state.arrowIcon ? false : true })}
                                className={`dvlpCardIcon ml-2 fa fa-xl ${this.state.arrowIcon ? 'fa-chevron-up' : 'fa-chevron-down'}`}
                                aria-hidden='true'
                            ></i>
                        </div>
                    </div>


                    {this.state.arrowIcon && <div className="card-body" style={{ padding: "0px" }}>
                        <div className="page-container content container-fluid">
                            <div style={{ padding: "10px" }}>
                                <div className="row" style={{ justifyContent: "end", paddingTop: "15px" }}>

                                    <div className="col-sm-6 col-md-4">
                                        <div className="form-group form-focus">
                                            <label className="focus-label">No Of Approves</label>
                                            <input onChange={e => {

                                                this.addRecord(e.target.value)
                                            }} type="number" defaultValue={this.state.approverCount} min="1" max="6" className="form-control floating" />

                                        </div>
                                        <div style={{ display: "flex", justifyContent: "end" }}>
                                            {this.state.approverCount > 0 && <input type="submit" className="btn btn-primary" value={this.state.viewPage ? "Edit" : "View"} onClick={(e) => { this.setState({ viewPage: this.state.viewPage ? false : true }) }} />}
                                        </div>
                                    </div>


                                </div>
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.leaveType}
                                    onSubmit={this.save}
                                 // validationSchema={multiApprovalLeaveSchema}
                                >
                                    {({
                                        values,
                                        errors,
                                        touched,
                                        handleChange,
                                        handleBlur,
                                        handleSubmit,
                                        isSubmitting,
                                        setFieldValue,
                                        setSubmitting
                                        /* and other goodies */
                                    }) => (
                                        <Form>
                                            {this.state.approverCount > 0 && !this.state.viewPage && this.state.arrowIcon && leaveData.length > 0 && leaveData.map((res, index) => (<div key={index} className="mt-3 mb-0 card">
                                                <div className="card-body" style={{ padding: "0px" }}>
                                                    {/* form */}
                                                    <div>
                                                        <div className="page-container content container-fluid">
                                                            {/* Page Header */}
                                                            <div className="tablePage-header" style={{ marginTop: "0px" }}>
                                                                <div className="row pageTitle-section">
                                                                    <div className="col">
                                                                        <h5 className="tablePage-title">Approver {index + 1} </h5>
                                                                    </div>
                                                                </div>
                                                            </div>




                                                            <div className="row">
                                                                <div className="col-md-4" style={{ paddingBottom: "14px" }}>
                                                                    <label>Approver Type <span style={{ color: "red" }}>*</span></label>
                                                                    <select
                                                                        className="form-control"
                                                                        name="approvers"
                                                                        required
                                                                        id="approvers"
                                                                        value={res.approverType == "REPORTING_MANAGER" || res.approverType == '0' ? 0 : res.approverType == "SKIP_MANAGER" || res.approverType == '1' ? 1 : res.approverType == "OWNER_ADMIN" || res.approverType == '2' ? 2 : ""}
                                                                        onChange={(e) => {
                                                                            if (e.target.value != 2 || index + 1 == leaveData.length) {
                                                                                res.approverType = e.target.value
                                                                                this.updateState(res, index)

                                                                            } else {
                                                                                toast.error("Owner/Admin should be the last approver");
                                                                            }

                                                                        }}
                                                                    >
                                                                        <option value="">Select Approver Type</option>
                                                                        <option value="0">Reporting Manager</option>
                                                                        <option value="1">Skip Manager</option>
                                                                        <option value="2">Owner/Admin</option>

                                                                    </select>

                                                                </div>


                                                                <div className="col-md-2">
                                                                    <FormGroup>
                                                                        <label>Auto Approval</label><br />
                                                                        <div type="checkbox" name="autoApprovalStatus" onClick={e => {
                                                                            res.autoApprovalStatus = res.autoApprovalStatus ? false : true
                                                                            this.updateState(res, index)
                                                                        }} >

                                                                            <i className={`fa fa-2x ${res.autoApprovalStatus
                                                                                ? 'fa-toggle-on text-success' :
                                                                                'fa fa-toggle-off text-danger'}`}></i>
                                                                        </div>

                                                                    </FormGroup>
                                                                </div>

                                                                {res.autoApprovalStatus &&

                                                                    <div className="col-sm-6 col-md-4">
                                                                        <label>In Days <span style={{ color: "red" }}>*</span></label><br />

                                                                        
                                                                            <input onChange={e => {
                                                                                res.autoApproveDaysCount = e.target.value
                                                                                this.updateState(res, index)
                                                                            }} type="number" required defaultValue={res.autoApproveDaysCount == 0 ? null : res.autoApproveDaysCount} min="1" className="form-control floating" style={{ padding: "3px"}} />

                                                    

                                                                    </div>


                                                                }

                                                                {/* move to nxt level */}
                                                               
                                                                {(res.approverType != "OWNER_ADMIN" && res.approverType != '2' && this.state.approverCount != index+1) && <div className="col-md-2">
                                                                    <FormGroup>
                                                                        <label style={{whiteSpace: "nowrap"}}>Move To Next Level </label><br />
                                                                        <div type="checkbox" name="moveToNextLevelStatus" onClick={e => {
                                                                            res.moveToNextLevelStatus = res.moveToNextLevelStatus ? false : true
                                                                            this.updateState(res, index)
                                                                        }} >

                                                                            <i className={`fa fa-2x ${res.moveToNextLevelStatus
                                                                                ? 'fa-toggle-on text-success' :
                                                                                'fa fa-toggle-off text-danger'}`}></i>
                                                                        </div>

                                                                    </FormGroup>
                                                                </div>}

                                                                {res.moveToNextLevelStatus && <div className="col-sm-6 col-md-4">
                                                                    <label> No Of Days <span style={{ color: "red" }}>*</span></label><br />

                                                                    <div className="form-group form-focus">
                                                                        <input required onChange={e => {
                                                                            res.moveToNextLevelCount = e.target.value
                                                                            this.updateState(res, index)
                                                                        }} type="number" defaultValue={res.moveToNextLevelCount == 0 ? null : res.moveToNextLevelCount} min="1" className="form-control floating" style={{padding:"3px"}} />

                                                                    </div>


                                                                </div>}



                                                            </div>




                                                        </div>
                                                    </div>
                                                    {/* form */}
                                                </div>
                                            </div>))

                                            }
                                            {/* change */}
                                            {/* save */}
                                            <div style={{ padding: "10PX 0PX 0px 0px", display: "flex", justifyContent: "end" }}>
                                                {this.state.approverCount > 0 && !this.state.viewPage && this.state.arrowIcon && <input type="submit" className="btn btn-primary" value={this.state.multiApprovalMasterId == 0 ? "Save" : "Update"} />}
                                            </div>
                                        </Form>
                                    )
                                    }

                                </Formik>

                                {/* change */}

                                {/* view */}
                                {this.state.approverCount > 0 && this.state.viewPage && this.state.arrowIcon && leaveData.length > 0 && leaveData.map((res, index) => (<div key={index} className="mt-3 mb-0 card">

                                    <div className="card-body" style={{ padding: "0px" }}>
                                        <div>

                                            <div className="page-container content container-fluid">
                                                {/* head */}
                                                <div className="tablePage-header" style={{ marginTop: "0px" }}>
                                                    <div className="row pageTitle-section">
                                                        <div className="col">
                                                            <h5 className="tablePage-title">Approver {index + 1} </h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* head */}
                                                {/* body */}
                                                <div className="row">
                                                    <div className="col-md-4">
                                                        <label>Approver Type </label>
                                                        <h5>{res.approverType == "REPORTING_MANAGER" ? "Reporting Manager" : res.approverType == "SKIP_MANAGER" ? "Skip Manager" : res.approverType == "OWNER_ADMIN" ? "Owner/Admin" : "-"}</h5>
                                                    </div>

                                                    {res.autoApprovalStatus && <div className="col-md-4">
                                                        <label> Auto Approve Days </label>
                                                        <h5>{res.autoApproveDaysCount}</h5>
                                                    </div>}

                                                    {res.moveToNextLevelStatus && <div className="col-md-4">
                                                        <label> Move To Next Level </label>
                                                        <h5>{res.moveToNextLevelCount}</h5>
                                                    </div>}
                                                </div>

                                                {/* body */}

                                            </div>
                                        </div>
                                    </div>

                                </div>))}

                                {/* view */}
                            </div>
                            {/* change */}
                        </div>
                    </div>}


                </div>
            </div>
        )
    }
}
