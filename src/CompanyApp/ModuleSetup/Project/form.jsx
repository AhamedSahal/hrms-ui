import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getEmployeeId } from '../../../utility';
import { save } from './service';
import EmployeeDropdown from "../Dropdown/EmployeeDropdown";
import { ProjectSchema } from './validation';

export default class ProjectForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            project: props.project || {
                id: 0,
                employeeId: props.employeeId || getEmployeeId(),
                employee: { id: props.employeeId || getEmployeeId() },
                name: "",
                active: true,
                code: ""
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.project && nextProps.project != prevState.project) {
            return ({ project: nextProps.project })
        } else if (!nextProps.project) {

            return prevState.project || ({
                project: {
                    id: 0,
                    employeeId: nextProps.employeeId || getEmployeeId(),
                    employee: { id: nextProps.employeeId || getEmployeeId() },
                    name: "",
                    active: true,
                    code: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        save(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Project");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.project}
                    onSubmit={this.save}
                    validationSchema={ProjectSchema}
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

                            <FormGroup>
                                <label>Project Code
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="code" className="form-control"></Field>
                                <ErrorMessage name="code">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Project Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <div className="row">
                                    <div className="col-md-12" style={{ fontWeight: "normal" }}>
                                        <FormGroup>
                                            <label>
                                                Project Manager
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="employeeId" render={field => {
                                                return <EmployeeDropdown 
                                                defaultValue={values.employee?.id}
                                                onChange={e => {
                                                    setFieldValue("employeeId", e.target.value);
                                                    setFieldValue("employee", { id: e.target.value });
                                                }}></EmployeeDropdown>
                                            }}></Field>
                                        </FormGroup>
                                    </div>
                                </div>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { project } = this.state;
                                    project.active = !project.active;
                                    setFieldValue("active", project.active);
                                    this.setState({
                                        project
                                    });
                                }} >
                                    <label>Inactive / Active</label><br />
                                    <i className={`fa fa-2x ${this.state.project
                                        && this.state.project.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.project.id > 0 ? "Update" : "Add"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
