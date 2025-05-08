import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';  
import { saveEmploymentStatus } from './service';
import { EmploymentStatusSchema } from './validation'; 

export default class EmploymentForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
          employmentStatus: props.employmentStatus || {
                id: 0,
                name: "",
                modeOfPay:"",
                active:true
            } 
        }
    }

    save = (data, action) => {
        action.setSubmitting(true); 
        saveEmploymentStatus(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error(err); 
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.employmentStatus}
                    onSubmit={this.save}
                    validationSchema={EmploymentStatusSchema} 
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
                                        <label>Mode of Pay
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div className="radio" >
                                            <label>
                                                <input type="radio" value="yes" name="modeOfPay"
                                                    checked={values.modeOfPay === 'yes'}
                                                    onChange={e => {
                                                        setFieldValue("modeOfPay", e.target.value)
                                                    }}
                                                />&nbsp;Default(Attendance clockin/clockout)
                                            </label>&nbsp;&nbsp;&nbsp;
                                            <label>
                                                <input type="radio"
                                                    value="no" name="modeOfPay"
                                                    checked={values.modeOfPay === 'no'}
                                                    onChange={e => {
                                                        setFieldValue("modeOfPay", e.target.value)
                                                    }}
                                                />&nbsp;Customization(Timesheet)
                                            </label>
                                        </div>
                                        <ErrorMessage name="modeOfPay">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                 <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { employmentStatus } = this.state;
                                    employmentStatus.active = !employmentStatus.active;
                                    setFieldValue("active", employmentStatus.active);
                                    this.setState({
                                      employmentStatus
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.employmentStatus
                                        && this.state.employmentStatus.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.employmentStatus.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
