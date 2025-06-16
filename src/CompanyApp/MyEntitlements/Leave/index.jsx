import { Table } from 'antd';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getUserType, getEmployeeId, getPermission, verifyViewPermission, verifyApprovalPermission, verifyViewPermissionForTeam, getCompanyId } from '../../../utility';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import LeaveEntitlementForm from './form';
import { getLeaveBalance } from './service';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { getLeaveTypeCompanyList } from '../../ModuleSetup/LeaveType/service';
import { Tooltip } from 'antd';
const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() === 'COMPANY_ADMIN';
const isCompanyId = getCompanyId();
export default class Leave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      dataWA: [],
      dataLeave: [],
      defaultEmployeeId: getEmployeeId(),
      defaultYear: this.props?.data ? new Date().getFullYear() : "",
      defaultYearWA: this.props?.data ? new Date().getFullYear() : "",
      years: [],
      isIdeal: true,
      self: isCompanyAdmin ? 0 : 1,
      buttonState: true,
      isCalender: 0,
      dataLength: 0,
      yearWA: [],
      yearWALength : 0,
      employeeValidation: false,
      yearValidation: true
    };
  }
  componentDidMount() {
    let defaultEmployeeId = getEmployeeId();
    let dataLeave = [];   
    if(defaultEmployeeId != 0){
    getLeaveTypeCompanyList(defaultEmployeeId).then(res =>{
      if (res.status == "OK") {  
        let tempData = res.data;
        let calenderCount = 0;
        let workAnniversaryCount = 0;
        tempData.length > 0 && tempData.map((res) => {
          if(res.entStartMode == 0){
            calenderCount = calenderCount+1;
          }else{
            workAnniversaryCount = workAnniversaryCount+1;
          }
        })
        this.setState({ 
          dataLeave: res.data,
          yearWALength: workAnniversaryCount,
          dataLength: calenderCount,
          defaultYearWA:new Date().getFullYear(),
          defaultYear:new Date().getFullYear() },() => {
            if(!isCompanyAdmin){
              this.setState({employeeValidation : true})
              this.fetchList(); 
            }
          });}
          else{
            this.setState({
              dataLeave: []
            }, () => {
              if(!isCompanyAdmin){
                this.setState({employeeValidation : true})
                this.fetchList(); 
              }
            })
            toast.error(res.message);
          }
    });  }
    
    if (!isCompanyAdmin) {
      //  this.fetchList(); 
      }
    
  }

