import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveGroups } from './service';
import { RoleSchema } from '../Role/validation';
import { GroupSchema } from './validation';

export default class GroupForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            group: props.group || {
                id: 0,
                name: "",
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.group && nextProps.group != prevState.group) {
            return ({ group: nextProps.group })
        } else if (!nextProps.group) {
            return prevState.group || ({
                group: {
                    id: 0,
                    name: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveGroups(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(() => {
            toast.error("Error while saving group");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.group}
                    onSubmit={this.save}
                    validationSchema={GroupSchema}
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
                                <label>Group Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.group.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}