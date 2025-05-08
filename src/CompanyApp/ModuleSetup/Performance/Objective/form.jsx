import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import ObjectiveGroupDropdown from '../../Dropdown/ObjectiveGroupDropdown';
import { saveObjective } from './service';
import { ObjectiveSchema } from './validation';

export default class ObjectiveForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            objective: props.objective || {
                id: 0,
                name: "",
                active: true,
                performanceObjectiveGroupId: 0,
                performanceObjectiveGroup: {
                    id: 0
                }
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.objective && nextProps.objective != prevState.objective) {
            return ({ objective: nextProps.objective })
        } else if (!nextProps.objective) {

            return prevState.objective || ({
                objective: {
                    id: 0,
                    name: "",
                    active: true,
                    performanceObjectiveGroupId: 0,
                    performanceObjectiveGroup: {
                        id: 0
                    }
                }
            })
        }
        return null;
    }
    save = (data, action) => { 
        action.setSubmitting(true);
        saveObjective(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Competency");

            action.setSubmitting(false);
        })
    }
    render() { 
        let {objective} = this.state;
        objective.performanceObjectiveGroupId=objective.performanceObjectiveGroup.id;
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={objective}
                    onSubmit={this.save}
                    validationSchema={ObjectiveSchema}
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
                                <label>Cluster
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="performanceObjectiveGroupId" render={field => {
                                    return <ObjectiveGroupDropdown defaultValue={this.state.objective.performanceObjectiveGroup.id} onChange={e => {
                                        setFieldValue("performanceObjectiveGroupId", e.target.value)
                                    }}></ObjectiveGroupDropdown>
                                }}></Field>
                                <ErrorMessage name="performanceObjectiveGroupId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
 
                            <input type="submit" className="btn btn-primary" value={this.state.objective.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
