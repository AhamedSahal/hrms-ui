import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, FormGroup } from 'reactstrap';
import { DatePicker } from 'antd';
import { payHubBulkSchema } from './validation';
import { savePayHubBulk } from './service';
import PayHubIndustryDropdown from '../../CompanyApp/ModuleSetup/Dropdown/PayHubIndustryDropdown';
import PayHubRegionDropdown from '../../CompanyApp/ModuleSetup/Dropdown/PayHubRegionDropdown';
import PayHubSubRegionDropdown from '../../CompanyApp/ModuleSetup/Dropdown/PayHubSubRegionDropdown';
import PayHubRevenueDropdown from '../../CompanyApp/ModuleSetup/Dropdown/PayHubRevenueDropdown';
export default class PayHubBulkUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editable: true,
            importType: '',
            downloadType: '',
            peers: [],
            peerValue: "",
            payHubBulk: {
                id: 0,
                regionId: '',
                year: '',
                importType: '',
                subRegionId: '',
                industryId: '',
                revenueId: ''
            },
            timeZone: '',
            isValid: false
        }
    }
    // componentDidMount() {
    //     this.getUserTimeZone();
    // }
    // getUserTimeZone = () => {
    //     const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    //     this.setState({
    //         timeZone: currentTimeZone,
    //     });
    // };
    handleChangePeers = (evt) => {
        this.setState({
            peerValue: evt.target.value,

        });
    };

    handleDeletePeers = (toBeRemoved) => {
        this.setState({
            peers: this.state.peers.filter((peers) => peers !== toBeRemoved),
        });
    };

    handleKeyDownPeers = (evt) => {
        if (["Enter", "Tab", ","].includes(evt.key)) {
            evt.preventDefault();

            var peers = this.state.peerValue.trim();

            if (peers) {
                this.setState({
                    peers: [...this.state.peers, peers],
                    peerValue: "",
                });
            }
        }
    };

    save = (data, action) => {
        // savePayHubBulk(data).then(res => {
        //     if (res.status == "OK") {
        //         toast.success(res.message);
        //         this.props.updateList(res.data);
        //     } else {
        //         toast.error(res.message);
        //     }
        //     action.setSubmitting(false)
        // }).catch(err => {
        //     toast.error("Error while saving PayHub-Bulk");

        //     action.setSubmitting(false);
        // })
    }

    downloadTemplateType = () => {
        let fileName = '';
        if (this.state.importType === '1') {
            fileName = 'payHub.xlsx';
        }

    }
    render() {
        const { editable, importType, overrideData } = this.state;
        return (
            <>
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Pay Hub Bulk Imports</h3>
                            </div>
                        </div>
                    </div>

                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card-body">

                                <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.payHubBulk}
                                    onSubmit={this.save}
                                    validationSchema={payHubBulkSchema}
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
                                        <Form>
                                            <div className="row">
                                                <div>
                                                    <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                                        <span>
                                                            We kindly request you to upload the file using the provided template format.This template is carefully designed to ensure seamless processing and accurate data extraction. You will receive a notification as soon as the import process is complete. This notification will provide you with the necessary and any relevant updates.
                                                        </span>
                                                    </div>
                                                </div>
                                                <FormGroup className='col-md-6'>
                                                    <label>Year
                                                        <span style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <DatePicker className="form-control" onChange={(date, dateString) => setFieldValue("year", dateString)} picker="year" />
                                                    <ErrorMessage name="year">
                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                                <FormGroup className='col-md-6'>
                                                    <label>Region
                                                        <span style={{ color: "red" }}>*</span>
                                                    </label>
                                                    {/* <PayHubRegionDropdown></PayHubRegionDropdown> */}
                                                    <select onChange={e => {
                                                        setFieldValue("regionId", e.target.value);
                                                    }} on name='regionId' className="form-control" >
                                                        <option value="">Select Region</option>
                                                        <option value="1">UAE</option>
                                                        <option value="2">KSA</option>
                                                        <option value="3">OMAN</option>
                                                    </select>
                                                    <ErrorMessage name="regionId">
                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>

                                                <FormGroup className='col-md-6'>
                                                    <label>Sub Region
                                                        <span style={{ color: "red" }}>*</span>
                                                    </label>
                                                    {/* <PayHubSubRegionDropdown></PayHubSubRegionDropdown> */}
                                                    
                                                    <select onChange={e => {
                                                        setFieldValue("subRegionId", e.target.value);
                                                    }} name='subRegionId' className="form-control" >
                                                        <option value="">Select Region</option>
                                                        <option value="1">1</option>
                                                        <option value="2" >2</option>
                                                        <option value="3" >3</option>
                                                    </select>
                                                    <ErrorMessage name="subRegionId">
                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                                <FormGroup className='col-md-6'>
                                                    <label>Industry Sector
                                                        <span style={{ color: "red" }}>*</span>
                                                    </label>
                                                    {/* <PayHubIndustryDropdown></PayHubIndustryDropdown> */}
                                                    <select onChange={e => {
                                                        setFieldValue("industryId", e.target.value);
                                                    }} name='industryId' className="form-control" >
                                                        <option value="">Select Industry</option>
                                                        <option value="1">1</option>
                                                        <option value="2" >2</option>
                                                        <option value="3" >3</option>
                                                    </select>
                                                    <ErrorMessage name="industryId">
                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                                <FormGroup className='col-md-6'>
                                                    <label>Revenue
                                                        <span style={{ color: "red" }}>*</span>
                                                    </label>
                                                    {/* <PayHubRevenueDropdown></PayHubRevenueDropdown> */}
                                                    <select onChange={e => {
                                                        setFieldValue("revenueId", e.target.value);
                                                    }} name='revenueId' className="form-control" >
                                                        <option value="">Select Revenue</option>
                                                        <option value="1">1</option>
                                                        <option value="2" >2</option>
                                                        <option value="3" >3</option>
                                                    </select>
                                                    <ErrorMessage name="revenueId">
                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                                <FormGroup className='col-md-6'>
                                                    <label>For Client
                                                    </label>
                                                    <select onChange={e => {
                                                        setFieldValue("revenueId", e.target.value);
                                                    }} name='revenueId' className="form-control" >
                                                        <option value="">Select Client</option>
                                                        <option value="1">Focal Point</option>
                                                        <option value="2" >Tuscan</option>
                                                        <option value="3" >Taphi</option>
                                                    </select>
                                                    <ErrorMessage name="revenueId">
                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                            <div className="row">

                                                
                                               
                                                <div className="col-md-6">
                                                    <main className="multi-inputwrapper">
                                                        <FormGroup>
                                                            <label> Peer List
                                                                <span style={{ color: "red" }}>*</span>
                                                            </label>
                                                            <input
                                                                className="m-0 multi-input"
                                                                placeholder="Type or paste skills and press `Enter`"
                                                                value={this.state.peerValue}
                                                                onChange={this.handleChangePeers}
                                                                onKeyDown={this.handleKeyDownPeers}
                                                            />
                                                        </FormGroup>
                                                        <br />
                                                        {this.state.peers.map((name) => (
                                                            <div className="multi-input-tag-item" key={name}>
                                                                {name}

                                                                <button
                                                                    type="button"
                                                                    className="button"
                                                                    onClick={() => this.handleDeletePeers(name)}
                                                                >
                                                                    &times;
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </main>
                                                </div>

                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <label> Import Type
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <select onChange={e => {
                                                            setFieldValue("importType", e.target.value);
                                                        }} name='importType' className="form-control" >
                                                            <option value="">Select Type</option>
                                                            <option value="1">Individual</option>
                                                            <option value="2" >Company</option>
                                                            <option value="3" >Market</option>
                                                        </select>
                                                        <ErrorMessage name="importType">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                               
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <label>Upload File
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <input name="file" type="file" required className="form-control" onChange={e => {
                                                            setFieldValue('file', e.target.files[0]);
                                                        }} />
                                                        <ErrorMessage name="file">
                                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                        </ErrorMessage>
                                                    </FormGroup>
                                                </div>
                                                <div className="col-md-3" style={{ paddingBlock: '40px' }} >
                                                    <i className="fa fa-download" onClick={this.downloadTemplateType}> Download Template</i>
                                                </div>
                                                <div className="col-md-6" style={{ paddingBlock: '32px' }}>
                                                    <input type="submit" className="btn btn-success" value="Save" />
                                                </div>

                                            </div>
                                        </Form>
                                    )
                                    }
                                </Formik>

                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}
