/**
 * Signin Firebase
 */

 import React, { Component } from 'react';
 import { Helmet } from "react-helmet";
 import {  Avatar_01 ,Avatar_02,Avatar_03 } from "../../../Entryfile/imagepath"

 import { Table } from 'antd';
 import "antd/dist/reset.css";
 import {itemRender,onShowSizeChange} from "../../paginationfunction"
 import "../../antdstyle.css"
 
 class AptituedeResults extends Component {
 
    
   constructor(props) {
      super(props);
      this.state = {
         data : [
           {id:1,image:Avatar_02,name:"John Doe",role:"Web Designer",jobtitle:"Web Designer",department:"Development",totalmark:"1"},
           {id:2,image:Avatar_01,name:"Richard Miles",role:"Web Developer",jobtitle:"Web Developer",department:"Designing",totalmark:"1"},
           {id:3,image:Avatar_03,name:"John Smith",role:"Android Developer",jobtitle:"Android Developer",department:"Android",totalmark:"1"},
           ],          
      };
    }
     render() {
      const{data} = this.state
      const columns = [
        {
          title: '#',
          dataIndex: 'id',
            sorter: (a, b) => a.id.length - b.id.length,
        },
        {
         title: 'Name',
         dataIndex: 'name',
         render: (text, record) => (            
             <h2 className="table-avatar">
               <a href="/app/profile/employee-profile" className="avatar"><img alt="" src={record.image} /></a>
               <a href="/app/profile/employee-profile">{text} <span>{record.role}</span></a>
             </h2>
           ), 
           sorter: (a, b) => a.name.length - b.name.length,
       },
        {
          title: 'Job Title',
          dataIndex: 'jobtitle',
          render: (text, record) => (            
              <a href="/app/administrator/job-details">{text}</a>
            ), 
            sorter: (a, b) => a.jobtitle.length - b.jobtitle.length,
        },
      
        {
          title: 'Department',
          dataIndex: 'department',
          sorter: (a, b) => a.department.length - b.department.length,
        },
        {
          title: 'Category Wise Mark',
          render: (text, record) => (
            <p>html - <b>1</b><br />Level1 - <b>0</b><br /></p>
            ), 
        },
      
        {
          title: 'Total Mark',
          dataIndex: 'totalmark',
          render: (text, record) => (
            <p className="text-center">{text}</p>
            ), 
          sorter: (a, b) => a.totalmark.length - b.totalmark.length,
        },
        {
          title: 'Status',
          render: (text, record) => (
            <div className="dropdown action-label">
               <a className="btn btn-white btn-sm btn-rounded dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">
               <i className="fa fa-dot-circle-o text-danger" /> Action pending								</a>	
               <div className="dropdown-menu dropdown-menu-right">
                  <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-info" /> Resume selected</a>
                  <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-danger" />  Resume Rejected</a>
                  <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-success" />  Aptitude Selected</a>
                  <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-danger" />  Aptitude rejected</a>
                  <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-success" />  video call selected</a>
                  <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-danger" />  Video call rejected</a>
                  <a className="dropdown-item" href="#"><i className="fa fa-dot-circle-o text-success" />  Offered</a>
               </div> 
            </div>
            ), 
        },    
      ]
      
       return ( 
        <>
         {/* Page Wrapper */}
      <div className="page-wrapper">
            <Helmet>
                  <title>Aptitude Result - WorkPlus</title>
                  <meta name="description" content="Login page"/>					
            </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col-12">
                <h3 className="page-title">Aptitude Result</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item">Jobs</li>
                  <li className="breadcrumb-item active">Aptitude Result</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                  <Table className="table-striped"
                     pagination= { {total : data.length,
                        showTotal : (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                        showSizeChanger : true,onShowSizeChange: onShowSizeChange ,itemRender : itemRender } }
                     style = {{overflowX : 'auto'}}
                     columns={columns}                 
                     // bordered
                     dataSource={data}
                     rowKey={record => record.id}
                     onChange={this.handleTableChange}
                  />
              </div>
            </div>
          </div>
        </div>
        {/* /Page Content */}
      </div>
      {/* /Page Wrapper */}
        </>
       );
    }
 }
 
 export default AptituedeResults;
 