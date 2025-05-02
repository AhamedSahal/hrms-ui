import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import TableDropDown from '../../../MainPage/tableDropDown';
import { onShowSizeChange } from '../../../MainPage/paginationfunction';
import { itemRender } from '../../../paginationfunction';
import TalentPoolForm from './form';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import { deleteTalentPool, getTalentPoolList } from './service';
import TalentPoolView from './view';
const { Header, Body, Footer, Dialog } = Modal;
const data =
    [
        { id: 0, poolName: 'Key people for finance', poolDate: '2024-02-20', candidate: [19, 24, 23, 25], members: 4, active: 'Active', description: 'Define the key people in finance organization' },
        { id: 2, poolName: 'Key people for Hr consultant', poolDate: '2024-10-05', candidate: [19, 24], members: 3, active: 'Active', description: 'Is simply dummy text of the printing.' },
        { id: 3, poolName: 'Key people for finance', poolDate: '2023-07-09', candidate: [19, 24], members: 5, active: 'Active', description: 'when an unknown printer ' },
    ]

export default class TalentPool extends Component {
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
            currentPage: 1,
            talentPool: '',
        };
    }

    // componentDidMount() {
    //     this.fetchList();
    // }
    // fetchList = () => {
    //     getTalentPoolList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
    //         if (res.status == "OK") {
    //             this.setState({
    //                 data: res.data.list,
    //                 totalPages: res.data.totalPages,
    //                 totalRecords: res.data.totalRecords,
    //                 currentPage: res.data.currentPage + 1,
    //             })
    //         }
    //     })
    // }
    getStyle(text) {
        if (text === 'Active') {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>;
        }
        if (text === 'Inactive') {
            return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Inactive</span>;
        }
        return 'black';
    }
    hideForm = () => {
        this.setState({
            showForm: false,
        })
    }

    updateList = (talentPool) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == talentPool.id);
        if (index > -1)
            data[index] = talentPool;
        else {
            data = [talentPool, ...data];
        }
        this.setState({ data },
            () => {
                this.hideForm();
            });
    }

    delete = (pool) => {
        confirmAlert({
            title: `Delete Talent Pool ${pool.poolName}`,
            message: 'Are you sure, you want to delete this Talent Pool?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteTalentPool(pool.id).then(res => {
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
    hidetalentPoolView = () => {
        this.setState({
            talentPoolView: false,
        })
    }

    render() {
        const { data, totalPages, totalRecords, currentPage, size, talentPool } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const menuItems = (text, record) => [
            <div ><a className="muiMenu_item" href="#" onClick={() => {
                this.setState({ talentPool: text, showForm: true })
            }}
            ><i className="fa fa-pencil m-r-5" /><b>Edit</b></a></div>,
            <div ><a className="muiMenu_item" href="#" onClick={() => {
                this.delete(text);
            }}
            ><i className="fa fa-trash-o m-r-5" /><b>Delete</b></a></div>,
            <div ><a className="muiMenu_item" href="#"
                onClick={() => {
                    this.setState({ talentPool: record, talentPoolView: true })
                }}
            ><i className="fa fa-eye m-r-5" /><b>View</b></a></div>
        ]
        const columns = [

            {
                title: 'Name',
                dataIndex: 'poolName',
                sorter: true,
            },
            {
                title: 'Date',
                dataIndex: 'poolDate',
                sorter: false,

            },
            {
                title: 'Candidates',
                dataIndex: 'members',
                sorter: true,
            },
            {
                title: 'Status',
                dataIndex: 'active',
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
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    <div className="mt-3 tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Talent Pool</h3>
                            </div>
                            <div className="mt-2 float-right col-auto ml-auto">
                                <a
                                    href="#"
                                    className="btn apply-button btn-primary"
                                    onClick={() => {
                                        this.setState({
                                            showForm: true,
                                            talentPool: ''
                                        });
                                    }}
                                >
                                    <i className="fa fa-plus" /> Add Pool
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                                <Table id='Table-style' className="table-striped"
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

                <Modal
                    enforceFocus={false} size={"lg"} show={this.state.showForm} onHide={this.hideForm}
                >
                    <Header closeButton>
                        <h5 className="modal-title">Talent Pool Form</h5>
                    </Header>
                    <Body>
                        <TalentPoolForm updateList={this.updateList} talentPool={this.state.talentPool} ></TalentPoolForm>
                    </Body>
                </Modal>
                <Modal enforceFocus={false} size={"lg"} show={this.state.talentPoolView} onHide={this.hidetalentPoolView} >
                    <Header closeButton>
                        <h5 className="modal-title">View Talent Pool</h5>
                    </Header>
                    <Body>
                        <TalentPoolView talentPool={talentPool} ></TalentPoolView>
                    </Body>
                </Modal>

            </>
        );
    }
}
