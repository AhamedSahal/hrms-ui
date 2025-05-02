import { PDFViewer } from '@react-pdf/renderer';
import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import moment from "moment";
import { toast } from "react-toastify";
import { camelize, exportToSortedCsv,exportToCsv,exportToSortedCsvOrder, getTitle, toLocalTime, verifyViewPermission, getMultiEntityCompanies, getCompanyId } from '../../../../../utility';
import BranchDropdown from '../../../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../../../ModuleSetup/Dropdown/DepartmentDropdown';
import PdfDocument from '../../../pdfDocument';
import { getPayVarianceDetailReport } from '../service';
import PreviewTable from '../../../previewTable';
import AccessDenied from '../../../../../MainPage/Main/Dashboard/AccessDenied';
import JobTitlesDropdown from '../../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import CompanyMultiSelectDropDown from '../../../../ModuleSetup/Dropdown/CompanyMultiSelectDropDown';
const { Header, Body, Footer, Dialog } = Modal;


export default class PayVarianceDetailReport extends Component {
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
      checkedValidation: true,
      currentDate: today.toISOString().split('T')[0],
      compare: "",
      withIn: "",
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
    if (verifyViewPermission("Pay Variance Report")) {
        getPayVarianceDetailReport(this.state.q, this.state.compare, this.state.withIn,this.state.selectedCompanies).then(response => {
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
    let compardate = new Date(this.state.compare);
    let withdate = new Date(this.state.withIn);
    //  split 
    let compareY =  this.state.compare.split("-")
    let compareYear = compareY[0];
    let withY =  this.state.withIn.split("-")
    let withYear = withY[0];

    let comparEarning = `${compardate.toLocaleDateString('en-US', { month: 'short' })}${compareYear}-TotalEarning`;
    let withEarning = `${withdate.toLocaleDateString('en-US', { month: 'short' })}${withYear}-TotalEarning`;
    let comparDeduction = `${compardate.toLocaleDateString('en-US', { month: 'short' })}${compareYear}-TotalDeduction`;
    let withDeduction = `${withdate.toLocaleDateString('en-US', { month: 'short' })}${withYear}-TotalDeduction`;
    let selectedProperties = ["employeeId", "fullName", "email", "reportingManager", "jobTitle","department",comparEarning,withEarning,comparDeduction,withDeduction];
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
    let compardate = new Date(this.state.compare);
    let withdate = new Date(this.state.withIn);
    //  split 
    let compareY =  this.state.compare.split("-")
    let compareYear = compareY[0];
    let withY =  this.state.withIn.split("-")
    let withYear = withY[0];

    let comparEarning = `${compardate.toLocaleDateString('en-US', { month: 'short' })}${compareYear}-TotalEarning`;
    let withEarning = `${withdate.toLocaleDateString('en-US', { month: 'short' })}${withYear}-TotalEarning`;
    let comparDeduction = `${compardate.toLocaleDateString('en-US', { month: 'short' })}${compareYear}-TotalDeduction`;
    let withDeduction = `${withdate.toLocaleDateString('en-US', { month: 'short' })}${withYear}-TotalDeduction`;
    let selectedData = [];
    let wtotalEarnings = 0;
    let ctotalEarnings	= 0;
    let ctotalDeduction	=0;
    let wtotalDeduction =0;

    if (data && selectedProperties) {
      data.forEach((element) => {
        let temp = {};
        Object.keys(element).forEach((key) => {
          if (selectedProperties.includes(key)) {
            temp[key] = element[key] == null || element[key] == "undefined" ? "-" :element[key];
            if(key == withEarning){
              wtotalEarnings = wtotalEarnings + element[key]
            }
            if(key == comparEarning){ 
              ctotalEarnings = ctotalEarnings + element[key]
            }
            if(key == comparDeduction){
              ctotalDeduction = ctotalDeduction + element[key]
            }
            if(key == withDeduction){
              wtotalDeduction = wtotalDeduction + element[key]
            }
          }
        });
        selectedData.push(temp);
      })
      if(selectedData.length > 0){
        let tempTotal = { 
          department: "Total Amount: ",
          [withEarning]: wtotalEarnings,
          [comparEarning]:ctotalEarnings,
          [comparDeduction]:ctotalDeduction,
          [withDeduction]:wtotalDeduction
        }
        selectedData.push(tempTotal);
        let differenceTotal = { 
          department: "Difference :",
          [comparEarning]: ctotalEarnings > wtotalEarnings?`+${ctotalEarnings-wtotalEarnings}`:ctotalEarnings-wtotalEarnings,
          [comparDeduction]:ctotalDeduction > wtotalDeduction?`+${ctotalDeduction-wtotalDeduction}`:ctotalDeduction-wtotalDeduction,
          
        }
        selectedData.push(differenceTotal);
      }
    }
    return (
      
      <div className="insidePageDiv">
        <Helmet>
          <title>Pay Variance | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="page-containerDocList content container-fluid" style={{ marginTop: "20px" }}>
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Pay Variance Detail Report</h3>
                <ul hidden className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item">Report</li>
                  <li className="breadcrumb-item active">Pay Variance Detail Report</li>
                </ul>
              </div>
            </div>
          </div>
          {verifyViewPermission("Pay Variance Report") && <><div className="card p-2">
            <div className="row">
            <div className="col-sm-4 col-md-3">
              <div className="form-group form-focus">
                <input  onChange={e => {
                  this.setState({
                    q: e.target.value
                  })
                }} type="text" className="form-control floating" />
                <label className="focus-label">Search</label>
              </div>
            </div>

              <div className="col-sm-6 col-md-3">

                <div className="form-group form-focus">
                  <input value={this.state.fromDate} max={currentDate} onChange={e => {
                    this.setState({
                        compare: e.target.value
                    })
                  }} type="month" className="form-control floating" />
                  <label className="focus-label">Compare</label>
                </div>

              </div>

              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <input value={this.state.toDate > this.state.currentDate?this.state.currentDate: this.state.toDate} max={currentDate}  onChange={e => {
                    this.setState({
                      withIn: e.target.value
                    })
                  }} type="month" className="form-control floating" />
                  <label className="focus-label">With</label>
                </div>

              </div>
              <div className="col-md-2">
                <a href="#" onClick={() => {
                  this.fetchList();
                }} className="btn btn-success btn-block"> Search </a>
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
            </div>

            <div className="row">
              <div className="col-md-12">

                <div className="table-responsive">
                  {selectedData && selectedData.length > 0 &&
                    <ButtonGroup>
                      <Button className='add-btn' variant='warning' size='sm' onClick={() => {
                        exportToSortedCsvOrder(selectedData, "PayVarianceDetailReport", "PayVarianceDetailReport",this.state.selectedProperties)
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
          {!verifyViewPermission("Pay Variance Report") && <AccessDenied></AccessDenied>}
        </div>
        {/* /Page Content */}
      </div>
    );
  }
}
