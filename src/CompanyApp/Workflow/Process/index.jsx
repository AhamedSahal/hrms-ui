import { Table } from 'antd';
import React, { Component } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { itemRender } from '../../../paginationfunction';
import { Modal, Anchor } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import { deleteWorkflow,getcheckassignee,getProcessList } from './service';
import { toast } from 'react-toastify';
import { verifyOrgLevelViewPermission } from '../../../utility';
import { fileDownload } from '../../../HttpRequest'; 
import WorkflowProcessForm from './processForm';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;

export default class Process extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: true,
      data: [],
      dropDownData:[],
      q: "",
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      employeeId: 0
    };
  }
  componentDidMount(){
    this.fetchList(); 
    this.getDropdownList();
  }
  getDropdownList = () => {
    if(verifyOrgLevelViewPermission("Workflow")){
    getcheckassignee(this.state.q, this.state.page, this.state.size, this.state.sort).then((res) => {
      if(res.status == "OK" ){
          this.setState({dropDownData:res.data.list })  

      }else{
          toast.error(res.message);
      }
  })
  }
  }
  fetchList = () => {
    if(verifyOrgLevelViewPermission("Workflow")){
    getProcessList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
        if (res.status == "OK") {
            this.setState({ 
                data: res.data,
                totalRecords: res.data.length,
            })
        }
    })
  }
}
  delete = (data) => {
    confirmAlert({
      title: `Delete Workflow`,
      message: 'Are you sure, you want to delete this Workflow?',
      buttons: [
        {
          className: "btn btn-danger",
          label: 'Yes',
          onClick: () => deleteWorkflow(data.id).then(res => {
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
    })
  } 
closeForm = () => {
    this.hideForm()
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
        title: 'Workflow Name',
        render: (text) => {
          return <>
            <div>{text.workflowautomate?.name}</div>
          </>
        },
        sorter: false,
      },
      {
        title: 'Step Name',
        render: (text) => {
          return <>
            <div>{text.workflowstepautomate?.name}</div>
          </>
        },
        sorter: false,
      },
      {
        title: 'Comment',
        render: (text) => {
          return <>
            <div>{text.comment}</div>
          </>
        },
        sorter: false,
      },
      {
        title: 'Attachment',  
        width: 50,
        render: (text) => {
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
        render: (text) => {
          return <span>{text.status == "PROCESS" || text.status == "SEND"?"Waiting for approval":"-"}</span>
         }
      },
    ]
    return (
      <>
        
          {/* Page Header */}
          {<div className="row justify-content-end">
          { 
              <div className="mt-2 d-flex float-right col-auto ml-auto" style={{ paddingRight: "50px" }}>
                  <p onClick={() => this.setState({ showForm: true })} className='btn apply-button btn-primary mt-2'> <i className="fa fa-hourglass-start" /> Initiate</p>
              </div>}
          </div>}
          <div className="page-container content container-fluid">
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Workflow Process</h3>
              </div>
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
                    showTotal: () => {
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
                <h5 className="modal-title">Workflow Form</h5>
            </Header>
            <Body>
                <WorkflowProcessForm workflowprocess={this.state.workflowprocess}></WorkflowProcessForm>

            </Body>
        </Modal> }

      </>
    );
  }
}
