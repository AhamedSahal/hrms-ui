import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Button, Modal, Anchor } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { getRecognitionList } from '../RecognitionMain/service';
import EmployeeListColumn from '../Employee/employeeListColumn';
import { getReadableDate, getDefaultProfilePicture,getUserType, verifyOrgLevelViewPermission } from '../../utility';
import { CONSTANT } from '../../constant';
import "./recstyle.css";
import EmployeePhoto from '../Employee/employeePhoto';
import { height } from '@mui/system';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
import RecognitionProfilePhoto from '../Employee/recognitionProfile';
import { Pagination } from 'antd';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class RecognitionMainList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      employeeId: 0,
      data: [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      employee: []
    };
  }

  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    if(verifyOrgLevelViewPermission("Engage Recognition")){ 
    getRecognitionList(this.state.q, this.state.page, this.state.size, this.state.sort, 0, 0).then(res => {

      if (res.status == "OK") {
        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
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
    const { data, totalPages, totalRecords, currentPage, size, employee } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    return (
      <div className="m-0 page-containerDocList content container-fluid">
        <div className="tablePage-header">
          {verifyOrgLevelViewPermission("Engage Recognition") && <>
            <div className="pt-4 row staff-grid-row">
              {data && data.map((e, i) => {
                return <div className="recognitionWrap" style={{height: "auto",padding: "20px"}}>
                  <div className="recognitionTopp" style={{height: "auto"}}>
                    <div className="recognitionPicc"  style={{height: "auto"}}>
                      <div className='pt-2 mb-0'>
                        <a className='' href="#">
                          
                          <RecognitionProfilePhoto className='' id={e.employeeId} name={e.awardee?.name} employeeId={e.employeeId} ></RecognitionProfilePhoto>
                        </a>
                      </div>
                     
                        
                        {/* <img alt={e.awardee.name} src={e.profilePicture ? `data:image/jpeg;base64,${e.profilePicture}` : CONSTANT.userImage} class="center"/></a>*/}
                     
                      <div className="row"><p className='mb-0' style={{ width: "300px", height: "36px", paddingLeft: "2px", color: "#727272", fontFamily: 'Verdana', textAlign: "Center", fontSize: "18px" }}>{e.awardee?.name}</p> </div>
                      <div className="row">
                        <div className="col-md-3"><hr className="hrr"></hr></div>
                        <div className="col-md-6" id="recognition-text-center"><span className="text-ellipsis" title={e.recognitionSetup?.name}>{e.recognitionSetup?.name}</span><i className="fa fa-thumbs-up" id="recognit-img" style={{ color: "#727272" }} aria-hidden="true"></i></div>
                        <div className="col-md-3"><hr className="hrr"></hr></div>
                      </div>
                    </div>

                    <div className="row"><div className="col-md-12" style={{ textAlign: "Left", color: "#727272", fontFamily: 'Verdana', paddingTop: "10px", fontSize: "12px" }}><label>Recognition for</label><br /><h5 style={{ color: "#3A3A3A", fontFamily: 'Verdana' }}>{e.reccommentss}</h5></div></div>
                    <div className="row">
                      <div className="col-md-6" style={{ textAlign: "Left", color: "#727272", fontFamily: 'Verdana', paddingTop: "20px", fontSize: "12px" }}><label>Recognized by</label>

                        <div className="row"><div>
                          {e.recognizer?.id != 0? <EmployeeListColumn 
                            id={e.recognizer?.id}></EmployeeListColumn>:<div style={{paddingTop: "15px"}}><br /><br /><span></span></div>
                            // <a href="#"><img    alt={e.recognizer?.name} src={ getDefaultProfilePicture()}  style={{height: "54px",width: "54px"}}/></a> 
                            }
                          {/* <a href="#"><img    alt={e.recognizer?.name} src={e.RecprofileImg ? `data:image/jpeg;base64,${e.RecprofileImg}` :  getDefaultProfilePicture()} /></a> */}

                          <h6 style={{ color: "#3A3A3A", fontFamily: 'Verdana', width: "auto", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={e.recognizer?.name}> {e.recognizer?.id != 0?e.recognizer?.name:"Admin"}</h6>
                        </div></div></div>
                      <div className="col-md-6" style={{ textAlign: "left", fontFamily: 'Verdana', paddingTop: "20px", fontSize: "12px" }}><label style={{ color: "#727272" }}>Date</label><h6 style={{ color: "#3A3A3A", fontFamily: 'Verdana', paddingTop: "10px" }}>{getReadableDate(e.createdOn)}</h6></div>

                      <hr style={{ width: "80%" }}></hr></div>
                  </div>
                </div>
              })}


            </div>
            <ul style={{placeItems: 'center'}} className="p-1 ant-pagination ant-table-pagination ">
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

