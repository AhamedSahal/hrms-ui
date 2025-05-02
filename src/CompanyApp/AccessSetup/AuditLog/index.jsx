import { Table } from 'antd';
import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { Helmet } from 'react-helmet';
import { itemRender } from "../../../paginationfunction";
import { getLoginLogList } from './service';
import { getTitle,toLocalDateTime } from '../../../utility';

export default class AuditLog extends Component {
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
    getLoginLogList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => { 
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
      sort: (sorter && sorter.field)? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
    })
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
  render() {
    const { data, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const columns = [
      {
        title: 'Type',
        dataIndex: 'auditType',
        sorter: true
      },
      {
        title: 'Action',
        dataIndex: 'actionType',
        sorter: false
      },
      {
        title: 'Class',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.className.replaceAll("Controller"," ")}</div>
          </>
        }
      },
      {
        title: 'Method',
        dataIndex: 'method',
        sorter: false
      },
      {
        title: 'Comment',
        dataIndex: 'comment',
        sorter: false
      },
      {
        title: 'Created On',
        sorter: true,
        render: (text) => {
          return toLocalDateTime(text.createdOn)
        }
      },
      {
        title: 'IP',
        dataIndex: 'location',
        sorter: false
      },
      {
        title: 'User',
        sorter: true,
        render: (text, record) => {
          return <>
            <div>{record.user?.name}</div>
          </>
        }
      }
    ]
    return (
      <div className="page-wrapper">
        <Helmet>
          <title>Audit Log | {getTitle()}</title>
          <meta name="description" content="Audit Log page" />
        </Helmet>
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <div className="page-header">
            <div className="row align-items-center">
              <div className="col">
                <h3 className="page-title">Audit Log</h3>
                <ul hidden className="breadcrumb">
                  <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                  <li className="breadcrumb-item active">Audit Log</li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">

                <Table className="table-striped table-border"
                  pagination={{
                    total: totalRecords,
                    showTotal: () => { 
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
        </div>
      </div>
    );
  }
}
