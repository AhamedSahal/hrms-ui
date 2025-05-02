import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { resetUsername } from './service';
import {  UpdateUsernameSchema } from './validation';

export default class ChangeUsernameForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            employee: props.employee || {
                id: 0,
                email: ""
            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.employee && nextProps.employee != prevState.employee) {
            return ({ employee: nextProps.employee })
        } else if (!nextProps.employee) {
            return ({
                employee: {
                    id: 0,
                    email: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        resetUsername(data.id,data.newUserName).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(() => {
            toast.error("Error while updating username");

            action.setSubmitting(false);
        })
    }
    render() {
        let { employee } = this.state;
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        id: employee.id,
                        newUserName: employee.email,
                    }}
                    onSubmit={this.save}
                    validationSchema={UpdateUsernameSchema}
                >
                    {() => (
                        <Form>
                            <FormGroup>
                                <label>User Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="newUserName" className="form-control"></Field>
                                <ErrorMessage name="newUserName">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <input type="submit" className="btn btn-primary" value={"Update"} />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
