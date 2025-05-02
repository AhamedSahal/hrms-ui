import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import GradesDropdown from '../../ModuleSetup/Dropdown/GradesDropdown';
import { saveGradingStructure } from './service';
import { GradingStructureSchema } from './validation';


export default class GradingStructureForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            gradingStructure: props.gradingStructure || {
                id: 0,
                refLevelId: 0,
                rolesname: "",
                active: true,
                gradesId: 0,
                grades: {
                    id: 0,
                }
            }
        }
    }



    save = (data, action) => {
        console.log(data)
        saveGradingStructure(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                window.location.reload();
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error(err);
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.gradingStructure}
                    onSubmit={this.save}
                    validationSchema={GradingStructureSchema}
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
                                <label>Reference Levels <span style={{ color: "red" }}>*</span>
                                </label>
                                {this.state.gradingStructure.id == 0 && <Field name="refLevelId" defaultValue={values.refLevelId} className="form-control" type='number'></Field>}
                                {this.state.gradingStructure.id != 0 && <><br /><label>{values.refLevelId}</label></>}
                                <ErrorMessage name="refLevelId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Grades <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="gradesId" render={field => {
                                    return <GradesDropdown defaultValue={values.gradesId} onChange={e => {
                                        setFieldValue("gradesId", e.target.value);
                                        setFieldValue("grades", { id: e.target.value });
                                    }}></GradesDropdown>
                                }}>
                                </Field>
                                <ErrorMessage name="gradesId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Typical Roles <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="rolesname" defaultValue={values.rolesname} className="form-control"></Field>
                                <ErrorMessage name="rolesname">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { gradingStructure } = this.state;
                                    gradingStructure.active = !gradingStructure.active;
                                    setFieldValue("active", gradingStructure.active);
                                    this.setState({
                                        gradingStructure
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.gradingStructure
                                        && this.state.gradingStructure.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`} defaultValue={values.active}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.gradingStructure.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
