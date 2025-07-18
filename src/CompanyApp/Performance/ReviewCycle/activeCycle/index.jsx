import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal, Col, Row } from 'react-bootstrap';
import { itemRender, onShowSizeChange } from '../../../../MainPage/paginationfunction';
import AccessDenied from '../../../../MainPage/Main/Dashboard/AccessDenied';
import { verifyOrgLevelViewPermission } from '../../../../utility';
import TableDropDown from '../../../../MainPage/tableDropDown';
import ReviewCycleView from './ReviewCycleView';
import { getPerformanceCycle } from '../CycleForms/service';
const { Header, Body, Footer, Dialog } = Modal;
export default class ActiveCycle extends Component {
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
            currentPage: 1,
            selectedId: null,
            selectedData: null
        };
    }

    componentDidMount() {
        getPerformanceCycle(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
            if (res.status == "OK") {
                this.setState({
                    data: res.data.list
                },);
            }
        })

    }

    getStyle(text) {
        if (text === 'Drafts') {
            return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Drafts</span>;
        }
        if (text === 'Active') {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Active</span>;
        }
        if (text === 'Completed') {
            return <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i>Completed</span>;
        }
        if (text === 'Planned') {
            return <span className='p-1 badge bg-inverse-warning'><i className="pr-2 fa fa-hourglass-o text-warning"></i>Planned</span>;
        }

        return ' ';
    }

    // view hide
    hideView = () => {
        this.setState({
            showView: false
        })
    }

     hideEdit = () => {
        this.setState({
            showEdit: false
        })
    }

    render() {
        const { data, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }

        const menuItems = (text, record) => {
            const items = [];


            items.push(<div>  <a className="muiMenu_item" href="#" onClick={() => {
                // this.delete(timesheetObj);
                this.setState({ showView: true,selectedId: record.id, selectedData: record })
            }}>
                <i className="fa fa-eye m-r-5" /> View</a>
            </div>
            )

             items.push(<div>  <a className="muiMenu_item" href="#" onClick={(e) => {
                e.preventDefault();
                this.props.updateCycle(record); 
            }}>
                <i className="fa fa-pencil m-r-5" /> Edit</a>
            </div>
            )
            return items;
        };

        const columns = [
            {
                title: 'Cycle Name',
                dataIndex: 'cyclename',
                sorter: true,
            },
            {
                title: 'Applicable For',
                dataIndex: 'assign',
                sorter: true,
            },

           {
                title: 'Starts On',
                dataIndex: 'cycleStartDate',
                sorter: true,
                render: (text) => (
                    text ? new Date(text).toLocaleDateString('en-GB') : ''
                )
            },
            {
                title: 'Ends On',
                dataIndex: 'cycleEndDate',
                sorter: true,
                render: (text) => (
                    text ? new Date(text).toLocaleDateString('en-GB') : ''
                )
            },
            {
                title: 'Status',
                dataIndex: 'active',
                sorter: true,
                render: (text, record) => (
                    <span>{record.prcActive ? 'Active' : 'InActive'}</span>
                )
            },

            {
                title: 'Action',
                width: 50,
                render: (text, record) => (
                    <Row>
                        <Col md={12}>
                            <div className="">
                                <TableDropDown menuItems={menuItems(text, record)} />
                            </div>

                        </Col>
                    </Row>
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
                                <h3 className="tablePage-title">Review Cycle</h3>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                                {verifyOrgLevelViewPermission("Performance Cycle") &&
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
                                    />}
                                {!verifyOrgLevelViewPermission("Performance Cycle") && <AccessDenied></AccessDenied>}

                            </div>
                        </div>
                    </div>
                </div>
                <Modal enforceFocus={false} size={"xl"} show={this.state.showView} onHide={this.hideView} >
                    <Header closeButton>
                        <h5 className="modal-title">View Review Cycle</h5>
                    </Header>
                    <Body>
                        <ReviewCycleView selectedId={this.state.selectedId} selectedData={this.state.selectedData}></ReviewCycleView>
                    </Body>
                </Modal>


            </>
        );
    }
}
