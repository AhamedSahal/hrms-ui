import { PDFViewer } from '@react-pdf/renderer';
import React, { Component } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import moment from "moment";
import { camelize, exportToSortedCsvOrder, getTitle,toLocalTime,verifyViewPermission,setAllChecked, getCompanyId, getMultiEntityCompanies,fallbackLocalDateTime } from '../../../../../utility';
import BranchDropdown from '../../../../ModuleSetup/Dropdown/BranchDropdown';
import DepartmentDropdown from '../../../../ModuleSetup/Dropdown/DepartmentDropdown';
import PdfDocument from '../../../pdfDocument';
import { getAssetsReport } from '../service';
import PreviewTable from '../../../previewTable';
import AccessDenied from '../../../../../MainPage/Main/Dashboard/AccessDenied';
import JobTitlesDropdown from '../../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import CompanyMultiSelectDropDown from '../../../../ModuleSetup/Dropdown/CompanyMultiSelectDropDown';
import Bowser from 'bowser';

const browser = Bowser.getParser(window.navigator.userAgent);
const browserName = browser.getBrowserName();
const isSafari = browserName === 'Safari';
const { Header, Body, Footer, Dialog } = Modal;


export default class AssetsReport extends Component {
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
      selectedPropertiestemp: ["name", "assetsCategory", "serialNo", "brandName", "modelNo", "ram", "storageCapacity", "imeiNo", "ipAddress", "previousState", "tag", "currentLocation", "purchaseFrom", "purchaseDate", "warrantyStartDate", "warrantyEndDate", "assignDate", "assignedTo", "previousOwner", "status"],
      checkedValidation: true,
      fromDate: firstDay.toISOString().split('T')[0],
      toDate: lastDay.toISOString().split('T')[0],
      sortedProperties: [],
      selectedProperties: [],
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
    if (verifyViewPermission("Assets Report")) {
      getAssetsReport(this.state.branchId, this.state.departmentId, this.state.jobTitleId, this.state.q, this.state.fromDate, this.state.toDate, this.state.selectedCompanies).then(response => {
        let data = response.data;
        this.setState({
          data
        }, () => {
          let sortedData = setAllChecked(data, this.state.selectedPropertiestemp, true);
          this.setState({ selectedProperties: sortedData, });
          this.setState({ sortedProperties: sortedData });
          this.setState({ checkedValidation: true })
        })
      })
    }
  }

  handlesortFuntion = (checkAll) => {
    this.setState({ selectedProperties: setAllChecked(this.state.data, this.state.selectedPropertiestemp, checkAll == true ? true : false) });
    this.setState({ checkedValidation: checkAll == true ? true : false })
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
    const { data, selectedProperties, showPdf, isFilter, showCsv, sortedProperties, companies, companyId } = this.state;
    let selectedData = [];

    if (data && selectedProperties) {
      data.forEach((element) => {
        let temp = {};
        Object.keys(element).forEach((key) => {
          if (selectedProperties.includes(key)) {
            if (key != "warrantyEndDate" && key != "assignDate" && key != "warrantyStartDate" && key != "purchaseDate") {
              temp[key] = element[key] == null || element[key] == "undefined" || element[key] == "" ? "-" : element[key];
            }else {
              temp[key] = element[key] == null ? "-" : moment(element[key]).format("ll")
            }
          }
        });
        if (Object.keys(temp).length > 0) {
          temp['warrantyEndDate'] = (temp['warrantyEndDate'] === '-') ? "-" : (isSafari ? fallbackLocalDateTime(temp['warrantyEndDate']) : temp['warrantyEndDate']);
          temp['warrantyStartDate'] = (temp['warrantyStartDate'] === '-') ? "-" : (isSafari ? fallbackLocalDateTime(temp['warrantyStartDate']) : temp['warrantyStartDate']);
          temp['returnOn'] = (temp['returnOn'] === '-') ? "-" : (isSafari ? fallbackLocalDateTime(temp['returnOn']) : temp['returnOn']);
          temp['assignDate'] = (temp['assignDate'] === '-') ? "-" : (isSafari ? fallbackLocalDateTime(temp['assignDate']) : temp['assignDate']);
          temp['purchaseDate'] = (temp['purchaseDate'] === '-') ? "-" : (isSafari ? fallbackLocalDateTime(temp['purchaseDate']) : temp['purchaseDate']);
        }
        selectedData.push(temp);
      })
    }

    return (
      <div className="insidePageDiv">
        <Helmet>
          <title>Assets | {getTitle()}</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        <div className="page-containerDocList content container-fluid" style={{ marginTop: "20px" }}>
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Assets Report</h3>
                <ul hidden className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item">Report</li>
                  <li className="breadcrumb-item active">Assets Report</li>
                </ul>
              </div>
            </div>
          </div>
          {verifyViewPermission("Assets Report") && <><div className="card p-2">
            <div className="row">
              <div className="col-sm-4 col-md-3">
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
                  <input value={this.state.fromDate} onChange={e => {
                    this.setState({
                      fromDate: e.target.value
                    })
                  }} type="date" className="form-control floating" />
                  <label className="focus-label">From Date</label>
                </div>

              </div>

              <div className="col-sm-6 col-md-4">
                <div className="form-group form-focus">
                  <input value={this.state.toDate} onChange={e => {
                    this.setState({
                      toDate: e.target.value
                    })
                  }} type="date" className="form-control floating" />
                  <label className="focus-label">To Date</label>
                </div>

              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <BranchDropdown readOnly={!isFilter} defaultValue={this.state.branchId} companyId={this.state.companyId} onChange={e => {
                    this.setState({
                      branchId: e.target.value
                    })
                  }}></BranchDropdown>
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <DepartmentDropdown readOnly={!isFilter} defaultValue={this.state.departmentId} companyId={this.state.companyId} onChange={e => {
                    this.setState({
                      departmentId: e.target.value
                    })
                  }}></DepartmentDropdown>
                </div>
              </div>
              <div className="col-sm-6 col-md-3">
                <div className="form-group form-focus">
                  <JobTitlesDropdown readOnly={!isFilter} defaultValue={this.state.jobTitleId} companyId={this.state.companyId} onChange={e => {
                    this.setState({
                      jobTitleId: e.target.value
                    })
                  }}></JobTitlesDropdown>
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
                      onChange={(e) => { this.handleChange(e) }}>
                    </CompanyMultiSelectDropDown>
                  </div>
                </div>
              }
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className='row'>
                  {this.state?.data?.length > 0 &&

                    <div className="col-md-3">

                      <i onClick={() => this.handlesortFuntion(selectedProperties.length == 0)}
                        className={sortedProperties.length > 0 ? 'fa-2x fa fa-toggle-on text-success' : 'fa-2x fa fa-toggle-off text-danger'}></i>
                      <label className="pl-2" htmlFor="checkAll">{sortedProperties.length == 0 ? 'Check All' : 'Uncheck All'}</label>

                    </div>
                  }
                </div>
                <div className='row'>
                  {data && data.length > 0 && sortedProperties.map((a, i) => {
                    //checkbox to select which properties to consider in selectedProperties
                    return <div className='col-md-3' key={i}>
                      <input id='cbColor' type="checkbox" checked={selectedProperties.includes(a)} onChange={e => {

                        let selectedProperties = this.state.selectedProperties
                        if (e.target.checked) {
                          this.setState({ checkedValidation: true })
                          selectedProperties.push(a)
                        } else {
                          selectedProperties = selectedProperties.filter(b => b !== a)
                        }
                        this.setState({
                          selectedProperties
                        })
                      }} />
                      <label className="ml-2">{camelize(a)}</label>

                    </div>
                  })}

                </div>

              </div>
              <div className="col-md-12">

              <div className="table-responsive">
                {selectedData && selectedData.length > 0 &&
                  <ButtonGroup>
                    <Button  className='add-btn' size='sm' onClick={() => {
                      this.setState({
                        showPdf: this.state.showPdf ? false : true,
                        showCsv: false
                      })
                    }}>
                      <i className="fa fa-file-pdf-o"></i> PDF
                    </Button>
                    <Button className='add-btn' variant='warning' size='sm' onClick={() => {
                      exportToSortedCsvOrder(selectedData,"Asset","Asset",selectedProperties)
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
          {!verifyViewPermission("Assets Report") && <AccessDenied></AccessDenied>}
        </div>
        {/* /Page Content */}
      </div>
    );
  }
}
