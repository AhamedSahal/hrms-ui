import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveAssetActive } from './service'; 
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown'; 


export default class AssetsActive extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            AssetsActive: props.AssetsActive || {
                id: 0
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.AssetsActive && nextProps.AssetsActive != prevState.AssetsActive) {
            return ({ AssetsActive: nextProps.AssetsActive })
        } else if (!nextProps.AssetsActive ) { 
            return prevState.AssetsActive || ({
                AssetsActive: {
                    id: 0
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);   
        saveAssetActive(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message); 
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                setTimeout(function () {
                    window.location.reload()
                  }, 6000)
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Asset");

            action.setSubmitting(false);
        })
    }
    render() {
        const { AssetsActive } = this.state; 
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.AssetsActive}
                    onSubmit={this.save}
                  //  validationSchema={categorySchema}
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
                             <div className="col-sm-12">
                                <div className="row">
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label >Previous Owner</label>
                                            <label style={{fontWeight:"bolder",display:"block"}}>{this.state.AssetsActive.employee?.name}</label>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label>Assign Date<span style={{ color: "red" }}>*</span></label>
                                            <Field name="assignDate" type="date"  className="form-control" required></Field>
                                            <ErrorMessage name="assignDate">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                    </div><div className="row">
                                    <div className="col-md-12">
                                    <FormGroup>
                                        <label>Assign to<span style={{ color: "red" }}>*</span> </label>
                                        <Field name="employeeId" className="col-md-12" render={field => {
                                            return <EmployeeDropdown   onChange={e => {
                                                setFieldValue("employeeId", e.target.value);
                                                setFieldValue("employee", { id: e.target.value });
                                            }}></EmployeeDropdown>
                                        }}></Field>
                                    </FormGroup>
                                    </div>
                                </div>
                                <input type="submit" className="btn btn-primary" value={"Assign"}/>
                            </div>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
