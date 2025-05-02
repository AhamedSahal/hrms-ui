import { PDFViewer } from '@react-pdf/renderer';
import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import * as XLSX from 'xlsx';
import moment from "moment";
import { camelize, exportToCsv, getTitle, toLocalDateTime, toLocalTime, verifyViewPermission, setAllChecked, exportToCsvSorted, getCompanyId,setAllCheckedEmployee, getMultiEntityCompanies } from '../../../utility';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import PdfDocument from '../pdfDocument';
import PreviewTable from '../previewTable';
import JobTitlesDropdown from '../../ModuleSetup/Dropdown/JobTitlesDropdown';
import { getEmployeeReport } from './service';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { getOrgSettings } from '../../ModuleSetup/OrgSetup/service';
import EntityDropdown from '../../ModuleSetup/Dropdown/EntityDropdown';
import CompanyMultiSelectDropDown from '../../ModuleSetup/Dropdown/CompanyMultiSelectDropDown';
const { Header, Body, Footer, Dialog } = Modal;


export default class EmployeeReport extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      q: "",
      status: "",
      branchId: "",
      departmentId: "",
      designationId: "",
      jobTitleId: "",
      entityId: "",
      selectedPropertiestemp :["employeeId", "firstName", "middleName","lastName","email","doj","companyName","locationName","departmentName","designationName","reportingManager","shiftStart","shiftEnd","weeklyOffs","status","statusComment","totalExperience","probationPeriod","dob","fatherName","gender","maritalStatus","bloodGroup","phone","religion","nationality","labourCardNo","noticePeriod","lwd","bankAccountHolderName","bankAccountNumber","bankName","ibanNumber","bankBranchLocation","swiftCode","routingCode","employerId","createdOn","modifiedOn"],
      selectedProperties:[],
      checkedValidation: true,
      orgsetup: false,
      sortedProperties: [],
      companyId: getCompanyId(),
      companies : getMultiEntityCompanies(),
      selectedCompanies: [],
      isFilter : true,
    };
  }
  componentDidMount() {
      // this.fetchList();
      this.fetchData();
  }

  fetchData = () => {
     // entity validation
    
     getOrgSettings().then(res => {
      if (res.status == "OK") {
        this.setState({ orgsetup: res.data.entity })
        if(res.data.entity){
          let tempProperties = ["employeeId", "firstName", "middleName","lastName","email","doj","entityName","companyName","locationName","departmentName","designationName","reportingManager","shiftStart","shiftEnd","weeklyOffs","status","statusComment","totalExperience","probationPeriod","dob","fatherName","gender","maritalStatus","bloodGroup","phone","religion","nationality","labourCardNo","noticePeriod","lwd","bankAccountHolderName","bankAccountNumber","bankName","ibanNumber","bankBranchLocation","swiftCode","routingCode","employerId","createdOn","modifiedOn"];
          this.setState({selectedPropertiestemp: tempProperties},() => {
            this.fetchList();

          })

        }else{
          this.fetchList();
        }
      }
    })

    
  }

  fetchList = () => {
    if(verifyViewPermission("Employee Report")){
      getEmployeeReport(this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.q, this.state.status,this.state.entityId, this.state.selectedCompanies).then(response => {
        let data = response.data;

        this.setState({
          data
        }, () => {
          let sortedData = setAllChecked(data,this.state.selectedPropertiestemp,true);
          this.setState({selectedProperties: sortedData,}) ;
          this.setState({sortedProperties: sortedData}) ;
          this.setState({checkedValidation:true})
          })
      })}
  }
  handlesortFuntion = (checkAll) => {
    this.setState({selectedProperties: setAllCheckedEmployee(this.state.data,this.state.selectedPropertiestemp,checkAll == true?true: false)});
    this.setState({checkedValidation:checkAll == true ? true:false})
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
    const { data, selectedProperties, showPdf, showCsv, sortedProperties,companies,isFilter } = this.state;
    let selectedData = [];

    if (data && selectedProperties) {
      data.forEach((element) => {
        let temp = {};
        Object.keys(element).forEach((key) => {
          if (selectedProperties.includes(key) && this.state.selectedPropertiestemp.includes(key)) {
            if(key != "dob" && key != "doj" && key != "createdOn" && key != "modifiedOn"){
              temp[key] = element[key] == null || element[key] == "undefined"?"-":element[key];
            }else{
              temp[key]  = element[key] == null?"-":moment(element[key]).format("ll")
            }
          }
        });
        if(Object.keys(temp).length > 0) {
          temp['createdOn'] = toLocalDateTime(temp['createdOn']);
          temp['modifiedOn'] = toLocalDateTime(temp['modifiedOn']);
          temp['dob'] = temp['dob']?.split('T')[0];
          temp['doj'] =temp['doj']?.split('T')[0];
          temp['shiftEnd'] = toLocalTime(temp['shiftEnd']);
          temp['shiftStart'] = toLocalTime(temp['shiftStart']);
        }
        selectedData.push(temp);
      })
    }

    return (
      <div className="insidePageDiv">
        <Helmet>
          <title>Employee | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="page-containerDocList content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Employee Report</h3>
                <ul hidden className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item">Report</li>
                  <li className="breadcrumb-item active">Employee Report</li>
                </ul>
              </div>
            </div>
          </div>
          {verifyViewPermission("Employee Report") && <><div className="card p-4">
            <div className="row align-items-center">
              <div className="col-sm-4 col-md-2">
                <div className="form-group form-focus">
                  <input onChange={e => {
                    this.setState({
                      q: e.target.value
                    })
                  }} type="text" className="form-control floating" />
                  <label className="focus-label">Search</label>
                </div>
              </div>
               {this.state.orgsetup &&  <div className="col-sm-6 col-md-3">
              
                              <div className="form-group form-focus">
                                <EntityDropdown readOnly ={!isFilter} defaultValue={this.state.entityId} companyId={this.state.companyId} onChange={e => {
                                  this.setState({
                                    entityId: e.target.value,
                                   
                                  })
              
                                }}></EntityDropdown>
                              </div>
              
                            </div>}
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <BranchDropdown readOnly ={!this.state.isFilter} defaultValue={this.state.branchId}  companyId={this.state.companyId} onChange={e => {
                    this.setState({
                      branchId: e.target.value
                    })
                  }}></BranchDropdown>
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <JobTitlesDropdown readOnly ={!isFilter} defaultValue={this.state.jobTitleId} companyId={this.state.companyId} onChange={e => {
                    this.setState({
                      jobTitleId: e.target.value
                    })
                  }}></JobTitlesDropdown>
                </div>
              </div>
              <div className="col-sm-6 col-md-2">
                <div className="form-group form-focus">
                  <select className="form-control"
                    onChange={e => {
                      this.setState({
                        status: e.target.value
                      })
                    }}>
                    <option value="">All</option>
                    <option value="ACTIVE">Active</option>
                    <option value="RESIGNED">Resigned</option>
                    <option value="TERMINATED">Terminated</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              {companies.length > 1 && 
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
                <div className='row'>
                  {this.state?.data?.length > 0 &&
                    <div className="col-md-3">

                      <i onClick={() => this.handlesortFuntion(selectedProperties.length == 0)}
                        className={selectedProperties.length > 0 ? 'fa-2x fa fa-toggle-on text-success' : 'fa-2x fa fa-toggle-off text-danger'}></i>
                      <label className="pl-2" htmlFor="checkAll">{selectedProperties.length == 0 ? 'Check All' : 'Uncheck All'}</label>

                    </div>
                  }
                </div>

                <div className='row '>
                  {data && data.length > 0 && sortedProperties.map((a, i) => {
                    //checkbox to select which properties to consider in selectedProperties
                    return <div className='col-md-3 form-check' key={i}>
                      <div className="col-md-12">
                        <input data-id="cbColor" type="checkbox" id={'rptempch' + i} className='cbColor form-check-input' checked={selectedProperties.includes(a)} onChange={e => {

                          let selectedProperties = this.state.selectedProperties
                          if (e.target.checked) {
                            this.setState({checkedValidation:true})
                            selectedProperties.push(a)
                          } else {
                            selectedProperties = selectedProperties.filter(b => b !== a)
                          }
                          this.setState({
                            selectedProperties
                          })
                        }} />
                        <label className="form-check-label" htmlFor={'rptempch' + i}>{camelize(a)}</label>
                      </div>
                    </div>
                  })}

                </div>

              </div>
              <div className="col-md-12">

                <div className="mt-2">
                  {selectedData && selectedData.length > 0 &&
                    <ButtonGroup>
                      <Button className='add-btn' size='sm' onClick={() => {
                        this.setState({
                          showPdf: this.state.showPdf ? false : true,
                          showCsv: false
                        })
                      }}>
                        <i className="fa fa-file-pdf-o"></i> PDF
                      </Button>
                      <Button className='add-btn' variant='warning' size='sm' onClick={() => {
                        exportToCsvSorted(selectedData, selectedProperties,"Employee", "Employee")
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
            <PreviewTable selectedData={selectedData} selectedProperties={selectedProperties} checkedValidation={this.state.checkedValidation}/></>}
          { !verifyViewPermission("Employee Report") && <AccessDenied></AccessDenied>}
        </div>
        {/* /Page Content */}
      </div>
    );
  }
}
