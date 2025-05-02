import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import ProjectDropdown from '../../Dropdown/ProjectDropdown';
import { save } from './service';
import { ActivitySchema } from './validation';


export default class ActivityForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            activity: props.activity || {
                id: 0,
                name: "",
                active: true,
                projectId: ""
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.activity && nextProps.activity != prevState.activity) {
            return ({ activity: nextProps.activity })
        } else if (!nextProps.activity) {

            return prevState.activity || ({
                activity: {
                    id: 0,
                    name: "",
                    active: true,
                    projectId: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        save(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Activity");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.activity}
                    onSubmit={this.save}
                    validationSchema={ActivitySchema}
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
                                <label>Activity Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Project
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <ProjectDropdown defaultValue={values.projectId} onChange={e => {
                                    setFieldValue("projectId", e.currentTarget.value);
                                }}></ProjectDropdown>
                                <ErrorMessage name="projectId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { activity } = this.state;
                                    activity.active = !activity.active;
                                    setFieldValue("active", activity.active);
                                    this.setState({
                                        activity
                                    });
                                }} >
                                    <label>Inactive / Active</label><br />
                                    <i className={`fa fa-2x ${this.state.activity
                                        && this.state.activity.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.activity.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