fetchData = () => {
  const {defaultEmployeeId } = this.state
  if(defaultEmployeeId != 0){
    getLeaveTypeCompanyList(defaultEmployeeId).then(res =>{
      if (res.status == "OK") {  
        let tempData = res.data;
        let calenderCount = 0;
        let workAnniversaryCount = 0;
        tempData.length > 0 && tempData.map((res) => {
          if(res.entStartMode == 0){
            calenderCount = calenderCount+1;
          }else{
            workAnniversaryCount = workAnniversaryCount+1;
          }
        })
        this.setState({ 
        dataLeave: res.data,
        yearWALength: workAnniversaryCount,
        dataLength: calenderCount}, () => {this.fetchList() });}
        else{
          this.setState({
            dataLeave: []
          },() => {this.fetchList() })
          toast.error(res.message);
        }
    });  } 

}

  fetchList = () => {
    const { isIdeal, defaultEmployeeId, defaultYear,defaultYearWA,dataLeave,isCalender } = this.state
   
    
    if (!isIdeal) {
      return;
    }   
     
    let years = [];
    let count = this.state.dataLength > 0 ? new Date().getFullYear() + 1 : new Date().getFullYear();
    for (var i = 2020; i <= count; i++) { 
      years.push(i);
    }
    this.setState({
      years
    });
    // work anniversary year 
    let yearWA = [];
    let countWA = this.state.yearWALength > 0 ? new Date().getFullYear() : new Date().getFullYear()-1;
    for (var i = 2020; i <= countWA; i++) { 
      yearWA.push(i);
    }
    this.setState({
      yearWA
    });

    // work anniversary year 
    this.setState({
      isIdeal: false,
      defaultYear: this.state.employeeValidation?new Date().getFullYear():this.state.defaultYear,
      defaultYearWA: this.state.employeeValidation?new Date().getFullYear():this.state.defaultYearWA,
    }, () => {
      console.log(!defaultEmployeeId, !defaultYear);
      if ((!defaultYear || !defaultEmployeeId) && (!defaultEmployeeId || !defaultYearWA) && !this.state.employeeValidation) {
        this.setState({
          data: [],
          showForm: false,
          isIdeal: true
        })
        return;
      }
     
      if (verifyViewPermission("LEAVE BALANCE")) {
        if(this.state.isCalender == 0 || this.state.employeeValidation){
        getLeaveBalance(defaultEmployeeId, this.state.employeeValidation?new Date().getFullYear():defaultYear,0).then(res => {
          this.setState({
            isIdeal: true
          }); 
          if (res.status == "OK") {
            this.setState({
              data: res.data,
              showForm: false
            })
          } else {
            this.setState({
              data: [],
              showForm: false
            })
            if(!this.state.yearValidation){
              toast.error(res.message);

            }
          }

        })}
        if(this.state.isCalender == 1 || this.state.employeeValidation){
        getLeaveBalance(defaultEmployeeId, this.state.employeeValidation?new Date().getFullYear():defaultYearWA,1).then(res => {
          this.setState({
            isIdeal: true
          }); 
          if (res.status == "OK") {
            this.setState({
              dataWA: res.data,
              defaultYear:res.data.year,
              showForm: false
            })
          } else {
            this.setState({
              dataWA: [],
              showForm: false
            })
            if(!this.state.yearValidation){
              toast.error(res.message);

            }
          }

        })}
      }
       this.setState({employeeValidation: false})
    });
    
  }
  updateSelf = () => {
    this.setState({
      self: this.state.self == 1 ? 0 : 1
    }, () => {
      this.fetchList();
    })
  }
  onEmployeeChange = (employeeId) => {
    this.setState({
      defaultEmployeeId: employeeId,
      employeeValidation: true
    }, () => {
      this.fetchData();
    });

  }
  onYearChange = (year) => { 
    this.setState({
      defaultYear: year,
      isCalender : 0,
      yearValidation: false
    }, () => {
      if(year != "" && year > 0){
        this.fetchList();

      }
    });

  }
  onYearChangeWorkAnniverSary = (year) => { 
    
    this.setState({
      defaultYearWA: year,
      isCalender : 1,
      yearValidation: false
    }, () => {
      if(year != "" && year > 0){
        this.fetchList();

      }
    });

  }
  hideForm = () => {
    this.setState({
      showForm: false,
    })
  }
  editOpeningBalance(leaveTypeId, openingBalance) {
    this.setState({
      selectedLeaveType: leaveTypeId,
      openingBalance,
      showForm: true,
    });
  }
  
  handleButtonClick = () => {
    this.setState((prevState) => ({
      buttonState: !prevState.buttonState,
      preferredMethod: prevState.buttonState ? 'Self' : 'Team'
    }));
  };
  render() {
    const { data,dataWA, years, defaultYear,defaultYearWA,buttonState,yearWA } = this.state
    const tableData = data.details;
    const tableDataWA = dataWA.details;
    const columns = [
      {
        title: 'Leave Type',
        render: (text, record) => {
          return <span>{record.leaveType?.name}</span>
        },
        sorter: true,
      },
      {
        title: ( 
          <>Opening Balance<Tooltip title="Leave balance carried over from the previous year, if applicable.">
            <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
          </Tooltip></>
        ),
        render: (text, record) => {
          return record.allowEditOpeningBalance && verifyApprovalPermission("LEAVE BALANCE") ? <span>{record.openingBalance.toFixed(2)} <i onClick={e => {
            this.editOpeningBalance(record.leaveType?.id, record.openingBalance)
          }} className="ml-2 fa fa-edit"></i></span> : <span>{record.openingBalance.toFixed(2)}</span>
        },
        sorter: false,
        align: 'center',
      },
      {
        title: (<>Entitlement Period <Tooltip title="The period for which the leave entitlement is calculated, either Date of Joining to 31st December or from Date of Joining anniversary to the next year.">
              <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
          </Tooltip></> ),
        render: (text, record) => {
          return <span>{record.entStartMode == 0 ?  "1st Jan - 31st Dec" : record.entStartMode == 1 ? "0" : "1st Jan - 31st Dec"}</span>
        },
        sorter: false,
        align: 'center',
      },
      {
        title: (<>Eligibility<Tooltip title="Leave eligibility for the current year based on entitlement and accrual settings.">
             <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
          </Tooltip></> ), 
        sorter: false,
        align: 'center',
        render: (text, record) => {
          return <span>{parseFloat(record.eligibility).toFixed(2)}</span>
        },
      },
      {
        title: (<>Total Eligible<Tooltip title="Total leave available, including eligibility for the year and any opening balance.">
           <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
        </Tooltip></> ),
        sorter: false, 
        align: 'center',
        render: (text, record) => {
          return <span>{parseFloat(record.totalEligible).toFixed(2)}</span>
        },
      },
      {
        title: (<>Leave Availed<Tooltip title="The number of leave days the employee has taken so far in the year.">
           <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
        </Tooltip></> ),
        dataIndex: 'leaveAvailed',
        sorter: false,
        align: 'center',
      }, {
        title: (<>Accrued<Tooltip title="The amount of leave accrued up to the current date if accrual is turned on.">
           <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
        </Tooltip></> ),
        render: (text, record) => {
          return <span>{parseFloat(record.accrued).toFixed(2)}</span>
        },
        sorter: false,
        align: 'center',
      },
      {
        title: (<>Leave Lapse<Tooltip title="The number of leave days that expire if not carried forward past the cutoff date.">
           <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
        </Tooltip></> ),
        render: (text, record) => {
          return <span>{text.leaveLapse}</span>
        },
        sorter: false,
        align: 'center',
      },
      {
        title: (<>Leave Balance<Tooltip title="The current available leave balance, which becomes the opening balance for the next period (Calendar Days: January 1, Date of Joining: Anniversary Date).">
           <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
        </Tooltip></> ),
        render: (text, record) => {
          return <span>{parseFloat(record.leaveBalance).toFixed(2)}</span>
        },
        sorter: false,
        align: 'center',
      },
    ]

    // columns 1
    const columns1 = [
      {
        title: 'Leave Type',
        render: (text, record) => {
          return <span>{record.leaveType?.name}</span>
        },
        sorter: true,
      },
      {
        title: ( 
          <>Opening Balance<Tooltip title="Leave balance carried over from the previous year, if applicable.">
            <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
          </Tooltip></>
        ),
        render: (text, record) => {
          return record.allowEditOpeningBalance && verifyApprovalPermission("LEAVE BALANCE") ? <span>{record.openingBalance.toFixed(2)} <i onClick={e => {
            this.editOpeningBalance(record.leaveType?.id, record.openingBalance)
          }} className="ml-2 fa fa-edit"></i></span> : <span>{record.openingBalance.toFixed(2)}</span>
        },
        sorter: false,
        align: 'center',
      },
      
      {
        title: (<>Eligibility<Tooltip title="Leave eligibility for the current year based on entitlement and accrual settings.">
             <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
          </Tooltip></> ), 
        sorter: false,
        align: 'center',
        render: (text, record) => {
          return <span>{parseFloat(record.eligibility).toFixed(2)}</span>
        },
      },
      {
        title: (<>Total Eligible<Tooltip title="Total leave available, including eligibility for the year and any opening balance.">
           <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
        </Tooltip></> ),
        sorter: false, 
        align: 'center',
        render: (text, record) => {
          return <span>{parseFloat(record.totalEligible).toFixed(2)}</span>
        },
      },
      {
        title: (<>Leave Availed<Tooltip title="The number of leave days the employee has taken so far in the year.">
           <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
        </Tooltip></> ),
        dataIndex: 'leaveAvailed',
        sorter: false,
        align: 'center',
      }, {
        title: (<>Accrued<Tooltip title="The amount of leave accrued up to the current date if accrual is turned on.">
           <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
        </Tooltip></> ),
        render: (text, record) => {
          return <span>{parseFloat(record.accrued).toFixed(2)}</span>
        },
        sorter: false,
        align: 'center',
      },
      {
        title: (<>Leave Lapse<Tooltip title="The number of leave days that expire if not carried forward past the cutoff date.">
           <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
        </Tooltip></> ),
        render: (text, record) => {
          return <span>{text.leaveLapse}</span>
        },
        sorter: false,
        align: 'center',
      },
      {
        title: (<>Leave Balance<Tooltip title="The current available leave balance, which becomes the opening balance for the next period (Calendar Days: January 1, Date of Joining: Anniversary Date).">
           <i className="fa fa-info-circle" style={{ marginLeft: '2px', cursor: 'pointer' }}></i>
        </Tooltip></> ),
        render: (text, record) => {
          return <span>{parseFloat(record.leaveBalance).toFixed(2)}</span>
        },
        sorter: false,
        align: 'center',
      },
    ]
    return (
      <>
        {verifyViewPermission("LEAVE BALANCE") && <>
          <div className="page-container content container-fluid">

            {/* Page Header */}
            <div className="tablePage-header">
              <div className="row pageTitle-section">
                <div className="col">
                  <h3 className="tablePage-title">Leave Balance</h3>
                </div>
                <div className="row leave-balance-table"> 

                  {verifyViewPermissionForTeam("LEAVE") && !isCompanyAdmin && <div className="col-sm-2" style={{marginRight: '100px',marginTop: '10px'}}>
                    <div onClick={e => {
                      this.updateSelf()
                      this.handleButtonClick()
                    }} className="toggles-btn-view" id="button-container">

                      <div id="my-button" className="toggle-button-element" style={{ transform: buttonState ? 'translateX(0px)' : 'translateX(80px)' }}>
                        <p className='m-0 self-btn'>{buttonState ? 'Self' : 'Team'}</p>

                      </div>
                      <p className='m-0 team-btn' style={{ transform: buttonState ? 'translateX(0px)' : 'translateX(-80px)' }}>{buttonState ? 'Team' : 'Self'}</p>
                    </div>

                  </div>}
                  {verifyViewPermissionForTeam("LEAVE BALANCE") && this.state.self != 1 && <div className="col-sm-4 col-md-4">
                    <EmployeeDropdown nodefault={false} permission={getPermission("LEAVE BALANCE", "VIEW")} onChange={e => {
                      this.onEmployeeChange(e.target.value)
                    }}></EmployeeDropdown>
                  </div>}
                  
                </div>
              </div>
            </div>

            {/* /Page Header */}
            <div className="mt-2 row">
              <div className="col-md-12">
                <div className="mb-3 table-responsive">

                <div className='profileFormHead'style={{width: "100%"}}>
                  <div className='profileFormHeadContent'>
                      <h3 className='dvlp-left-align'>Leave Based on Calendar</h3>
                      <div className='dvlp-right-align'>
                          {/* <i 
                              className={`dvlpCardIcon ml-2 fa fa-xl fa-chevron-down`}
                              aria-hidden='true'
                          ></i> */}
                      </div>
                      <div className="mb-2 col-sm-4 col-md-3">
                    <select value={defaultYear} className="form-control"
                      onChange={e => {
                        this.onYearChange(e.target.value)
                      }}>
                      <option value="" selected={true}>Select Year</option>
                      {years.map((year, index) => (
                        <option key={index} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  </div>
                  { (
                      <div className={`mt-2 'profileFormBodyVisible'}`}>
                          {(this.state.defaultEmployeeId != 0 || !verifyViewPermissionForTeam("LEAVE BALANCE")) && tableData && <>
                          <Table id='Table-style' className="table-striped"
                            style={{ overflowX: 'auto' }}
                            columns={columns}
                            // bordered
                            dataSource={[...tableData]}
                            rowKey={record => record.id}
                            pagination={false}
                          />
                        </>}
                      </div>
                  )}

                </div>

                <div className='profileFormHead' style={{width: "100%"}}>
                    <div className='profileFormHeadContent'>
                        <h3 className='dvlp-left-align'>Leave Based on Work Anniversary</h3>
                        <div className='dvlp-right-align'>
                            {/* <i 
                                className={`dvlpCardIcon ml-2 fa fa-xl fa-chevron-down`}
                                aria-hidden='true'
                            ></i> */}
                        </div>
                        <div className="mb-2 col-sm-4 col-md-3">
                        <select value={defaultYearWA} className="form-control"
                          onChange={e => {
                            this.onYearChangeWorkAnniverSary(e.target.value)
                          }}>
                          <option value=""  >Select Year</option>
                          {yearWA.map((year, index) => (
                            <option key={index} value={year}>
                              {year} - {year + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    { (
                    <div className={`mt-2 'profileFormBodyVisible'}`}>
                        {(this.state.defaultEmployeeId != 0 || !verifyViewPermissionForTeam("LEAVE BALANCE")) && tableDataWA && <>
                        <Table id='Table-style' className="table-striped"
                          style={{ overflowX: 'auto' }}
                          columns={columns1}
                          // bordered
                          dataSource={[...tableDataWA]}
                          rowKey={record => record.id}
                          pagination={false}
                        />
                      </>}
                    </div>
                    )}

                </div>
                </div>
              </div>
            </div>
          </div>
          <Modal enforceFocus={false} size={"md"} show={this.state.showForm && verifyApprovalPermission("LEAVE BALANCE")} onHide={this.hideForm} >
            <Header closeButton>
              <h5 className="modal-title">Edit Opening Balance</h5>
            </Header>
            <Body>
              <LeaveEntitlementForm updateList={this.fetchList} currentOpeningBalance={this.state.openingBalance} leaveTypeId={this.state.selectedLeaveType} year={this.state.defaultYear} employeeId={this.state.defaultEmployeeId}>
              </LeaveEntitlementForm>
            </Body>
          </Modal>
        </>}
        {!verifyViewPermission("LEAVE BALANCE") && <AccessDenied></AccessDenied>}
      </>
    );
  }
}
