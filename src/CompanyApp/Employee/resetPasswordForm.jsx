import { Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import PasswordField from '../../initialpage/PasswordField';
import { resetPassword } from './service';
import { ResetPasswordSchema } from './validation';

export default class ResetPasswordForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            employee: props.employee || {
                id: 0,
                email: ""
            },
            isPasswordValid: false,
        };
        this.passwordFieldRef = React.createRef();
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
        resetPassword(data.id, data.password).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while updating password");

            action.setSubmitting(false);
        })
    }
    handlePasswordChange = (value) => {
        this.setState({ isPasswordValid: this.passwordFieldRef.current.validatePasswordWithRegex(value) });
    }
    render() {
        let { employee } = this.state;
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        id: employee.id,
                        password: "",
                    }}
                    onSubmit={this.save}
                    validationSchema={ResetPasswordSchema}
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
                                <label>Password
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <PasswordField
                                   type = 'password'
                                    ref={this.passwordFieldRef}
                                    name="password"
                                    onChange={(value) => {
                                        this.handlePasswordChange(value);
                                        setFieldValue("password", value);
                                    }} />
                            </FormGroup>

                            <input type="submit" className="btn btn-primary" value={"Reset Password"} disabled={!this.state.isPasswordValid} />

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
