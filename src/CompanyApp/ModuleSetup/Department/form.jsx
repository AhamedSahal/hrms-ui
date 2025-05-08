import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap'; 
import { saveDepartment } from './service';
import { DepartmentSchema } from './validation';

export default class DepartmentForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            department: props.department || {
                id: 0,
                name: "",
                active: true,
                
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.department && nextProps.department != prevState.department) {
            return ({ department: nextProps.department })
        } else if (!nextProps.department) {

            return prevState.department || ({
                department: {
                    id: 0,
                    name: "",
                    active: true,
                     
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveDepartment(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Department");

            action.setSubmitting(false);
        })
    }
    render() {
        let {department} = this.state; 
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={department}
                    onSubmit={this.save}
                    validationSchema={DepartmentSchema}
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
                                <label>Department
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                             

                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { department } = this.state;
                                    department.active = !department.active;
                                    setFieldValue("active", department.active);
                                    this.setState({
                                        department
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.department
                                        && this.state.department.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.department.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
