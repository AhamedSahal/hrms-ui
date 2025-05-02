import { Table } from 'antd';
import React, { Component } from 'react';
import TableDropDown from '../../../MainPage/tableDropDown';
import { onShowSizeChange } from '../../../MainPage/paginationfunction';
import { itemRender } from '../../../paginationfunction';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import SuccessionPlanFormLanding from './PlanForms/formLanding';
import SuccessionPlanView from './view';
import { getSuccessionPlanList } from './service';

const { Header, Body, Footer, Dialog } = Modal;
const data =
    [
        {
            id: 0, planName: 'Marketing Director',
            planType: { id: 1, name: 'Position' }, typeOfSuccessor: '1', jobTitlesId: "4",position: 'Finance Manager',
            createdDate: '2024-10-20', members: '5', active: true,
            candidate: [19 , 24, 23, 25],
            owner: [27, 26],
            description: 'Define the key people in finance organization', isPlan: true
        },

    ]

export default class SuccessionPlan extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: data,
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1,
            successionPlan: true,
        };
    }
    // componentDidMount() {
    //     this.fetchList();
    // }
    // fetchList = () => {
    //     getSuccessionPlanList(this.state.page, this.state.size, this.state.sort).then(res => {
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
        if (text === true) {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>;
        }
        if (text === false) {
            return <span className='p-1 badge bg-inverse-danger'><i className="pr-2 fa fa-remove text-danger"></i>Inactive</span>;
        }
        return 'black';
    }

    hidePlanView = () => {
        this.setState({
            successionPlanView: false,
        })
    }

    render() {
        const { data, totalPages, totalRecords, currentPage, size, successionPlan } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }
        const menuItems = (text, record) => [
            <div ><Link className="muiMenu_item" to={{
                pathname: `successionPlanForm`,
                state: text
            }}> <i className="fa fa-pencil m-r-5"></i> Edit</Link></div>,
            <div ><a className="muiMenu_item" href="#" onClick={() => {
                this.delete(text);
            }}
            ><i className="fa fa-trash-o m-r-5" /><b>Delete</b></a></div>,
            <div ><a className="muiMenu_item" href="#"
                onClick={() => {
                    this.setState({ successionPlan: record, successionPlanView: true })
                }}
            ><i className="fa fa-eye m-r-5" /><b>View</b></a></div>
        ]
        const columns = [
            {
                title: 'Plan Name',
                dataIndex: 'planName',
                sorter: true,
            },
            {
                title: 'Plan Type',
                sorter: true,
                render: (text, record) => {
                    return <><div >{text.planType.name}</div>
                    </>
                }
            },
            {
                title: 'Created Date',
                dataIndex: 'createdDate',
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
                                <h3 className="tablePage-title">Succession Plan</h3>
                            </div>
                            <div className="mt-2 float-right col-auto ml-auto">
                                <Link to={`successionPlanForm`} className="btn apply-button btn-primary"><i className="fa fa-plus" /> Add Succession Plan</Link>

                            </div>
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
                <Modal enforceFocus={false} size={"lg"} show={this.state.successionPlanView} onHide={this.hidePlanView} >
                    <Header closeButton>
                        <h5 className="modal-title">View Talent Pool</h5>
                    </Header>
                    <Body>
                       <SuccessionPlanView successionPlan={successionPlan} ></SuccessionPlanView>
                    </Body>
                </Modal>
            </>
        );
    }
}
