import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { getTitle, verifyOrgLevelViewPermission } from '../../utility';
import Role from './Role/index';
import LoginLog from './LoginLog';
import Groups from './Groups';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
export default class AccessSetupLanding extends Component {
   render() {
      return (
         <div style={{ backgroundColor: '#f5f5f5' }} className="page-wrapper">
            <Helmet>
               <title>Access Setup | {getTitle()}</title>
            </Helmet>

            <div className="content container-fluid">


               <div className="mt-4 tab-content">
                  <div className="subMenu_box row user-tabs">
                     <div className="nav-box">
                        <div className="page-headerTab">
                           <h3 style={{ color: 'white' }} className="page-title">Access Setup</h3>
                           <div className="p-0 col-lg-12 col-md-12 col-sm-12 sub-nav-tabs">
                              <ul className="nav nav-items">
                                 <li className="nav-item"><a href="#loginlog" data-toggle="tab" className="nav-link active">Login Log</a></li>
                                 <li className="nav-item"><a href="#role" data-toggle="tab" className="nav-link">Role</a></li>
                                 <li className="nav-item"><a href="#groups" data-toggle="tab" className="nav-link">Groups</a></li>
                              </ul>
                           </div>
                        </div>

                     </div>
                  </div>
                  <div id="loginlog" className="pro-overview tab-pane fade show active">
                     {verifyOrgLevelViewPermission("Settings Access") && 
                     <LoginLog></LoginLog>}
                     {(!verifyOrgLevelViewPermission("Settings Access"))&& <AccessDenied></AccessDenied>}
                  </div>
                  <div id="role" className="pro-overview tab-pane fade">
                  {verifyOrgLevelViewPermission("Settings Access") && 
                     <Role></Role>}
                     {(!verifyOrgLevelViewPermission("Settings Access"))&& <AccessDenied></AccessDenied>}
                  </div>
                  <div id="groups" className="pro-overview tab-pane fade">
                  {verifyOrgLevelViewPermission("Settings Access") && 
                     <Groups></Groups>}
                     {(!verifyOrgLevelViewPermission("Settings Access"))&& <AccessDenied></AccessDenied>}
                  </div>
                  
               </div>
            </div>

         </div>
      )
   }
}