import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveIPConfig } from './service';
import { IPSchema } from './validation';
import axios from 'axios';


export default class IPConfigForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ipConfig: props.ip || {
                id: 0,
                name: "",
                ip: ""
            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.ipConfig && nextProps.ipConfig != prevState.ipConfig) {
            return ({ ipConfig: nextProps.ipConfig })
        } else if (!nextProps.ip) {

            return prevState.ipConfig || ({
                ipConfig: {
                    id: 0,
                    name: "",
                    ip: ''
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveIPConfig(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving IP");
            action.setSubmitting(false);
        })
    }
    getCurrentSystemInternetIP = (setFieldValue) => {
        axios.get('https://api.ipify.org?format=json')
            .then(response => {
                const currentSystemInternetIp = response.data.ip;
                setFieldValue('ip', currentSystemInternetIp);
            })
            .catch(error => {
                console.error("Error fetching the IP address:", error);
            });
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.ipConfig}
                    onSubmit={this.save}
                    validationSchema={IPSchema}
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
                                <label>Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>IP Address
                                    <span style={{ color: "red" }}>*</span>
                                    <span style={{ color: "blue", cursor: "pointer", fontSize: "x-small", padding: "5px" }} onClick={() => this.getCurrentSystemInternetIP(setFieldValue)}> Get Current IP</span>
                                </label>
                                <Field name="ip" className="form-control"></Field>
                                <ErrorMessage name="ip">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.ipConfig.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}