import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { updatePlan } from './service';
import { PlanSchema } from './validation';

export default class PlanForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            plan: props.plan || {
                id: 0,
                duration: "UNLIMITED",
                name: "",
                description: "",
                maxEmployees: 0,
                maxUsers: 0,
                price:0
            }
        }
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        
        if (nextProps.plan && nextProps.plan!= prevState.plan) {
            return ({ plan: nextProps.plan })
        } else if(!nextProps.plan){
            return ({
                plan: {
                    id: 0,
                    code: "",
                    name: "",
                    description: "",
                    discount: "",
                    isActive: true,
                    maxLimit: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => { 
        action.setSubmitting(true);
        updatePlan(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving plan");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.plan}
                    onSubmit={this.save}
                    validationSchema={PlanSchema}
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
                                <label>Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup>
                                <label>Duration
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                 <select className="form-control" name="duration" 
                                 onChange={handleChange} onBlur={handleBlur} value={values.duration}
                                  >
                                    <option value="">Select Duration</option>
                                    <option value="UNLIMITED">UNLIMITED</option>
                                    <option value="YEAR">YEARLY</option>
                                    <option value="MONTH">MONTHLY</option> 
                                    </select>
                                <ErrorMessage name="duration">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>

                            </FormGroup>

                            <FormGroup>
                                <label>
                                Max Employees
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="maxEmployees" className="form-control"></Field>
                                <ErrorMessage name="maxEmployees">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>
                                    Max Users
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="maxUsers" className="form-control"></Field>
                                <ErrorMessage name="maxUsers">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>
                                    Price
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="price" className="form-control"></Field>
                                <ErrorMessage name="price">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Description</label>

                                <Field name="description"
                                    component="textarea" rows="4"
                                    className="form-control"
                                    placeholder="Description"
                                >
                                </Field>
                            </FormGroup> 

                            <input type="submit" className="btn btn-primary" value="Update" />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
