import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
import { deleteMultiEntity, getList } from './service';
import MultiEntityAccessForm from './form';
import EmployeeListColumn from '../../Employee/employeeListColumn';
import { verifyOrgLevelViewPermission } from '../../../utility';

const { Header, Body } = Modal;
export default class MultiEntityAccess extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            multiEntityAccess: {},
        };
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        if (verifyOrgLevelViewPermission("Module Setup Manage")) {
            getList().then(res => {
                if (res.status == "OK") {
                    this.setState({
                        data: res.data,
                    })
                }
            })
        }
    }
    updateList = (multiEntityAccess) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == multiEntityAccess.id);
        if (index > -1)
            data[index] = multiEntityAccess;
        else {
            data = [multiEntityAccess, ...data];
        }
        this.setState({ data },
            () => {
                this.hideForm();
                this.fetchList();
            });
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            multiEntityAccess: undefined
        })
    }
    delete = (employee) => {
        confirmAlert({
            title: `Remove Employee ${employee.employeeName}`,
            message: 'Are you sure, you want to remove this Employee from Multi-Entity Access?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteMultiEntity(employee.id).then(res => {
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
        const { data, } = this.state
        return (
            <>
                <div className="page-container content container-fluid" >
                    <div className="tablePage-header" >
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Manage Multi Entity Access </h3>
                            </div>
                            <div className="float-right col-auto mt-2">
                                <div className="row justify-content-end">
                                    <a href="#" className="btn apply-button btn-primary" onClick={() => {
                                        this.setState({ 
                                            multiEntityAccess : {id: 0,
                                                companyId: '',
                                                employeeId: '',
                                                accessCompanyId: '',
                                                roleId: ''
                                            },
                                            showForm: true })
                                    }}><i className="fa fa-plus" /> Add </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}
                    {verifyOrgLevelViewPermission("Module Setup Owner") && (<div className="row">
                        <div className="col-md-12">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 ">
                                        <div className="expireDocs-table">
                                            <table className="table">
                                                <thead >
                                                    <tr style={{ background: '#c4c4c4' }}>
                                                        <th>#</th>
                                                        <th>Employee Name</th>
                                                        <th>Default Company Name</th>
                                                        <th>Assigned Company Name</th>
                                                        <th>Assigned Company Role</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.map((item, index) => (
                                                        <tr key={`${item.employeeId}_${index}`} className="table-row">
                                                            <td className="table-column">{index + 1}</td>
                                                            <td className="table-column">
                                                                <EmployeeListColumn
                                                                    key={item.employeeId}
                                                                    id={item.employeeId}
                                                                    name={`${item.employeeName}`}
                                                                    employeeId={item.empId}
                                                                />
                                                            </td>
                                                            <td className="table-column">{item.defaultCompanyName}</td>
                                                            <td className="table-column">{item.accessCompanyName}</td>
                                                            <td className="table-column">{item.accessCompanyRole}</td>
                                                            <td className="table-column">
                                                                <div className="dropdow">
                                                                    <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                                        <i className="las la-bars"></i>
                                                                    </a>
                                                                    <div className="dropdown-menu dropdown-menu-right">
                                                                        <a className="dropdown-item" href="#" onClick={() => {
                                                                            this.setState({ multiEntityAccess: item, showForm: true })
                                                                        }} >
                                                                            <i className="fa fa-pencil m-r-5"></i> Edit</a>
                                                                        <a className="dropdown-item" href="#" onClick={() => {
                                                                            this.delete(item);
                                                                        }}>
                                                                            <i className="fa fa-trash-o m-r-5"></i> Remove </a>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <Modal enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm} >
                                    <Header closeButton>
                                        <h5 className="modal-title">{this.state.multiEntityAccess?.id > 0 ? 'Edit' : 'Add'} Multi Entity Access</h5>
                                    </Header>
                                    <Body>
                                        <MultiEntityAccessForm updateList={this.updateList} multiEntityAccess={this.state.multiEntityAccess}>
                                        </MultiEntityAccessForm>
                                    </Body>
                                </Modal>
                            </div>
                        </div>
                    </div>
                    )}{!verifyOrgLevelViewPermission("Module Setup Owner") && <AccessDenied></AccessDenied>}
                </div>
            </>
        )
    }
}
