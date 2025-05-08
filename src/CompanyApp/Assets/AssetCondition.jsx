import React, { Component } from 'react';
import jsPDF from 'jspdf';
import { Table } from 'antd'; 
import EmployeeListColumn from '../Employee/employeeListColumn';
import { itemRender } from "../../paginationfunction";
import {  getAssetLatestHistory } from './service';
import { getCurrency, getLogo, getReadableDate, verifyEditPermission, verifyViewPermission } from '../../utility';
import { getAssetHistory } from './service'
import { toast } from 'react-toastify';

export default class AssetCondition extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentAsset: props.currentAsset || {},
            AssetLatestHistory:[],
        };
    }

   
    componentDidMount(){
       
      this.getAssetLatestHistory(this.state.currentAsset.category?.id,this.state.currentAsset.assets?.id,this.state.currentAsset.serialno)
   
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

    render() { 
        
        const { AssetLatestHistory, currentAsset } = this.state
        const descendingIndex = 1

        return (
            
            <div className="row"> 
             
                <div className="col-md-12">
                    <div className="table-responsive">
                    
                  {this.state.AssetLatestHistory!=null && <div className="GoalAudit-container">
                    <div className="d-flex mb-1">
                            <div style={{ marginRight:"50px",fontSize: "16px", textAlign: 'center' }}>
                            <span className="text-muted">Asset Category: </span>  <span>{currentAsset.category?.name}</span>
                            </div>
                            <div style={{  marginRight:"50px",fontSize: "16px", textAlign: 'center'  }}>
                            <span className="text-muted">Asset Name: </span> <span>{currentAsset.assets?.name}</span>
                            </div>
                            <div style={{  marginRight:"50px",fontSize: "16px", textAlign: 'center'  }}>
                            <span className="text-muted">Serial No: </span> <span>{currentAsset.serialno}</span>
                            </div>
                    </div>

                    <div className="GoalAudit-timeline">
                       
                                <div className="GoalAudit-timelineItem" >
                                    <div className="GoalAudit-dot">
                                        <span className="GoalAudit-index">{descendingIndex}</span>
                                    </div>
                                    <div className="mt-2 GoalAudit-dotBar"></div>
                                    <div className="GoalAudit-content">
                                       
                                        <div style={{ width: '170px' }}>
                                            <span className="text-muted">Availability</span>
                                            <div>{AssetLatestHistory.availability == 0?"High":AssetLatestHistory.availability == 1?"Medium":"Low"}</div> 
                                        </div>

                                        <div style={{ width: '170px' }}>
                                            <span className="text-muted">Confidentiality</span>
                                            <div>{AssetLatestHistory.confidentiality == 0?"High":AssetLatestHistory.confidentiality == 1?"Medium":"Low"}</div> 
                                        </div>
                                        
                                        <div style={{ width: '170px' }}>
                                            <span className="text-muted">Integrity</span>
                                            <div>{AssetLatestHistory.integrity == 0?"High":AssetLatestHistory.integrity == 1?"Medium":"Low"}</div> 
                                        </div>
                                    </div>
                                </div>
                        
                    </div>
                </div>}
                    </div>
                </div>
               
            </div>
        )
    }
}








