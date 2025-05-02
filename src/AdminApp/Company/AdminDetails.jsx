import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteAdmin, getAdmin, getCompanyDetails, saveAdmin } from './service';
import { getReadableDate } from '../../utility';
import { confirmAlert } from 'react-confirm-alert';
import EmployeeListColumn from '../../CompanyApp/Employee/employeeListColumn';
import AdminOwnerForm from './AdminOwnerForm';
const { Header, Body } = Modal;

export default class AdminForm extends Component {
    _isMounted = false;

    constructor(props) {
        super(props)
        const company = this.props.company || {};
        this.state = {
            companyId: company.id,
            company : company,
            editable: true,
            employeeId: '',
            admins: [],
            adminData: {}
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchList();
        this.fetchCompanyDetails();
    }
    componentDidUpdate(prevProps) {
        if (this.props.company !== prevProps.company) {
            this.setState({
                company:this.props.company,
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    fetchCompanyDetails = () => {
            getCompanyDetails(this.state.companyId)
                .then(res => {
                    if (res.status === 'OK') {
                        this.setState({
                            company: res.data,
                        });
                    } else {
                        console.log("Error: " + res.error);
                    }
                })
                .catch(error => {
                    console.log("Error: " + error);
            });
        };

    fetchList = () => {
        getAdmin(this.state.companyId)
            .then(res => {
                if (this._isMounted) {
                    if (res.status === 'OK') {
                        this.setState({
                            admins: res.data,
                        });
                    } else {
                        console.log("Error: " + res.error);
                    }
                }
            })
            .catch(error => {
                console.log("Error: " + error);
            });
    };
    updateList = () => {
        this._isMounted = true;
        this.fetchList();
    }

    handleEmployeeIdChange = (e) => {
        const newValue = e.target.value;
        this.setState({ employeeId: newValue });
    }

    delete = (empId) => {
        const companyId = this.state.companyId;
        confirmAlert({
            title: `Remove Owner/Admin`,
            message: 'Are you sure, you want to remove this Owner/Admin?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteAdmin(empId, companyId).then(res => {
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
    hideForm = () => {
        this.setState({
            showForm: false,
            ownerDetails: undefined
        })
    }
    render() {
        const {  admins ,company} = this.state;
        return (
            <>
                <div className="page-container content container-fluid">
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Manage Company Admin </h3>
                            </div>
                            <div className="float-right col-auto mt-2">
                                <div className="row justify-content-end">
                                    <a href="#" className="btn apply-button btn-primary" onClick={() => {
                                        this.setState({ showForm: true })
                                    }}><i className="fa fa-plus" /> Add Owner</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 ">
                                        <div className="expireDocs-table">
                                            <table className="table">
                                                <thead >
                                                    <tr style={{ background: '#c4c4c4' }}>
                                                        <th>#</th>
                                                        <th>Admin Name</th>
                                                        <th>Created On</th>
                                                        <th>Created By</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {admins.map((item, index) => (
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
                                                            <td className="table-column">{getReadableDate(item.createdOn)}</td>
                                                            <td className="table-column">{item.createdBy}</td>
                                                            <td className="table-column">
                                                                <div className="dropdow">
                                                                    <>
                                                                        <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                                            <i className="las la-bars"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu dropdown-menu-right">
                                                                            {company.multiEntity && <a className="dropdown-item" href="#" onClick={() => {
                                                                                this.setState({ ownerDetails: item, showForm: true })
                                                                            }} >
                                                                                <i className="fa fa-pencil m-r-5"></i> Edit</a>}
                                                                            <a className="dropdown-item" href="#" onClick={() => {
                                                                                this.delete(item.employeeId);
                                                                            }}>
                                                                                <i className="fa fa-user-times m-r-5"></i> Remove </a>
                                                                        </div>
                                                                    </>
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
                                        <h5 className="modal-title">{this.state.ownerDetails ? 'Edit' : 'Add'} Owner Details</h5>
                                    </Header>
                                    <Body>
                                        <AdminOwnerForm updateList={this.updateList} ownerDetails={this.state.ownerDetails} company={this.state.company} companyId={this.state.company?.id} hideForm={this.hideForm}>
                                        </AdminOwnerForm>
                                    </Body>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}
