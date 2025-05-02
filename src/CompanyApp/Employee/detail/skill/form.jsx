import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { verifyEditPermission } from '../../../../utility';
import { saveSkill } from './service';
import { SkillSchema } from './validation';


export default class SkillForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            skill: props.skill || {
                id: 0,
                employeeId: props.employeeId,
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.skill && nextProps.skill != prevState.skill) {
            return ({ skill: nextProps.skill })
        } else if (!nextProps.skill) {
            return ({
                skill: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                }
            })
        }

        return null;
    }
    save = (data, action) => {

        action.setSubmitting(true);
        saveSkill(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                console.log({ props: this.props })
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.error(err);
            toast.error("Error while saving skill");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.skill}
                    onSubmit={this.save}
                    validationSchema={SkillSchema}
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
                                <label>Skill
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="skill" className="form-control"></Field>
                                <ErrorMessage name="skill">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Description
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="description" className="form-control" component="textarea" rows="4"></Field>
                                <ErrorMessage name="description">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                           <input type="submit" className="btn btn-primary" value={this.state.skill.id > 0 ? "Update" : "Save"} />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
