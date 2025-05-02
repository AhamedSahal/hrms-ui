import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveAllowancetype } from './service';
import { AllowanceTypeSchema } from './validation';


export default class AllowanceTypeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            allowancetype: props.allowancetype || {
                id: 0,
                name: ""
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.allowancetype && nextProps.allowancetype != prevState.allowancetype) {
            return ({ allowancetype: nextProps.allowancetype })
        } else if (!nextProps.allowancetype ) { 
            return prevState.allowancetype || ({
                allowancetype: {
                    id: 0,
                    name: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveAllowancetype(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving allowance type");
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.allowancetype}
                    onSubmit={this.save}
                    validationSchema={AllowanceTypeSchema}
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
                            <input type="submit" className="btn btn-primary" value={this.state.allowancetype.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
