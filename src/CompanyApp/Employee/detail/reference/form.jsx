import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { verifyEditPermission } from '../../../../utility';
import { saveProfessionalReference } from './service';
import { ProfessionalReferenceSchema } from './validation';


export default class ProfessionalReferenceForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            professionalReference: props.professionalReference || {
                id: 0,
                employeeId: props.employeeId,
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.professionalReference && nextProps.professionalReference != prevState.professionalReference) {
            return ({ professionalReference: nextProps.professionalReference })
        } else if (!nextProps.professionalReference) {
            return ({
                professionalReference: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                }
            })
        }

        return null;
    }
    save = (data, action) => {

        action.setSubmitting(true);
        saveProfessionalReference(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                console.log({ props: this.props })
                this.props.updateList(res.data);
                this.props.fetchList();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.error(err);
            toast.error("Error while saving professionalReference");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.professionalReference}
                    onSubmit={this.save}
                    validationSchema={ProfessionalReferenceSchema}
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
                                <label>Company Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="company" className="form-control"></Field>
                                <ErrorMessage name="company">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Contact Number
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="contactNumber" className="form-control"></Field>
                                <ErrorMessage name="contactNumber">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Email
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="email" className="form-control"></Field>
                                <ErrorMessage name="email">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.professionalReference.id > 0 ? "Update" : "Save"} />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
