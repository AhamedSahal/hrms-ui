import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { regionSchema } from './validation';
import { saveRegion } from './service';

export default class RegionForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            region: props.region || {
                id: 0,
                name: "",
                active: false
            }
        }
    }

   
    save = (data, action) => {
        action.setSubmitting(true);
        saveRegion(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Region");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.region}
                    onSubmit={this.save}
                    validationSchema={regionSchema}
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
                                <label>Region
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { region } = this.state;
                                    region.active = !region.active;
                                    setFieldValue("active", region.active);
                                    this.setState({
                                        region
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.region
                                        && this.state.region.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>

                            <input type="submit" className="btn btn-primary" value={this.state.region.id > 0 ? "Update" : "Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
