import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Anchor } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getUserType, verifyEditPermission } from '../../../../utility';
import { saveAcademic } from './service';
import { AcademicSchema } from './validation';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
const isEmployee = getUserType() == 'EMPLOYEE';
export default class AcademicForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            editable: true,
            academic: props.academic || {
                id: 0,
                gpa: "",
                employeeId: props.employeeId,
                fieldOfStudy: "",
                fileName: "",
                institute: "",
                qualification: "",
                yearOfCompletion: "",
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.academic && nextProps.academic != prevState.academic) {
            return ({ academic: nextProps.academic })
        } else if (!nextProps.academic) {
            return ({
                academic: {
                    id: 0,
                    gpa: "",
                    employeeId: nextProps.employeeId,
                    fieldOfStudy: "",
                    fileName: "",
                    institute: "",
                    qualification: "",
                    yearOfCompletion: "",
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        data["GPA"] = data.gpa;
        action.setSubmitting(true);
        saveAcademic(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving academic");

            action.setSubmitting(false);
        })
    }
    render() {
        let { editable, academic } = this.state;
        academic.file = "";
         
        return (
            <div>
                {!editable && !isEmployee && <Anchor onClick={() => {
                    this.setState({ editable: true })
                }}><i className="fa fa-edit"></i>Edit</Anchor>}
                <Formik
                    enableReinitialize={true}
                    initialValues={academic}
                    onSubmit={this.save}
                    validationSchema={AcademicSchema}
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
                                <label>Qualification
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field readOnly={!editable} name="qualification" className="form-control"></Field>
                                <ErrorMessage name="qualification">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Institute
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field readOnly={!editable} name="institute" className="form-control"></Field>
                                <ErrorMessage name="institute">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Field Of Study
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field readOnly={!editable} name="fieldOfStudy" className="form-control"></Field>
                                <ErrorMessage name="fieldOfStudy">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>


                            <FormGroup>
                                <label>
                                    GPA
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field readOnly={!editable} name="gpa" className="form-control"></Field>
                                <ErrorMessage name="gpa">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>
                                    Year Of Completion
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field readOnly={!editable} name="yearOfCompletion" className="form-control"></Field>
                                <ErrorMessage name="yearOfCompletion">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>
                                    File
                                </label>
                                <input name="file" type="file" className="form-control" onChange={e => {
                                    setFieldValue('file', e.target.files[0]);
                                }}></input>

                            </FormGroup>

                            <Field readOnly={!editable} type="hidden" name="fileName">
                            </Field>
                            <Field readOnly={!editable} type="hidden" name="employeeId">
                            </Field>
                            <input type="submit" className="btn btn-primary" value={this.state.academic.id > 0 ? "Update" : "Save"} />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
