import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Modal, Anchor } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getUserType, verifyEditPermission } from '../../../utility';
import CountryDropdown from '../../ModuleSetup/Dropdown/CountryDropdown';
import { getAddressInformation, updateAddressInformation } from './service';
import { AddressDetailEmployeeSchema } from '../validation';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const isEmployee = getUserType() == 'EMPLOYEE';

const { Header, Body, Footer, Dialog } = Modal;
export default class AddressDetailEmployeeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editable: false,
            id: props.employeeId || 0,
            localAddress: {
                id: 0,
                addressType: "LOCAL",
            },
            homeAddress: {
                id: 0,
                addressType: "HOMETOWN",
            },
            emergencyAddress: {
                id: 0,
                addressType: "EMERGENCY",
            },
            emergencyAddress2: {
                id: 0,
                addressType: "EMERGENCY2",
            },

            
        }
    }

    componentDidMount() {
        getAddressInformation(this.state.id).then(res => {
            let address = res.data;
            let localAddress = address.filter(a => a.addressType === "LOCAL")[0];
            let homeAddress = address.filter(a => a.addressType === "HOMETOWN")[0];
            let emergencyAddress = address.filter(a => a.addressType === "EMERGENCY")[0];
            let emergencyAddress2 = address.filter(a => a.addressType === "EMERGENCY2")[0];
            this.setState({
                localAddress,
                homeAddress,
                emergencyAddress,
                emergencyAddress2
            });
        })
    }

    save = (data, action) => {
        action.setSubmitting(true);
        updateAddressInformation(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.setState({
                    editable: false
                }, () => {
                    let { localAddress, homeAddress, emergencyAddress, emergencyAddress2 } = this.state;
                    let address = res.data;
                    if (address.addressType === "LOCAL") {
                        localAddress = address;
                    } else if (address.addressType === "HOMETOWN") {
                        homeAddress = address;
                    }
                    else if (address.addressType === "EMERGENCY") {
                        emergencyAddress = address;
                    }
                    else if (address.addressType === "EMERGENCY2") {
                        emergencyAddress2 = address;
                    }
                    this.setState({
                        localAddress,
                        homeAddress,
                        emergencyAddress,
                        emergencyAddress2

                    });

                })
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Address");
            action.setSubmitting(false);
        })
    }
    view = (address, heading) => {
        let { editable } = this.state;
        const isEditAllowed = verifyEditPermission("EMPLOYEE");
        if (editable && !isEditAllowed) {
            editable = true;
        }
        return <>
            <div className="card profile-box flex-fill">
                <div className="card-body">
                    <h3 className="card-title">{heading} {!editable && <Anchor style={{borderRadius:"50%"}} className="btn btn-success btn-sm" onClick={() => {
                        this.setState({ editable: true, editAddress: address })
                    }}><i className="fa fa-edit"></i></Anchor>}</h3>

                    <ul className="personal-info">

                        {(address.addressType == "EMERGENCY" ||  address.addressType == "EMERGENCY2") && <><li>
                            <div className="title">Contact Person</div>
                            <div className="text">{address.contactperson ?? "-"}</div>
                        </li>
                            <li>
                                <div className="title">Relationship</div>
                                <div className="text">{address.relationship ?? "-"}</div>
                            </li>
                            <li>
                                <div className="title">Phone</div>
                                <div className="text">{address.personalPhone ?? "-"}</div>
                            </li>
                            <li>
                                <div className="title">Mobile</div>
                                <div className="text">{address.mobile ?? "-"}</div>
                            </li></>}
                        {address.addressType !== "EMERGENCY" && address.addressType !== "EMERGENCY2"  && <><li>
                            <div className="title">Building Name</div>
                            <div className="text">{address.buildingName ?? "-"}</div>
                        </li> </>}
                        <li>
                            <div className="title">Street Address</div>
                            <div className="text">{address.contactAddress ?? "-"}</div>
                        </li>
                        <li>
                            <div className="title">City</div>
                            <div className="text">{address.city ?? "-"}</div>
                        </li>
                        <li>
                            <div className="title">Country</div>
                            <div className="text">{address.country?.name ?? "-"}</div>
                        </li>
                        {address.addressType == "HOMETOWN" && <><li>
                            <div className="title">Telephone No</div>
                            <div className="text">{address.telephoneNo?? "-"}</div>
                        </li> </>}
                        <li>
                            <div className="title">Zip/Postal Code</div>
                            <div className="text">{address.zipCode ?? "-"}</div>
                        </li>
                      
                        
                    </ul>
                </div>
            </div>
        </>
    }
    render() {
        let { editable } = this.state;
        const isEditAllowed = verifyEditPermission("EMPLOYEE") || verifyEditPermission ("COMPANY_ADMIN");
        if (editable && isEditAllowed) {
            editable = true;
        }
        return (<>
            <div className="col-md-12 d-flex">
                <div className="profile-box flex-fill">
                    <div className="row">
                        <div className="col-md-4">
                            {this.view(this.state.localAddress, "Local Address")}
                        </div>
                        <div className="col-md-4">
                            {this.view(this.state.homeAddress, "Home Country Address")}
                        </div>
                        <div className="col-md-4">
                            {this.view(this.state.emergencyAddress, "Emergency Contact 1")}
                        </div>
                        <div className="col-md-4">
                            {this.view(this.state.emergencyAddress2, "Emergency Contact 2")}
                        </div>
                    </div>

                </div>
            </div>
            <Modal enforceFocus={false} size={"md"} show={editable} onHide={() => { this.setState({ editable: false }) }}>
                <Header closeButton>
                    <h5 className="modal-title">Edit  Address</h5>
                </Header>
                <Body>
                    <Formik
                        enableReinitialize={true}
                        initialValues={this.state.editAddress}
                        onSubmit={this.save}
                        validationSchema={AddressDetailEmployeeSchema}
                    >
                        {({
                            values,
                            setFieldValue,
                        }) => (
                            <Form autoComplete='off'>
                                <div className="row">
                                    <div className="col-md-12">
                                        <FormGroup>
                                            <label>Address Type
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field readOnly={true} name="addressType" className="form-control" required></Field>
                                        </FormGroup>
                                    </div>
                                </div>
                                {((this.state.editAddress.addressType != "EMERGENCY") &&  (this.state.editAddress.addressType != "EMERGENCY2")) &&<><div className="row">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label>Building Name
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field readOnly={!editable} name="buildingName" className="form-control" required></Field>
                                            <ErrorMessage name="buildingName">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                </div></>}
                               
                                {(this.state.editAddress.addressType == "EMERGENCY" ||  this.state.editAddress.addressType == "EMERGENCY2")  && <><div className="row">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label>Contact Person
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field readOnly={!editable} name="contactperson" className="form-control" required></Field>
                                            <ErrorMessage name="contactperson">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label>Relationship
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field readOnly={!editable} name="relationship" className="form-control" required></Field>
                                            <ErrorMessage name="relationship">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>

                                 </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <FormGroup>
                                                <label>Phone
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly={!editable} name="personalPhone" className="form-control" required></Field>
                                                <ErrorMessage name="personalPhone">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                        <div className="col-md-6">
                                            <FormGroup>
                                                <label>Mobile
                                                    <span style={{ color: "red" }}>*</span>
                                                </label>
                                                <Field readOnly={!editable} name="mobile" className="form-control" required></Field>
                                                <ErrorMessage name="mobile">
                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                </ErrorMessage>
                                            </FormGroup>
                                        </div>
                                    </div></>
                                    }
                               
                                <div className="row">
                                    <div className="col-md-12">
                                        <FormGroup>
                                            <label>Street Address
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field readOnly={!editable} name="contactAddress" className="form-control" component="textarea" rows="5" required></Field>
                                            <ErrorMessage name="contactAddress">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                </div>
                                {((this.state.editAddress.addressType != "EMERGENCY") &&  (this.state.editAddress.addressType != "EMERGENCY2")) &&<><div className="row">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label>Telephone no  
                                                <span style={{ color: "red" }}>*</span>
                                            </label> 
                                            <Field readOnly={!editable} name="telephoneNo" className="form-control" required></Field>
                                            <ErrorMessage name="telephoneNo">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                </div></>}
                               
                                
                                <div className="row">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label>City
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field readOnly={!editable} name="city" className="form-control" required></Field>
                                            <ErrorMessage name="city">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label>Country
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field readOnly={!editable} name="country" render={field => {
                                                return <CountryDropdown required readOnly={!editable} defaultValue={values?.country?.id} onChange={e => {
                                                    setFieldValue("country.id", e.target.value);
                                                }}></CountryDropdown>
                                            }}></Field>
                                            <ErrorMessage name="country">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label>Zip/Postal Code
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field readOnly={!editable} name="zipCode" className="form-control" required></Field>
                                            <ErrorMessage name="zipCode">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-12">

                                        <input disabled={!editable} type="submit" className="btn btn-primary" value="Update" />
                                        &nbsp;
                                        <Anchor onClick={() => { this.setState({ editable: false }) }} className="btn btn-secondary btn-sm" ><span>Cancel</span></Anchor>
                                    </div>
                                </div>

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
