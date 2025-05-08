
import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Modal,Anchor } from 'react-bootstrap';
import { getReadableDate,getCustomizedDate,getTitle,getUserType,verifyViewPermission, verifyEditPermission } from '../../utility';
import {  getAssetList,updateStatus } from './service';  
import { toast } from 'react-toastify';
import { getWithAuth } from "../../HttpRequest";
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { updateAsset, getAssetSerials, getAssetHistory, getAsset} from './service'; 
import { saveAssetActive, getPreviousOwner } from './service';
import AssetHistory from './AssetHistory';
import AssetViewer from './view';
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown'; 
import AssetCondition from './AssetCondition';
const { Header, Body, Footer, Dialog } = Modal;

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const isEmployee = getUserType() == 'EMPLOYEE';

export default class AssetsActive extends Component {
    constructor(props) {
        super(props)       
        this.state = {
            
            AssetsActive: props.AssetsActive || {
                id: 0,
                returnDate: "",
                confidentiality: "",
                integrity: "",
                availability: "",
                remarks: "",
                employeeId: 0
            },
            AssetSerialNo:[],
            currentAsset: [],
            currentAssetHistory:[],
            page: 0,
            size: 10,
            sort: "id,desc",
            AssetView: true,
            showForm: false,
            serialno: "",

            assignDate: "",
            onHide: props.onHide,
            previousOwner:"",
            employeeId:""

        }
    }

    componentDidMount(){
       this.getAssetSerialNumbers();
    }

    hideForm = () => {
        this.setState({
          showForm: false,
          Assets: undefined
        })
      }

      hideAssetView = () => {
        this.setState({
          showAssetView: false,
          showAssetAction: false,
          AssetView: undefined
        })
      }

       hideAssetHistory = () => {
        this.setState({
          showAssetAction: false,
          showAssetView: false,
          showAssetHistory: false,
          showAssetActive: false,
          AssetsHistory: undefined
        })
      } 

      hideAssetCondition = () => {
        this.setState({
          showAssetAction: false,
          showAssetView: false,
          showAssetHistory: false,
          showAssetActive: false,
          AssetsCondition: undefined
        })
      } 

