import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveBranch } from './service';
import { BranchSchema } from './validation';


export default class BranchForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            branch: props.branch || {
                id: 0,
                name: "",
                active: true
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.branch && nextProps.branch != prevState.branch) {
            return ({ branch: nextProps.branch })
        } else if (!nextProps.branch ) { 
            return prevState.branch || ({
                branch: {
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
        saveBranch(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving branch");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.branch}
                    onSubmit={this.save}
                    validationSchema={BranchSchema}
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
                                <label>Location
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { branch } = this.state;
                                    branch.active = !branch.active;
                                    setFieldValue("active", branch.active);
                                    this.setState({
                                        branch
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.branch
                                        && this.state.branch.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.branch.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
