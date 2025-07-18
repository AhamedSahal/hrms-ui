import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from "../../../paginationfunction";
import PaymentFileForm from './form';
import { getPaymentFileList } from './service';
import TableDropDown from '../../../MainPage/tableDropDown';
import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied'; 
const { Header, Body, Footer, Dialog } = Modal;

export default class PaymentFile extends Component {
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
    if(verifyOrgLevelViewPermission("Module Setup Pay")){
        getPaymentFileList().then(res => {
      if (res.status == "OK") {
        this.setState({
          data: res.data, 
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
  updateList = (documentType) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == documentType.id);
    if (index > -1)
      data[index] = documentType;
    else {
      data = [documentType, ...data];
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
      PaymentFile: undefined
    })
  }
 
  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size));
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (text, record) => {
      const items = [];
       
     
      // view 
        items.push(<div>
          <a className="muiMenu_item" href="#" onClick={() => {
             
            this.setState({ PaymentFile:text, showForm: true })
          
          }} >
            <i className="fa fa-pencil m-r-5"></i> Edit</a>
        </div>
        ); 
       

      return items;
    };
    const columns = [
      {
        title: 'Entity / Company Name',  
        sorter: true,
        render: (text, record) => (<span>
              {text && text.entity ?text.entity.name:text.name}
        </span>)
      },
      {
        title: 'Format Template', 
       // dataIndex: 'formatTemplate',
        sorter: true,
        render: (text, record) => (<span>
              {text && record.formatTemplate == "Universal" ? "Universal" : record.formatTemplate == "AlAnsari_UAE" ? "Al Ansari Exchange - UAE" : record.formatTemplate == "lulu_UAE" ? "Lulu Exchange - UAE" : "-"}
        </span>)
      },
      {
        title: 'Employer Unique ID', 
        dataIndex: 'employerUniqueId',
        sorter: true,
      },
      {
        title: 'Employer MOL ID', 
        dataIndex: 'employerMOLId',
        sorter: true,
      },
      {
        title: 'Bank Name', 
        dataIndex: 'bankName',
        sorter: true,
      },
      {
        title: 'Bank Routing Code', 
        dataIndex: 'bankRoutingCode',
        sorter: true,
      },
      {
        title: 'Agent Code',
        render: (text, record) => (<span>
              {text && text.agentCode?text.agentCode:"-"}
        </span>)
      },
      
      {
        title: 'Action',
        width: 50,
        className: "text-center",
         render: (text, record) => (
            <div className="">
              <TableDropDown menuItems={menuItems(text, record)} />
            </div>
          ),
      },
    ]
    return (
      <div className="page-container content container-fluid">
      {/* Page Header */}
      <div className="tablePage-header">
        <div className="row pageTitle-section">
          <div className="col">
            <h3 className="tablePage-title">Payment File</h3>
          </div>

          <div className="mt-2 float-right col-auto ml-auto">
          {verifyOrgLevelEditPermission("Module Setup Pay") && <a href="#" className="btn apply-button btn-primary" onClick={() => {
                  this.setState({
                    showForm: true
                  })
                }}><i className="fa fa-plus" /> Add</a>}
          </div>

        </div>
      </div>

      {/* /Page Header */}
      <div className="row">
        <div className="col-md-12">
          <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Module Setup Pay") && <Table id='Table-style' className="table-striped "
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
            {!verifyOrgLevelViewPermission("Module Setup Pay") && <AccessDenied></AccessDenied>}
          </div>
        </div>
      </div>

          <Modal enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm} >
            <Header closeButton>
              <h5 className="modal-title">{this.state.PaymentFile ? 'Edit' : 'New'} Payment File</h5>
            </Header>
            <Body>
              <PaymentFileForm updateList={this.updateList} PaymentFile={this.state.PaymentFile}>
              </PaymentFileForm>
            </Body>
          </Modal>

          
        </div>
    );
  }
}
