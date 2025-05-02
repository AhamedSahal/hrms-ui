import { Table } from 'antd';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Button, Modal, Anchor } from 'react-bootstrap';
import { BsFillCaretDownFill } from "react-icons/bs";
import { getgoalsViewHistory } from './service';
import { toLocalDateTime } from '../../../../utility';
import { fileDownload } from '../../../../HttpRequest';
//import EmployeeListColumn from '../../../Employee/employeeListColumn';



export default class GoalsStatusViewHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      name: props.goalsViewHistory.name


    };
  }

  componentDidMount() { 
    
    
    this.fetchList()
  }

  fetchList = () => {
    getgoalsViewHistory(this.props.goalsViewHistory.id).then(res => {
        
      if (res.status == "OK") {
        this.setState({ data: res.data })

      }

    });
  }

  getStyle(text) {
    if (text === 'RESCHEDULE') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Rescheduled</span>;
    }
    if (text === 'CANCEL') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Cancel</span>;
    }
    if (text === 'COMPLETED') {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Completed</span>;
    }
    if (text === 'PENDING') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Pending</span>;
    }
    return 'black';
  }



  render() {
    let { data } = this.state;
    return (
      <>
      <div className="col-md-3" style={{ backgroundColor: "#36A1D4", color: "#EEF8FB", borderRadius: "5px", height: "35px", flex: "1", marginRight: "10px" }}>
        
        <p style={{ textAlign: "center", fontWeight: "bold", paddingTop: "5px", margin: 0 }}>{this.state.name}</p>
    
        </div><br/> 
        {data.length > 0 && data.map((res, index) => { 

          return <>
            <div className="col-md-12" style={{ border: "2px solid #E7ECF2", background: "#fff" }}>
              <div className="row">
                <div className="col-md-12" style={{ padding: "0" }}>
                  <button className="collaps-btn" style={{ background: "none" }}>
                    <a
                      className="collapstag"
                      data-bs-toggle="collapse"
                      href={`#data${index}`}
                      role="button"
                      aria-expanded="false"
                      aria-controls="collapseExample"
                    >
                      <div className="row">
                        <div className="col-md-6">
                            
                          <h4 className="collapse-para">Comment {(data.length >= 2 && index == 0) && <span style={{background: "grey",color:"white",borderRadius: "2px", padding: "3px"}}><i className="fa fa-check" />Recent</span>}</h4>
                          
                        </div>
                        <div className="col-md-3">
                          <h4 className="collapse-para">{toLocalDateTime(res.createdOn)}</h4>
                        </div> 
                        <div
                          className="col-md-2"
                          style={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                          }}
                        >
                          <BsFillCaretDownFill
                            size={15}
                            style={{ color: "black" }}
                          />
                        </div>
                      </div>
                    </a>
                  </button>
                </div>
              </div>

              {/* BODY */}
              <div className="collapse" 
               id={`data${index}`}
               style={{ borderTop: "2px solid #E7ECF2" }}>
                <div className="row" >
                  <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>
                    Achievement
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {res.achievement == null ? "-" : res.achievement}

                    </div>
                  </div>
 
                  <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Comments
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {res.comments == null ? "-" : res.comments}
                    </div>
                  </div> 
                  <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Uploaded Attachment
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                    {res.attachFile == null ? "-" : <Anchor style={{color: 'black'}} onClick={() => {
                    fileDownload(res.id, res.subGoalsId, "SUBGOALS_STATUS", res.attachFile);
                    }} title={res.attachFile}>
                        <i style={{color: '#45C56D'}} className='fa fa-download'></i> Download
                    </Anchor>}
                    </div>
                  </div> 
                  </div>
                  <div className="row">
                    <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Updated By
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                        { res.createdBy}
                        </div>
                    </div>
                        <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Updated On
                        <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                        { toLocalDateTime(res.createdOn)}
                        </div>
                    </div>
                </div>
              </div>

            </div>
          </>
         })} 
      </>
    )
  }

}