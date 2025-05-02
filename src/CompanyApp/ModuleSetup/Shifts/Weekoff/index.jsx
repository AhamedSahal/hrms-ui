import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { itemRender } from "../../../../paginationfunction";
import { getTitle, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../../utility'; 
import WeekoffForm from './form';
import {  getWeekoffList,deleteWeekoff } from './service';
import AccessDenied from '../../../../MainPage/Main/Dashboard/AccessDenied';

const { Header, Body, Footer, Dialog } = Modal;
export default class WeekoffList extends Component {
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
      currentPage: 1
    };
  }
  componentDidMount() {
    this.fetchList();
  }
  fetchList = () => {
    {verifyOrgLevelViewPermission("Module Setup Manage") &&
    getWeekoffList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

      if (res.status == "OK") {
        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1
        })
      }
    })
    }
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
  updateList = (WeekoffList) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == WeekoffList.id);
    if (index > -1)
      data[index] = WeekoffList;
    else {
      data=[WeekoffList,...data];
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
   
  delete = (WeekoffList) => {
    console.log(WeekoffList);
    confirmAlert({
      title: `Delete weekly off  ${WeekoffList.weekoffname}`,
      message: 'Are you sure, you want to delete this weekly off?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteWeekoff(WeekoffList.id).then(res => {
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

hideForm = () => {
  this.setState({
    showForm: false,
    shifts: undefined
  })
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
        title: 'Weekly Off Name',
        dataIndex: 'weekoffname',
        sorter: true
      },
      {
        title: 'Weekly Off Code Name',
        dataIndex: 'weekoffcodename',
        sorter: true
        
      },
      {
        title: 'Description',
        sorter: true,
        render: (text, record) => {
            return <>
              <div>{record.description ? record.description : "-"} </div>
            </>
          } 
      },
      {
        title: 'Weekoff Days',
        sorter: true,
        dataIndex: "weeklyOffs"
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => (
          <div className="dropdow">
            {verifyOrgLevelEditPermission("Module Setup Manage") &&<><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item" href="#" onClick={() => {
                this.setState({ Weekoff: text, showForm: true })
              }} >
                <i className="fa fa-pencil m-r-5"></i> Edit</a>
              <a className="dropdown-item" href="#" onClick={() => {
                this.delete(text);
              }}>
                <i className="fa fa-trash-o m-r-5"></i> Delete</a>

            </div></>}
          </div>
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
                <h3 className="tablePage-title">Weekly Off</h3>
              </div>

              <div className="mt-2 float-right col-auto ml-auto">
              {verifyOrgLevelEditPermission("Module Setup Manage") && <a href="#" className="btn apply-button btn-primary" onClick={() => {
                  this.setState({
                    showForm: true
                  })

                }}><i className="fa fa-plus" /> Add</a>}
              </div>

            </div>
          </div >

          {/* /Page Header */}
          < div className="row" >
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Module Setup Manage") &&
                <Table id='Table-style' className="table-striped"
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




        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
          <Header  closeButton>
            <h5 className="modal-title">Weekoff</h5>
          </Header>
         <Body>
            <WeekoffForm updateList={this.updateList} Weekoff={this.state.Weekoff}>
            </WeekoffForm>
          </Body> 


        </Modal>

         
      </div>
      </>
    );
  }
}
