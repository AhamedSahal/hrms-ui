/**
 * App Header
 */
import React from 'react';

function Sidebar() {

  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-inner slimscroll">
        <div className="sidebar-menu">
          <ul>
            <li>
              <a href="/app/main/dashboard"><i className="la la-home" /> <span>Back to Home</span></a>
            </li>
            <li className="menu-title">Projects <a href="#" data-toggle="modal" data-target="#create_project"><i className="fa fa-plus" /></a></li>
            <li>
              <a href="/tasks/tasks">Project Management</a>
            </li>
            <li className="active">
              <a href="/tasks/tasks">Hospital Administration</a>
            </li>
            <li>
              <a href="/tasks/tasks">Video Calling App</a>
            </li>
            <li>
              <a href="/tasks/tasks">Office Management</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
