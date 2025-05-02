import { PDFViewer } from '@react-pdf/renderer';
import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import moment from "moment";
import { toast } from "react-toastify";
import { camelize,exportToCsv, getCompanyId, getMultiEntityCompanies, getTitle, toLocalTime, verifyViewPermission,exportToCsvSorted } from '../../../../../utility';
// import PdfDocument from '../../../pdfDocument';
import PdfDocument from '../../../pdfDocument';
import { getPayrollStatusReport } from '../service';
import PreviewTable from '../../../previewTable';
import AccessDenied from '../../../../../MainPage/Main/Dashboard/AccessDenied';
import EntityDropdown from '../../../../ModuleSetup/Dropdown/EntityDropdown';
import { getOrgSettings} from '../../../../ModuleSetup/OrgSetup/service';
import CompanyMultiSelectDropDown from '../../../../ModuleSetup/Dropdown/CompanyMultiSelectDropDown';

const { Header, Body, Footer, Dialog } = Modal;


export default class PayrollStatusReport extends Component {
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
      payrollStatus: "",
      entityId: "",
      orgsetup: false,
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
    this.fetchData();
  }

  fetchData = () => {
       // entity validation
      
       getOrgSettings().then(res => {
        if (res.status == "OK") {
          this.setState({ orgsetup: res.data.entity })
        }
      })
  
      
    }
  fetchList = () => {
    if (verifyViewPermission("Payroll Report")) {
        getPayrollStatusReport(this.state.q, this.state.fromDate, this.state.toDate > this.state.currentDate?this.state.currentDate:this.state.toDate,this.state.payrollStatus,this.state.entityId,this.state.selectedCompanies).then(response => {
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
    let selectedProperties = [];
    let sortedData= []
    if(this.state.orgsetup){
     selectedProperties = ["employeeId", "fullName", "email","departmentName","entityName","visaEntity","buCc","salaryCalculationMode","salaryMonth","totalDays","daysWorked","paidLeaves","unPaidLeaves","earningAmount","deductionAmount","totalEarning","netPaybleAmount"];
    
    }else{
     selectedProperties = ["employeeId", "fullName", "email","departmentName","visaEntity","buCc","salaryCalculationMode","salaryMonth","totalDays","daysWorked","paidLeaves","unPaidLeaves","earningAmount","deductionAmount","totalEarning","netPaybleAmount"];

    }

    this.setState({checkedValidation:checkAll == true?true: false})
    if (data && data.length > 0 && checkAll) {
      let tempselectedProperties = Object.keys(data[0]).filter(key => !selectedProperties.includes(key)).map(key => key);
      sortedData = [...selectedProperties]
    }
    this.setState({
      selectedProperties :sortedData
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
    let netPaybleAmount = 0;

    if (data && selectedProperties) {
      data.forEach((element) => {
        let temp = {};
        Object.keys(element).forEach((key) => {
          if (selectedProperties.includes(key)) {
            if(key != "startDate" && key != "completedDate" && key != "endDate" ){
            temp[key] = element[key] == null || element[key] == "undefined" ? "-": element[key];
            if(key == "netPaybleAmount"){
              netPaybleAmount = netPaybleAmount + element[key];
            }
            }else{
                temp[key]  = element[key] == null?"-":moment(element[key]).format("ll") 
            }
          }
        });
        selectedData.push(temp);
      })
      if(selectedData.length > 0){
      let tempTotal = {
        totalEarning: "Total Amount: ",
        netPaybleAmount: parseFloat(netPaybleAmount).toFixed(2)
      }
      selectedData.push(tempTotal);
    }
    }
    
    return (
      
      <div className="insidePageDiv">
        <Helmet>
          <title>Payroll | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="page-containerDocList content container-fluid" style={{ marginTop: "20px" }}>
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Payroll Status Report</h3>
                <ul hidden className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item">Report</li>
                  <li className="breadcrumb-item active">Payroll Status Report</li>
                </ul>
              </div>
            </div>
          </div>
          {verifyViewPermission("Payroll Report") && <><div className="card p-2">
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
                  <select
                    className="form-control floating"
                    defaultValue={this.state.payrollStatus}
                    onChange={(e) => {
                      this.setState({payrollStatus: e.target.value})
                    }}
                  >
                    <option value="">All</option>
                    <option value="1">Paid</option>
                    <option value="0">Un Paid</option>
                    
            
                  </select>
              </div>
              </div>
              {/* entity dropdown */}
            {this.state.orgsetup &&  <div className="col-sm-6 col-md-4">

                <div className="form-group form-focus">
                  <EntityDropdown readOnly ={!this.state.isFilter} defaultValue={this.state.entityId} companyId={this.state.companyId} onChange={e => {
                    this.setState({
                      entityId: e.target.value,

                    })

                  }}></EntityDropdown>
                </div>

              </div>}

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

              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <input value={this.state.toDate > this.state.currentDate?this.state.currentDate: this.state.toDate} max={currentDate}  onChange={e => {
                    this.setState({
                      toDate: e.target.value
                    })
                  }} type="date" className="form-control floating" />
                  <label className="focus-label">To Date</label>
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
                        // exportToCsv(selectedData, "PayrollStatus", "PayrollStatus")
                        exportToCsvSorted(selectedData, selectedProperties,"PayrollStatus","PayrollStatus")
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
          {!verifyViewPermission("Payroll Report") && <AccessDenied></AccessDenied>}
        </div>
        {/* /Page Content */}
      </div>
    );
  }
}
