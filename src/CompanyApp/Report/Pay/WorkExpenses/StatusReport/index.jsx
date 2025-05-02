import { PDFViewer } from '@react-pdf/renderer';
import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import moment from "moment";
import { toast } from "react-toastify";
import { camelize, exportToCsv,exportToSortedCsvOrder, getCompanyId, getMultiEntityCompanies, getTitle, toLocalTime, verifyViewPermission } from '../../../../../utility';
// import PdfDocument from '../../../pdfDocument';
import PdfDocument from '../../../pdfDocument';
import { getWorkExpensesStatusReport } from '../service';
import PreviewTable from '../../../previewTable';
import ProjectDropdown from '../../../../ModuleSetup/Dropdown/ProjectDropdown';
import AccessDenied from '../../../../../MainPage/Main/Dashboard/AccessDenied';
import CompanyMultiSelectDropDown from '../../../../ModuleSetup/Dropdown/CompanyMultiSelectDropDown';

const { Header, Body, Footer, Dialog } = Modal;


export default class WorkExpensesStatusReport extends Component {
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
      workExpensesStatus: "",
      projectId: "",
      checkedValidation: true,
      currentDate: today.toISOString().split('T')[0],
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      companyId: getCompanyId(),
      selectedCompanies: [],
      isFilter : true,
      companies : getMultiEntityCompanies(),
    };
  }

  componentDidMount() {
    // this.fetchList();
  }
  fetchList = () => {
    if (verifyViewPermission("Work Expenses Report")) {
        getWorkExpensesStatusReport(this.state.q, this.state.fromDate, this.state.toDate > this.state.currentDate ? this.state.currentDate : this.state.toDate, this.state.workExpensesStatus,this.state.selectedCompanies).then(response => {
        if (response.status == "OK") {
          let data = response.data;
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
    selectedProperties = ["employeeId", "fullName", "email","reportingManager","department","jobTitle","spendDate","description","referenceId","status","isPaid","vatAmount","amountSpent"];
    this.setState({ checkedValidation: checkAll == true ? true : false })
    if (data && data.length > 0 && checkAll) {
      let tempselectedProperties = Object.keys(data[0]).filter(key => !selectedProperties.includes(key)).map(key => key);
      sortedData = [...selectedProperties, ...tempselectedProperties]
    }
    this.setState({
      selectedProperties: sortedData
    })

  }
  handleChange = (selectedOptions) => {
    const selectedCompanies = selectedOptions.map((option) => option.value);
    this.setState((prevState) => ({
      selectedCompanies ,
      isFilter: selectedCompanies.length === 1 || selectedCompanies.length === 0 ,
      companyId: selectedCompanies.length === 1 ? selectedCompanies[0] : '',
      branchId: selectedCompanies.length > 1 ? '' : prevState.branchId,
      jobTitleId : selectedCompanies.length > 1 ? '' : prevState.jobTitleId,
      departmentId : selectedCompanies.length > 1 ? '' : prevState.departmentId,
  }));
  };

  render() {
    const { data, selectedProperties, showPdf, showCsv } = this.state;
    const currentDate = new Date().toISOString().split('T')[0];
    let selectedData = [];
    let workExpensesTotalHours = 0;
    if (data && selectedProperties) {
      data.forEach((element) => {
        let temp = {};
        
        Object.keys(element).forEach((key) => {
          if (selectedProperties.includes(key)) {
            if (key != "spendDate") {
              if(key == "isPaid"){
                temp[key] = element[key] == null || element[key] == "undefined" || element[key] == "" ? "-":element[key] == 1?"Paid":element[key] == 2?"UnPaid":"-"
              }else if(key == "status") {
                temp[key] = element[key] == null || element[key] == "undefined" || element[key] == "" ? "-":element[key] == "PENDING"?"Pending":element[key] == "APPROVED"?"Approved":element[key] == "REJECTED"?"Rejected":element[key] == "ADDED_TO_PAYROLL"?"Add To Payroll":element[key] == "SETTLED"?"Settled":"-"
              }
              else{
              temp[key] = element[key] == null || element[key] == "undefined" || element[key] == "" ? "-" : element[key];
              }
              if(key == "amountSpent"){
                workExpensesTotalHours = workExpensesTotalHours + Number(element[key]);
              }
            } else {
              temp[key] = element[key] == null ? "-" : moment(element[key]).format("ll")
            }
          }
        });
        selectedData.push(temp);
      })
      if(selectedData.length > 0){
        let tempTotal = {
          vatAmount: "Total: ",
          amountSpent: workExpensesTotalHours
        }
        selectedData.push(tempTotal);
      }
    }

    return (

      <div className="insidePageDiv">
        <Helmet>
          <title>Work Expenses | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="page-containerDocList content container-fluid" style={{ marginTop: "20px" }}>
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Work Expenses Status Report</h3>
                <ul hidden className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item">Report</li>
                  <li className="breadcrumb-item active">Work Expenses Status Report</li>
                </ul>
              </div>
            </div>
          </div>
          {verifyViewPermission("Work Expenses Report") && <><div className="card p-2">
            <div className="row">

              <div className="col-sm-6 col-md-4">
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

              <div className="col-sm-6 col-md-4">
                <div className="form-group form-focus">
                  <select
                    className="form-control floating"
                    defaultValue={this.state.workExpensesStatus}
                    onChange={(e) => {
                      this.setState({ workExpensesStatus: e.target.value })
                    }}
                  >
                    <option value="">All</option>
                    <option value="0">Pending</option>
                    <option value="1">Approved</option>
                    <option value="2">Rejected</option>
                    <option value="3">Add To Payroll</option>
                    <option value="4">Settled</option>
                  </select>
                </div>
              </div>
              {this.state.companies.length > 1 && 
                <div className='col-sm-6 col-md-6'>
                    <div className="form-group form-focus">
                      <CompanyMultiSelectDropDown value={this.state.selectedCompanies} 
                        onChange={(e) => {this.handleChange(e)}}>
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
                        exportToSortedCsvOrder(selectedData, "workExpensesStatus", "workExpensesStatus",selectedProperties)
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
          {!verifyViewPermission("Work Expenses Report") && <AccessDenied></AccessDenied>}
        </div>
        {/* /Page Content */}
      </div>
    );
  }
}
