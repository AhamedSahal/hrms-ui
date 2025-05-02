import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { itemRender } from "../../../paginationfunction";
import { verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import TableDropDown from '../../../MainPage/tableDropDown';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import EntityForm from './form';
import { deleteEntity, getEntityList } from './service';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';

const { Header, Body, Footer, Dialog } = Modal;
export default class Entity extends Component {
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
      if(verifyOrgLevelViewPermission("Organize Org Setup")){
      getEntityList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
  
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
  updateList = (entity) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == entity.id);
    if (index > -1)
      data[index] = entity;
    else {
      data = [entity, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }

  hideForm = () => {
    this.setState({
      showForm: false,
      entity: undefined
    },() => {
      this.fetchList();

    })
  }

  delete = (entity) => {
      confirmAlert({
        title: `Delete entity ${entity.name}`,
        message: 'Are you sure, you want to delete this entity?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => deleteEntity(entity.id).then(res => {
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
    const { data, totalRecords, currentPage, size } = this.state
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size + 1)) - 1;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }
    const menuItems = (text) => [
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        this.setState({ entity: text, showForm: true })
      }} >
        <i className="fa fa-pencil m-r-5"></i> Edit</a></div>,
      <div ><a className="muiMenu_item" href="#" onClick={() => {
        this.delete(text);
      }}>
        <i className="fa fa-trash-o m-r-5"></i> Delete</a></div>,
    ]

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
      },
      {
        title: 'Logo',
        width: 50,
        render: (text, record) => {
          return (<div><img
                src={`data:image/jpeg;base64,${text.logoFilePath}`} alt={text.name}
                style={{ width: '50%', height: '50%' }} 
              /></div>);
        },
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
                <h3 className="tablePage-title">Entity</h3>
              </div>
              <div className="float-right col-auto mt-2">
                <div className="row justify-content-end">
                {verifyOrgLevelEditPermission("Organize Org Setup") &&
                  <a href="#" className="btn apply-button btn-primary" onClick={() => {
                    this.setState({
                      showForm: true
                    })

                  }}><i className="fa fa-plus" /> Add Entity</a>}

                </div>
              </div>
            </div>
          </div>
          {/* /Page Header */}
          <div className="row">
            <div className="col-md-12">
              <div className="mt-3 mb-3 table-responsive">
              {verifyOrgLevelViewPermission("Organize Org Setup") &&
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
                />}
                {!verifyOrgLevelViewPermission("Organize Org Setup") && <AccessDenied></AccessDenied>}

              </div>
            </div>
          </div>
        </div>


        {/* /Page Content */}

            <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


                <Header closeButton>
                    <h5 className="modal-title">{this.state.entity ? 'Edit' : 'Add'} Entity</h5>

                </Header>
                <Body>
                    <EntityForm updateList={this.updateList} entity={this.state.entity}>
                    </EntityForm>
                </Body>


            </Modal>

      </>
    );
  }
}
