import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getEmployeeId } from '../../../utility';
import { save } from './service';
import ProjectDropdown from '../../ModuleSetup/Dropdown/ProjectDropdown';
import ActivityDropdown from '../../ModuleSetup/Dropdown/ActivityDropdown';

export default class ProjectMainForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            projectMain: props.projectMain || {
                id: 0,
                employeeId: props.employeeId || getEmployeeId(),
                employee: { id: props.employeeId || getEmployeeId() },
                projectId: 0,
                projtotalcost: 0,
                projduration: 0,
                projActivitycost: 0,
                projActivityduration: 0,
                projstartdate: "",
                projenddate: "",
                activitystartdate: "",
                activityenddate: ""
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.projectMain && nextProps.projectMain != prevState.projectMain) {
            return ({ projectMain: nextProps.projectMain })
        } else if (!nextProps.projectMain) {

            return prevState.projectMain || ({
                projectMain: {
                    id: 0,
                    projtotalcost: 0,
                    projectId: 0,
                    projduration: 0,
                    projActivitycost: 0,
                    projActivityduration: 0,
                    projstartdate: "",
                    projenddate: "",
                    activitystartdate: "",
                    activityenddate: ""
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
            toast.error("Error while saving Project");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.projectMain}
                    onSubmit={this.save}
                // validationSchema={ProjectSchema}
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

                            <div className="row">
                                <div className="col-md-6">
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
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Total Budget (Approx.)
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="projtotalcost" className="form-control" required></Field>
                                        <ErrorMessage name="projtotalcost">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                    <FormGroup>
                                        <label>
                                            Start Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="projstartdate" type="date" defaultValue={values.projstartdate} className="form-control" required></Field>
                                        <ErrorMessage name="projstartdate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                    <FormGroup>
                                        <label>
                                            End Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="projenddate" type="date" defaultValue={values.projenddate} className="form-control" required></Field>
                                        <ErrorMessage name="projenddate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div style={{ fontSize: "18px", fontWeight: "bolder", textAlign: "center" }}>Activity Details</div><br />
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Activity
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <ActivityDropdown projectId={values.projectId} defaultValue={values.activityId} onChange={e => {
                                            setFieldValue("activityId", e.currentTarget.value);
                                        }}></ActivityDropdown>
                                        <ErrorMessage name="activityId">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Activity Budget (Approx.)
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="projActivitycost" className="form-control" required></Field>
                                        <ErrorMessage name="projActivitycost">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                    <FormGroup>
                                        <label>
                                            Start Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="activitystartdate" type="date" defaultValue={values.activitystartdate} className="form-control" required></Field>
                                        <ErrorMessage name="activitystartdate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6" style={{ fontWeight: "normal" }}>
                                    <FormGroup>
                                        <label>
                                            End Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="activityenddate" type="date" defaultValue={values.activityenddate} className="form-control" required></Field>
                                        <ErrorMessage name="activityenddate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <input type="submit" className="btn btn-primary" value={this.state.projectMain.id > 0 ? "Update" : "Create"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
