import React, { Component } from "react";
import { Table } from "antd";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { itemRender } from "../../../paginationfunction";
import { toast } from "react-toastify";
import { BsLink45Deg } from "react-icons/bs";
import { getUserType, getEmployeeId } from "../../../utility";
import EmployeeListColumn from "../employeeListColumn";
import { getMultiApprovalLeaveList } from "./service";

const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class LeaveViewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leave: props.leave || {},
      data: [],
      showForm: false,
      job: [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
    }
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    getMultiApprovalLeaveList(this.state.leave.id).then(res => {
      if (res.status == "OK") {
        this.setState({
          data: res.data
        })
      }
    })
  }

  onTableDataChange = (d, filter, sorter) => {
    this.setState(
      {
        page: d.current - 1,
        size: d.pageSize,
        sort: sorter && sorter.field ? `${sorter.field},${sorter.order == "ascend" ? "asc" : "desc"}` : this.state.sort,
      },
      () => {
        this.fetchList();
      }
    );
  };

  hideForm = () => {
    this.setState({
      showForm: false
    })
    this.props.redirectToList();
    // window.location.reload();
  }

  getStyle(text) {
    if (text === 'REQUESTED') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Requested</span>;
    }
    if (text === 'CANCELED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Canceled</span>;
    }
    if (text === 'APPROVED') {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Approved</span>;
    }
    if (text === 'REJECTED') {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Rejected</span>;
    }
    if (text === 'PENDING') {
      return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Pending</span>;
    }
    return 'black';
  }

  pageSizeChange = (currentPage, pageSize) => {
    this.setState(
      {
        size: pageSize,
        page: 0,
      },
      () => {
        this.fetchList();
      }
    );
  };

  getLeaveDaytype = (type) => {
    if(type ==2) return "FH";
   else if(type ==3) return "SH";
   return "";

}

  render() {
    const { data, totalPages, totalRecords, currentPage, size, leave } = this.state;
    let startRange = (currentPage - 1) * size + 1;
    let endRange = currentPage * (size + 1) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }


    return (
      <div>
        <div className="row" style={{ paddingLeft: "17px" }}>
          <div className="col-md-12">
            <div className="row" style={{ border: "2px solid #E7ECF2" , padding: "5px"}}>
             
              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>
                {<div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  <EmployeeListColumn id={leave.employee.id} ></EmployeeListColumn>{leave.employee.name}

                </div>}
              </div>
              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Leave Type
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {leave.leaveType.name}
                </div>
              </div>
              <div className="col-md-4" style={{ padding: "15px" }}>
              
              </div>

              

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Start Date
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {moment(leave.startDate).format("ll")} {this.getLeaveDaytype(leave.startDateDayType)}
                </div>
              </div>

            

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>End Date
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {moment(leave.endDate).format("ll")} {this.getLeaveDaytype(leave.endDateDayType)}
                </div>
              </div>


              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Total Leave Days
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {leave.totalDays}
                </div>
              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Reason
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {leave.leaveReason}
                </div>
              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Status
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                  {this.getStyle(leave.status)}
                </div>
              </div>

              <div className="col-md-4" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Approval Status
                <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                {leave.status == "APPROVED"?<span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Approved</span> :leave.status == "REJECTED"? <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Rejected</span>:<span className='p-1 badge bg-inverse-warning' style={{whiteSpace: "pre-wrap"}}><i className="pr-2 fa fa-hourglass-o text-warning"></i>Waiting for approval level {leave.multiApprovalStatus}</span>}
                </div>
              </div>


             

            </div>
          </div>
        </div>
        <br />

        {/* body */}
        <div style={{ backgroundColor: '#f5f5f5', padding: "30px" }} className="page-wrapper">
          {data.length > 0 ? data.map((res, index) => {

            return <div className="row" style={{ border: "10px solid #E7ECF2" }}>
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-12" style={{ padding: "5px" }}>
                    <h4> Approver <span> {index + 1}</span> </h4></div>
                 

                  <div className="col-md-3" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Approver
                    {<div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                    {res.remark == "Moved to next level" || res.remark == "Auto approved"? res.remark: res.employee != null ?<span> <EmployeeListColumn id={res.employee?.id} ></EmployeeListColumn> {res.employee.name}</span>:leave.status == "APPROVED" || leave.status == "REJECTED"?"Admin":"-"}

                    </div>}
                  </div>

                  <div className="col-md-3" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}> {res.remark == "Rejected"?"Rejected Date":"Approved Date"}
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {moment(res.approvedDate).format("ll")}
                    </div>
                  </div>


                  <div className="col-md-3" style={{ color: "#999", fontSize: "14px", paddingTop: "10px" }}>Remark
                    <div style={{ color: "#55687d", fontSize: "14px", fontWeight: "bolder" }}>
                      {res.remark && res.remark != "Moved to next level" && res.remark != "Auto approved" && res.remark != "Rejected" ? res.remark : res.remark == "Rejected" ? leave.remark : "-"}
                    </div>
                  </div>

                </div>



              </div>

            </div>
          }) : null}
        </div>

      </div>
    )
  }
}