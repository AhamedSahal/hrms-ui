import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { itemRender } from '../../../../paginationfunction';
import { getReadableDate, verifyEditPermission } from '../../../../utility';
import ExperienceForm from './form';
import { deleteExperience, getExperienceList } from './service';

const { Header, Body, Footer, Dialog } = Modal;
export default class Experience extends Component {
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
    getExperienceList(this.state.employeeId, this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

      if (res.status == "OK") {
        this.setState({
          data: res.data.list,
          totalPages: res.data.totalPages,
          totalRecords: res.data.totalRecords,
          currentPage: res.data.currentPage + 1,
          employeeName: res.data.employeeName
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
  
  updateList = (experience) => {
    let { data } = this.state;
    let index = data.findIndex(d => d.id == experience.id);
    if (index > -1)
      data[index] = experience;
    else {
      data = [experience, ...data];
    }
    this.setState({ data },
      () => {
        this.hideForm();
      });
  }

  hideForm = () => {
    this.setState({
      showForm: false,
      experience: undefined
    })
  }

  delete = (data) => {
    confirmAlert({
      title: `Delete Experience for ${data.companyName}`,
      message: 'Are you sure, you want to delete this Experience?',
      buttons: [
        {
          className: "btn btn-danger",
          label: 'Yes',
          onClick: () => deleteExperience(data.id).then(res => {
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
        title: 'Designation',
        dataIndex: 'designation',
        sorter: true,
      },
      {
        title: 'Company',
        dataIndex: 'company',
        sorter: true,
      },
      {
        title: 'From Date',
        dataIndex: 'fromDate',
        sorter: true,
        render: (text, record) => {
          return <span>{text && text ? getReadableDate(text) : "NA"}</span>
        }
      },
      {
        title: 'To Date',
        dataIndex: 'toDate',
        sorter: true,
        render: (text, record) => {
          return <span>{text ? getReadableDate(text) : "NA"}</span>
        }
      },
      {
        title: 'Job Description',
        dataIndex: 'jobDescription',
        className: 'pre-wrap',
        sorter: true,
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
              {isEditAllowed && <><a className="dropdown-item" href="#" onClick={() => {
                let { experience } = this.state;
                experience = text;
                this.setState({ experience, showForm: true })
              }} >
                <i className="fa fa-pencil m-r-5"></i> Edit</a>
                <a className="dropdown-item" href="#" onClick={() => {
                  this.delete(text);
                }}>
                  <i className="fa fa-trash-o m-r-5"></i> Delete</a></>}
            </div>
          </div>
        ),
      },
    ]
    return (
      <>
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header btn-group-sm text-right">
              {isEditAllowed &&  <a href="#" className="btn btn-primary" onClick={() => {
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
            <h5 className="modal-title">{this.state.experience ? 'Edit' : 'Add'} Experience</h5>

          </Header>
          <Body>
            <ExperienceForm updateList={this.updateList} experience={this.state.experience} employeeId={this.state.employeeId}>
            </ExperienceForm>
          </Body>


        </Modal>
      </>
    );
  }
}
