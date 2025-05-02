import { Table } from 'antd';
import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Modal, Row } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AccessDenied from '../../../../MainPage/Main/Dashboard/AccessDenied';
import { itemRender } from '../../../../paginationfunction';
import { getUserType, verifyApprovalPermission } from '../../../../utility';
import { deleteParticipant, getSurveyParticipantList, getEmployeeList, saveParticipant, saveEveryoneInDept, saveEveryoneInOrganization } from './service';
import { FormGroup } from 'reactstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { SurveyParticipantSchema } from './validation';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import DepartmentDropdown from '../../../ModuleSetup/Dropdown/DepartmentDropdown';


const { Header, Body, Footer, Dialog } = Modal;
export default class SurveyParticipantList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      q: "",
      status:"ACTIVE",
      name:"",
      categoryId:"",
      page: 0,
      size: 10,
      sort: "desc",
      totalPages: 0,
      totalRecords: 0,
      currentPage: 1,
      showFilter: false,
      selected: [],
      branchId: "",
      departmentId: "",
      designationId: "",
      surveyId: props.survey,
      participantData:[],
      participantTotalPages:"",
      participantTotalRecords:"",
      participantCurrentPage:"",
      pageP: 0,
      sizeP: 10,
      sortP: "desc",
      employee:{
        name:"",
        email:"",
        mobile:"",
      },
      selectedOption:"internalParticipant",
      selectedInternalEmpOption:"employees",
      selectedDepartment:"",
      file:{},
      surveyDetails:this.props.surveyData,
    };
  }
  componentDidMount() {
    this.fetchList();
    this.fetchParticipantList();
  }
  fetchParticipantList = () => {
    getSurveyParticipantList(this.state.status, this.props.survey).then(res => {

      if (res.status == "OK") {
        this.setState({
          participantData: res.data.list,
          participantTotalPages: res.data.totalPages,
          participantTotalRecords: res.data.totalRecords,
          participantCurrentPage: res.data.currentPage + 1,
          selected: res.data.list.map((item)=>item.internalUserId)
        })
      }
    });
  }
  fetchList = () => {
    getEmployeeList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.status, this.state.branchId, this.state.departmentId, this.state.designationId).then(res => {

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


  pageSizeChange = (currentPage, pageSize) => {
    this.setState({
      size: pageSize,
      page: 0
    }, () => {
      this.fetchList();
    })

  }
  participantPageSizeChange = (currentPage, pageSize) => {
    this.setState({
      sizeP: pageSize,
      pageP: 0
    }, () => {
      this.fetchParticipantList();
    })

  }
  onTableDataChange = (d, filter, sorter) => {
    this.setState({
      page: d.current - 1,
      size: d.pageSize,
      sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
    }, () => {
      this.fetchList();
      this.fetchParticipantList();
    })
  }
  onParticipantTableDataChange = (d, filter, sorter) => {
    this.setState({
      pageP: d.current - 1,
      sizeP: d.pageSize,
      sortP: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sortP
    }, () => {
      this.fetchList();
      this.fetchParticipantList();
    })
  }

  delete = (data) => {
    console.log(data);
    confirmAlert({
      title: `Delete Participant`,
      message: 'Are you sure, you want to delete this Participant?',
      buttons: [
        {
          className: "btn btn-danger",
          label: 'Yes',
          onClick: () => deleteParticipant(data.id).then(res => {
            if (res.status == "OK") {
              toast.success(res.message);
              this.fetchList();
            } else {
              toast.error(res.message);
            }
            this.fetchList();
            this.fetchParticipantList();
          })
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  }
  deleteUnchecked = (data) => {
    deleteParticipant(data.id).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      this.fetchList();
      this.fetchParticipantList();
    })
  }
  saveParticipantData = (record) => {
    let { selected, data, participantData } = this.state;
    let index = selected.indexOf(record.id);

    if (index > -1) {
      selected.splice(index, 1);
      let deleteRecord = participantData.filter((u) => record.id === u.internalUserId);
      this.deleteUnchecked(deleteRecord[0]);
    } else {
      selected.push(record.id);
      const participantsData = data.filter((u) => record.id === u.id);
      let participants = [];
      participantsData.forEach(element => {
        participants.push({
          id:0,
          internalUserId: element.id,
          name: element.name,
          email: element.email,
          mobile: element.phone,
          surveyId: this.props.survey,
        });
      });

      saveParticipant(participants).then(res => {
        if (res.status == "OK") {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
        this.fetchParticipantList();
        this.fetchList();
      }).catch(err => {
        console.error(err);
        toast.error("Error while saving participant");
      })
    }
    this.setState({
      selected
    });

  }

  save = (data, action) => {
    let participants = [];
    participants.push({
      id:0,
      internalUserId: "",
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      surveyId: this.props.survey,
    });
    action.setSubmitting(true);
    saveParticipant(participants).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
        // this.redirectToList();
      } else {
        toast.error(res.message);
      }
      action.setSubmitting(false)
      action.resetForm();
      this.fetchParticipantList();
    }).catch(err => {
      console.log({ err });
      toast.error("Error while saving Participant");
      action.setSubmitting(false);
    })
  }

  saveEveryoneInOrg = () => {
    saveEveryoneInOrganization(this.props.survey).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      this.fetchParticipantList();
      this.fetchList();
    }).catch(err => {
      console.error(err);
      toast.error("Error while saving participant");
    })

  }

  saveEveryoneInDepartment = () => {
    let {selectedDepartment} = this.state;
    saveEveryoneInDept(selectedDepartment, this.props.survey).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      this.fetchParticipantList();
      this.fetchList();
    }).catch(err => {
      console.error(err);
      toast.error("Error while saving participant");
    })
  }

  handleOptionChange = (event) => {
    this.setState({
      selectedOption: event.target.value,
    });
  }
  handleInternalEmpOptionChange = (event) => {
    this.setState({
      selectedInternalEmpOption: event.target.value,
    });
  }
  handleDownload = () => {
    const data = [ ['Name', 'Email', 'Mobile'], // Heading row 
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'users_template.xlsx');
  }

  handleFileUpload = (event) => {
    const file = event.target.files[0];
    this.setState({
      file:file
    });
  };
  handleUpload = () => {
    if (this.state.file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const users = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 1 });

        console.log(users); // Just for demonstration, remove this line
        let participants = [];
        users.map(p =>
          participants.push({
            id: 0,
            internalUserId: "",
            name: p[0],
            email: p[1],
            mobile: p[2],
            surveyId: this.props.survey,
          })
        );
        saveParticipant(participants).then(res => {
          if (res.status == "OK") {
            toast.success(res.message);
          } else {
            toast.error(res.message);
          }
          this.fetchParticipantList();
          this.fetchList();
        }).catch(err => {
          console.error(err);
          toast.error("Error while saving participant");
        })
      };
      reader.readAsArrayBuffer(this.state.file);
      this.setState({
        file:{}
      })
    }
  };
  render() {
    const { data, totalRecords, currentPage, size, selected, participantCurrentPage, participantTotalRecords, participantData, selectedOption, selectedInternalEmpOption, surveyDetails } = this.state;
    let startRange = ((currentPage - 1) * size) + 1;
    let endRange = ((currentPage) * (size)) ;
    if (endRange > totalRecords) {
      endRange = totalRecords;
    }

    let participantStartRange = ((participantCurrentPage - 1) * size) + 1;
    let participantEndRange = ((participantCurrentPage) * (size + 1)) - 1;
    if (participantEndRange > participantTotalRecords) {
      participantEndRange = participantTotalRecords;
    }
    // this.setState({
    //   selected:ids
    // })
    // const employeeData = data.filter((user)=> !ids.includes(user.id));
    // const employeeTotalRecords = totalRecords - participantTotalRecords;
    // console.log(employeeData.length, data.length);

    // const isInternal = false;

    const columns = [
      {
        title: 'Employee',
        sorter: false,
        render: (text) => {
          return <div>{text.name}</div>
        }
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Mobile',
        dataIndex: 'phone',
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text, record) => (
          <div className="dropdow">
            <Row className='actionCenter'>
              <Col md={4}>
                {verifyApprovalPermission("LEAVE") && <input
                  type="checkbox"
                  checked={selected && selected.length > 0 && selected.indexOf(record.id) > -1}
                  className="pointer"
                  onClick={() => {
                    this.saveParticipantData(record);
                  }}></input>}
              </Col>
            </Row>
          </div>
        ),
      },
    ]

    const columnsSelected = [
      {
        title: 'Name',
        sorter: false,
        render: (text) => {
          return <div>{text.name}</div>
        }
      },
      {
        title: 'Email',
        dataIndex: 'email',
      },
      {
        title: 'Mobile',
        dataIndex: 'mobile',
      },
      {
        title: 'Invitee Type',
        sorter: false,
        render: (text, record) => {
          return <div>{record.internalUserId === 0 ? "External" : "Internal"}</div>
        }
      },
      {
        title: 'Action',
        width: 50,
        className: "text-center",
        render: (text) => (
          <div >
            <Row className='actionCenter'>
              <Col md={12}>
                <a href="#" onClick={() => {
                  this.delete(text);
                }} >
                  <i className="fa fa-trash-o m-r-5"></i>
                </a>
                {/* <Button className='btn btn-danger' onClick={e => this.delete(record)} variant='warning' size='sm' >Delete</Button> */}
              </Col>
            </Row>
          </div>
        ),
      },
    ]

    return (
      <>
        {/* Page Content */}
        <div >

          <div >
            <Row className='ml-2 my-2'>
              <Col md={4}>
                <label className='int-ext-link'>
                  <input type="radio" value="internalParticipant" className='mr-2' checked={selectedOption === 'internalParticipant'} onChange={this.handleOptionChange} disabled={getUserType() !== 'SUPER_ADMIN' && (surveyDetails?.surveyStatus === 'TEMPLATE' || false)} />
                  Internal Participant
                </label>
              </Col>
              <Col md={4}>
                <label className='int-ext-link'>
                  <input type="radio" value="externalParticipant" className='mr-2' checked={selectedOption === 'externalParticipant'} onChange={this.handleOptionChange} disabled={getUserType() !== 'SUPER_ADMIN' && (surveyDetails?.surveyStatus === 'TEMPLATE' || false)} />
                  External Participant
                </label>
              </Col>
              {/* <Col xs="auto" className="ml-auto">
              <input type="button" className="btn btn-secondary" onClick={this.redirectToList} value="Back"></input>
              </Col> */}
            </Row>

            <Col className='p-0 mt-1' >
              {selectedOption === "internalParticipant" ? <div className="card-body p-6 mt-1">

                <Row>
                  <Col md={4}>
                    <label className='int-link'>
                      <input type="radio" value="employees" className='mr-2' checked={selectedInternalEmpOption === 'employees'} onChange={this.handleInternalEmpOptionChange} disabled={getUserType() !== 'SUPER_ADMIN' && (surveyDetails?.surveyStatus === 'TEMPLATE' || false)} />
                      Employees
                    </label>
                  </Col>
                  <Col md={4}>
                    <label className='int-link'>
                      <input type="radio" value="teams" className='mr-2' checked={selectedInternalEmpOption === 'teams'} onChange={this.handleInternalEmpOptionChange} disabled={getUserType() !== 'SUPER_ADMIN' && (surveyDetails?.surveyStatus === 'TEMPLATE' || false)} />
                      Teams
                    </label>
                  </Col>
                  <Col md={4}>
                    <label className='int-link'>
                      <input type="radio" value="everyoneInOrganization" className='mr-2' checked={selectedInternalEmpOption === 'everyoneInOrganization'} onChange={this.handleInternalEmpOptionChange} disabled={getUserType() !== 'SUPER_ADMIN' && (surveyDetails?.surveyStatus === 'TEMPLATE' || false)} />
                      Everyone In Organization
                    </label>
                  </Col>
                </Row>
                {selectedInternalEmpOption === "employees" && <Table id='Table-style' className="table-striped "
                  pagination={{
                    total: totalRecords,
                    showTotal: () => {
                      return `Showing ${startRange} to ${endRange} of ${totalRecords} entries`;
                    },
                    showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                    itemRender: itemRender,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    current: currentPage,
                    defaultCurrent: 1,
                  }}
                  style={{ overflowX: 'auto' }}
                  columns={columns}
                  // bordered
                  dataSource={[...data]}
                  rowKey={record => record.id}
                  onChange={this.onTableDataChange}
                /> }
                {selectedInternalEmpOption === "teams" && <><DepartmentDropdown defaultValue={this.state.selectedDepartment} onChange={e => {
                  this.setState({
                    selectedDepartment: e.target.value
                  })
                }}></DepartmentDropdown>
                  <Button className='btn btn-primary my-3 mx-0' onClick={this.saveEveryoneInDepartment} >Add Department</Button>
                </> }
                {selectedInternalEmpOption === "everyoneInOrganization" &&
                  <Button className='btn btn-primary my-3 mx-0' onClick={this.saveEveryoneInOrg} disabled={getUserType() !== 'SUPER_ADMIN' && (surveyDetails?.surveyStatus === 'TEMPLATE' || false)}>Add Everyone In Organization</Button>
                }
              </div> :
                <div className="card-body mt-2">
                  <Formik
                    enableReinitialize={true}
                    initialValues={this.state.employee}
                    onSubmit={this.save}
                    validationSchema={SurveyParticipantSchema}
                  >
                    {() => (
                      <Form autoComplete='off'>
                        <fieldset className='border border-dark p-2' style={{ marginTop: "13px" }}>
                          <legend className='float-none w-auto p-2'>Individual Participant</legend>
                          <div className="row">
                            <div className="col-md-4">
                              <FormGroup>
                                <label className='survey-label'>Name
                                  <span className='ml-1' style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                              </FormGroup>
                            </div>
                            <div className="col-md-4">
                              <FormGroup>
                                <label className='survey-label'>Email
                                  <span className='ml-1' style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="email" className="form-control"></Field>
                                <ErrorMessage name="email">
                                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                              </FormGroup>
                            </div>
                            <div className="col-md-4">
                              <FormGroup>
                                <label className='survey-label'>Mobile
                                  <span className='ml-1' style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="mobile" className="form-control"></Field>
                                <ErrorMessage name="mobile">
                                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                              </FormGroup>
                            </div>
                          </div>
                          <div className="row my-2">
                            <div className="col-md-4">
                              <input type="submit" className="btn btn-primary mx-0" value="Add Participant" disabled={getUserType() !== 'SUPER_ADMIN' && (surveyDetails?.surveyStatus === 'TEMPLATE' || false)} />
                            </div>
                          </div>
                        </fieldset>

                      </Form>
                    )
                    }
                  </Formik>
                  <div>
                    <fieldset className='border border-dark p-2 mt-3'>
                      <legend className='float-none w-auto p-2'>Multiple Participant</legend>
                      <div className="row">
                        <div className="col-md-4">
                          <input className='' type="file" onChange={this.handleFileUpload} />
                          {/* <button className="btn btn-primary" onClick={this.handleUpload}>Upload</button> */}
                        </div>
                        <div className="col-md-4 me-4">
                          <input className="btn btn-primary" onClick={this.handleUpload} value="Add Participants" />
                        </div>
                        <div className="col-md-6">
                          <button className='btn btn-primary mt-3 mx-0' onClick={this.handleDownload} disabled={getUserType() !== 'SUPER_ADMIN' && (surveyDetails?.surveyStatus === 'TEMPLATE' || false)}>
                            Download Template <i class="fa fa-download" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>
                    </fieldset>

                  </div>
                </div>}
            </Col>
            <Col className='p-0 mt-3'>
              <div className="card-body p-6">
                <h3> Total Participants: {participantTotalRecords}</h3>
                <Table id='Table-style' className="table-striped "
                  pagination={{
                    total: participantTotalRecords,
                    showTotal: () => {
                      return `Showing ${participantStartRange} to ${participantEndRange} of ${participantTotalRecords} entries`;
                    },
                    showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                    itemRender: itemRender,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    current: currentPage,
                    defaultCurrent: 1,
                  }}
                  columns={columnsSelected}
                  // bordered
                  dataSource={[...participantData]}
                  rowKey={record => record.id}
                  onChange={this.onTableDataChange}
                />
               
              </div>
            </Col>

          </div>
        </div>
        {/* /Page Content */}
      </>
    );
  }
}
