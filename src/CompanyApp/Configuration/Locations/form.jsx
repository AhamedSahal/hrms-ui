import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveLocationConfig } from './service';
import { LocationSchema } from './validation';
import { Row } from 'antd';
import GoogleMapComponent from './GoogleMap';

export default class LocationConfigForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            location: props.location || {
                id: 0,
                name: "",
                latitude: "",
                longitude: "",
                radius: 0,
            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.location && nextProps.location != prevState.location) {
            return ({ location: nextProps.location })
        } else if (!nextProps.location) {

            return prevState.location || ({
                location: {
                    id: 0,
                    name: "",
                    latitude: "",
                    longitude: "",
                    radius: 0,
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveLocationConfig(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving location");

            action.setSubmitting(false);
        })
    }
    render() {
        const {location} = this.state;
        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={location}
                    onSubmit={this.save}
                    validationSchema={LocationSchema}
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
                            <Row>
                                <FormGroup className='col-md-12'>
                                    <label>Name
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="name" className="form-control"></Field>
                                    <ErrorMessage name="name">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </Row>
                            <Row>
                                <FormGroup className="col-md-4">
                                    <label>Latitude
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="latitude" type="number" className="form-control"></Field>
                                    <ErrorMessage name="latitude">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <label>Longitude
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="longitude" type="number" className="form-control"></Field>
                                    <ErrorMessage name="longitude">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <label>Radius (Meters)  <span>{ values.radius ? values.radius : location.radius }</span>
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <br />
                                    <Field name="radius" type="range" id="rangeInput" min="0" max="1000" step="1" style={{paddingTop : '10px',paddingBottom : '10px'}}></Field>
                                    <ErrorMessage name="radius">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </Row>
                            <FormGroup>
                                <label>
                                    Google Map
                                </label>
                                <GoogleMapComponent setFieldValue={setFieldValue}
                                    latitude={values.latitude}
                                    longitude={values.longitude}
                                    radius ={values.radius}
                                />
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.location.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}