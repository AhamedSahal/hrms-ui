import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveCountry } from './service';
import { CountrySchema } from './validation';

export default class CountryForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            country: props.country || {
                id: 0,
                name: "",
                nationality:"",
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.country && nextProps.country != prevState.country) {
            return ({ country: nextProps.country })
        } else if (!nextProps.country ) { 
            return prevState.country || ({
                country: {
                    id: 0,
                    name: "",
                    nationality:"",
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveCountry(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving country");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.country}
                    onSubmit={this.save}
                    validationSchema={CountrySchema}
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
                                <label>Country Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Nationality
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="nationality" className="form-control"></Field>
                                <ErrorMessage name="nationality">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <input type="submit" className="btn btn-primary" value={this.state.country.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
