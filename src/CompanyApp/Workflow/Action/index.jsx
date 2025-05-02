import { Table } from 'antd';
import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { itemRender } from '../../../paginationfunction';
import { Modal, Anchor } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import {  getActionList } from './service';
import { toast } from 'react-toastify';
import { getEmployeeId, verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import { fileDownload } from '../../../HttpRequest'; 
import WorkFlowAutomateDropdown from '../../ModuleSetup/Dropdown/WorkFlowAutomateDropdown';
import WorkflowActionForm from './actionForm';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;

export default class Action extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: true,
      data: [],
      dropDownData:[],
      workFlowMainData: [],
      q: "",
      stepId: 0,
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      employeeId: 0,
      workFlowId: "",
      status: "SEND"
    };
  }

  fetchList = () => {
    if(verifyOrgLevelViewPermission("Workflow")){
      (this.state.workFlowId != 0 && getActionList(this.state.q, this.state.page, this.state.size, this.state.sort,this.state.workFlowId,this.state.status).then(res => {

        if (res.status == "OK") { 
            this.setState({
                data: res.data,
                totalRecords: res.data.length,
            })
        }else{
          this.setState({data: []})
        }
    }))
  }
}
 
  handleShowForm =(id,data) => {
    this.setState({workFlowMainData: data})
    this.setState({stepId: id})
    this.setState({ showForm: true })
    
  }
  hideForm = () => {
    this.setState({
      showForm: false,
    })
  } 
closeForm = (value) => {
    this.hideForm()
}
  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    const menuItems = (text, record) => [
      <div ><a className="muiMenu_item" href="#"
        onClick={(e) => { this.handleShowForm(text.id, text); }} >
        <i className="fa fa-plus-square-o m-r-5" />  Action form</a></div>,
    ]

    const columns = [
      {
        title: 'Workflow Name',
        render: (text, record) => {
          return <>
            <div>{text.workflowautomate?.name}</div>
          </>
        },
        sorter: false,
      },
      {
        title: 'Step Name',
        render: (text, record) => {
          return <>
            <div>{text.workflowstepautomate?.name}</div>
          </>
        },
        sorter: false,
      },
      {
        title: 'Comment',
        render: (text, record) => {
          return <>
            <div>{text.comment}</div>
          </>
        },
        sorter: false,
      },
      {
        title: 'Attachment',  
        width: 50,
        render: (text, record) => {
            return <Anchor onClick={() => {
              fileDownload(text.id, text.id, "WORKFLOW", text.fileName); 
            }}title={text.fileName}>
            <i className='fa fa-download'></i> Download
            </Anchor>
          }

    },
      {
        title: 'Status',
        sorter: true,
        render: (text,record) => {
         return <span>{text.status == "PROCESS" || text.status == "SEND" ?"Waiting for approval":"-"}</span>
        }

      },
      {
        title: 'Action',
        width: 50,
        className: 'text-center',
        render: (text, record) => (
          <div className="">
            <TableDropDown menuItems={menuItems(text, record)} />
          </div>
        ),
      }
    ]
    return (
      <>
        
          {/* Page Header */}
          <div className="page-container content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col-auto">
                <h3 className="tablePage-title">Workflow Action</h3>
              </div>
              {
              <div className="mt-2 mb-2 float-right col-auto ml-auto d-flex">
                  <WorkFlowAutomateDropdown defaultValue="Select Workflow"
                  onChange={(e) => {
                      this.setState({ workFlowId:e.target.value},
                      () => {this.fetchList()}    
                          )
                  }}
                  >

                  </WorkFlowAutomateDropdown>
                    
              </div>}
            </div>
          </div>
          
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Workflow") && 
                <Table id='Table-style' className="table-striped "
                  pagination={{
                    total: totalRecords,
                    showTotal: (total, range) => {
                      return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                    },
                    showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                    itemRender: itemRender,
                    // pageSizeOptions: [30, 50, 100],
                    // current: currentPage,
                    defaultCurrent: 1,
                  }}
                  style={{ overflowX: 'auto' }}
                  columns={columns}
                  dataSource={[...data]}
                />}
                {!verifyOrgLevelViewPermission("Workflow") && <AccessDenied></AccessDenied>}
              </div>
            </div>
          </div>
        </div>

      
        { 
        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
            <Header closeButton>
                <h5 className="modal-title">Action Form</h5>
            </Header>
            <Body>
                <WorkflowActionForm stepId={this.state.stepId} workflowprocess={this.state.workflowprocess} workFlowMainData = {this.state.workFlowMainData}></WorkflowActionForm>

            </Body>
        </Modal> }

      </>
    );
  }
}
