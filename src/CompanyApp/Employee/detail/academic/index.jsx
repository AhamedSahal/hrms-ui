import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal, Anchor } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { fileDownload } from '../../../../HttpRequest';
import { itemRender } from '../../../../paginationfunction';
import { verifyEditPermission } from '../../../../utility';
import AcademicForm from './form';
import { deleteAcademic, getAcademicList } from './service';

const { Header, Body, Footer, Dialog } = Modal;
export default class Academic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employeeId: props.employeeId || 0,
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
    getAcademicList(this.state.employeeId, this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

      if (res.status == "OK") {

        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1,
          employeeName: res.data.employeeName
        }, () => {
          console.log(this.state)
        })
      }

    })
  }
  onTableDataChange = (d, filter, sorter) => {
    this.setState(
      {
        page: d.current - 1,
        size: d.pageSize,
        sort: sorter && sorter.field ? `${sorter.field},${sorter.order == "ascend" ? "asc" : "desc"}`: this.state.sort,
      },
      () => {
        this.fetchList();
      }
    );
  };

  pageSizeChange = (currentPage, pageSize) => {
    this.setState(
      {
        size: pageSize,
        page: 0,
      },
      () => {
        this.fetchList();
      }
    );
  };
  updateList = (academic) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == academic.id);
    if (index > -1)
      data[index] = academic;
    else {
      data = [academic, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }

  hideForm = () => {
    this.setState({
      showForm: false,
      academic: undefined
    })
  }

  delete = (data) => {
    confirmAlert({
      title: `Delete Qualification Detail for ${data.qualification}`,
      message: 'Are you sure, you want to delete this Qualification detail?',
      buttons: [
        {
          className: "btn btn-danger",
          label: 'Yes',
          onClick: () => deleteAcademic(data.id).then(res => {
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

    const isEditAllowed = true;// verifyEditPermission("EMPLOYEE");
    const columns = [
      {
        title: 'Qualification',
        dataIndex: 'qualification',
        sorter: true,
      },
      {
        title: 'Field Of Study',
        dataIndex: 'fieldOfStudy',
        sorter: true,
      },
      {
        title: 'Institute',
        dataIndex: 'institute',
        sorter: true,
      },
      {
        title: 'GPA',
        dataIndex: 'gpa',
        sorter: true,
      },
      {
        title: 'Year Of Completion',
        dataIndex: 'yearOfCompletion',
        sorter: true,
      },
      {
        title: 'File Name',
        sorter: true,
        render: (text, record) => {
          return <Anchor onClick={() => {
            fileDownload(text.id, text.employeeId, "EMPLOYEE_EDU_DOCUMENT", text.fileName);
          }}>
            {text.fileName}
          </Anchor>
        }
      },
      {
        title: 'Action',
        width: 50,
        render: (text, record) => (
          <div className="dropdow">
            <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
              <i className="las la-bars"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-right">
              {isEditAllowed && <> <a className="dropdown-item" href="#" onClick={() => {
                let { academic } = this.state;
                academic = text;
                this.setState({ academic, showForm: true })
              }} >
                <i className="fa fa-pencil m-r-5"></i> Edit</a>
                <a className="dropdown-item" href="#" onClick={() => {
                  this.delete(text);
                  console.log(text)
                }}>
                  <i className="fa fa-trash-o m-r-5"></i> Delete</a>
              </>}
            </div>
          </div>
        ),
      },
    ]
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header btn-group-sm text-right">
                {isEditAllowed && <a href="#" className="btn btn-primary" onClick={() => {
                  this.setState({
                    showForm: true
                  })

                }}><i className="fa fa-plus" /></a>}
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
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
          </div>
        </div>
        <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
          <Header closeButton>
            <h5 className="modal-title">{this.state.academic ? 'Edit' : 'Add'} Qualification</h5>
          </Header>
          <Body>
            <AcademicForm updateList={this.updateList} academic={this.state.academic} employeeId={this.state.employeeId}>
            </AcademicForm>
          </Body>
        </Modal>
      </div>
    );
  }
}
