import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getEmployeeId } from '../../../utility';
import { saveActivity } from './service';
import ActivityDropdown from '../../ModuleSetup/Dropdown/ActivityDropdown';
import ProjectDropdown from '../../ModuleSetup/Dropdown/ProjectDropdown';
// import { ProjectSchema } from './validation';


export default class ProjectActivityMainForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            projectActivityMain: props.projectActivityMain || {
                id: 0,
                activityName: "",
                projectId: 0,
                projActivitycost: 0,
                projActivityduration: 0,
                activitystartdate: "",
                activityenddate: ""
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.projectActivityMain && nextProps.projectActivityMain != prevState.projectActivityMain) {
            return ({ projectActivityMain: nextProps.projectActivityMain })
        } else if (!nextProps.projectActivityMain) {

            return prevState.projectActivityMain || ({
                projectActivityMain: {
                    id: 0,
                    activityName: "",
                    projectId: 0,
                    projActivitycost: 0,
                    projActivityduration: 0,
                    activitystartdate: "",
                    activityenddate: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveActivity(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                // this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            if(res.status == "OK"){
                setTimeout(function () {
                    window.location.reload()
                  }, 6000)
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
                    initialValues={this.state.projectActivityMain}
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
                                        <Field name="projectId" className="form-control"
                                            render={field => {
                                                return <ProjectDropdown readOnly label={"Template Type"} defaultValue={this.state.projectActivityMain.projectId} onChange={e => {
                                                    setFieldValue("projectId", e.currentTarget.value);
                                                }}></ProjectDropdown>

                                            }}></Field>
                                        <ErrorMessage name="projectId">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
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
                            <div className="row">
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Activity Budget(Approx.)
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="projActivitycost" className="form-control" required></Field>
                                        <ErrorMessage name="projActivitycost">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <input type="submit" className="btn btn-primary" value={this.state.projectActivityMain.id > 0 ? "Update" : "Create"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
