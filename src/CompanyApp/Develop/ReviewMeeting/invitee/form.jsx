import { Table } from 'antd';
import React, { Component } from 'react';
import { Button, ButtonGroup, Col, Modal, Row } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { FormGroup } from 'reactstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { itemRender } from '../../../../paginationfunction';
import { getEmployeeList } from '../service';
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
import DivisionDropdown from '../../../ModuleSetup/Dropdown/DivisionDropdown';
import DepartmentDropdown from '../../../ModuleSetup/Dropdown/DepartmentDropdown';
import BranchDropdown from '../../../ModuleSetup/Dropdown/BranchDropdown';
import { BsSliders } from 'react-icons/bs';
import { deleteCandidates } from './service';


export default class MeetingInvite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            q: "",
            participantData: this.props.formData?.participants || [],
            participantTotalPages: "",
            participantTotalRecords: "",
            participantCurrentPage: "",
            status: "ACTIVE",
            page: 0,
            size: 5,
            selected: this.props.formData?.participants?.map(ids => ids.id) || [],
            
            sort: "desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            showFilter: false,
            invitee: {
                employee: '',

            }

        };
    }

    componentDidMount = () => {
        this.fetchList()
    }

    fetchList = () => {
        getEmployeeList(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.status).then(res => {

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


    delete = (data) => {
        confirmAlert({
            title: `Delete Participant`,
            message: 'Are you sure, you want to delete this Participant?',
            buttons: [
                {
                    className: "btn btn-danger",
                    label: 'Yes',
                    onClick: () => deleteCandidates(data.id).then(res => {
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
    saveParticipantData = (record) => {

        const { name, email, phone, employeeId, id } = record;

        const newParticipant = {
            name,
            email,
            phone,
            employeeId,
            id
        };

        this.setState(prevState => {
            const existingParticipantIndex = prevState.participantData.findIndex(p => p.id === id);

            if (existingParticipantIndex !== -1) {
                const updatedParticipantData = prevState.participantData.filter(p => p.id !== id);
                const updatedSelected = prevState.selected.filter(selectedId => selectedId !== id);
                return { participantData: updatedParticipantData, selected: updatedSelected };
            } else {
                return { participantData: [...prevState.participantData, newParticipant], selected: [...prevState.selected, id] };
            }
        });
    };

    save = (data, action) => {
        const { participantData } = this.state
        this.props.handleFormData({ participants: participantData })
        this.props.nextStep()
    }



    handleOptionChange = (event) => {
        this.setState({
            selectedOption: event.target.value,
        });
    }


    render() {


        const { showFilter, data, totalPages, totalRecords, currentPage, size, selected, participantCurrentPage, participantTotalRecords, participantData, selectedOption, selectedInternalEmpOption, surveyDetails } = this.state;
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        let participantStartRange = ((participantCurrentPage - 1) * size) + 1;
        let participantEndRange = ((participantCurrentPage) * (size + 1)) - 1;
        if (participantEndRange > participantTotalRecords) {
            participantEndRange = participantTotalRecords;
        }
        const columns = [
            {
                title: 'Employee',
                sorter: false,
                render: (text, record) => {
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
                        <Row style={{ justifyContent: 'center' }}>
                            <Col md={4}>
                                <input
                                    type="checkbox"
                                    checked={selected && selected.length > 0 && selected.indexOf(record.id) > -1}
                                    className="pointer"
                                    onChange={e => {
                                        this.saveParticipantData(record);
                                    }}></input>
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
                render: (text, record) => {
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
                className: "justify-content-center text-center",
                render: (text, record) => (
                    <div >
                        <Row >
                            <Col >
                                <a href="#" onClick={() => {
                                    this.delete(text);
                                }} >
                                    <i className="fa fa-trash-o m-r-5"></i>
                                </a>
                            </Col>
                        </Row>
                    </div>
                ),
            },
        ]

        return (
            <>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.invitee}
                    onSubmit={this.save}
                // validationSchema={ownerFormValidation}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue,
                        setSubmitting
                        /* and other goodies */
                    }) => (
                        <Form >
                            <div >

                                <div >
                                    <div className='text-right mr-3'>
                                        <BsSliders className='ml-2 filter-btn' size={30} onClick={() => this.setState({ showFilter: !this.state.showFilter })} />
                                    </div>

                                    {showFilter && <div className='mt-5 filterCard p-3'>
                                        <div className="row">

                                            <div className="col-md-4">
                                                <div className="form-group form-focus">
                                                    <DivisionDropdown defaultValue={this.state.divisionId} onChange={e => {
                                                        this.setState({
                                                            divisionId: e.target.value
                                                        })
                                                    }}></DivisionDropdown>
                                                    <label className="focus-label">Division</label>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-group form-focus">
                                                    <DepartmentDropdown defaultValue={this.state.departmentId} onChange={e => {
                                                        this.setState({
                                                            departmentId: e.target.value
                                                        })
                                                    }}></DepartmentDropdown>
                                                    <label className="focus-label">Department</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group form-focus">
                                                    <BranchDropdown defaultValue={this.state.branchId} onChange={e => {
                                                        this.setState({
                                                            branchId: e.target.value
                                                        })
                                                    }}></BranchDropdown>
                                                    <label className="focus-label">Location</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group form-focus">
                                                    <input onChange={e => {
                                                        this.setState({
                                                            q: e.target.value
                                                        })
                                                    }} type="text" className="form-control floating" />
                                                    <label className="focus-label">Search</label>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <a href="#" onClick={() => {
                                                    this.fetchList();
                                                }} className="btn btn-success btn-block"> Search </a>
                                            </div>
                                        </div>
                                    </div>}
                                    <div className="col-md-12">
                                        <FormGroup >
                                            <label>Add Participant
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Table id='Table-style' className="table-striped "
                                                pagination={{
                                                    total: totalRecords,
                                                    showTotal: (total, range) => {
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
                                                dataSource={[...data]}
                                                rowKey={record => record.id}
                                                onChange={this.onTableDataChange}
                                            />
                                        </FormGroup>
                                    </div>
                                    <Col className='p-0 mt-3'>
                                        <div className="card-body p-6">
                                            <h3> Total Participants: {participantTotalRecords}</h3>
                                            <Table id='Table-style' className="table-striped "
                                                pagination={{
                                                    total: participantTotalRecords,
                                                    showTotal: (total, range) => {
                                                        return `Showing ${participantStartRange} to ${participantEndRange} of ${participantTotalRecords} entries`;
                                                    },
                                                    showSizeChanger: true, onShowSizeChange: this.pageSizeChange,
                                                    itemRender: itemRender,
                                                    pageSizeOptions: [5, 10, 20, 50, 100],
                                                    current: currentPage,
                                                    defaultCurrent: 1,
                                                }}
                                                columns={columnsSelected}
                                                dataSource={[...participantData]}
                                                rowKey={record => record.id}
                                                onChange={this.onTableDataChange}
                                            />

                                        </div>
                                    </Col>
                                </div>
                                {participantData.length > 0 ? <input type="submit" className="float-right mt-2 mb-3 btn btn-info" value={"Next"} /> :
                                    <button type="button" style={{ cursor: 'not-allowed' }} className='float-right mt-2 mb-3 btn btn-secondary inviteeBtn'>Next</button>}
                                <input onClick={this.props.prevStep} style={{ width: '68px', marginRight: '18px' }} className="col-md-2 float-right mt-2 mb-3 btn btn-dark" value={"Back"} />
                            </div>
                        </Form>
                    )
                    }
                </Formik>
            </>
        );
    }
}
