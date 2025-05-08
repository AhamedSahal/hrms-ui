import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveAnnouncement } from './service';
import { AnnouncementSchema } from './validation';

export default class AnnouncementForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            announcement: props.announcement || {
                id: 0,
                title: "",
                description: "",
                validFrom: new Date().toISOString().split('T')[0],
                validTill: new Date().toISOString().split('T')[0],
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.announcement && nextProps.announcement != prevState.announcement) {
            return ({ announcement: nextProps.announcement })
        } else if (!nextProps.announcement) {
            return prevState.announcement || ({
                announcement: {
                    id: 0,
                    title: "",
                    description: "",
                    validFrom: "",
                    validTill: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        data["validFrom"] = new Date(`${data["validFrom"]} GMT`);
        data["validTill"] = new Date(`${data["validTill"]} GMT`);
        action.setSubmitting(true);
        saveAnnouncement(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving announcement");

            action.setSubmitting(false);
        })
    }
    render() {
        const currentDate = new Date().toISOString().split('T')[0];
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.announcement}
                    onSubmit={this.save}
                    validationSchema={AnnouncementSchema}
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
                                <label>Title
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="title" className="form-control"></Field>
                                <ErrorMessage name="title">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Description</label>

                                <Field name="description"
                                    component="textarea" rows="4"
                                    className="form-control"
                                    placeholder="Description"
                                >
                                </Field>
                            </FormGroup>
                            <FormGroup>
                                <label>Valid From
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <Field type="date" name="validFrom" className="form-control" min={currentDate} required />
                                <ErrorMessage name="validFrom" component="div" style={{ color: 'red' }} />
                            </FormGroup>
                            <FormGroup>
                                <label> Valid Till
                                    <span style={{ color: 'red' }}>*</span>
                                </label>
                                <Field type="date" name="validTill" className="form-control" min={values.validFrom} required />
                                <ErrorMessage name="validTill" component="div" style={{ color: 'red' }} />
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.announcement.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
