
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {Avatar_19,Avatar_21} from "../../../Entryfile/imagepath"

class UserReport extends Component {
  
   render() {
    
      return ( 
        <>
          {/* Page Wrapper */}
          <div className="page-wrapper">
            <Helmet>
                <title>User Reports - WorkPlus</title>
                <meta name="description" content="Login page"/>					
            </Helmet>
            {/* Page Content */}
            <div className="content container-fluid">
              {/* Page Header */}
              <div className="page-header">
                <div className="row">
                  <div className="col-sm-12">
                    <h3 className="page-title">User Report</h3>
                    <ul className="breadcrumb">
                      <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                      <li className="breadcrumb-item active">User Reports</li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* /Page Header */}
              {/* Content Starts */}
              {/* Search Filter */}
              <div className="row filter-row">
                <div className="col-sm-6 col-md-3">  
                  <div className="form-group form-focus">
                    <div className="cal-icon">
                      <select className="form-control floating select">
                        <option>
                          Name1
                        </option>
                        <option>
                          Name2
                        </option>
                      </select>
                    </div>
                    <label className="focus-label">User Role</label>
                  </div>
                </div>
                <div className="col-sm-6 col-md-3">  
                  <a href="#" className="btn btn-success btn-block"> Search </a>  
                </div>     
              </div>
              {/* /Search Filter */}
              <div className="row">
                <div className="col-md-12">
                  <div className="table-responsive">
                    <table className="table table-striped custom-table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Company</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Designation</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>
                            <h2 className="table-avatar">
                              <a href="/app/profile/employee-profile" className="avatar"><img src={Avatar_19} /></a>
                              <a href="/app/profile/employee-profile">Barry Cuda <span>Global Technologies</span></a>
                            </h2>
                          </td>
                          <td>Global Technologies</td>
                          <td>barrycuda@example.com</td>
                          <td>
                            <span className="badge bg-inverse-info">Client</span>
                          </td>
                          <td>CEO</td>
                          <td>
                            <div className="dropdown action-label">
                              <a href="#" className="btn btn-white btn-sm btn-rounded"><i className="fa fa-dot-circle-o text-success" /> Active </a>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>
                            <h2 className="table-avatar">
                              <a href="/app/profile/employee-profile" className="avatar"><img src={Avatar_21} /></a>
                              <a href="/app/profile/employee-profile">Daniel Porter <span>Admin</span></a>
                            </h2>
                          </td>
                          <td>Focus Technologies</td>
                          <td>danielporter@example.com</td>
                          <td>
                            <span className="badge bg-inverse-danger">Admin</span>
                          </td>
                          <td>Admin Manager</td>
                          <td>
                            <div className="dropdown action-label">
                              <a href="#" className="btn btn-white btn-sm btn-rounded"><i className="fa fa-dot-circle-o text-success" /> Active </a>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* /Content End */}
            </div>
            {/* /Page Content */}
          </div>
          {/* /Page Wrapper */}
        </>
      );
   }
}

export default UserReport;
