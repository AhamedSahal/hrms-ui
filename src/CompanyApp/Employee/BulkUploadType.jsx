import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component,useEffect,useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, FormGroup } from 'reactstrap';
import EnumDropdown from '../ModuleSetup/Dropdown/EnumDropdown';
import { ImportType } from '../../Constant/enum';
import { downloadAttendanceTemplate } from '../../HttpRequest';
import { saveImportJobsAttendance, saveImportJobsDeductions, saveImportJobsEarnings, saveImportJobsEmployees, saveImportJobsJobTitle, saveImportJobsEmployeesalary } from './service';
import { verifyOrgLevelEditPermission, verifyOrgLevelViewPermission } from '../../utility';
import AccessDenied from '../../MainPage/Main/Dashboard/AccessDenied';
export default class BulkUploadTypeForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editable: true,
            importType: '',
            downloadType: '',
            overrideData: false,
            attendanceBulk: {},
            timeZone: '',
        }
    }
    componentDidMount() {
        this.getUserTimeZone();
    }
    getUserTimeZone = () => {
        const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.setState({
          timeZone: currentTimeZone,
        });
      };
    save = (data) => {
    if(this.state.importType === 'ATTENDANCE'){
        try {
            saveImportJobsAttendance(data,this.state.importType,this.state.overrideData,this.state.timeZone).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.setState({importType : null,overrideData : false })
                    document.querySelector('input[name="file"]').value = '';
                } else {
                    toast.error(res.message);
                }
            });
        }
             catch (err) {
            toast.error("Error while uploading Attendance Bulk Data");
        }
    }
    else if(this.state.importType === 'JOB_TITLE'){
        try {
            saveImportJobsJobTitle(data,this.state.importType,this.state.overrideData,this.state.timeZone).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.setState({importType : null,overrideData : false })
                    document.querySelector('input[name="file"]').value = '';
                } else {
                    toast.error(res.message);
                }
            });}
             catch (err) {
            toast.error("Error while uploading Job-Title Bulk Data");
        }
    }
    else if(this.state.importType === 'EARNINGS'){
        try {
            saveImportJobsEarnings(data,this.state.importType,this.state.overrideData,this.state.timeZone).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.setState({importType : null,overrideData : false })
                    document.querySelector('input[name="file"]').value = '';
                } else {
                    toast.error(res.message);
                }
            });}
             catch (err) {
            toast.error("Error while uploading Earnings Bulk Data");
        }
    }
    else if(this.state.importType === 'DEDUCTIONS'){
        try {
            saveImportJobsDeductions(data,this.state.importType,this.state.overrideData,this.state.timeZone).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.setState({importType : null,overrideData : false })
                    document.querySelector('input[name="file"]').value = '';
                } else {
                    toast.error(res.message);
                }
            });}
             catch (err) {
            toast.error("Error while uploading Deductions Bulk Data");
        }
    }
    else if(this.state.importType === 'EMPLOYEES'){
        try {
            saveImportJobsEmployees(data,this.state.importType,this.state.overrideData,this.state.timeZone).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.setState({importType : null,overrideData : false })
                    document.querySelector('input[name="file"]').value = '';
                } else {
                    toast.error(res.message);
                }
            });}
             catch (err) {
            toast.error("Error while uploading Employee Bulk Data");
        }
    }
    else if(this.state.importType === 'SALARY'){
        try {
            saveImportJobsEmployeesalary(data,this.state.importType,this.state.overrideData,this.state.timeZone).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.setState({importType : null,overrideData : false })
                    document.querySelector('input[name="file"]').value = '';
                } else {
                    toast.error(res.message);
                }
            });}
             catch (err) {
            toast.error("Error while uploading Employee Bulk Data");
        }
    }
    
    }

    downloadTemplateType = () => {
        let fileName = '';
        if (this.state.importType === 'ATTENDANCE') {
            fileName = 'EmployeeAttendanceTemplate.xlsx';
        }
        else if (this.state.importType === 'JOB_TITLE') {
            fileName = 'JobTitleTemplate.xlsx';
        }
        else if (this.state.importType === 'EARNINGS') {
            fileName = 'EarningsTemplate.xlsx';
        }
        else if (this.state.importType === 'DEDUCTIONS') {
            fileName = 'DeductionsTemplate.xlsx';
        }
        else if (this.state.importType === 'EMPLOYEES') {
            fileName = 'EmployeeBulkUploadTemplate.xlsx';
        }
        else if (this.state.importType === 'SALARY'){
            fileName = 'EmployeeSalaryUploadTemplate.xlsx';
        }
        if (fileName) {
            downloadAttendanceTemplate(fileName)
                .catch((error) => {
                    console.warn('Error downloading template:', error);
                });
        } else {
            console.warn('Invalid importType or missing fileName.');
        }
    }
    render() {
        const { editable, importType,overrideData } = this.state;
        return (
            <>
                <div className="page-container content container-fluid">
                    {/* Page Header */}
                    <div className="tablePage-header">
                        <div className="row pageTitle-section">
                            <div className="col">
                                <h3 className="tablePage-title">Bulk Imports</h3>
                            </div>
                        </div>
                    </div>

                    {/* /Page Header */}
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card-body">
                            {verifyOrgLevelEditPermission("Module Setup Bulk Import") &&
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.attendanceBulk}
                                    //onSubmit={this.save}
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
                                                <div className="col-md-6">
                                                    <FormGroup>
                                                        <label> Import Type
                                                            <span style={{ color: "red" }}>*</span>
                                                        </label>
                                                        <Field readOnly={editable} name="importType" className="form-control"
                                                            render={field => {
                                                                return <EnumDropdown label={"Import Type"} readOnly={!editable} enumObj={ImportType} defaultValue={this.state.importType}
                                                                    onChange={e => {
                                                                        this.setState({ importType: e.target.value });
                                                                        setFieldValue("importType", e.target.value)
                                                                    }}>
                                                                </EnumDropdown>
                                                            }}
                                                        ></Field>
                                                    </FormGroup>
                                                </div>
                                                {this.state.importType !== '' && (
                                                    <>
                                                        <div className="col-md-3" style={{paddingBlock: '40px'}} >
                                                            <button className="btn btn-primary" style={{backgroundColor:'#45C56D',border:'#45C56D'}} onClick={this.downloadTemplateType}
                                                                >
                                                        <i className="fa fa-download"> Download Template</i>
                                                        </button>
                                                        </div>
                                                    {!['JOB_TITLE', 'SALARY'].includes(this.state.importType) && (
                                                        <div className="col-md-3" style={{paddingBlock: '40px'}}>
                                                        <div type="checkbox" name="active" onClick={e => {
                                                            let { overrideData } = this.state;
                                                            overrideData = !overrideData;
                                                            setFieldValue("overrideData", overrideData);
                                                            this.setState({
                                                                overrideData
                                                            });

                                                        }} >
                                                            <label>Data Override</label><br />
                                                            <i className={`fa fa-2x ${this.state.overrideData ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}></i>
                                                        </div>
                                                        </div>
                                                    )}

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
                                                        <div className="col-md-6" style={{paddingBlock: '32px'}}>
                                                            <input type="submit" className="btn btn-primary" value="Upload" onClick={() => this.save({ file: values.file }, this.state.importType)} />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </Form>
                                    )
                                    }
                                </Formik>
                            }{!verifyOrgLevelEditPermission("Module Setup Bulk Import") && <AccessDenied></AccessDenied>}
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )
    }
}
