import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { industrySchema } from './validation';
import { saveIndustry } from './service';


export default class IndustryForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            industry: props.industry || {
                id: 0,
                name: "",
                active: false
            }
        }
    }

   
    save = (data, action) => {
        action.setSubmitting(true);
        saveIndustry(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Industry");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.industry}
                    onSubmit={this.save}
                    validationSchema={industrySchema}
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
                        <Form>
                            <FormGroup>
                                <label>Industry
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { industry } = this.state;
                                    industry.active = !industry.active;
                                    setFieldValue("active", industry.active);
                                    this.setState({
                                        industry
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.industry
                                        && this.state.industry.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>

                            <input type="submit" className="btn btn-primary" value={this.state.industry.id > 0 ? "Update" : "Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
