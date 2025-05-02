import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { itemRender } from "../../paginationfunction";
import { getOrderList } from './service';

const { Header, Body, Footer, Dialog } = Modal;
export default class Order extends Component {
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
    getOrderList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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
  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const columns = [ 
      {
        title: 'Order Id',
        dataIndex: 'orderId',
        sorter: true,
      },
      {
        title: 'Company',
        dataIndex: 'company',
        sorter: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        sorter: true,
      },
      {
        title: 'Plan',
        render:(text, record) => {   
          return <span>{text.planEntity.name}</span>
        }
      },
      {
        title: 'Amount',
        render:(text, record) => {   
          return <span>{text.planEntity.price}</span>
        }
      },
      {
        title: 'Date',
        dataIndex: 'createdOn',
      },  
    ]
    return (
      <div className="adminInsidePageDiv">
      
      < div className = "page-container content container-fluid" >
        <Helmet>
          <title>Orders - WorkPlus</title>
          <meta name="description" content="Orders" />
        </Helmet>
        {/* Page Content */}
        < div className = "tablePage-header" >
          <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Orders</h3>
                <ul className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Orders</li>
                </ul>
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
      </div>
      </div>
    );
  }
}
