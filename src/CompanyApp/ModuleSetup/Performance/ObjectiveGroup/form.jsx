import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveObjectiveGroup } from './service';
import { ObjectiveGroupSchema } from './validation';


export default class ObjectiveGroupForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            objectivegroup: props.objectivegroup || {
                id: 0,
                name: "",
                active: true
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.objectivegroup && nextProps.objectivegroup != prevState.objectivegroup) {
            return ({ objectivegroup: nextProps.objectivegroup })
        } else if (!nextProps.objectivegroup ) { 
            return prevState.objectivegroup || ({
                objectivegroup: {
                    id: 0,
                    name: "",
                    active: true
                }
            })
        }
        return null;
    }
    save = (data, action) => {
         action.setSubmitting(true);
        saveObjectiveGroup(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Performance Factor");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.objectivegroup}
                    onSubmit={this.save}
                    validationSchema={ObjectiveGroupSchema}
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
                                <label>Weightage % 
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="weightage" type="number" className="form-control"></Field>
                                <ErrorMessage name="weightage">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>  
                            <input type="submit" className="btn btn-primary" value={this.state.objectivegroup.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