    updateList = (Assets) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == Assets.id);
        if (index > -1)
          data[index] = Assets;
        else {
          data=[Assets,...data];
        }
        this.setState({ data },
          () => {
            this.hideForm(); 
            this.hideAssetView(); 
            this.hideAssetAction();
            // this.hideAssetHistory();
          });
      }

    getAssetSerialNumbers = () => {     
            verifyViewPermission("Manage Assets") && getAssetSerials(this.state.AssetsActive.assetCategoryName, this.state.AssetsActive.assetSetupName, this.state.AssetsActive.currentLocation,0).then(res => {
            
            if (res.status == "OK") {
          
              this.setState({
                AssetSerialNo:res.data
              })
            }else {
                return toast.error(res.data.message);
            }
          })
        
        }

    save = () => {
          
        if(this.updateAsset()){
          const { AssetsActive, serialno, assignDate, employeeId } = this.state;
          const data = {
              ...AssetsActive, 
              serialno,       
              assignDate,
              employeeId      
          };
            verifyEditPermission("Manage Assets") && saveAssetActive(data).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message); 
                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") {
                    setTimeout(function () {
                        window.location.reload()
                      }, 1000)
                }
               
            }).catch(err => {
                toast.error("Error while Allocating Asset");
            })
        }
        return
        }

        getPreviousOwner = (serialNo) => {
            verifyViewPermission("Manage Assets") && getPreviousOwner(serialNo).then(res => {
                if (res.status == "OK") {
                    this.setState(
                        {
                            previousOwner: res.data
                        }
                    )
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
                toast.error("Error while fetching previous owner");
            })
        }


    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.AssetsActive && nextProps.AssetsActive != prevState.AssetsActive) {
            return ({ AssetsActive: nextProps.AssetsActive })
        } else if (!nextProps.AssetsActive) {
            return ({
                AssetsActive: {
                    id: 0,
                    returnDate: "",
                    remarks: "",
                    employeeId: 0

                }
            })
        }

        return null;
    }
    updateAsset = () => {  
       
        if(this.state.serialno == undefined || this.state.serialno == ""){
            toast.error("Serial No should not be empty");
            return false;
        }
        else if(this.state.assignDate == undefined || this.state.assignDate == "") {
            toast.error("Assign Date should not be empty");
            return false;
        } 
        else if( this.state.employeeId == undefined || this.state.employeeId == "") {
            toast.error("Assign to should not be empty.");
            return false;
        }
        else{ 
            return true
        }
    }

    getCurrentAsset = (serialNo) => {

       verifyViewPermission("Manage Assets") && getAsset(this.state.AssetsActive.assetCategoryId,this.state.AssetsActive.assetSetupId,serialNo).then(res => {    
        if (res.status == "OK") {
      
          this.setState({

            currentAsset:res.data
          }, 
          () => {
           
            if(this.state.currentAsset!= null){
            this.getAssetCurrentHistory(serialNo)
            }
          }
        )
    
        }else {
            return toast.error(res.data.message);
        }
      })
     }

     getAssetCurrentHistory = (serialNo) => {
      
       getAssetHistory(this.state.q,this.state.page,this.state.size,this.state.sort,this.state.AssetsActive.assetCategoryId, this.state.AssetsActive.assetSetupId,serialNo,this.state.currentAsset.id).then(res => {     
        if (res.status == "OK") {
         
          this.setState({
            currentAssetHistory:res.data
          })
        }else {
            return toast.error(res.data.message);
        }
      })

    }

  
   

    render() {
        const { AssetsActive, AssetView } = this.state; 
       
        return (
            <div>
                {AssetsActive && <> <table className="table">
                     <tr>
                        <th>Asset Name</th>
                        <td>{AssetsActive.assetSetupName}</td>
                    </tr>
                    <tr>
                        <th>Category</th>
                        <td>{AssetsActive.assetCategoryName}</td>
                    </tr>
                    <tr>
                        <th>Current Location</th>
                        <td>{AssetsActive.currentLocation}</td>
                    </tr>
                                              
                                <tr>
                                    <th>
                                        <label>Serial No<span style={{ color: "red" }}>*</span></label>
                                    </th>
                                
                                <td>
                                    <FormGroup>
                                    <select
                                        id="serialno"
                                        className="form-control"
                                        name="serialno"
                                        value={this.state.serialno}
                                        onChange={e=>{ this.setState(
                                            {
                                                serialno: e.target.value
                                                
                                            }
                                            
                                        )
                                        this.getCurrentAsset(e.target.value)
                                    }}
                                    >
                                        <option value="">Select Serial No</option>
                                        {this.state.AssetSerialNo &&
                                            this.state.AssetSerialNo.map((asset, index) => (
                                                <option key={index} value={asset.assetSerialNo}>
                                                    {asset.assetSerialNo}
                                                </option>
                                            ))}
                                    </select>

                                    </FormGroup>
                                    {this.state.serialno!=""?<div className="flex gap-10 items-center">
                                        <div>
                                            <a className="muiMenu_item" href="#" onClick={() => {
                                            this.setState({ AssetView: this.state.currentAsset, showAssetView: true, showForm: false })
                                            }} >
                                            <i className="fa fa-eye m-r-5" /><b>View</b></a>
                                        </div>
                                        
                                       { this.state.currentAssetHistory.length > 0  && <div >  <a className="muiMenu_item" href="#" onClick={() => {
                                            this.setState({ AssetsHistory: this.state.currentAsset, showAssetHistory: true, showForm: false })
                                            }} >
                                            <i className="fa fa-history m-r-5" /><b>History</b></a>
                                        </div>}

                                        { this.state.currentAssetHistory.length > 0  && <div >  <a className="muiMenu_item" href="#" onClick={() => {
                                            this.setState({ AssetsCondition: this.state.currentAsset, showAssetCondition: true, showForm: false })
                                            }} >
                                            <i className="fa fa-history m-r-5" /><b>Condition</b></a>
                                        </div>}
                                    </div>:''}
                                    </td>
                                    </tr>

                                <tr>
                                    <th>
                                        <label>Assign Date<span style={{ color: "red" }}>*</span></label>
                                    </th>
                                    <td>
                                        <FormGroup>
                                           
                                        <div className="form-group">
                                            <input
                                                name="assignDate"
                                                type="date"
                                                className="form-control"
                                                value={this.state.assignDate}
                                                onChange={e=>{this.setState(
                                                    {
                                                        assignDate: e.target.value
                                                    }
                                                )}}
                                                
                                            />
                                        </div>
                                        </FormGroup>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <th>
                                        <label>Assign to<span style={{ color: "red" }}>*</span> </label>
                                    </th>
                                    <td>
                                    <FormGroup>
                                        <EmployeeDropdown   onChange={e => {
                                            this.setState(
                                                {
                                                    employeeId:e.target.value
                                                }
                                            )   
                                        }}></EmployeeDropdown>
                                    </FormGroup>
                                    </td>
                                </tr>
                </table>
                <hr />
                    <Anchor onClick={() => {
                        this.save();
                    }} className="btn btn-success">Allocate</Anchor>
                    &nbsp;
                </>}

                <Modal enforceFocus={false} size={"xl"} show={this.state.showAssetView} onHide={this.hideAssetView} >
 
                <Header closeButton>
                {isCompanyAdmin && <><h5 className="modal-title">Asset Details</h5></>}
                {!isCompanyAdmin && <><h5 className="modal-title">My Asset Details</h5></>} 
                </Header>
                <Body>
                     <AssetViewer AssetView={AssetView}/>
                </Body>
                
                
                </Modal>
                

                <Modal enforceFocus={false} size={"xl"} show={this.state.showAssetHistory} onHide={this.hideAssetHistory} >
                <Header closeButton>
                    <h5 className="modal-title">Asset History</h5>
                </Header>
                <Body>
                    <AssetHistory updateList={this.updateList} AssetsHistory={this.state.currentAsset}>
                    </AssetHistory>
                </Body>
                </Modal> 

                <Modal enforceFocus={false} size={"xl"} show={this.state.showAssetCondition} onHide={this.hideAssetCondition} >
                <Header closeButton>
                    <h5 className="modal-title">Asset Condition</h5>
                </Header>
                <Body>
                    <AssetCondition updateList={this.updateList} currentAsset={this.state.currentAsset}>
                    </AssetCondition>
                </Body>
                </Modal>

            </div>
        )
    }

}

















