import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import TableDropDown from '../../../../../MainPage/tableDropDown';
import AddPoolMembers from './addPoolMember';
import AddCadidateForm from './candidatesForm';
import { onShowSizeChange } from '../../../../../MainPage/paginationfunction';
import { itemRender } from '../../../../../paginationfunction';
import EmployeeListColumn from '../../../../Employee/employeeListColumn';
import { deleteCandidate } from './service';
import { toast } from 'react-toastify';
const { Header, Body, Footer, Dialog } = Modal;
const data =
    [
        { employee: { id: '23', name: 'Najeer' },planId: 15, status: true, readiness: { id: '1', name: 'Less than 1 year' } },
        { employee: { id: '24', name: 'Jacki' },planId: 18, status: true, readiness: { id: '2', name: '1 to 2 Years' } },
        { employee: { id: '26', name: 'Prakash' },planId: 25, status: false, readiness: { id: '3', name: '3 to 4 Years' } }
    ]

export default class AddCandidates extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: data,
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1
        };
    }
    getStyle(text) {
        if (text === true) {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>;
        }
        if (text === false) {
            return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Inactive</span>;
        }
        return 'null';
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            candidate: undefined
        })
    }

    poolHideForm = () => {
        this.setState({
            poolShowForm: false,
        })
    }

    handleAddCandidates = (e) => {
        const value = e.target.value
        if (value === '1') {
            this.setState((prevState) => ({
                showForm: !prevState.showForm,
                poolShowForm: false,
            }));
        } else if (value === '2') {
            this.setState((prevState) => ({
                showForm: false,
                poolShowForm: !prevState.poolShowForm,
            }));
        }

    }

    delete = (candidate) => {
        confirmAlert({
            title: `Delete Candidate ${candidate.employee.name}`,
            message: 'Are you sure, you want to delete this Candidate?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteCandidate(candidate.id).then(res => {
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
        const menuItems = (text, record) => [
            <div ><a className="muiMenu_item" href="#" onClick={() => {
                this.setState({ candidate: text, showForm: true })
            }}
            ><i className="fa fa-pencil m-r-5" /><b>Edit</b></a></div>,
            <div ><a className="muiMenu_item" href="#" onClick={() => {
                this.delete(text);
            }}
            ><i className="fa fa-trash-o m-r-5" /><b>Delete</b></a></div>
        ]
        const columns = [
            {
                title: 'Candidate Name',
                render: (text, record) => {
                    return <EmployeeListColumn
                        id={text.employee.id} name={text.employee.name} employeeId={text.employeeId}></EmployeeListColumn>
                }
            },
            {
                title: 'Readiness',
                sorter: true,
                render: (text, record) => {
                    return <><div >{text.readiness.name}</div>
                    </>
                }
            },
            {
                title: 'Status',
                dataIndex: 'status',
                render: (text, record) => {
                    return <><div >{this.getStyle(text)}</div>
                    </>
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
                <div  >
                    <div className={`${'addPlanForm'}`} >
                        <div className='successionPlanHead'>
                            <h3 className='dvlp-left-align'>Candidates</h3>
                            <div className='dvlp-right-align'>
                                {<select onChange={(e) => this.handleAddCandidates(e)} className="btn apply-button btn-primary">
                                    <option value="0" >Select members </option>
                                    <option value="1" >External Candidates</option>
                                    <option value="2" >Add Pool Members</option>
                                </select>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="mt-3 mb-3 table-responsive">
                                    <Table id='Table-style' className="table-striped "
                                        pagination={{
                                            total: data.length,
                                            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                            showSizeChanger: true, onShowSizeChange: onShowSizeChange, itemRender: itemRender
                                        }}
                                        style={{ overflowX: 'auto' }}
                                        columns={columns}
                                        dataSource={[...data]}
                                        rowKey={record => record.id}
                                        onChange={this.onTableDataChange}
                                    />

                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                <Modal
                    enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm}
                >
                    <Header closeButton>
                        <h5 className="modal-title">Add Candidate</h5>
                    </Header>
                    <Body>
                        <AddCadidateForm candidate={this.state.candidate} nextForm={this.props.nextForm} ></AddCadidateForm>
                    </Body>
                </Modal>
                <Modal
                    enforceFocus={false} size={"lg"} show={this.state.poolShowForm} onHide={this.poolHideForm}
                >
                    <Header closeButton>
                        <h5 className="modal-title">Add Pool Members</h5>
                    </Header>
                    <Body>
                        <AddPoolMembers candidate={this.state.candidate} nextForm={this.props.nextForm} ></AddPoolMembers>
                    </Body>
                </Modal>
            </>
        );
    }
}
