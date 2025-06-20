import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveAssets } from './service';
import AssetsCategoryDropDown from '../ModuleSetup/Dropdown/AssetsCategoryDropDown';
import AssetSetupDropDown from '../ModuleSetup/Dropdown/AssetSetupDropDown';
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown';
import { verifyEditPermission, verifyViewPermission } from '../../utility';
import { AssetSchema } from './validation';
import { Tooltip } from 'antd';

export default class Assets extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Assets: props.Assets || {
                id: 0,
                assetId: 0,
                assetCatId: 0,
                serialno: "",
                tag: "",
                brandName: "",
                modelNo: "",
                ram: "",
                storagecapacity: "",
                imeiNo: "",
                ipAddress: "",
                currentlocation: "",
                purchasefrom: "",
                prevState: "",
                purchaseDate: "",
                wStartDate: "",
                wEndDate: "",
                assignDate: "",
                employeeId: props.employeeId,
                prevemployeeId: props.prevemployeeId
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.Assets && nextProps.Assets != prevState.Assets) {
            return ({ Assets: nextProps.Assets })
        } else if (!nextProps.Assets ) { 
            return prevState.Assets || ({
                Assets: {
                    id: 0,
                    assetId: 0,
                    assetCatId: 0,
                    serialno: "",
                    tag: "",
                    brandName: "",
                    modelNo: "",
                    ram: "",
                    storagecapacity: "",
                    imeiNo: "",
                    ipAddress: "",
                    currentlocation: "",
                    purchasefrom: "",
                    prevState: "",
                    purchaseDate: "",
                    wStartDate: "",
                    wEndDate: "",
                    assignDate: "",
                    employeeId: nextProps.employeeId,
                    prevemployeeId: nextProps.prevemployeeId
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        verifyEditPermission("Manage Assets") && saveAssets(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message); 
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                setTimeout(function () {
                    window.location.reload()
                  }, 1000)
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Asset");

            action.setSubmitting(false);
        })
    }

 
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.Assets}
                    onSubmit={this.save}
                    validationSchema={AssetSchema}
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
                             <div className="col-sm-12">
                                <div className="row">
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Category
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="assetCatId" render={field => {
                                        return   <AssetsCategoryDropDown  onChange={e => {
                                            setFieldValue("assetCatId", e.currentTarget.value);
                                        }}></AssetsCategoryDropDown>}}></Field> 
                                        <ErrorMessage name="assetCatId">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label style={{ paddingBottom: 8 }}>Asset Name
                                            <span style={{ color: "red" }}>*</span>
                                        </label> 
                                        <Field name="assetId" render={field => {
                                            return  <AssetSetupDropDown  assetCatId={values.assetCatId}  onChange={e => {
                                            setFieldValue("assetId", e.currentTarget.value);
                                        }}></AssetSetupDropDown>}}></Field> 
                                        <ErrorMessage name="assetId">
                                            {msg => <div style={{ color: 'red', marginTop: '10px' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                    <FormGroup>
                                       <div className="d-flex align-items-center">
                                        <label>
                                            Serial Number <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Tooltip title="Serial number is only allowed to contain (A-Z, a-z, 0-9, - _ . /)">
                                            <i
                                                className="fa fa-info-circle"
                                                style={{ marginLeft: '8px',marginBottom:'5px', cursor: 'pointer' }}
                                            ></i>
                                        </Tooltip>
                                    </div>
                                        <Field name="serialno" className="form-control"></Field>
                                        <ErrorMessage name="serialno">
                                            {msg => <div style={{ color: 'red', marginTop: '5px' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Tag</label>
                                        <Field name="tag" className="form-control"></Field>
                                    </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Brand Name</label>
                                        <Field name="brandName" className="form-control"></Field> 
                                    </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Model Number</label>
                                        <Field name="modelNo" className="form-control"></Field>
                                    </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>RAM</label>
                                        <Field name="ram" className="form-control"></Field>
                                    </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Storage Capacity</label>
                                        <Field name="storagecapacity" className="form-control"></Field> 
                                    </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>IMEI Number</label>
                                        <Field name="imeiNo" className="form-control"></Field>
                                    </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>IP address</label>
                                        <Field name="ipAddress" className="form-control"></Field>
                                    </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Current Location</label>
                                        <Field name="currentlocation" className="form-control"></Field>
                                    </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Purchased From</label>
                                        <Field name="purchasefrom" className="form-control"></Field>
                                    </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Previous State</label>
                                        <Field name="prevState" className="form-control"></Field>
                                    </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Purchased Date</label>
                                        <Field name="purchaseDate" type="date" defaultValue={values.purchaseDate} className="form-control"></Field>
                                    </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Warranty Start Date</label>
                                        <Field name="wstartDate" type="date" defaultValue={values.wStartDate} className="form-control"></Field>
                                    </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Warranty End Date</label>
                                        <Field name="wendDate" type="date" defaultValue={values.wEndDate} className="form-control"></Field>
                                    </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Assign Date<span style={{ color: "red" }}></span></label>
                                        <Field name="assignDate" type="date"  className="form-control" ></Field>
                                        <ErrorMessage name="assignDate">
                                            {msg => <div style={{ color: 'red', marginTop: '5px' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Assign to<span style={{ color: "red" }}></span></label>
                                        <Field name="employeeId" className="col-md-12" render={field => {
                                                return <EmployeeDropdown  permission="ORGANIZATION"  onChange={e => {
                                                setFieldValue("employeeId", e.target.value);
                                                setFieldValue("employee", { id: e.target.value });
                                            }}></EmployeeDropdown>
                                        }}></Field>
                                        
                                    </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                    <FormGroup>
                                        <label>Previous Owner</label>
                                        <Field name="prevemployeeId" className="col-md-12" render={field => {
                                           
                                                return <EmployeeDropdown permission="ORGANIZATION" onChange={e => {
                                                setFieldValue("prevemployeeId", e.target.value);
                                                setFieldValue("prevemployee", { id: e.target.value });
                                            }}></EmployeeDropdown>
                                        }}></Field>
                                    </FormGroup>
                                    </div>
                                </div>
                             
                                <input type="submit" className="btn btn-primary" value={this.state.Assets.id>0?"Update":"Add"}/>
                            </div>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
