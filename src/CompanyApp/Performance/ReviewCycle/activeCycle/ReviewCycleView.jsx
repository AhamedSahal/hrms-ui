import React, { Component } from 'react';
export default class ReviewCycleView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.selectedData || {
        id: 0,
      },
      ReviewCycleId: props.selectedId || 0

    }

  };

  render() {
    const { data, ReviewCycleId } = this.state;

    return (
      <div className="card" >
        <div className="card-body">

          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-10">
                  <p style={{ fontSize: "24px", lineHeight: "1.5", color: "#55687d" }}>  {data.cyclename != "" ? data.cyclename : "-"} </p>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div
                    className="row"
                    style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
                  >
                    <div className="col-md-10">
                      <h4>Cycle details</h4>
                    </div>

                  </div>
                </div>
                <div className="col-md-3">
                  <div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Description
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder", paddingTop: "0px" }}>
                      {data.description != "" ? data.description : "-"}
                    </div>
                  </div></div> <div className="col-md-3">
                  <div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Applicable For
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder", paddingTop: "0px" }}>
                      {data.assign != "" ? data.assign : "-"}
                    </div>
                  </div></div>
                {/* <div className="col-md-3"> 
                                            <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Serial Number
                                                <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder", paddingTop: "0px" }}>
                                                    { serialno != "" ? serialno : "-" } 
                                                </div>
                                            </div></div>
                                             <div className="col-md-3"> 
                                            <div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Model Number
                                                <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                    { modelNo != "" ? modelNo : "-" }
                                                </div>
                                            </div></div>
                                             <div className="col-md-3"> 
                                            <div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>IMEI Number
                                                <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                    { imeiNo != "" ? imeiNo : "-" }
                                                </div>
                                            </div>
                                           
                                            
                                      </div>  */}
              </div>
              <div className='row'>
                {/* </div> */}
                <div className="col-md-12">
                  <div
                    className="row"
                    style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
                  >
                    <div className="col-md-10">
                      <h4>Compose Score</h4>
                    </div>

                  </div>
                </div>
                <div className="col-md-3"  >
                  <div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Performance Factors
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder", paddingTop: "0px" }}>
                      
                        <div style={{ display: "grid", rowGap: "4px" }}>
                          {Object.entries(data.performanceScore || {}).map(([key, value]) => (
                            <div key={key} style={{ display: "grid", gridTemplateColumns: "150px 10px auto" }}>
                              <div style={{ color: "#333" }}>{key}</div>
                              <div style={{ textAlign: "center" }}>:</div>
                              <div>{value}</div>
                            </div>
                          ))}
                        </div>

                    </div>
                  </div></div>



              </div>
              {/* <div className='row'>
                <div className="col-md-12">
                  <div
                    className="row"
                    style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
                  >
                    <div className="col-md-10">
                      <h4>Templatize</h4>
                    </div>

                  </div>
                </div>
                <div className="col-md-3"  >
                  {<div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Cycle rating Scale
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {purchaseDate != null ? getCustomizedDate(purchaseDate) : "-"} 5 points scale
                    </div>
                  </div>}</div> <div className="col-md-3">
                  {<div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Templates based on
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {wstartDate != null ? getCustomizedDate(wstartDate) : "-"}Everyone
                    </div>
                  </div>}</div> <div className="col-md-3">

                  { <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Warranty End Date
                                                <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>
                                                  {wendDate != null ? getCustomizedDate(wendDate) : "-"} 
                                                </div>
                                            </div>}</div> <div className="col-md-3"> 
                                            <div style={{    color: "#999", fontSize: "14px", paddingTop: "10px" }}>Current Location  
                                                <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}> 
                                                  { currentlocation != "" ? currentlocation : "-" } 
                                                </div>
                                            </div>

                </div>
              </div> */}
              <div className='row'>
                <div className="col-md-12">
                  <div
                    className="row"
                    style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
                  >
                    <div className="col-md-10">
                      <h4>Participants</h4>
                    </div>

                  </div>
                </div>
                {/* <div className="col-md-12"  style={{   display: "flex", color: "#999", fontSize: "14px", paddingTop: "10px" }}>Reviewers
                                        <div className="col-md-3"  >
                                        { 
                                                <div>Level 1
                                                   <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}>Employee</div>
                                                </div>} </div>
                                               <div className="col-md-3" >{ <div>Level 2
                                                  <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}> Immediate Manager</div>
                                                </div>} </div>
                                                <div className="col-md-3"  >{<div >Level 3
                                                   <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}> Second Level</div>
                                                </div>}</div>
                                               <div className="col-md-3"  >{ <div>Level 4
                                                  <div style={{ color: "#55687d", fontSize: "14px",fontWeight:"bolder" }}> HR</div>
                                                </div>}</div>
                                          
                                         </div> */}
                <div className="col-md-12" style={{ paddingTop: "10px" }}>
                  <div style={{ color: "#999", fontSize: "14px", marginBottom: "10px" }}>Reviewers</div>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <div className="col-md-3"  >
                      <div style={{ color: "#999", fontSize: "14px" }}>Level 1</div>
                      <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>{data.reviewer1? ((data.reviewer1=="1"?"Employee Self evaluation":(data.reviewer1=="2"?"Immediate manager":(data.reviewer1=="3"?"Second level reporting manager":(data.reviewer1=="4"?"Third level reporting manager":(data.reviewer1=="5"? data.roleName :"-")))))):"-"}</div>
                    </div>
                    <div className="col-md-3" >
                      <div style={{ color: "#999", fontSize: "14px" }}>Level 2</div>
                      <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>{data.reviewer2? ((data.reviewer2=="1"?"Employee Self evaluation":(data.reviewer2=="2"?"Immediate manager":(data.reviewer2=="3"?"Second level reporting manager":(data.reviewer2=="4"?"Third level reporting manager":(data.reviewer2=="5"? data.roleName :"-")))))):"-"}</div>
                    </div>
                    <div className="col-md-3" >
                      <div style={{ color: "#999", fontSize: "14px" }}>Level 3</div>
                      <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>{data.reviewer3? ((data.reviewer3=="1"?"Employee Self evaluation":(data.reviewer3=="2"?"Immediate manager":(data.reviewer3=="3"?"Second level reporting manager":(data.reviewer3=="4"?"Third level reporting manager":(data.reviewer3=="5"? data.roleName :"-")))))):"-"}</div>
                    </div>
                    <div className="col-md-3" >
                      <div style={{ color: "#999", fontSize: "14px" }}>Level 4</div>
                      <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>{data.reviewer4? ((data.reviewer4=="1"?"Employee Self evaluation":(data.reviewer4=="2"?"Immediate manager":(data.reviewer4=="3"?"Second level reporting manager":(data.reviewer4=="4"?"Third level reporting manager":(data.reviewer4=="5"? data.roleName :"-")))))):"-"}</div>
                    </div>
                    <div className="col-md-3" >
                      <div style={{ color: "#999", fontSize: "14px" }}>Level 5</div>
                      <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>{data.reviewer5? ((data.reviewer5=="1"?"Employee Self evaluation":(data.reviewer5=="2"?"Immediate manager":(data.reviewer5=="3"?"Second level reporting manager":(data.reviewer5=="4"?"Third level reporting manager":(data.reviewer5=="5"? data.roleName :"-")))))):"-"}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className="col-md-12">
                  <div
                    className="row"
                    style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
                  >
                    <div className="col-md-10">
                      <h4>Timelines</h4>
                    </div>

                  </div>
                </div>
                <div className="col-md-3"  >
                  {<div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Instance  Name
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {data.instanceName}
                    </div>
                  </div>}</div> <div className="col-md-3">
                  {<div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Start Date
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {data.cycleStartDate}
                    </div>
                  </div>}</div>
                <div className="col-md-3">
                  {<div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>End Date
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                     {data.cycleEndDate}
                    </div>
                  </div>}</div>

              </div>
              <div className='row'>
                <div className="col-md-12">
                  <div
                    className="row"
                    style={{ padding: "10px 0 10px 0", background: "#F7F9FA" }}
                  >
                    <div className="col-md-10">
                      <h4>Repetitions</h4>
                    </div>

                  </div>
                </div>
                <div className="col-md-3"  >
                  {<div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Frequency
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {data.frequencyType}
                    </div>
                  </div>}</div> <div className="col-md-3">
                  {<div style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Recurrences
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {data.recurrence}
                    </div>
                  </div>}</div>

              </div>
            </div>

          </div>

        </div>

      </div>

    )
  }
}