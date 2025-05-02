import { Table } from 'antd';
import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { BsFillCaretDownFill } from "react-icons/bs";
import { get1On1ViewList } from './service';
import { toLocalDateTime } from '../../../../utility';
import EmployeeListColumn from '../../../Employee/employeeListColumn';



export default class EmployeePerformance1on1MeetingView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],


    };
  }

  componentDidMount() {
    // this.setState({viewStatus : this.props.viewStatus || true})
    this.fetchList()
  }

  fetchList = () => {
    get1On1ViewList(this.props.meetingId).then(res => {
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
        <div style={{ justifyContent: 'right',marginBottom: '5px' }} className="row">
          <div className='col-2 btn-group btn-group-sm'>
            <Button className="btn apply-button btn-primary" onClick={() => {
              this.props.updateView()
            }}><i className="fa fa-arrow-left" /> Back</Button>
          </div>
        </div>
        <div  style={{ border: "2px solid #E7ECF2", background: "#fff", padding: "10px", borderRadius: "10px" }} >
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
                        <div className="col-md-3">
                          <h4 className="collapse-para">{res.meetingType == 0 ? "In-person" : res.meetingType == 1 ? "MS Teams" : res.meetingType == 2 ? "Zoom" : res.other} {(data.length >= 2 && index == 0) && <span style={{background: "#666666",color:"#ccccff",borderRadius: "4px", padding: "3px"}}>Recent</span>}</h4>
                          
                        </div>
                        <div className="col-md-3">
                          <h4 className="collapse-para">{toLocalDateTime(res.dateAndTime)}</h4>
                        </div>
                        <div className="col-md-3">
                          <h4 className="collapse-para">{this.getStyle(res.status)}</h4>
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
              <div className="collapse" id={`data${index}`} style={{ borderTop: "2px solid #E7ECF2" }}>
                <div className="row" >
                  <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>
                    Employee
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {res.employeeName == null ? "-" : res.employeeName}
                      {/* <EmployeeListColumn id={res.employeeId} name={res.employeeName}  ></EmployeeListColumn> */}

                    </div>
                  </div>

                  {/* reviewer */}
                  <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Reviewer
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {res.reviewerName == null ? "-" : res.reviewerName}
                      {/* <EmployeeListColumn id={res.reviewerId} name={res.reviewerName}  ></EmployeeListColumn> */}

                    </div>


                  </div>
                  <div className="col-md-4"></div>
                  {/* Current Performance level */}
                  <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Current Performance level
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {res.currentPerformanceLevel == 0 ? "Needs Improvement" : res.currentPerformanceLevel == 1 ? "Upto Par" : res.currentPerformanceLevel == 2 ? "OutStanding" : "-"}

                    </div>


                  </div>
                  {/* Reviewer Comment */}
                 <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Reviewer Comment
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {res.reviewerComment == null ? "-" : res.reviewerComment}

                    </div>


                  </div>

                  {/* Hidden Comments */}
                  {this.props.viewStatus &&  <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Hidden Comments
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {res.hiddenComments == null ? "-" : res.hiddenComments}

                    </div>


                  </div>}

                  {/* Employee Comments */}
                  <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Employee Comments
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {res.employeeComment == null ? "-" : res.employeeComment}

                    </div>


                  </div>

                  {/* date */}

                {res.status != "PENDING"  && <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>
                  {res.status == "RESCHEDULE"?"Re-scheduled on":res.status == "CANCEL"?"Canceled on":res.status == "COMPLETED"?"Completed on":"-"}
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {res.modifiedOn == null ? "-" : toLocalDateTime(res.modifiedOn)}

                    </div>


                  </div>}


                </div>
              </div>

            </div>
          </>
        })}
        </div>
      </>
    )
  }

}