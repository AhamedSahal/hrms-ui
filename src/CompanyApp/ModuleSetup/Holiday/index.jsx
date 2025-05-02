import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { itemRender } from "../../../paginationfunction";
import { isDateGreaterThanOrEqualsToCurrentDate, verifyOrgLevelViewPermission, verifyOrgLevelEditPermission, getReadableDate } from '../../../utility';
import HolidayForm from './form';
import BranchDropdown from '../../ModuleSetup/Dropdown/BranchDropdown';
import { deleteHoliday, getHolidayist} from './service';

const { Header, Body, Footer, Dialog } = Modal;
export default class Holiday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      validation: false,
      locationName: "",
      locationId:0,
      holidayYear: "",

    };
  }
  // componentDidMount() {
  //   this.fetchList();
  // }
  fetchList = () => {
    if(verifyOrgLevelViewPermission("Module Setup Manage")){
      this.state.locationId != 0 &&  this.state.holidayYear != "" && getHolidayist(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.locationId,this.state.holidayYear).then(res => {
      if (res.status == "OK") {
        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1
        })
      }
    })}
}
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }
  updateList = (holiday) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == holiday.id);
    if (index > -1)
      data[index] = holiday;
    else {
      data=[holiday,...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }
  pageSizeChange = (currentPage, pageSize) => {
    this.setState({
      size: pageSize,
      page: 0
    }, () => {
      this.fetchList();
    })
  }
  hideForm = () => {
    this.setState({
      showForm: false,
      holiday: undefined
    })
  }
  delete = (holiday) => {
    confirmAlert({
      title: `Delete holiday ${holiday.occasion}`,
      message: 'Are you sure, you want to delete this holiday?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteHoliday(holiday.id).then(res => {
            if (res.status == "OK") {
              toast.success(res.message);
              this.fetchList();
            } else {
              toast.error(res.message)
            }
          })
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }
  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const columns = [
      {
        title: 'Date',
        dataIndex: 'date',
        sorter: true,
        render: (text, record) => {
          return <span>{getReadableDate(text)}</span>  
           },
      },
      {
        title: 'Occasion',
        dataIndex: 'occasion',
        sorter: true,
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (obj, record) => (
          <>{ isDateGreaterThanOrEqualsToCurrentDate(new Date(obj.date)) && verifyOrgLevelEditPermission("Module Setup Manage") &&
          <div className="dropdow">
            <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item" href="#" onClick={() => {
                this.setState({ holiday: obj,showForm: true })
              }} >
                <i className="fa fa-pencil m-r-5"></i> Edit</a>
              <a className="dropdown-item" href="#" onClick={() => {
                this.delete(obj);
              }}>
                <i className="fa fa-trash-o m-r-5"></i> Delete</a>
            </div>
          </div>
            }</>
        ),
      },
    ]
    return (
      <>
       {/* Page Content */}
       < div className="page-container content container-fluid" >
          {/* Page Header */}
          < div className="tablePage-header" >
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Holiday</h3>
              </div>
              <div className="mt-2 mb-2 float-right col-auto ml-auto d-flex">
                            <BranchDropdown defaultValue="Select Location"
                            onChange={(e) =>  {
                              this.setState({ 
                                locationId:e.target.value,
                                locationName:e.target.selectedOptions[0].label,
                                
                              }, () => {
                               this.fetchList()
                              }
                               
                                  )}} >
                               </BranchDropdown>
                {/* year */}

                {this.state.locationId > 0 && <select className="form-control" defaultValue={this.state.holidayYear}  style={{marginLeft: "10px"}} 
                  onChange={e => {
                    this.setState({holidayYear: e.target.value}, () => {this.fetchList()})
                  }}>
                  <option value="">Year</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>}
                                                
                          {this.state.locationId > 0 && <><p style={{ width: '16em' }} className="ml-3 mt-2 btn apply-button btn-primary" onClick={() => {
                                this.setState({
                                    showForm: true,
                                })
                            }}><i className="fa fa-plus" />Add</p></>}
                        </div>

            </div>
          </div >

          {/* /Page Header */}
          < div className="row" >
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
                 {verifyOrgLevelViewPermission("Module Setup Manage") && <Table id='Table-style' className="table-striped"
                 pagination={{
                   total: totalRecords,
                   showTotal: (total, range) => { 
                     return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                   },
                   showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                   itemRender: itemRender,
                   pageSizeOptions: [10, 20, 50, 100],
                   current: currentPage,
                   defaultCurrent: 1,
                 }}
                 style={{ overflowX: 'auto' }}
                 columns={columns}
                 // bordered
                 dataSource={[...data]}
                 rowKey={record => record.id}
                 onChange={this.onTableDataChange}
               />}
               {!verifyOrgLevelViewPermission("Module Setup Manage") && <AccessDenied></AccessDenied>}
            </div>

          </div >

          </div >


        {/* /Page Content */}
        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
          <Header closeButton>
            <h5 className="modal-title">{this.state.holiday ? 'Edit' : 'Add'} Holiday</h5>
          </Header>
          <Body>
            <HolidayForm locationId={this.state.locationId} locationName={this.state.locationName} updateList={this.updateList} holiday={this.state.holiday}>
            </HolidayForm>
          </Body>
        </Modal>
        </div >
      </>
    );
  }
}
