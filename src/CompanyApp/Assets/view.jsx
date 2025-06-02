
import React, { Component } from 'react';
import EmployeeListColumn from '../../CompanyApp/Employee/employeeListColumn';
import { getReadableDate,getCustomizedDate } from '../../utility'; 
export default class AssetView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            AssetView: props.AssetView || {
                id: 0, 

            }
        }

    }; 

  
    render() {
        const { id, employee, assets,category,modelNo,imeiNo,prevState,serialno,ram,ipAddress,purchaseDate,pEmployee,tag,storagecapacity,currentlocation,wstartDate,brandName,isStatus,purchasefrom,wendDate,assignDate,createdBy,createdOn,modifiedBy,modifiedOn,} = this.state.AssetView;
        
        return (
            <div className="card" >
                <div className="card-body"> 
                 
                    <div className="row"> 
                            <div className="col-md-12">   
                                <div className="row">
                                    <div className="col-md-10">
                                    <p style={{ fontSize: "24px", lineHeight: "1.5", color: "#55687d" }}> {assets?.name} </p> 
                                    </div>  
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div style={{  color: "#999", fontSize: "14px", paddingTop: "10px" }}>Category
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder", paddingTop: "0px" }}>  
                                                {category?.name}
                                            </div>
                                        </div>
                                        <div style={{  color: "#999", fontSize: "14px",paddingTop: "10px" }}>Brand Name
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder", paddingTop: "0px" }}> 
                                                { brandName != "" ? brandName : "-" } 
                                            </div>
                                        </div>
                                        <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Serial Number
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder", paddingTop: "0px" }}>
                                                { serialno != "" ? serialno : "-" } 
                                            </div>
                                        </div>
                                        <div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Model Number
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                { modelNo != "" ? modelNo : "-" }
                                            </div>
                                        </div>
                                        <div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>IMEI Number
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                { imeiNo != "" ? imeiNo : "-" }
                                            </div>
                                        </div>
                                       
                                        
                                    </div>
                                    <div className="col-md-3"  >
                                    <div style={{    color: "#999", fontSize: "14px",paddingTop: "10px" }}>Tag
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder", paddingTop: "0px" }}>  
                                                { tag != "" ? tag : "-" } 
                                            </div>
                                        </div>
                                        <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>RAM
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                { ram != "" ? ram : "-" } 
                                            </div>
                                        </div>
                                       
                                        <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Storage Capacity
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                { storagecapacity != "" ? storagecapacity : "-" } 
                                            </div>
                                        </div>
                                        <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>IP Address 
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                { ipAddress != "" ? ipAddress : "-" } 
                                            </div>
                                        </div>
                                        <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Purchased From
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                { purchasefrom != "" ? purchasefrom : "-" } 
                                            </div>
                                        </div>
                                       
                                       
                                    </div>
                                    <div className="col-md-3"  >
                                    { <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Purchased Date
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                {purchaseDate != null ? getCustomizedDate(purchaseDate) : "-"}
                                            </div>
                                        </div>}
                                    { <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Warranty Start Date
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                {wstartDate != null ? getCustomizedDate(wstartDate) : "-"}
                                            </div>
                                        </div>}
                                        
                                        { <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Warranty End Date
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                {wendDate != null ? getCustomizedDate(wendDate) : "-"}
                                            </div>
                                        </div>}
                                        <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Current Location  
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}> 
                                             { currentlocation != "" ? currentlocation : "-" } 
                                            </div>
                                        </div>
                                
                                    </div>
                                    <div className="col-md-3"  >
                                    { <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Previous State
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                { prevState != "" ? prevState : "-" }
                                            </div>
                                        </div>}
                                    
                                        

                                        <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Status
                                            <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder", paddingTop: "0px"}}>
                                               <b> <span>
                                               {isStatus === "APPROVED" ? (
                                                <i className="pr-2 fa fa-lock text-primary"></i>
                                                ) : isStatus === "AVAILABLE" ? (
                                                <i className="pr-2 fa fa-check text-success"></i>
                                                ) : (
                                                <i className="pr-2 fa fa-spinner text-warning"></i>
                                                )}
                                                </span></b>
                                                <span> {isStatus === "APPROVED" ? "Allocated" : isStatus === "AVAILABLE" ? "Available" : "Pending"}</span>   
                                            </div>
                                        </div>

                                        <div style={{ display: "block", color: "#999", fontSize: "12px", paddingTop: "10px" }}>Previous Owner
                                       {pEmployee != null ? <div style={{ color: "#55687d", fontSize: "14px", paddingTop: "4px", display: "flex" }}> <EmployeeListColumn id={pEmployee.id} ></EmployeeListColumn>
                                            {pEmployee.name}
                                        </div>:<div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}> {"-"}</div>}
                                    </div>
                                    </div> 
                                    </div>
                            </div> 

                    </div>

                </div> 
            </div>
            
        )
    }
}