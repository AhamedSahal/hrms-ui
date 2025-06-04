import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { Helmet } from 'react-helmet'; 
import {  getRecognitionList } from '../RecognitionMain/service';
import EmployeeListColumn from '../Employee/employeeListColumn'; 
import { getReadableDate,getDefaultProfilePicture, verifyOrgLevelViewPermission} from '../../utility';
import { CONSTANT } from '../../constant';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
import { Empty } from 'antd';


export default class RecognitionReceive extends Component {
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
            getRecognitionList(this.state.q, this.state.page, this.state.size, this.state.sort,1,0).then(res => {
    
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
            sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort}, () => {
            this.fetchList();
        })
        }
           
        pageSizeChange = (currentPage, pageSize) => {
        this.setState({
            size: pageSize,
            page: 0}, () => {
            this.fetchList();
        })
    
        }
            
        render() {
            const { data, totalPages, totalRecords, currentPage, size,employee } = this.state
            let startRange = ((currentPage - 1) * size) + 1;
            let endRange = ((currentPage) * (size + 1)) - 1;
            if (endRange > totalRecords) {
              endRange = totalRecords;
            }
              return ( 
                <div className="m-0 page-containerDocList content container-fluid">
                <div className="tablePage-header">
    
                  {verifyOrgLevelViewPermission("Engage Recognition") &&    <>
                      <div className="pt-4 row staff-grid-row">
                        {data.length ? data.map((e, i) => {
                          return <div className="col-md-6 col-sm-5 col-12 col-lg-5 col-xl-6">
                            <div className="profile-widgets">
                            <div className="col-md-12" style={{textAlign : "Right"}}><h2 style={{textAlign : "right",fontFamily: 'Verdana',fontWeight:"bold",color : "#3A3A3A",fontSize: "12px",paddingRight: "25px"}}><b>
                                {/* <img class="img-responsive recognition-category-image" src="../assets/img/img_great_work.png"/> */}
                                {e.recognitionSetup?.name}&nbsp;&nbsp;&nbsp;<i className="fa fa-thumbs-up"  style={{color:"#727272",fontSize:"14px"}} aria-hidden="true"></i></b></h2></div>
                            {/*                               
                              <h4 className="user-name m-t-10 mb-0 text-ellipsis"> {e.recognitionSetup?.name}</h4> */}
                              <div className="row"><div className="col-md-12" style={{textAlign : "Left",color: "#727272",fontFamily: 'Verdana'}}><label>Recognition for</label><br/><h5 style={{ color:"#3A3A3A",fontFamily: 'Verdana'}}>{e.reccommentss}</h5></div></div>
                              <div className="row"><div className="col-md-6" style={{textAlign : "Left",color: "#727272",fontFamily: 'Verdana'}}><label>Recognized by</label>
                               
                              <div className="row"><div>
                                  <EmployeeListColumn
                                    id={e.recognizer?.id}   ></EmployeeListColumn>
                                  {/* <a href="#"><img    alt={e.recognizer?.name} src={e.RecprofileImg ? `data:image/jpeg;base64,${e.RecprofileImg}` :  getDefaultProfilePicture()} /></a> */}
                                 
                                 <h6 style={{ color:"#3A3A3A",fontFamily: 'Verdana',width: "auto",overflow: "hidden",textOverflow: "ellipsis",whiteSpace: "nowrap"}} title={e.recognizer?.name}> {e.recognizer?.name}</h6> 
                                 </div></div></div>
                              <div className="col-md-6" style={{textAlign:"left",paddingLeft:"80px",fontFamily: 'Verdana'}}><label style={{color: "#727272"}}>Date</label><h6 style={{color:"#3A3A3A",fontFamily: 'Verdana'}}>{getReadableDate(e.createdOn)}</h6></div></div>
                              <hr></hr>
                            </div>
                          </div>
                        }) : <div> <Empty/> </div>}
    
    
                      </div>
                       
                    </>}
                      {!verifyOrgLevelViewPermission("Engage Recognition") && <AccessDenied></AccessDenied>}
                    </div>
                </div>
              );
        }
    } 
 
