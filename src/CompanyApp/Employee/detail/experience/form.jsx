import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { verifyEditPermission } from '../../../../utility';
import { saveExperience } from './service';
import { ExperienceSchema } from './validation';


export default class ExperienceForm extends Component {
    constructor(props) {
        super(props)
        let experience = props.experience;

        try {
            experience.fromDate = experience.fromDate.substr(0, 10);
            experience.toDate = experience.toDate.substr(0, 10);
        } catch (error) {
            console.error(error);
        }

        this.state = {
            experience: experience || {
                id: 0,
                employeeId: props.employeeId,
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.experience && nextProps.experience != prevState.experience) {
            let experience = nextProps.experience;
            try {
                experience.fromDate = experience.fromDate.substr(0, 10);
                experience.toDate = experience.toDate.substr(0, 10);
            } catch (error) {
                console.error(error);
            }
            return ({ experience })
        } else if (!nextProps.experience) {
            return ({
                experience: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                }
            })
        }

        return null;
    }
    save = (data, action) => {
        data["fromDate"] = new Date(`${data["fromDate"]} GMT`);
        data["toDate"] = new Date(`${data["toDate"]} GMT`);
        action.setSubmitting(true);
        saveExperience(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.error(err);
            toast.error("Error while saving experience");
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.experience}
                    onSubmit={this.save}
                    validationSchema={ExperienceSchema}
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
                                <label>Designation
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="designation" className="form-control"></Field>
                                <ErrorMessage name="designation">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Company
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="company" className="form-control"></Field>
                                <ErrorMessage name="company">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup>
                                <label>From Date
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="fromDate" type="date" className="form-control"></Field>
                                <ErrorMessage name="fromDate">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup>
                                <label>To Date
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="toDate" type="date" className="form-control"></Field>
                                <ErrorMessage name="toDate">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Job Description
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="jobDescription" className="form-control" component="textarea" rows="4"></Field>
                                <ErrorMessage name="jobDescription">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.experience.id > 0 ? "Update" : "Save"} />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
