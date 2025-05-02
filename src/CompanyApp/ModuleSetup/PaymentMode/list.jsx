import { Table } from 'antd';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';
import AccessDenied from "../../../MainPage/Main/Dashboard/AccessDenied";
import { verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from "../../../utility";
import { deletePaymentMode, getPaymentModeList } from './service';
import PaymentModeForm from './form';
const { Header, Body, Footer, Dialog } = Modal;

export default class PaymentMode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            q: "",
        };
    }
    componentDidMount() {
        this.fetchList();
    }
    fetchList = () => {
        if (verifyOrgLevelViewPermission("Module Setup Pay")) {
            getPaymentModeList().then(res => {
                if (res.status == "OK") {
                    this.setState({
                        data: res.data,
                    })
                }
            })
        }
    }
    updateList = (paymentModeType) => {
        let { data } = this.state;
        let index = data.findIndex(d => d.id == paymentModeType.id);
        if (index > -1)
            data[index] = paymentModeType;
        else {
            data = [paymentModeType, ...data];
        }
        this.setState({ data },
            () => {
                this.hideForm();
            });
    }
    hideForm = () => {
        this.setState({
            showForm: false,
            paymentMode: undefined
        })
    }
    delete = (pay) => {
        confirmAlert({
            title: `Delete Payment Mode ${pay.name}`,
            message: 'Are you sure, you want to delete this Payment Mode?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deletePaymentMode(pay.id).then(res => {
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
        const { data } = this.state
        return (
            <div className="page-container content container-fluid">
                {/* Page Header */}
                <div className="tablePage-header">
                    <div className="row pageTitle-section">
                        <div className="col">
                            <h3 className="tablePage-title">Payment Mode</h3>
                        </div>

                        <div className="mt-2 float-right col-auto ml-auto">
                            {verifyOrgLevelEditPermission("Module Setup Pay") && <a href="#" className="btn apply-button btn-primary" onClick={() => {
                                this.setState({
                                    showForm: true
                                })
                            }}><i className="fa fa-plus" /> Add</a>}
                        </div>

                    </div>
                </div>
                <div className="row">
                {verifyOrgLevelViewPermission("Module Setup Pay") &&
                    <div className="col-md-12 ">
                        <div className="expireDocs-table">
                            <table className="table">
                                <thead >
                                    <tr style={{ background: '#c4c4c4' }}>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={`${item.empId}_${index}`} className="table-row">
                                            <td className="table-column">{index + 1}</td>
                                            <td className="table-column">{item.name}</td>
                                            <td className="table-column">
                                                <div className="dropdow">
                                                    <>
                                                        <a href="#" className="action-icon dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                            <i className="las la-bars"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right">
                                                            <a className="dropdown-item" href="#" onClick={() => {
                                                                let { paymentMode } = this.state;
                                                                paymentMode = item;
                                                                this.setState({ paymentMode, showForm: true })
                                                            }} >
                                                                <i className="fa fa-pencil m-r-5"></i> Edit</a>
                                                            <a className="dropdown-item" href="#" onClick={() => {
                                                                this.delete(item);
                                                            }}>
                                                                <i className="fa fa-trash-o m-r-5"></i> Delete </a>
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
                    }{!verifyOrgLevelViewPermission("Module Setup Pay") && <AccessDenied></AccessDenied>}
                </div>




                <Modal enforceFocus={false} size={"md"} show={this.state.showForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">{this.state.paymentMode ? 'Edit' : 'New'} Payment Mode</h5>
                    </Header>
                    <Body>
                        <PaymentModeForm updateList={this.updateList} paymentMode={this.state.paymentMode}>
                        </PaymentModeForm>
                    </Body>
                </Modal>
            </div>
        );
    }
}