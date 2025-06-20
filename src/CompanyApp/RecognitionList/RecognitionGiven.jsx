import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Button, Modal, Anchor } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { getRecognitionList } from '../RecognitionMain/service';
import EmployeeListColumn from '../Employee/employeeListColumn';
import { getReadableDate, getDefaultProfilePicture, verifyOrgLevelViewPermission } from '../../utility';
import { CONSTANT } from '../../constant';
import EmployeePhoto from '../Employee/employeePhoto';
import "./recstyle.css";
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
import { Empty, Pagination } from 'antd';
import 'antd/dist/reset.css';

export default class RecognitionGiven extends Component {
  constructor(props) {
    super(props)
    this.state = {
      employeeId: 0,
      data: [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalRecords: 0,
      currentPage: 1,
    };
  }

  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    if (verifyOrgLevelViewPermission("Engage Recognition")) {
      getRecognitionList(this.state.q, this.state.page, this.state.size, this.state.sort, 0, 1).then(res => {

        if (res.status == "OK") {
          console.log("res.data.list", res.data.list)
          this.setState({
            data: res.data.list,
            totalRecords: res.data.totalRecords,
            currentPage: res.data.currentPage + 1
          })
        }
      })
    }
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

  pageSizeChange = (currentPage, pageSize) => {
    this.setState({
      size: pageSize,
      page: 0
    }, () => {
      this.fetchList();
    })

  }

  render() {
    const { data, totalRecords, currentPage, size } = this.state; // Removed unused variables

    let endRange = ((currentPage) * size);
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    return (
      <div className="m-0 page-containerDocList content container-fluid">
        <div className="tablePage-header">

          {verifyOrgLevelViewPermission("Engage Recognition") && <>
            <div className="pt-4 row staff-grid-row">
              {data.length ? data.map((e, i) => {
                return <div className="recognitionWrap" key={i}>
                  <div className="recognitionTopp">
                    <div className="recognitionPicc">
                      <div className="profile-images">
                        <a href="#">
                          <EmployeePhoto id={e.awardee?.id} alt={e.awardee?.name}></EmployeePhoto>
                        </a>
                      </div>
                      <div className="row">
                        <p style={{ width: "300px", height: "36px", paddingTop: "10px", paddingLeft: "2px", color: "#727272", fontFamily: 'Verdana', textAlign: "Center", fontSize: "18px" }}>{e.awardee?.name}</p>
                      </div>
                      <div className="row">
                        <div className="col-md-3"><hr className="hrr"></hr></div>
                        <div className="col-md-6" id="recognition-text-center">
                          <span className="text-ellipsiss" title={e.recognitionSetup?.name}>{e.recognitionSetup?.name}</span>
                          <i className="fa fa-thumbs-up" id="recognit-img" style={{ color: "#727272" }} aria-hidden="true"></i>
                        </div>
                        <div className="col-md-3"><hr className="hrr"></hr></div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12" style={{ textAlign: "Left", color: "#727272", fontFamily: 'Verdana', paddingTop: "10px", fontSize: "12px" }}>
                        <label>Recognition for</label><br />
                        <h5 style={{ color: "#3A3A3A", fontFamily: 'Verdana' }}>{e.reccommentss}</h5>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6" style={{ textAlign: "Left", color: "#727272", fontFamily: 'Verdana', paddingTop: "20px", fontSize: "12px" }}>
                        <label>Recognized by</label>
                        <div className="row">
                          <div>
                            <EmployeeListColumn id={e.recognizer?.id}></EmployeeListColumn>
                            <h6 style={{ color: "#3A3A3A", fontFamily: 'Verdana', width: "auto", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={e.recognizer?.name}>{e.recognizer?.name}</h6>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6" style={{ textAlign: "left", fontFamily: 'Verdana', paddingTop: "20px", fontSize: "12px" }}>
                        <label style={{ color: "#727272" }}>Date</label>
                        <h6 style={{ color: "#3A3A3A", fontFamily: 'Verdana', paddingTop: "10px" }}>{getReadableDate(e.createdOn)}</h6>
                      </div>
                      <hr style={{ width: "80%" }}></hr>
                    </div>
                  </div>
                </div>
              }) : <div> <Empty/> </div>}
            </div>

            <ul  className="p-1 ant-pagination ant-table-pagination ">
              <Pagination
                current={currentPage}
                total={totalRecords}
                pageSize={size}
                onChange={(page, pageSize) => {
                  this.setState({
                    page: page - 1,
                    size: pageSize
                  }, () => {
                    this.fetchList();
                  });
                }}
                showSizeChanger
                onShowSizeChange={(current, size) => {
                  this.pageSizeChange(current, size);
                }}
                showTotal={(total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`}
              />
            </ul>
          </>}

          {!verifyOrgLevelViewPermission("Engage Recognition") && <AccessDenied></AccessDenied>}
        </div>
      </div>
    );
  }
}

