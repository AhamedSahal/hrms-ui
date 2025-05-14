import React, { Component } from 'react';
import jsPDF from 'jspdf';
import { Table } from 'antd'; 
import EmployeeListColumn from '../Employee/employeeListColumn';
import { itemRender } from "../../paginationfunction";
import { getCurrency, getLogo, getReadableDate, verifyViewPermission } from '../../utility';
import { getAssetHistory } from './service'
export default class AssetsHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            no: 0,
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1, 
            AssetsHistory: props.AssetsHistory || {}
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.AssetsHistory && nextProps.AssetsHistory != prevState.AssetsHistory) {
            return ({ AssetsHistory: nextProps.AssetsHistory })
        } else if (!nextProps.AssetsHistory) {
            return prevState.AssetsHistory || ({
                AssetsHistory: {
                    projid: 0
                }
            })
        }
        return null;
    }

    componentDidMount() {
 
        this.fetchList()
    }

    fetchList = () => { 
       verifyViewPermission("Manage Assets") &&  getAssetHistory(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.AssetsHistory.category.id,this.state.AssetsHistory.assets.id,this.state.AssetsHistory.serialno,this.state.AssetsHistory.id).then(res => {
         
            if (res.status == "OK") { 
             
                this.setState({
                  data: res.data, 
                  totalRecords: res.data.length 
                })
            }
        })
    }
    
    onTableDataChange = (d, filter, sorter) => {
      this.setState({
        page: d.current - 1,
        size: d.pageSize,
        sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
      }, () => {
        this.fetchList();
      })
    }

    render() { 
        
        const { data, totalPages, totalRecords, currentPage, size,AssetsHistory } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }

        
        return (
            <div className="row"> 
                <div className="col-md-12">
                    <div className="table-responsive">
                    
                  {this.state.data.length > 0 && <div className="GoalAudit-container">
                    <div className="d-flex mb-1">
                            <div style={{ marginRight:"50px",fontSize: "16px", textAlign: 'center' }}>
                            <span className="text-muted">Asset Category: </span>  <span>{data[0].assetCatName}</span>
                            </div>
                            <div style={{  marginRight:"50px",fontSize: "16px", textAlign: 'center'  }}>
                            <span className="text-muted">Asset Name: </span> <span>{data[0].assetName}</span>
                            </div>
                            <div style={{  marginRight:"50px",fontSize: "16px", textAlign: 'center'  }}>
                            <span className="text-muted">Serial No: </span> <span>{data[0].serialno}</span>
                            </div>
                    </div>

                    <div className="GoalAudit-timeline">
                        {data.map((datas, index) => {
                           
                            const descendingIndex = data.length - index;
                            return (
                                <div className="GoalAudit-timelineItem" key={index}>
                                    <div className="GoalAudit-dot">
                                        <span className="GoalAudit-index">{descendingIndex}</span>
                                    </div>
                                    <div className="mt-2 GoalAudit-dotBar"></div>
                                    <div className="GoalAudit-content">
                                       
                                        <div style={{ width: '170px' }}>
                                            <span className="text-muted">Current Status</span>
                                            <div>{datas.statusDef}</div>
                                        </div>
                                        {<>
                                          <div style={{ width: '170px' }}>
                                          <span className="text-muted">{datas.statusDef=="Assigned Request"?"Assigned On":datas.statusDef=="Allocated"?"Allocated On":datas.statusDef=="Return Request"?"Returned On":"Available from"}</span>
                                            <div>{datas.statusDef=="Allocated"?new Date(datas.modifiedOn).toLocaleDateString('en-GB'): datas.statusDef=="Available"?new Date(datas.modifiedOn).toLocaleDateString('en-GB'):datas.assignedon}</div>
                                        </div>
                                        
                                        <div style={{ width: '200px' }}>  
                                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "0px" }}>
                                            <span className="text-muted">Assigned To</span>
                                            <div>
                                            {datas.employeeId != null ?
                                             <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder", display:"flex" }}>
                                              <EmployeeListColumn
                                               id={datas.employeeId}  ></EmployeeListColumn><span>{datas.employeeName}</span></div>: "-"
                                                }
                                            </div>
                                        </div>   
                                        </div>

                                        <div style={{ width: '200px' }}>  
                                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "0px" }}>
                                            <span className="text-muted">Assigned By</span>
                                            <div>
                                            {datas.assignedEmp != null ? 
                                                <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder", display:"flex" }}>
                                                     <EmployeeListColumn
                                                id={datas.assignedEmp} ></EmployeeListColumn> <span>{datas.assignedEmpName}</span></div>: "-"}
                                            </div>
                                            </div>
                                        </div> 
                                        

                                        </>}
                                        
                                       

                                        <div style={{ width: '200px' }}>     
                                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "0px" }}>
                                            <span className="text-muted">Previous Owner</span>
                                            <div>
                                            {datas.prevemployeeId != null ?
                                                <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder", display:"flex" }}>
                                                <EmployeeListColumn id={datas.prevemployeeId}></EmployeeListColumn><span>{datas.prevemployeename}</span>
                                            </div>:'-'}
                                            </div>
                                        </div>
                                        </div> 
                                        

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>}
                    </div>
                </div>
            </div>
        )
    }
}



