import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { deleteOwners, getOwners, saveOwner } from './service';
import { getCompanyId, getIsMultiEntity, getReadableDate, verifyOrgLevelViewPermission } from '../../utility';
import EmployeeListColumn from './employeeListColumn';
import { confirmAlert } from 'react-confirm-alert';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
import CompanyOwnerForm from './CompanyOwnerForm';
const { Header, Body } = Modal;

export default class CompanyOwners extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            ownerDetails: {
                id: 0,
                employeeId: '',
                defaultOwner: false,
                reportingHeadId: '',
                reportingHeadCompanyId: '',
                autoApproval: false,
                companyId: '',
            },
            isMultiEntity : getIsMultiEntity(),
            company : getCompanyId(),
            editable: true,
            employeeId: '',
            owners: [],
            ownersData: {}
        }
    }
    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        if (verifyOrgLevelViewPermission("Module Setup Owner")) {
            getOwners().then(res => {
                if (res.status === 'OK') {
                    this.setState({
                        owners: res.data,
                        ownerDetails: {},
                    });
                } else {
                    console.log("Error: " + res.error);
                }
            }).catch(error => { console.log("Error: " + error); });
        };
    }

    save = (data, action) => {
        action.setSubmitting(true);
        this.fetchList();
        saveOwner(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.fetchList();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false);
        }).catch(err => {
            toast.error("Please select the Employee to add Owner");
            action.setSubmitting(false);
        })
    }
    handleEmployeeIdChange = (e) => {
        const newValue = e.target.value;
        this.setState({ employeeId: newValue });
    }

    delete = (empId) => {
        confirmAlert({
            title: `Remove Owner`,
            message: 'Are you sure, you want to remove this Owner?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteOwners(empId).then(res => {
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
        const { owners,isMultiEntity } = this.state;
        return (
            <>
                <div className="page-container content container-fluid">
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title"> Manage Owners </h3>
                            </div>
                            <div className="float-right col-auto mt-2">
                                <div className="row justify-content-end">
                                    <a href="#" className="btn apply-button btn-primary" onClick={() => {
                                        this.setState({ownerDetails: {
                                            id: 0,
                                            employeeId: '',
                                            defaultOwner: false,
                                            reportingHeadId: '',
                                            reportingHeadCompanyId: '',
                                            autoApproval: false,
                                            companyId: this.state.company,
                                        }, showForm: true })
                                    }}><i className="fa fa-plus" /> Add Owner</a>
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
                                                        <th>Owners</th>
                                                        <th>Created On</th>
                                                        <th>Created By</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {owners.map((item, index) => (
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
                                                                            {isMultiEntity && <a className="dropdown-item" href="#" onClick={() => {
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
                                        <CompanyOwnerForm updateList={this.fetchList} ownerDetails={this.state.ownerDetails} companyId={this.state.company} hideForm={this.hideForm}>
                                        </CompanyOwnerForm>
                                    </Body>
                                </Modal>
                            </div>
                        </div>
                    </div>)}
                    {!verifyOrgLevelViewPermission("Module Setup Owner") && <AccessDenied></AccessDenied>
                    }
                </div>
            </>
        )
    }
}
