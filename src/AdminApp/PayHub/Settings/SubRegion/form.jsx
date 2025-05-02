import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveSubRegion } from './service';
import { subRegionSchema } from './validation';


export default class ActivityForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            subRegion: props.subRegion || {
                id: 0,
                subRegion: "",
                regionId: "",
                active: false
            }
        }
    }


    save = (data, action) => {
        action.setSubmitting(true);
        saveSubRegion(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Sub Region");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.subRegion}
                    onSubmit={this.save}
                    validationSchema={subRegionSchema}
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
                                <label>Sub Region Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="subRegion" className="form-control"></Field>
                                <ErrorMessage name="subRegion">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Select Region
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <select name='regionId' className="form-control" >
                                    <option value="">Select Region</option>
                                    <option value="1">UAE</option>
                                    <option value="2" >Qatar</option>
                                    <option value="3" >Saudi Arabia</option>
                                </select>
                                <ErrorMessage name="regionId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { subRegion } = this.state;
                                    subRegion.active = !subRegion.active;
                                    setFieldValue("active", subRegion.active);
                                    this.setState({
                                        subRegion
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.subRegion
                                        && this.state.subRegion.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>


                            <input type="submit" className="btn btn-primary" value={this.state.subRegion.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
