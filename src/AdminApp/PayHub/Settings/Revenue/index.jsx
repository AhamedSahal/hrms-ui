import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { itemRender } from '../../../../paginationfunction';
import RegionForm from './form';
import { toast } from 'react-toastify';
import { deletePayHubRevenue } from './service';

const datas = [{id:0 , name: 'Small', active: true},{id:1 , name: 'Medium', active: true},
{id:1 , name: 'Large', active: true}]

const { Header, Body, Footer, Dialog } = Modal;
export default class Revenue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: datas,
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1
    };
  }
//   componentDidMount() {
//     this.fetchList();
//   }
//   fetchList = () => {
//       getPayHubRevenueList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
//         if (res.status == "OK") {
//           this.setState({
//             data: res.data.list,
//             totalPages: res.data.totalPages,
//             totalRecords: res.data.totalRecords,
//             currentPage: res.data.currentPage + 1
//           })
//         }
//       })
    
//   }
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }
  updateList = (revenue) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == revenue.id);
    if (index > -1)
      data[index] = revenue;
    else {
      data = [revenue, ...data];
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
      branch: undefined
    })
  }
  delete = (revenue) => {
    confirmAlert({
      title: `Delete Region ${revenue.name}`,
      message: 'Are you sure, you want to delete this Region?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deletePayHubRevenue(revenue.id).then(res => {
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
  getStyle(text) {
    if (text) {
      return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>;
    }
    if (!text) {
      return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Inactive</span>;
    }
    return 'black';
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
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'Status',
        dataIndex: 'active',
        render: (text, record) => {
          return <><div >{this.getStyle(text)}</div>
          </>
        }
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => (
          <div className="dropdow">
             <><a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
              <div className="dropdown-menu dropdown-menu-right">
                <a className="dropdown-item" href="#" onClick={() => {
                  this.setState({ region: text, showForm: true })
                }} >
                  <i className="fa fa-pencil m-r-5"></i> Edit</a>
                <a className="dropdown-item" href="#" onClick={() => {
                  this.delete(text);
                }}>
                  <i className="fa fa-trash-o m-r-5"></i> Delete</a>
              </div></>
          </div>
        ),
      },
    ]
    return (
      <>
        {/* Page Content */}
        <div className="page-container content container-fluid">
          {/* Page Header */}
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Revenue</h3>
              </div>

              <div className="mt-2 float-right col-auto ml-auto">
                 <a href="#" className="btn apply-button btn-primary" onClick={() => {
                  this.setState({
                    showForm: true
                  })
                }}><i className="fa fa-plus" /> Add</a>
              </div>

            </div>
          </div>

          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              <Table id='Table-style' className="table-striped "
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
                />
              </div>
            </div>
          </div>


          {/* /Page Content */}
          <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
            <Header closeButton>
              <h5 className="modal-title">{this.state.revenue ? 'Edit' : 'Add'} Region</h5>
            </Header>
            <Body>
              <RegionForm updateList={this.updateList} revenue={this.state.revenue}>
              </RegionForm>
            </Body>
          </Modal>
        </div>
      </>
    );
  }
}
