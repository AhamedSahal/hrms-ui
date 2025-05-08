import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getUserType, getEmployeeId,getPermission,verifyApprovalPermission } from '../../../utility';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import LeaveTypeDropdown from '../../ModuleSetup/Dropdown/LeaveTypeDropdown';
import ProjectDropdown from '../../ModuleSetup/Dropdown/ProjectDropdown';
import ExpenseCategoryDropdown from '../../ModuleSetup/Dropdown/ExpenseCategoryDropdown';
import { saveWorkExpenses } from './service'; 
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';

export default class WorkExpensesForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            workExpenses: props.workExpenses || {
                id: 0,
                employeeId: props.employeeId || getEmployeeId(),
                employee: { id: props.employeeId || getEmployeeId() },
                expensecatId: 0,
                expensescat:{
                    id: 0,
                },
                spenddate: "",
                referenceId: "",
                projectId: 0,
                project:{
                    id: 0,
                },
                description: "",
                file: null,
                amountspent: "",
                VATamount: ""
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.workExpenses && nextProps.workExpenses != prevState.workExpenses) {
            return ({ workExpenses: nextProps.workExpenses })
        } else if (!nextProps.workExpenses) {
            return ({
                workExpenses: {
                    id: 0,
                    employeeId: nextProps.employeeId || getEmployeeId(),
                    employee: { id: nextProps.employeeId || getEmployeeId() },
                    expensecatId: 0,
                    expensescat:{
                        id: 0,
                    },
                    spenddate: "",
                    referenceId: "",
                    projectId: 0,
                    project:{
                        id: 0,
                    },
                    description: "",
                    file: null,
                    amountspent: "",
                    VATamount: ""
                }
            })
        }

        return null;
    }
    save = (data, action) => {  
        action.setSubmitting(true);
        saveWorkExpenses(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message); 
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                setTimeout(function () {
                    window.location.reload()
                  }, 6000) }
            action.setSubmitting(false)
        }).catch(err => {
            console.error(err);
            toast.error("Error while applying Work Expense");
            action.setSubmitting(false); 
        })
    }
    redirectToList = () => {
        this.props.history.goBack();
    }
    
    render() {
        let { workExpenses } = this.state;
        workExpenses.file = ""; 
        workExpenses.employeeId = workExpenses.employee?.id || getEmployeeId(); 
        
        const currentDate = new Date().toISOString().split('T')[0];
        return (
            <div>

            <Formik
                enableReinitialize={true}
                initialValues={this.state.workExpenses}
                onSubmit={this.save}
            // validationSchema={ProjectSchema}
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
                            {isCompanyAdmin && <> <div className="col-md-6">
                                <FormGroup>
                                <label>Employee
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="employeeId" render={field => {
                                        return <EmployeeDropdown defaultValue={values.employee?.id} onChange={e => {
                                            setFieldValue("employeeId", e.target.value);
                                            setFieldValue("employee", { id: e.target.value });
                                        }}></EmployeeDropdown>
                                    }} ></Field>
                                    <ErrorMessage name="employeeId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div></>}
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Expense Category
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                   <Field name="expensecatId" render={field => {
                                        return <ExpenseCategoryDropdown   defaultValue={values.expensecatId} onChange={e => {
                                        setFieldValue("expensecatId", e.currentTarget.value);
                                        setFieldValue("expensescat", { id: e.target.value });
                                    }} required></ExpenseCategoryDropdown> }}></Field>
                                    <ErrorMessage name="expensecatId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                <FormGroup>
                                    <label>
                                        Date of Spend
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="spenddate" type="date" defaultValue={values.spenddate} className="form-control" max={currentDate} required></Field>
                                    <ErrorMessage name="spenddate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                <FormGroup>
                                    <label>
                                        Bill / Invoice Reference
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="referenceId"   placeholder="12CG107" className="form-control" required></Field>
                                    <ErrorMessage name="referenceId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                <FormGroup>
                                    <label>
                                        Project
                                    </label>
                                    <ProjectDropdown defaultValue={values.projectId} onChange={e => {
                                            setFieldValue("projectId", e.currentTarget.value);
                                            setFieldValue("project", { id: e.target.value });
                                        }}></ProjectDropdown>
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12" style={{ fontWeight: "normal" }}>
                                <FormGroup>
                                    <label>
                                        Description
                                    </label>
                                    <Field name="description" component="textarea" rows="5" placeholder="Enter Description" defaultValue={values.description} className="form-control"></Field>
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                <FormGroup>
                                    <label>
                                    Add File <span style={{ color: "red" }}>*</span>
                                    </label>
                                <input name="file" type="file" className="form-control" onChange={e => 
                                {setFieldValue('file', e.target.files[0]);}} required></input>
                                <p style={{ fontSize: "10px", fontFamily: "Arial" }}>
                                Please upload a file of less than 5MB and of format (pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx, .ppt, .pptx, .txt, .csv.)</p>
                                <ErrorMessage name="file">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                                </FormGroup>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div style={{ fontSize: "18px", fontWeight: "bolder", textAlign: "Left" }}>Payment Details</div><br /><br/>
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Amount Spent (Inclusive of All.)
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="amountspent" type="number" className="form-control" required></Field>
                                    <ErrorMessage name="amountspent">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>VAT<span style={{color:"grey"}}> (optional)</span></label>
                                    <Field name="VATamount" type="number" className="form-control" ></Field> 
                                </FormGroup>
                            </div>
                        </div>
                        <input type="submit" className="btn btn-primary" value={this.state.workExpenses.id > 0 ? "Claim" : "Claim"} />
                    </Form>
                )
                }
            </Formik>
        </div>
        )
    }
}
