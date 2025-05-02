import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import { deleteIP, getIPConfigList } from './service';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../../utility';
import IPConfigForm from './form';
import { itemRender } from "../../../paginationfunction";

const { Header, Body } = Modal;
export default class IPConfig extends Component {
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
            showFilter: false,
        };
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        if (verifyOrgLevelViewPermission("Settings Configuration")) {
            getIPConfigList(this.state.q, this.state.page, this.state.size, this.state.sort).then(res => {
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
            this.fetchList();
        })
    }
    updateList = (ip) => {
        this.fetchList();
        let { data } = this.state;
        let index = data.findIndex(d => d.id == ip.id);
        if (index > -1)
            data[index] = ip;
        else {
            data = [ip, ...data];
        }
        this.setState({ data },
            () => {
                this.hideForm();
            });
    }
    pageSizeChange = (currentPage, pageSize) => {
        this.setState({
            size: pageSize,
            page: 0
        }, () => {
            this.fetchList();
        })
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            ip: undefined
        })
    }
    delete = (ip) => {
        confirmAlert({
            title: `Delete IP ${ip.name}`,
            message: ip.active === 1 ? `This IP Address is currently mapped to a Attendance Group Configuration. Are you sure, you want to delete?`:'Are you sure, you want to delete this IP Address?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteIP(ip.id).then(res => {
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
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                sorter: true,
            },
            {
                title: 'IP',
                dataIndex: 'ip',
                sorter: true,
            },
            {
                title: 'Action',
                width: 50,
                className: "text-center",
                render: (obj, record) => (
                    <>{verifyOrgLevelEditPermission("Settings Configuration") &&
                        <div className="dropdow">
                            <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                <i className="las la-bars"></i>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right">
                                <a className="dropdown-item" href="#" onClick={() => {
                                    this.setState({ ip: obj, showForm: true })
                                }} >
                                    <i className="fa fa-pencil m-r-5"></i> Edit</a>
                                <a className="dropdown-item" href="#" onClick={() => {
                                    this.delete(obj);
                                }}>
                                    <i className="fa fa-trash-o m-r-5"></i> Delete</a>
                            </div>
                        </div>
                    }</>
                ),
            },
        ]
        return (
            <>
                {/* Page Content */}
                < div className="page-container content container-fluid" >
                    < div className="tablePage-header" >
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Manage IP </h3>
                            </div>
                            <div className='col-md-4'>
                                <div className="form-group form-focus mb-1">
                                    <input onChange={e => {
                                        this.setState({
                                            q: e.target.value,
                                            page: 0
                                        })
                                    }} type="text" className="form-control floating" />
                                    <label className="focus-label">Search</label>
                                </div>
                            </div>
                            <div className="mt-1 mb-2 float-right col-md-2 ml-auto d-flex">
                                <p style={{ width: '12rem' }} className="ml-3 mt-1 btn apply-button btn-primary" onClick={() => {this.fetchList();}}><i className="fa fa-search" aria-hidden="true" /> Search </p>
                            </div>
                            <div className="mt-1 mb-2 float-right col-md-2 ml-auto d-flex">
                                <p style={{ width: '16em' }} className="ml-3 mt-1 btn apply-button btn-primary" onClick={() => {
                                    this.setState({
                                        showForm: true,
                                    })
                                }}><i className="fa fa-plus" /> Add </p>
                            </div>
                        </div>
                    </div >
                    {/* /Page Header */}
                    < div className="row" >
                        <div className="col-md-12">
                            <div className="mt-3 mb-3 table-responsive">
                                {verifyOrgLevelViewPermission("Settings Configuration") && <Table id='Table-style' className="table-striped"
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
                                {!verifyOrgLevelViewPermission("Settings Configuration") && <AccessDenied></AccessDenied>}
                            </div>
                        </div >
                    </div >
                    <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
                        <Header closeButton>
                            <h5 className="modal-title">{this.state.ip ? 'Edit' : 'Add'} IP</h5>
                        </Header>
                        <Body>
                            <IPConfigForm updateList={this.updateList} ip={this.state.ip}>
                            </IPConfigForm>
                        </Body>
                    </Modal>
                </div>
            </>
        );
    }
}