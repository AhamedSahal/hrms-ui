import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveDesignation } from './service';
import { DesignationSchema } from './validation';
import DepartmentDropdown from '../Dropdown/DepartmentDropdown';

export default class DesignationForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            designation: props.designation || {
                id: 0,
                name: "",
                active: true,
                departmentId: 0,
                department: {
                    id: 0
                }
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.designation && nextProps.designation != prevState.designation) {
            return ({ designation: nextProps.designation })
        } else if (!nextProps.designation) {

            return prevState.designation || ({
                designation: {
                    id: 0,
                    name: "",
                    active: true,
                    departmentId: 0,
                    department: {
                        id: 0
                    }
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveDesignation(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Designation");

            action.setSubmitting(false);
        })
    }
    render() {
        let { designation } = this.state;
        designation.departmentId = designation.department.id;
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={designation}
                    onSubmit={this.save}
                    validationSchema={DesignationSchema}
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
                            <FormGroup>
                                <label>Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Department
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="departmentId" render={field => {
                                    return <DepartmentDropdown defaultValue={this.state.designation.departmentId} onChange={e => {
                                        setFieldValue("departmentId", e.target.value)
                                    }}></DepartmentDropdown>
                                }}></Field>
                                <ErrorMessage name="departmentId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { designation } = this.state;
                                    designation.active = !designation.active;
                                    setFieldValue("active", designation.active);
                                    this.setState({
                                        designation
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.designation
                                        && this.state.designation.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.designation.id>0?"Update":"Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
