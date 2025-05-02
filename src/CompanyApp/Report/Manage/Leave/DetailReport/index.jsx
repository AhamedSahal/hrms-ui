import { PDFViewer } from '@react-pdf/renderer';
import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import moment from "moment";
import { toast } from "react-toastify";
import LeaveTypeDropdown from '../../../../ModuleSetup/Dropdown/LeaveTypeDropdown';
import { camelize, exportToSortedCsv,exportToCsv, getTitle, toLocalTime, verifyViewPermission, getMultiEntityCompanies, getCompanyId } from '../../../../../utility';
import BranchDropdown from '../../../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../../../ModuleSetup/Dropdown/DepartmentDropdown';
import PdfDocument from '../../../pdfDocument';
import { getLeaveDetailReport } from '../service';
import PreviewTable from '../../../previewTable';
import LeaveTypeReportDropdown from '../../../../ModuleSetup/Dropdown/LeaveTypeReportDropdown';
import AccessDenied from '../../../../../MainPage/Main/Dashboard/AccessDenied';
import JobTitlesDropdown from '../../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import CompanyMultiSelectDropDown from '../../../../ModuleSetup/Dropdown/CompanyMultiSelectDropDown';
const { Header, Body, Footer, Dialog } = Modal;


export default class LeaveDataReport extends Component {
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
      leaveType: 0,
      selectedProperties: [],
      checkedValidation: true,
      currentDate: today.toISOString().split('T')[0],
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      companyId: getCompanyId(),
      allCompany : false,
      companies : getMultiEntityCompanies(),
      selectedCompanies: [],
      isFilter : true,
    };
  }


  fetchList = () => {
    if (verifyViewPermission("Leave Report")) {
        getLeaveDetailReport(this.state.q, this.state.fromDate, this.state.toDate > this.state.currentDate?this.state.currentDate:this.state.toDate,this.state.leaveType,this.state.selectedCompanies).then(response => {
        if(response.status == "OK"){
        let data = response.data;
        this.setState({
          data
        }, () => {
          this.setAllChecked(true);
        })
      }else{
        this.setState({data: []})
        toast.error(response.message);      
      }
      })
    }
  }
  setAllChecked = (checkAll) => {

    const data = this.state.data;
    // let selectedProperties = []
    let sortedData = [];
    let selectedProperties = ["employeeId", "fullName", "email", "reportingManager", "jobTitle","department","openingBalance","eligibility","totalEligible","leaveAvailed","accrued","leaveBalance"];
    this.setState({ checkedValidation: checkAll == true ? true : false })
    if (data && data.length > 0 && checkAll) {
      // my code
      let tempselectedProperties = Object.keys(data[0]).filter(key => !selectedProperties.includes(key)).sort((a, b) => {
        return new Date(a) - new Date(b);
      });
      sortedData = [...selectedProperties, ...tempselectedProperties]
    }
    this.setState({
      selectedProperties: sortedData
    })
  }

  handleLeaveDropdownChange = (leavetypeId) => {
    this.setState({leaveType: leavetypeId});
       
  }
  handleChange = (selectedOptions) => {
    let selectedCompanies = Array.isArray(selectedOptions) 
      ? selectedOptions.map((option) => option.value) : [selectedOptions.value];
    this.setState((prevState) => ({
      selectedCompanies ,
      isFilter: selectedCompanies.length === 1 || selectedCompanies.length === 0 ,
      companyId: selectedCompanies.length === 1 ? selectedCompanies[0] : '',
      leaveType: selectedCompanies.length > 1 ? '' : prevState.leaveType,
  }));
  };


  render() {
    const { data, selectedProperties, showPdf, showCsv } = this.state;
    const currentDate = new Date().toISOString().split('T')[0];
    let selectedData = [];

    if (data && selectedProperties) {
      data.forEach((element) => {
        let temp = {};
        Object.keys(element).forEach((key) => {
          if (selectedProperties.includes(key)) {
            if(key != "accrued"){
            temp[key] = element[key] == null || element[key] == "undefined" ? key == "jobTitle" || key == "fullName" || key == "employeeId" || key == "Email" || key == "reportingManager" || key == "jobTitle" || key == "department"?"-":0 : element[key];
            }else{
              temp[key] = element[key] == null?"-":parseFloat(element[key]).toFixed(2)
          
            }
          }
        });
        selectedData.push(temp);
      })
    }
    
    return (
      
      <div className="insidePageDiv">
        <Helmet>
          <title>Leave | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="page-containerDocList content container-fluid" style={{ marginTop: "20px" }}>
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Leave Detail Report</h3>
                <ul hidden className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item">Report</li>
                  <li className="breadcrumb-item active">Leave Detail Report</li>
                </ul>
              </div>
            </div>
          </div>
          {verifyViewPermission("Leave Report") && <><div className="card p-2">
            <div className="row">
            <div className="col-sm-4 col-md-4">
              <div className="form-group form-focus">
                <input  onChange={e => {
                  this.setState({
                    q: e.target.value
                  })
                }} type="text" className="form-control floating" />
                <label className="focus-label">Search</label>
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
                  <input value={this.state.toDate > this.state.currentDate?this.state.currentDate: this.state.toDate} max={currentDate}  onChange={e => {
                    this.setState({
                      toDate: e.target.value
                    })
                  }} type="date" className="form-control floating" />
                  <label className="focus-label">To Date</label>
                </div>

              </div>

              <div className="col-sm-6 col-md-4">
                <div className="form-group form-focus">
                
                <LeaveTypeReportDropdown  readOnly ={!this.state.isFilter}  companyId={this.state.companyId}  onChange = { (e) => this.handleLeaveDropdownChange(e.target.value) }></LeaveTypeReportDropdown>
                                
                  <label className="focus-label">Leave Type</label>
                </div>

              </div>
            {this.state.companies.length > 1 && 
                <div className='col-sm-6 col-md-6'>
                    <div className="form-group form-focus">
                      <CompanyMultiSelectDropDown value={this.state.selectedCompanies} 
                        onChange={(e) => {this.handleChange(e)}} isMulti={true}>
                      </CompanyMultiSelectDropDown>
                    </div>
                  </div>
                }
              <div className="col-md-2">
                <a href="#" onClick={() => {
                  this.fetchList();
                }} className="btn btn-success btn-block"> Search </a>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">

                <div className="table-responsive">
                  {selectedData && selectedData.length > 0 &&
                    <ButtonGroup>
                      <Button className='add-btn' variant='warning' size='sm' onClick={() => {
                        exportToSortedCsv(selectedData, "LeaveDetail", "LeaveDetail")
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
          {!verifyViewPermission("Leave Report") && <AccessDenied></AccessDenied>}
        </div>
        {/* /Page Content */}
      </div>
    );
  }
}
