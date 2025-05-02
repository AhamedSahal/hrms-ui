import { Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Anchor } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { getEmployeeBulkTemplate, saveBulkEmployee } from './bulkService';
//React Component for employee bulk upload
export default class BulkUpload extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    camelize(text) {
        text = text.replace(/[-_\s.]+(.)?/g, (_, c) => c ? c.toUpperCase() : '');
        return text.substr(0, 1).toLowerCase() + text.substr(1);
    }
    //read excel sheet and set state employees
    readExcel = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            let data = e.target.result;
            let workbook = XLSX.read(data, {
                type: 'binary'
            });
            let sheetName = workbook.SheetNames[0];
            let excelRows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            if (excelRows.length > 100) {
                toast.error("Please upload only 100 employees at a time");
            } else {
                this.setState({
                    employees: excelRows
                });
            }
        }
        reader.readAsBinaryString(file);
    }
    downloadTemplate() {
        getEmployeeBulkTemplate().then(res => {
            var blob = new Blob([res.data], {
                type: res.headers["content-type"],
              });
              const link = document.createElement("a");
              link.href = window.URL.createObjectURL(blob);
              link.download = `EmployeeImportTemplate_${new Date().getTime()}.xlsx`;
              link.click();
        })
    }
    saveEmployees = () => {
        let { employees } = this.state;
        let payload = [];
        employees.forEach(employee => {

            let employeeData = new Object();
            employeeData["email"] = employee.Email;
            let dict = {};
            Object.keys(employee).forEach(key => {
                if (key !== "Email") {
                    dict[this.camelize(key)] = employee[key];
                }
            });
            employeeData.employeeData = dict;
            payload.push(employeeData);
        });
        console.log({ payload });

        saveBulkEmployee(payload).then(res => {
            console.log({ res });
            if (res.status == "OK") {
                this.setState({
                    employees: res.data.data
                })
            }
        })
    }
    exportEmployees=()=>{
        var ws = XLSX.utils.json_to_sheet(this.state.employees);
        console.log({ws}) 
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Employees') 
        XLSX.writeFile(wb, 'Employees.xlsx')
    }
    render() {
        //Access Excel file and upload to server
        return (
            <div className="page-wrapper">
                <Helmet>
                    {/* <title>Employee | {getTitle()}</title> */}
                    <meta name="description" content="Login page" />
                </Helmet>
                {/* Page Content */}
                <div className="content container-fluid">
                    {/* Page Header */}
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col">
                                <h3 className="page-title">Employee</h3>
                                <ul className="breadcrumb">
                                    <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                                    <li className="breadcrumb-item active">Employee</li>
                                </ul>
                            </div>
                            <div className="float-right col-auto ml-auto">
                                {/* donwload template as Sample Template */}
                                <a href={'#'} onClick={this.downloadTemplate} className="btn btn-primary btn-sm">
                                    <i className="fa fa-download"></i>
                                    &nbsp;Download Template
                                </a>

                            </div>
                        </div>
                    </div>
                    {/* /Page Header */}

                    <div className="row">
                        <div className="col-md-12">
                            {/* Employee bulk Excel upload form using Formik */}

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Upload excel file</label>

                                        <ul>
                                            <li><small>Please upload only 100 employees at a time</small></li>
                                            <li><small>Do not modify template headers</small></li>
                                            <li><small>Download Template using link given in right corner</small></li>
                                        </ul>
                                        <input
                                            type="file"
                                            className="form-control col-4"
                                            name="file"
                                            onChange={(e) => {
                                                this.readExcel(e.currentTarget.files[0]);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {this.state.employees && this.state.employees.length > 0 && <> <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Uploaded Excel Sheet Preview</label>
                                        <div className="table-responsive" style={{ width: "100%", overflow: "auto", height: "500px" }}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        {Object.keys(this.state.employees[0]).map((key, index) => {
                                                            if (this.state.employees[0].employeeData) {
                                                                return <>
                                                                    <th>status</th>
                                                                    <th>message</th>
                                                                    <th>password</th>
                                                                    {Object.keys(this.state.employees[0].employeeData).map((key, index) => {
                                                                        return <th>{key}</th>
                                                                    })}
                                                                </>
                                                            } else {
                                                                return <th key={index}>{key}</th>
                                                            }
                                                        })}

                                                    </tr>
                                                </thead>
                                                {/* display employee data read from excel */}
                                                <tbody>
                                                    {this.state.employees && this.state.employees.length>0 && this.state.employees.map((employee, index) => {
                                                        if (employee.employeeData) {
                                                            return <tr key={index}>
                                                                <td>{employee["status"]}</td>
                                                                <td>{employee["message"]}</td>
                                                                <td>{employee["password"]}</td>
                                                                {Object.keys(employee.employeeData).map((key, i) => {
                                                                    return <td key={i}>{employee.employeeData[key]}</td>
                                                                })}
                                                            </tr>
                                                        }
                                                        else {
                                                            return <tr key={index}>
                                                                {Object.keys(employee).map((key, index) => {
                                                                    return <td key={index}>{employee[key]}</td>
                                                                })}
                                                            </tr>

                                                        }
                                                    })}
                                                </tbody>


                                            </table>
                                        </div>

                                    </div>
                                </div>
                            </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary" onClick={this.saveEmployees}>Upload</button>
                                            &nbsp;
                                            <button type="button" className="btn btn-warning" onClick={this.exportEmployees}>Export</button>
                                        </div>
                                    </div>
                                </div></>}

                        </div>
                    </div>
                </div>
            </div>
        )
    }

}