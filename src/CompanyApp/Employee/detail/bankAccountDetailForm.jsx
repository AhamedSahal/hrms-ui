import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Modal, Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getOrDefault, getPermission, getUserType, verifyEditPermission, getEmployeeId } from '../../../utility';
import { getBankInformation, updateBankInformation } from './service';
import { BankDetailsSchema } from '../validation';
import { PERMISSION_LEVEL } from '../../../Constant/enum';
import PaymentModeDropdown from '../../ModuleSetup/PaymentMode/PaymentModeDropdown';
import { getPaymentModeSelectList } from '../../ModuleSetup/PaymentMode/service';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const isEmployee = getUserType() == 'EMPLOYEE';
const { Header, Body, Footer, Dialog } = Modal;
export default class BankAccountDetailEmployeeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editable: false,
            payModeId: 0,
            payModeName: "",
            id: props.employeeId || 0,
            employee: props.employee || {
                id: 0,
                name: "",
                active: true
            },
            paymentModes: []
        }
    }

    componentDidMount() {
        this.fetchList()

    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevState.editable && this.state.editable) {
            const name = this.getPaymentModeName(this.state.employee.paymentModeId);
            if (name !== this.state.payModeName) {
                this.setState({ payModeName: name });
            }
        }
    }

    fetchList = () => {
        getBankInformation(this.state.id).then(res => {
            let employee = res.data;
            this.setState({ employee })
        });
        getPaymentModeSelectList().then(res => {
            this.setState({ paymentModes: res.data })
        });
    }

    save = (data, action) => {
        action.setSubmitting(true);
        updateBankInformation(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.setState({ employee: res.data, editable: false });
                this.fetchList()
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Bank Detail");

            action.setSubmitting(false);
        })
    }
    getPaymentModeName = (paymentId) => {
        if (!paymentId || !this.state.paymentModes || !this.state.paymentModes.length) {
            return "";
        }

        const paymentMode = this.state.paymentModes.find(x => x.id == paymentId);
        return paymentMode ? paymentMode.name : "";
    }

    render() {
        let { editable, employee } = this.state;
        // const isEditAllowed = getPermission("Peoples Organization", "EDIT") == PERMISSION_LEVEL.ORGANIZATION
        const currentUserId = getEmployeeId();
        const isEditAllowed = getPermission("Peoples Organization", "EDIT") == PERMISSION_LEVEL.ORGANIZATION ||
            (getPermission("Peoples My Profile", "EDIT") == PERMISSION_LEVEL.SELF &&
                currentUserId == this.state.id);
        if (editable && !isEditAllowed) {
            editable = true;
        }
        employee.accountHolderName = getOrDefault(employee.accountHolderName, "");
        employee.accountNumber = getOrDefault(employee.accountNumber, "");
        employee.bankName = getOrDefault(employee.bankName, "");
        employee.ibanNumber = getOrDefault(employee.ibanNumber, "");
        employee.branchLocation = getOrDefault(employee.branchLocation, "");
        employee.swiftCode = getOrDefault(employee.swiftCode, "");
        employee.routingCode = getOrDefault(employee.routingCode, "");
        employee.labourCardNo = getOrDefault(employee.labourCardNo, "");
        employee.employerId = getOrDefault(employee.employerId, "");
        employee.paymentMode = this.getPaymentModeName(employee.paymentModeId);
        return (
            <>
                <div className="col-md-6 d-flex">
                    <div className="card profile-box flex-fill">
                        <div className="card-body">
                            <h3 className="card-title">Bank Information {(!editable && isEditAllowed) && <Anchor style={{ borderRadius: "50%" }} className="btn btn-success btn-sm" onClick={() => {
                                this.setState({ editable: true })
                            }}><i className="fa fa-edit"></i></Anchor>}</h3>
                            <ul className="personal-info">
                                <li>
                                    <div className="title">Payment Mode</div>
                                    <div className="text">{getOrDefault(employee.paymentMode, "-")}</div>
                                </li>
                                <li>
                                    <div className="title">Account Holder Name</div>
                                    <div className="text">{getOrDefault(employee.accountHolderName, "-")}</div>
                                </li>
                                <li>
                                    <div className="title">Account Number</div>
                                    <div className="text">{getOrDefault(employee.accountNumber, "-")}</div>
                                </li>
                                <li>
                                    <div className="title">Bank Name</div>
                                    <div className="text">{getOrDefault(employee.bankName, "-")}</div>
                                </li>
                                <li>
                                    <div className="title"> IBAN Number</div>
                                    <div className="text">{getOrDefault(employee.ibanNumber, "-")}</div>
                                </li>
                                <li>
                                    <div className="title">Branch Location</div>
                                    <div className="text">{getOrDefault(employee.branchLocation, "-")}</div>
                                </li>
                                <li>
                                    <div className="title">SWIFT Code </div>
                                    <div className="text">{getOrDefault(employee.swiftCode, "-")}</div>
                                </li>
                                <li>
                                    <div className="title">Routing Code </div>
                                    <div className="text">{getOrDefault(employee.routingCode, "-")}</div>
                                </li>
                                <li>
                                    <div className="title">Labour Card Number </div>
                                    <div className="text">{getOrDefault(employee.labourCardNo, "-")}</div>
                                </li>
                                <li>
                                    <div className="title">Employer Id </div>
                                    <div className="text">{getOrDefault(employee.employerId, "-")}</div>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>

                <Modal enforceFocus={false} size={"xl"} show={editable} onHide={() => { this.setState({ editable: false }) }}>
                    <Header closeButton>
                        <h5 className="modal-title">Edit Bank Information</h5>
                    </Header>
                    <Body>
                        <Formik
                            enableReinitialize={true}
                            initialValues={employee}
                            onSubmit={this.save}
                            validationSchema={BankDetailsSchema(this.state.payModeName)}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                setFieldValue,
                                setSubmitting
                                /* and other goodies */
                            }) => (
                                <Form autoComplete='off'>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Payment Mode <span style={{ color: 'red' }}> * </span>
                                                </label>
                                                <Field required readOnly={!editable} name="paymentModeId" render={field => {
                                                    return <PaymentModeDropdown readOnly={!editable} defaultValue={employee.paymentModeId} onChange={e => {
                                                        setFieldValue("paymentModeId", e.target.value);
                                                        const name = this.getPaymentModeName(e.target.value);
                                                        this.setState({ payModeName: name });
                                                    }}></PaymentModeDropdown>
                                                }}></Field>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Account Holder Name
                                                    {this.state.payModeName == "WPS" && <span style={{ color: "red" }}>*</span>}
                                                </label>
                                                <Field readOnly={!editable} name="accountHolderName" className="form-control"></Field>
                                                <ErrorMessage name="accountHolderName">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Account Number {this.state.payModeName == "WPS" && <span style={{ color: "red" }}>*</span>}
                                                </label>
                                                <Field readOnly={!editable} name="accountNumber" className="form-control"></Field>
                                                <ErrorMessage name="accountNumber">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Bank Name
                                                    {this.state.payModeName == "WPS" && <span style={{ color: "red" }}>*</span>}
                                                </label>
                                                <Field readOnly={!editable} name="bankName" className="form-control"></Field>
                                                <ErrorMessage name="bankName">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label> IBAN Number
                                                    {this.state.payModeName == "WPS" && <span style={{ color: "red" }}>*</span>}
                                                </label>
                                                <Field readOnly={!editable} name="ibanNumber" className="form-control"></Field>
                                                <ErrorMessage name="ibanNumber">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Branch Location
                                                    {this.state.payModeName == "WPS" && <span style={{ color: "red" }}>*</span>}
                                                </label>
                                                <Field readOnly={!editable} name="branchLocation" className="form-control"></Field>
                                                <ErrorMessage name="branchLocation">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>SWIFT Code {this.state.payModeName == "WPS" && <span style={{ color: "red" }}>*</span>}</label>
                                                <Field readOnly={!editable} name="swiftCode" className="form-control"></Field>
                                                <ErrorMessage name="swiftCode">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Routing Code {this.state.payModeName == "WPS" && <span style={{ color: "red" }}>*</span>}</label>
                                                <Field readOnly={!editable} name="routingCode" className="form-control"></Field>
                                                <ErrorMessage name="routingCode">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Labour Card No {this.state.payModeName == "WPS" && <span style={{ color: "red" }}>*</span>}</label>
                                                <Field readOnly={!editable} name="labourCardNo" className="form-control"></Field>
                                                <ErrorMessage name="labourCardNo">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Employer Id</label>
                                                <Field readOnly={!editable} name="employerId" className="form-control"></Field>
                                                <ErrorMessage name="employerId">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-4">
                                            <FormGroup>
                                                <label>Personal No(Labour Card) {this.state.payModeName == "WPS" && <span style={{ color: "red" }}>*</span>}</label>
                                                <Field readOnly={!editable} name="personalNo" className="form-control"></Field>
                                                <ErrorMessage name="personalNo">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                    </div>

                                    <input type="submit" className="btn btn-primary" value="Update" />
                                    &nbsp;
                                    <Anchor onClick={() => { this.setState({ editable: false }) }} className="btn btn-secondary btn-sm" ><span>Cancel</span></Anchor>
                                </Form>
                            )
                            }
                        </Formik>
                    </Body>
                </Modal>
            </>
        )
    }
}
