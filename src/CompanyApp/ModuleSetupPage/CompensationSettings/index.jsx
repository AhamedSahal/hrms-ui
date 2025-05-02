import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { itemRender } from '../../../paginationfunction';
import GradingStructureForm from './form';
import PayScaleGenaratorForm from './PayscaleGenarator';
import PayRange from './payRange';
import { getGradingStructureList } from './service';

const { Header, Body, Footer, Dialog } = Modal;
export default class GradingStructure extends Component {
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
        getGradingStructureList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {

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
    onTableDataChange = (d, filter, sorter) => {
        this.setState({
            page: d.current - 1,
            size: d.pageSize,
            sort: sorter && sorter.field ? `${sorter.field},${sorter.order == 'ascend' ? 'asc' : 'desc'}` : this.state.sort
        }, () => {
            this.fetchList();
        })
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            recognition: undefined
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

    render() {
        const { data, totalPages, totalRecords, currentPage, size } = this.state
        let startRange = ((currentPage - 1) * size) + 1;
        let endRange = ((currentPage) * (size + 1)) - 1;
        if (endRange > totalRecords) {
            endRange = totalRecords;
        }

        const columns = [
            {
                title: 'Ref.Levels',
                dataIndex: 'refLevelId',
                width: 200,

            },
            {
                title: 'Grades',
                dataIndex: 'gradesName',
            },
            {
                title: 'Typical Roles',
                dataIndex: 'rolesname',
                // render: (text) => text.join(', ')
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
                className: "text-center",
                render: (text, record) => (
                    <div className="dropdow">
                        <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            <i className="las la-bars"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="#" onClick={() => {
                                this.setState({ gradingStructure: text, showForm: true })
                            }} >
                                <i className="fa fa-pencil m-r-5"></i> Edit</a>
                        </div>
                    </div>
                ),

            },
        ]
        return (
            <>
                <div className="page-container content container-fluid">
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Grading Structure</h3>
                            </div>
                            <div className="mt-2 float-right col-auto ml-auto">  <a href="#" className="btn apply-button btn-primary" onClick={() => {
                                this.setState({
                                    showForm: true
                                })
                            }}><i className="fa fa-plus" /> Add</a>
                            </div>
                        </div>
                    </div>

                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
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
                                    dataSource={[...data]}
                                    rowKey={record => record.id}
                                    onChange={this.onTableDataChange}
                                />
                            </div>
                        </div>
                    </div>

                </div>
                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >


                    <Header closeButton>
                        <h5 className="modal-title">{this.state.gradingStructure ? 'Edit' : 'Add'}  Grading Structure</h5>

                    </Header>
                    <Body>
                        <GradingStructureForm updateList={this.updateList} gradingStructure={this.state.gradingStructure}>
                        </GradingStructureForm>
                    </Body>
                </Modal>
                <PayScaleGenaratorForm></PayScaleGenaratorForm>
                <PayRange></PayRange>
            </>
        );
    }
}
