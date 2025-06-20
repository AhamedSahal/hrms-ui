import { PDFViewer } from '@react-pdf/renderer';
import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import moment from "moment";
import { toast } from "react-toastify";
import { camelize, exportToCsv, getTitle, verifyViewPermission, convertToUserTimeZone, formTimeFormat, toDateTime, toLocalDateTime, formatDateTime, getCompanyId, getMultiEntityCompanies,fallbackLocalDateTime } from '../../../../../../utility';
// import PdfDocument from '../../../pdfDocument';
import PdfDocument from '../../../../pdfDocument';
import { getRegularizationStatusReport } from '../service';
import PreviewTable from '../../../../previewTable';
import AccessDenied from '../../../../../../MainPage/Main/Dashboard/AccessDenied';
import CompanyMultiSelectDropDown from '../../../../../ModuleSetup/Dropdown/CompanyMultiSelectDropDown';
import Bowser from 'bowser';

const browser = Bowser.getParser(window.navigator.userAgent);
const browserName = browser.getBrowserName();
const isSafari = browserName === 'Safari';
const { Header, Body, Footer, Dialog } = Modal;


export default class RegularizationStatusReport extends Component {
  constructor(props) {
    super(props);
    var today = new Date();
    var firstDay = new Date(today.getFullYear(), today.getMonth(), 2);
    var lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    this.state = {
      data: [],
      q: "",
      branchId: "",
      departmentId: "",
      designationId: "",
      jobTitleId: "",
      selectedProperties: [],
      regularizationStatus: 2,
      approvalStatus: "",
      checkedValidation: true,
      currentDate: today.toISOString().split('T')[0],
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      companyId: getCompanyId(),
      allCompany: false,
      companies: getMultiEntityCompanies(),
      selectedCompanies: [],
      isFilter: true,
    };
  }

  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    if (verifyViewPermission("Attendance Report")) {
      getRegularizationStatusReport(this.state.q, this.state.fromDate, this.state.toDate > this.state.currentDate ? this.state.currentDate : this.state.toDate, this.state.regularizationStatus, this.state.approvalStatus, this.state.selectedCompanies).then(response => {
        if (response.status == "OK") {
          let data = response.data.map(item => {
                    let systemShiftClockIn = item.settingClockIn != null ? isSafari ? (fallbackLocalDateTime(convertToUserTimeZone(item.settingClockIn)) ):convertToUserTimeZone(toDateTime(item.date, item.settingClockIn)): "-";
                    let systemShiftClockOut = item.settingClockOut != null ?  isSafari ? (fallbackLocalDateTime(convertToUserTimeZone(item.settingClockOut)) ):convertToUserTimeZone(toDateTime(item.date, item.settingClockOut)) : "-";
                    let systemAttendanceclockIn = item.systemClockIn != null ? fallbackLocalDateTime(convertToUserTimeZone(item.systemClockIn)) : "-";
                    let systemAttendanceclockOut = item.systemClockOut != null ? fallbackLocalDateTime(convertToUserTimeZone(item.systemClockOut)) : "-";
            return {
              ...item,
              settingClockIn: formTimeFormat(item.settingClockIn),
              settingClockOut: formTimeFormat(item.settingClockOut),
              assignedShift: systemShiftClockIn + " to " + systemShiftClockOut,
              systemAttendance: systemAttendanceclockIn + " - " + systemAttendanceclockOut
            };
          });
          this.setState({
            data
          }, () => {
            this.setAllChecked(true);
          })
        } else {
          this.setState({ data: [] })
          toast.error(response.message);
        }
      })
    }
  }
  setAllChecked = (checkAll) => {

    const data = this.state.data;
    let selectedProperties = [];
    let sortedData = []
    selectedProperties = ["employeeId", "fullName", "email", "date", "assignedShift", "systemReason", "recordedClockInTime", "recordedClockOutTime", "requestedClockInTime", "requestedClockOutTime", "reasonForRegularization", "requestSubmissionStatus", "approvalStatus", "approver", "submittedBy", "submittedOn"];
    this.setState({ checkedValidation: checkAll == true ? true : false })
    if (data && data.length > 0 && checkAll) {
      // let tempselectedProperties = Object.keys(data[0]).filter(key => !selectedProperties.includes(key)).map(key => key);
      sortedData = [...selectedProperties]
    }
    this.setState({
      selectedProperties: sortedData
    })
  }
  handleChange = (selectedOptions) => {
    const selectedCompanies = selectedOptions.map((option) => option.value);
    this.setState((prevState) => ({
      selectedCompanies,
      isFilter: selectedCompanies.length === 1 || selectedCompanies.length === 0,
      companyId: selectedCompanies.length === 1 ? selectedCompanies[0] : '',
      branchId: selectedCompanies.length > 1 ? '' : prevState.branchId,
      jobTitleId: selectedCompanies.length > 1 ? '' : prevState.jobTitleId,
      departmentId: selectedCompanies.length > 1 ? '' : prevState.departmentId,
    }));
  };

  render() {
    const { data, selectedProperties, showPdf, isFilter, showCsv, companyId, companies } = this.state;
    const currentDate = new Date().toISOString().split('T')[0];
    let selectedData = [];

    if (data && selectedProperties) {
      data.forEach((element) => {
        let temp = {};
        Object.keys(element).forEach((key) => {
     
          if (selectedProperties.includes(key)) {
            if (key != "recordedClockInTime" && key != "recordedClockOutTime") {
              if (key == "requestedClockInTime" || key == "requestedClockOutTime" || key == "submittedOn") {
                temp[key] = element[key] == null ? "-" : formatDateTime(toLocalDateTime(element[key]))
              } else if (key == "date") {
                temp[key] = element[key] == null ? "-" : moment(element[key]).format("ll")
              } else {
                if (key == "approvalStatus") {
                  temp[key] = element[key] == null || element[key] == "undefined" || element[key] == "" ? "-" : element[key] == "PENDING" ? "Pending" : element[key] == "APPROVED" ? "Approved" : "Rejected"
                } else if (key == "requestSubmissionStatus") {
                  temp[key] = element[key] == "NOT_REGULARIZED" ? 'Not Regularized(P)' : element[key] == "PENDING" ? 'Pending' : element[key] == "REGULARIZED" ? 'Regularized(A + R)' : "-"
                } else {
                  temp[key] = element[key] == null || element[key] == "undefined" ? "-" : element[key];
                }


              }
            } else {
              temp[key] = element[key] == null ? "-" : convertToUserTimeZone(element[key])
            }
          }
        });
        if (Object.keys(temp).length > 0) {
          temp['date'] = (temp['date'] === '-') ? "-" : (isSafari ? fallbackLocalDateTime(temp['date']) : temp['date']);
          temp['recordedClockInTime'] = (temp['recordedClockInTime'] === '-') ? "-" : (isSafari ? fallbackLocalDateTime(temp['recordedClockInTime']) : temp['recordedClockInTime']);
          temp['recordedClockOutTime'] = (temp['recordedClockOutTime'] === '-') ? "-" : (isSafari ? fallbackLocalDateTime(temp['recordedClockOutTime']) : temp['recordedClockOutTime']);
          temp['requestedClockInTime'] = (temp['requestedClockInTime'] === '-') ? "-" : (isSafari ? fallbackLocalDateTime(temp['requestedClockInTime']) : temp['requestedClockInTime']);
          temp['requestedClockOutTime'] = (temp['requestedClockOutTime'] === '-') ? "-" : (isSafari ? fallbackLocalDateTime(temp['requestedClockOutTime']) : temp['requestedClockOutTime']);
          temp['submittedOn'] = (temp['submittedOn'] === '-') ? "-" : (isSafari ? fallbackLocalDateTime(temp['submittedOn']) : temp['submittedOn']);
        }
        selectedData.push(temp);
      })
    }

    return (

      <div className="insidePageDiv">
        <Helmet>
          <title>Regularization | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="page-containerDocList content container-fluid" style={{ marginTop: "20px" }}>
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Regularization Status Report</h3>
                <ul hidden className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item">Report</li>
                  <li className="breadcrumb-item active">Regularization Status Report</li>
                </ul>
              </div>
            </div>
          </div>
          {verifyViewPermission("Attendance Report") && <><div className="card p-2">
            <div className="row">
              <div className="col-sm-4 col-md-4">
                <div className="form-group form-focus">
                  <input onChange={e => {
                    this.setState({
                      q: e.target.value
                    })
                  }} type="text" className="form-control floating" />
                  <label className="focus-label">Search</label>
                </div>
              </div>
              <div className="col-sm-6 col-md-4">
                <div className="form-group form-focus">
                  <select
                    className="form-control floating"
                    defaultValue={this.state.regularizationStatus}
                    onChange={(e) => {
                      this.setState({ regularizationStatus: e.target.value })
                    }}
                  >
                    <option value="">All</option>
                    <option value="0">Not Regularized</option>
                    <option value="2">Regularized</option>

                  </select>
                </div>
              </div>
              {/* approval status */}
              <div className="col-sm-6 col-md-4">
                <div className="form-group form-focus">
                  <select
                    className="form-control floating"
                    defaultValue={this.state.approvalStatus}
                    onChange={(e) => {
                      this.setState({ approvalStatus: e.target.value })
                    }}
                  >
                    <option value="">All</option>
                    <option value="0">Pending</option>
                    {this.state.regularizationStatus != "0" && <option value="1">Approved</option>}
                    {this.state.regularizationStatus != "0" && <option value="2">Rejected</option>}

                  </select>
                </div>
              </div>
              <div className="col-sm-6 col-md-4">

                <div className="form-group form-focus">
                  <input value={this.state.fromDate} max={currentDate} onChange={e => {
                    this.setState({
                      fromDate: e.target.value
                    })
                  }} type="date" className="form-control floating" />
                  <label className="focus-label">From Date</label>
                </div>

              </div>

              <div className="col-sm-6 col-md-4">
                <div className="form-group form-focus">
                  <input value={this.state.toDate > this.state.currentDate ? this.state.currentDate : this.state.toDate} max={currentDate} onChange={e => {
                    this.setState({
                      toDate: e.target.value
                    })
                  }} type="date" className="form-control floating" />
                  <label className="focus-label">To Date</label>
                </div>

              </div>



              <div className="col-md-2">
                <a href="#" onClick={() => {
                  this.fetchList();
                }} className="btn btn-success btn-block"> Search </a>
              </div>
            </div>
            {this.state.companies.length > 1 &&
              <div className='col-sm-6 col-md-6'>
                <div className="form-group form-focus">
                  <CompanyMultiSelectDropDown value={this.state.selectedCompanies}
                    onChange={(e) => { this.handleChange(e) }}>
                  </CompanyMultiSelectDropDown>
                </div>
              </div>
            }

            <div className="row">
              <div className="col-md-12">

                <div className="table-responsive">
                  {selectedData && selectedData.length > 0 &&
                    <ButtonGroup>
                      <Button className='add-btn' variant='warning' size='sm' onClick={() => {
                        exportToCsv(selectedData, "RegularizationStatus", "RegularizationStatus")
                      }}>
                        <i className="fa fa-file-excel-o"></i> Export to CSV
                      </Button>
                    </ButtonGroup>
                  }
                </div>
                <div className='mt-3'>

                  {showPdf && selectedData && selectedData.length > 0 && selectedProperties.length > 0 &&
                    <PDFViewer width="100%" height="600">
                      <PdfDocument data={selectedData} />
                    </PDFViewer>}
                </div>

                <div className='mt-3'>
                  {selectedData && selectedData.length == 0 && selectedProperties.length == 0 &&
                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                      <span>No Data Found</span>
                    </div>
                  }
                </div>

              </div>
            </div>
          </div>
            <PreviewTable selectedData={selectedData} selectedProperties={selectedProperties} checkedValidation={this.state.checkedValidation} /></>}
          {!verifyViewPermission("Attendance Report") && <AccessDenied></AccessDenied>}
        </div>
        {/* /Page Content */}
      </div>
    );
  }
}
