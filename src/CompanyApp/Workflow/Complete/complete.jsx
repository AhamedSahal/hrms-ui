import React, { Component } from 'react';
import { itemRender } from '../../../paginationfunction';
import { Table } from 'antd';
import { Modal, Anchor } from 'react-bootstrap';
import WorkflowView from '../Process/viewPage';
import { confirmAlert } from 'react-confirm-alert';
import { deleteWorkflow } from '../Process/service';
import { toast } from 'react-toastify';
import { getWorkFlowList } from '../Action/service';
import { fileDownload } from '../../../HttpRequest'; 
import TableDropDown from '../../../MainPage/tableDropDown';
import { verifyOrgLevelViewPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;
export default class CompletedWorkflow extends Component {
  constructor() {
    super();
    this.state = {
      isVisible:false,
      status: "COMPLETED",
      q: "",
      data:[],
      viewInfo: [],
      page: 0,
      size: 10,
      sort: "id,desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1
    };

  }

  componentDidMount(){
    this.fetchList(); 

   }

   fetchList = () => {
    if(verifyOrgLevelViewPermission("Workflow")){
      (this.state.workFlowId != 0 && getWorkFlowList(this.state.q, this.state.page, this.state.size, this.state.sort,this.state.status,1).then(res => {
        if (res.status == "OK") { 
            this.setState({
                data: res.data,
                totalRecords: res.data.length,
            })
        }
    }))
  }
}

handleViewForm = (data) => {
  this.setState({ showForm: true })
  this.setState({viewInfo: data})
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
  render() {
    const { data, totalPages, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (text, record) => [
      <div > <a className="dropdown-item" href="#"
      onClick={() => this.handleViewForm(text)}
   ><i className="fa fa-eye m-r-5" />
     <b>View</b></a></div>,
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
        render: (text,action) => {
          return <span className='badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i> Completed</span>;
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
      },
      
     
    ]
    return (
      <>
        <div className="page-container content container-fluid">
          {/* Page Header */}
          <div className="tablePage-header">
            <div className="row pageTitle-section">
              <div className="col">
                <h3 className="tablePage-title">Completed</h3>
              </div>

            </div>
          </div>
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

        <Modal enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm} >
        <Header closeButton>
            <h5 className="modal-title">Workflow View</h5>
          </Header>
          <Body>
            <WorkflowView workflowprocess={this.state.viewInfo}></WorkflowView>

          </Body>
        </Modal>


      </>
    );
  }
}
