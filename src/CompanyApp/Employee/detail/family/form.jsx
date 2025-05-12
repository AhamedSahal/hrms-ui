import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { verifyEditPermission } from '../../../../utility';
import { saveFamily } from './service';
import { FamilySchema } from './validation';


export default class FamilyForm extends Component {
    constructor(props) {
        super(props)
        let family = props.family;

        this.state = {
            family: family || {
                id: 0,
                employeeId: props.employeeId,
                file: "",
                significantDate: "",

            },
            selectButton: props.family?.relation || 0
        }
    }



    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.family && nextProps.family != prevState.family) {
            return ({ family: nextProps.family })
        } else if (!nextProps.family) {
            return ({
                family: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                    file: nextProps.file,
                    significantDate: nextProps.significantDate

                }
            })
        }

        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveFamily(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.error(err);
            toast.error("Error while saving family");
            action.setSubmitting(false);
        })
    }
    render() {
        const currentDate = new Date().toISOString().split('T')[0];
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.family}
                    onSubmit={this.save}
                    validationSchema={FamilySchema}
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
                        <Form autocomplete="off">
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
                                {/* {Relation} */}
                                <div className="card-body" style={{ padding: "0px" }}>
                                    <label>Relation <span style={{ color: "red" }}>*</span></label>
                                    <select
                                        className="form-control"
                                        name="relation"
                                        id="relation"
                                        defaultValue={values.relation}
                                        onChange={(e) => {
                                            setFieldValue("relation", e.target.value);
                                            const tempRelation = e.target.value;
                                            const { family } = this.state;
                                            this.setState({ selectButton: e.target.value });
                                            if (tempRelation == "4" || tempRelation == "5" || tempRelation == "6" || tempRelation == "7") {
                                                setFieldValue('significantDate', " ");
                                                setFieldValue('file', " ");
                                            } else {
                                                setFieldValue("siginificantDate",
                                                    family.id == 0 ? " " : family.significantDate
                                                );
                                                setFieldValue("file", family.id == 0 ? " " : family.file);
                                            }
                                        }}
                                    >
                                        <option value="">Select Relation</option>
                                        <option value="1">Spouse</option>
                                        <option value="2">Daughter</option>
                                        <option value="3">Son</option>
                                        <option value="4">Father</option>
                                        <option value="5">Mother</option>
                                        <option value="6">Brother</option>
                                        <option value="7">Sister</option>

                                    </select>

                                </div>
                                <ErrorMessage name="relation">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Job Title/ Company 
                                </label>
                                <Field name="jobTitleOrCompany" className="form-control"></Field>
                                <ErrorMessage name="jobTitleOrCompany">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Contact No
                                  
                                </label>
                                <Field name="contactNo" className="form-control" required></Field>
                                <ErrorMessage name="contactNo">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                           


                            {this.state.selectButton == 1 ? <div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <FormGroup>
                                            <label>Marriage Date
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="significantDate" type="date" max={currentDate} defaultValue={values.date} className="form-control"
                                                onChange={(e) => {
                                                    setFieldValue('significantDate', e.target.value);
                                                }}></Field>
                                            <ErrorMessage name="significantDate">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                </div>
                                <FormGroup>
                                    <label>Marriage certificate <span style={{ color: "red" }}>*</span></label>
                                    <input name="file" type="file" required className="form-control" onChange={e => {
                                        setFieldValue('file', e.currentTarget.files[0]);
                                    }}></input>
                                    <ErrorMessage name="file">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div> : this.state.selectButton == 2 || this.state.selectButton == 3 ? <div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <FormGroup>
                                            <label> Date of Birth
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="significantDate" type="date" max={currentDate} defaultValue={values.significantDate} className="form-control"
                                                onChange={(e) => {
                                                    setFieldValue('significantDate', e.target.value);
                                                }}></Field>
                                            <ErrorMessage name="significantDate">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                </div>
                                <FormGroup>
                                    <label> DOB certificate <span style={{ color: "red" }}>*</span></label>
                                    <input name="file" type="file" required className="form-control" onChange={e => {
                                        setFieldValue('file', e.currentTarget.files[0]);
                                    }}></input>
                                    <ErrorMessage name="file">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div> : null}


                            <input type="submit" className="btn btn-primary" value={this.state.family.id > 0 ? "Update" : "Save"} />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
