import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { Component } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormGroup } from "reactstrap";
import EmployeeDropdown from "../ModuleSetup/Dropdown/EmployeeDropdown";
import { saveTasks } from "./service";
import { TaskSchema } from "./validation";


export default class TasksForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editValidation: props.editValidation || false,
            Tasks: props.Tasks || {
                id: 0,
                employeeId: props.employeeId || 0,
                employee: { id: props.employeeId || 0 },
                description: "",
                taskname: "",
                file: null,
                url: "",
                startdate: "",
                enddate: ""

            },
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.Tasks && nextProps.Tasks != prevState.Tasks) {
            return { Tasks: nextProps.Tasks };
        } else if (!nextProps.Tasks) {
            return ({
                Tasks: {
                    id: 0,
                    employeeId: nextProps.employeeId || 0,
                    employee: { id: nextProps.employeeId || 0 },
                    description: "",
                    taskname: "",
                    file: null,
                    url: "",
                    startdate: "",
                    enddate: ""
                },
            }
            );
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveTasks(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                //this.redirectToList();
            } else {
                toast.error(res.message);
            }
            if(res.status == "OK"){
                let {editValidation} = this.state;
                setTimeout(
                    () => {
                         if(!editValidation){
                            this.redirectToList();
                         }
                         if(editValidation){
                            window.location.reload();
                         }
                    },
                    2000);
                
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log(err)
            toast.error("Error while creating Tasks");
            action.setSubmitting(false);
        })
    };
    redirectToList = () => {
        this.props.history.goBack();
    } 
    render() {
        return (
            <div>
                <div className="page-wrapper" >
                    <div className="content container-fluid">
                            <div className="page-header taskForm-page">
                                <Formik
                                    enableReinitialize={true}
                                    initialValues={this.state.Tasks}
                                    onSubmit={this.save}
                                validationSchema={TaskSchema}
                                >
                                    {({
                                        values,
                                        setFieldValue,
                                        /* and other goodies */
                                    }) => (
                                        <Form autoComplete="off">

                                            <div>
                                                <div className="col-md-12">
                                                    <div className="col-md-12">
                                                        <div className="row">
                                                            <div className="col-md-12" style={{ fontWeight: "normal" }}>
                                                                <FormGroup>
                                                                    <label>
                                                                        Title
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field name="taskname" className="form-control" placeholder="Apply Visa" required></Field>
                                                                    <ErrorMessage name="taskname">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                                </FormGroup>
                                                            </div>

                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12" style={{ paddingTop: "10px" }}>
                                                                <FormGroup>
                                                                    <label style={{ fontWeight: "normal" }}>
                                                                        Description
                                                                    </label>
                                                                    <Field name="description" className="form-control" placeholder="Enter Description" component="textarea" rows="5"></Field>
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                                                <FormGroup>
                                                                    <label>
                                                                        Assign to
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field
                                                                        name="employeeId"
                                                                        render={() => {
                                                                            return (
                                                                                <EmployeeDropdown permission="ORGANIZATION"
                                                                                    defaultValue={values.employee?.id}
                                                                                    onChange={(e) => {
                                                                                        setFieldValue(
                                                                                            "employeeId",
                                                                                            e.target.value
                                                                                        );
                                                                                        setFieldValue("employee", {
                                                                                            id: e.target.value,
                                                                                        });
                                                                                    }}
                                                                                ></EmployeeDropdown>
                                                                            );
                                                                        }}
                                                                    ></Field>
                                                                     <ErrorMessage name="employeeId">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                                                <FormGroup>
                                                                    <label>
                                                                        Start date
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field name="startdate" type="date" className="form-control" required></Field>
                                                                    <ErrorMessage name="startdate">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                                                <FormGroup>
                                                                    <label>
                                                                        Due on
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field name="enddate" type="date" className="form-control" required></Field>
                                                                    <ErrorMessage name="enddate">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                                                <FormGroup>
                                                                    <label>
                                                                        Add File
                                                                    </label>
                                                                    <input name="file" type="file" className="form-control" onChange={e => {
                                                                        setFieldValue('file', e.target.files[0]);
                                                                    }}></input>
                                                                    <p style={{ fontSize: "10px", fontFamily: "Arial" }}>
                                                                        Please upload a file of less than 5MB and of format (pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx, .ppt, .pptx, .txt, .csv.)</p>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                                                <FormGroup>
                                                                    <label>
                                                                        URL
                                                                    </label>
                                                                    <Field name="url" className="form-control" placeholder="Type here....."></Field>
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div style={{ paddingBottom: "5px", paddingTop: "20px" }}>
                                                            <input
                                                                type="submit"
                                                                className="btn btn-primary"
                                                                value={
                                                                    this.state.Tasks.id > 0 ? "Update" : "Create"
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                    </div>
                </div>
            </div>
        );
    }
}
