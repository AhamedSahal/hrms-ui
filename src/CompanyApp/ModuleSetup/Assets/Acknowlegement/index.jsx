
import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getTitle, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../../utility';
import { confirmAlert } from 'react-confirm-alert';
import AccessDenied from '../../../../MainPage/Main/Dashboard/AccessDenied';
import {getAssetAcknowledgementStatus, updateAssetAcknowledgementStatus} from './service';
import { toast } from "react-toastify";

export default class AssetsAcknowledgement extends Component {
  constructor(props) {
    super(props);

    this.state = {
       AssetAcknowlegement: false
    };
  }

    componentDidMount() {
      this.checkAcknowledgementStatus();
    }

    checkAcknowledgementStatus = () => {
      if(verifyOrgLevelViewPermission("Module Setup Manage")){
        getAssetAcknowledgementStatus().then(res => {
        if (res.status == "OK") {
          
          this.setState({
            AssetAcknowlegement:res.data
          })
        }
      })
    }
    }

    changeAcknowledgement = () =>{
      if(verifyOrgLevelViewPermission("Module Setup Manage")){
        if (this.state.AssetAcknowlegement == false) {
          confirmAlert({
              message: `Are you sure you want to disable Asset Acknowledgement?`,
              buttons: [
                  {
                      label: "Confirm",
                      className :"confirm-alert",
                      onClick: () => {
                        this.updateAcknowlegement();
                      },
                  }, {
                    label: 'Cancel',
                    onClick: () => { }
                }
              ]
          });
      } else {
        this.updateAcknowlegement();
      } 
          }
        }
      
        updateAcknowlegement = () =>{
          updateAssetAcknowledgementStatus(this.state.AssetAcknowlegement).then(res => {
            if (res.status == "OK") {
              toast.success(res.message);
            }else{
               toast.error(res.message);
            }
          })
        }
    
  render() {
    
    return (
      <>
        <div className="page-container content container-fluid">
          {/* Page Header */}
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Assets Setup</h3>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Module Setup Manage") &&
             
                <div className="col-md-4">
                
                <label>Enable Acknowledge</label><br/>
                <i className={`fa fa-2x ${this.state.AssetAcknowlegement
                    ? 'fa-toggle-on text-success' :
                    'fa fa-toggle-off text-danger'}`} onClick={()=>this.setState({AssetAcknowlegement:!this.state.AssetAcknowlegement})} ></i>
                    <div>
                        <input type="button"  className="btn btn-primary" value={"Save"} onClick={()=>this.changeAcknowledgement()} />
                    </div> 
                </div>
                    }
                {!verifyOrgLevelViewPermission("Module Setup Manage") && <AccessDenied></AccessDenied>}  
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
