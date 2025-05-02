import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getPermission, getUserType } from '../../../utility';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import { saveTimeinlieu } from './service';
import { TimeInLieuSchema } from './validation';


const { Header, Body, Footer, Dialog } = Modal;
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class TimeInLieuForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            timeinlieu: props.timeinlieu || {
                id: 0,
                employeeId: props.employeeId,
                hours: "",
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.timeinlieu && nextProps.timeinlieu != prevState.timeinlieu) {
            return ({ timeinlieu: nextProps.timeinlieu })
        } else if (!nextProps.timeinlieu) {
            return prevState.timeinlieu || ({
                timeinlieu: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                    hours: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        data.employeeId = data.employee?.id
        action.setSubmitting(true);
        saveTimeinlieu(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving timeinlieu");

            action.setSubmitting(false);
        })
    }
    render() {
        console.log(this.props)
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.timeinlieu}
                    onSubmit={this.save}
                    validationSchema={TimeInLieuSchema}
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
                            <div className="row">
                                {isCompanyAdmin &&
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label>Employee
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="employeeId" render={field => {
                                                return <EmployeeDropdown defaultValue={values.employee?.id} onChange={e => {
                                                    setFieldValue("employeeId", e.target.value);
                                                    setFieldValue("employee", { id: e.target.value });
                                                }}></EmployeeDropdown>
                                            }}></Field>
                                        </FormGroup></div>}
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="forDate" type="date" className="form-control"></Field>
                                        <ErrorMessage name="forDate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            Hours
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="hours" className="form-control"></Field>
                                        <ErrorMessage name="hours">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>



                            <input type="submit" className="btn btn-primary" value={this.state.timeinlieu.id > 0 ? "Update" : "Request"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
