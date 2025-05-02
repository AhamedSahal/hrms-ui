import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { Helmet } from 'react-helmet';
import { itemRender } from "../../paginationfunction";
import { deleteCoupon, getCouponList } from './service';
import CouponForm from './form';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';

const { Header, Body, Footer, Dialog } = Modal;
export default class Coupon extends Component {
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
    getCouponList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
  }
  updateList = (coupon) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == coupon.id);
    if (index > -1)
      data[index] = coupon;
    else {
      data=[coupon,...data];
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
      coupon: undefined
    })
  }
  delete = (coupon) => {
    confirmAlert({
      title: `Delete Coupon ${coupon.name}`,
      message: 'Are you sure, you want to delete this coupon?',
      buttons: [
        {
          className: "btn btn-danger",
          label: 'Yes',
          onClick: () => deleteCoupon(coupon.id).then(res => {
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
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'Code',
        dataIndex: 'code',
        sorter: true,
      },
      {
        title: 'Discount',
        dataIndex: 'discount',
        sorter: true,
      },
      {
        title: 'Limit',
        dataIndex: 'maxLimit',
        sorter: true,
      },
      {
        title: 'Is Active',
        width: 50,
        render: (text, record) => {
          return <span className={text.active ? "badge bg-inverse-success " : "badge bg-inverse-danger"}>
            {text.active ? <i className="pr-2 fa fa-check text-success"></i> : <i className="pr-2 fa fa-remove text-danger"></i>}{
              text.active ? 'Yes' : 'No'
            }</span>
        }
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => (
          <div className="dropdow">
            <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              <a className="dropdown-item" href="#" onClick={() => {
                this.setState({ coupon: text, showForm: true })
              }} >
                <i className="fa fa-pencil m-r-5"></i> Edit</a>
              <a className="dropdown-item" href="#" onClick={() => {
                this.delete(text);
              }}>
                <i className="fa fa-trash-o m-r-5"></i> Delete</a>

            </div>
          </div>
        ),
      },
    ]
    return (
      <div className="adminInsidePageDiv">
      
      < div className = "page-container content container-fluid" >
        <Helmet>
          <title>Coupon Management - WorkPlus</title>
          <meta name="description" content="Login page" />
        </Helmet>
        {/* Page Content */}
        
          {/* Page Header */}
          < div className = "tablePage-header" >
          <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Coupon</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Coupon</li>
                </ul>
              </div>
              <div className="float-right col-auto ml-auto">
                <a href="#" className="mt-2 btn apply-button btn-primary" onClick={() => {
                  this.setState({
                    showForm: true
                  })

                }}><i className="fa fa-plus" /> Add Coupon</a>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">

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
                />

              </div>
            </div>
          </div>
       
        {/* /Page Content */}


        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


          <Header closeButton>
            <h5 className="modal-title">{this.state.coupon ? 'Edit' : 'Add'} Coupon</h5>

          </Header>
          <Body>
            <CouponForm updateList={this.updateList} coupon={this.state.coupon}>
            </CouponForm>
          </Body>


        </Modal>
     
        </div>
       </div>
    );
  }
}
