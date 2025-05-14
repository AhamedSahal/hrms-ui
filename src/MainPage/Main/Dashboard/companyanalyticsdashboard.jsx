import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import {  getPrimaryGradientColor, getPrimaryColor, getReadableDate, verifyOrgLevelViewPermission } from '../../../utility';

import "../../index.css"
import { getCompanyAdminDashboardDetail } from './service.jsx';
import AccessDenied from './AccessDenied.jsx';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';

function CompanyAnalyticsDashboard() {
  
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = () => {
    getCompanyAdminDashboardDetail().then(res => {
      setDashboardData(res.data);
    });
  };

  const getdepartmentdata = () => {
    let departmentdata = [];
    if (dashboardData.employeeCountByDepartment) {
      departmentdata = dashboardData.employeeCountByDepartment.map(item => {
        return {
          Department: item.valuey, "Total Employees": item.valuex
        }
      })
    }
    return departmentdata;
  };

  const getGenderdata = () => {
    let genderdata = [];
    if (dashboardData.employeeCountByDepartment) {
      genderdata = dashboardData.employeeCountByGender.map(item => {
        return {
          Gender: item.valuey, "Total Employees": item.valuex
        }
      })
    }
    return genderdata;
  };

  const getNationalitydata = () => {
    let nationalitydata = [];
    if (dashboardData.employeeCountByDepartment) {
      nationalitydata = dashboardData.employeeCountByNationality.map(item => {
        return {
          Nationality: item.valuey, "Total Employees": item.valuex
        }
      })
    }
    return nationalitydata;
  };

  const getCountByMonthdata = () => {
    let countByMonthdata = [];
    if (dashboardData.employeeCountByDepartment) {
      countByMonthdata = dashboardData.employeeCountByMonth.map(item => {
        return {
          Month: item.valuey, "Total Employees": item.valuex
        }
      })
    }
    return countByMonthdata;
  };

  useEffect(() => {
    let firstload = localStorage.getItem("firstload")
    if (firstload === "true") {
      setTimeout(function () {
        window.location.reload(1)
        localStorage.removeItem("firstload")
      }, 1000)
    }
  }, []);

  return (
    <div className="insidePageDiv">
      <Helmet>
        <title>Analytics Dashboard</title>
        <meta name="description" content="Dashboard" />
      </Helmet>
      {/* Page Content */}
      <div className="page-containerDocList content container-fluid">
        <div className="tablePage-header">
          <div className="row pageTitle-section">
            <div className="col-sm-6">
              <h3 className="tablePage-title">Analytics Dashboard</h3>
              <ul hidden className="breadcrumb">
                <li className="breadcrumb-item active"></li>
              </ul>
            </div>
          </div>
        </div>
        {(verifyOrgLevelViewPermission("Analytics Report")) && <>
          <div className="tab-content pt-0">
            <div className="tab-pane active" id="step1">
              {/* /Page Header */}
              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                  <div className="card dash-widget">
                    <div className="card-body">
                      <span className="dash-widget-icon"><i className="fa fa-building" /></span>
                      <div className="dash-widget-info">
                        <h3>{dashboardData.topCounts?.Branches || 0}</h3>
                        <span>Locations</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                  <div className="card dash-widget">
                    <div className="card-body">
                      <span className="dash-widget-icon"><i className="fa fa-cubes" /></span>
                      <div className="dash-widget-info">
                        <h3>{dashboardData.topCounts?.Departments || 0}</h3>
                        <span>Departments</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                  <div className="card dash-widget">
                    <div className="card-body">
                      <span className="dash-widget-icon"><i className="fa fa-diamond" /></span>
                      <div className="dash-widget-info">
                        <h3>{dashboardData.topCounts?.JobTitles || 0}</h3>
                        <span>Job Titles</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
                  <div className="card dash-widget">
                    <div className="card-body">
                      <span className="dash-widget-icon"><i className="fa fa-user" /></span>
                      <div className="dash-widget-info">
                        <h3>{dashboardData.topCounts?.Employees || 0}</h3>
                        <span>Employees</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 text-center">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Employees by Division</h3>
                      {/* <div id="bar-charts" /> */}
                      <ResponsiveContainer width='100%' height={300}>
                        <BarChart
                          data={getdepartmentdata()}
                          margin={{
                            top: 5, right: 5, left: 5, bottom: 5,
                          }}
                        >
                          <CartesianGrid />
                          <XAxis dataKey="Department" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Total Employees" fill={getPrimaryColor()} />
                        </BarChart>
                      </ResponsiveContainer>

                    </div>
                  </div>
                </div>
                <div className="col-md-6 text-center">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Employees by Gender</h3>
                      {/* <div id="bar-charts" /> */}
                      <ResponsiveContainer width='100%' height={300}>
                        <BarChart
                          data={getGenderdata()}
                          margin={{
                            top: 5, right: 5, left: 5, bottom: 5,
                          }}
                        >
                          <CartesianGrid />
                          <XAxis dataKey="Gender" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Total Employees" fill={getPrimaryGradientColor()} />
                        </BarChart>
                      </ResponsiveContainer>

                    </div>
                  </div>
                </div>

                <div className="col-md-6 text-center">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Employees by Joining Month</h3>
                      {/* <div id="bar-charts" /> */}
                      <ResponsiveContainer width='100%' height={300}>
                        <BarChart
                          data={getCountByMonthdata()}
                          margin={{
                            top: 5, right: 5, left: 5, bottom: 5,
                          }}
                        >
                          <CartesianGrid />
                          <XAxis dataKey="Month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Total Employees" fill={getPrimaryGradientColor()} />
                        </BarChart>
                      </ResponsiveContainer>

                    </div>
                  </div>
                </div>
                <div className="col-md-6 text-center">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Employees by Nationality</h3>
                      {/* <div id="bar-charts" /> */}
                      <ResponsiveContainer width='100%' height={300}>
                        <BarChart
                          data={getNationalitydata()}
                          margin={{
                            top: 5, right: 5, left: 5, bottom: 5,
                          }}
                        >
                          <CartesianGrid />
                          <XAxis dataKey="Nationality" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="Total Employees" fill={getPrimaryColor()} />
                        </BarChart>
                      </ResponsiveContainer>

                    </div>
                  </div>
                </div>
                <div className="col-md-6 text-center">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Ticket Status (Company)</h3>
                      <ResponsiveContainer width='100%' height={100}>
                        <table>
                          <thead>
                            <tr>
                              <th>Status</th>
                              <th>Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardData.ticketCountByStatusCompany?.length > 0 && dashboardData.ticketCountByStatusCompany.map((ticket, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <span className="badge badge-primary">{ticket.name}</span>
                                  </td>
                                  <td>
                                    {ticket.id}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 text-center">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Ticket Status (Self)</h3>
                      <ResponsiveContainer width='100%' height={100}>
                        <table>
                          <thead>
                            <tr>
                              <th>Status</th>
                              <th>Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dashboardData.ticketCountByStatusSelf?.length > 0 && dashboardData.ticketCountByStatusSelf.map((ticket, index) => {
                              return (
                                <tr key={index}>
                                  <td>
                                    <span className="badge badge-primary">{ticket.name}</span>
                                  </td>
                                  <td>
                                    {ticket.id}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title text-center">To Do List</h3>
                      <ResponsiveContainer width='100%' height={200}>
                        <div>
                          {/* {toDos=> task,description and actionLink } */}
                          {console.log("cell toDo", dashboardData.toDos)}
                          {dashboardData.toDos?.map((toDo, index) => {
                                    const resolvedLink = index < 3 ? '/app/company-app/settings' : (toDo.actionLink.startsWith('/') ? toDo.actionLink : `/app${toDo.actionLink}`);
                                    return (
                                        <div key={index} className="border-bottom">
                                            <Link to={resolvedLink}>
                                                <label className='m-0'>
                                                    <i className='fa fa-check'></i>&nbsp;
                                                    {toDo.task}
                                                </label>
                                            </Link>
                                            <br />
                                            <small>{toDo.description}</small>
                                        </div>
                                    );
                                })}
                        </div>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title text-center">Announcement</h3>
                      <ResponsiveContainer width='100%' height={200}>
                        <div>
                          {dashboardData.announcements?.map((item, index) => {
                            return (
                              <div key={index} className="border-bottom">

                                <h5><i><small>{getReadableDate(new Date(item.validFrom))} - {getReadableDate(new Date(item.validTill))}</small></i>
                                  &nbsp;{item.title}</h5>
                                <p><small>{item.description}</small></p>
                              </div>
                            )
                          })}
                          {(!dashboardData.announcements || dashboardData.announcements?.length == 0) && <span>No Announcement</span>}
                        </div>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 text-center">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Last 30 Days Attendance</h3>
                      {/* <div id="bar-charts" /> */}
                      <ResponsiveContainer height={300}>
                        <BarChart
                          width={500}
                          data={dashboardData?.last30DaysAttendance}
                          margin={{
                            top: 5, right: 5, left: 5, bottom: 5,
                          }}
                        >
                          <CartesianGrid />
                          <XAxis angle={90} interval={0} dy={50} height={120} dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar barSize={20} dataKey="presentCount" stackId="a" fill="#82ca9d" />
                          <Bar barSize={20} dataKey="absentCount" stackId="a" fill={getPrimaryColor()} />
                        </BarChart>
                      </ResponsiveContainer>

                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>}
        {!verifyOrgLevelViewPermission("Analytics Report") && <AccessDenied></AccessDenied>}
      </div>
      {/* /Page Content */}
    </div>
  );
}

export default CompanyAnalyticsDashboard;
