import { Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getUserType } from '../../../utility';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import { saveGratuity } from './service';



const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class GratuityEntitlementForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            gratuity: props.gratuity || {
                id: 0,
                employeeId: props.employeeId,
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.gratuity && nextProps.gratuity != prevState.gratuity) {
            return ({ gratuity: nextProps.gratuity })
        } else if (!nextProps.gratuity) {
            return prevState.gratuity || ({
                gratuity: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveGratuity(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving gratuity");
            action.setSubmitting(false);
        })
    }
    render() {

        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.gratuity}
                    onSubmit={this.save}
                // validationSchema={TimeInLieuSchema}
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
                                        <Field name="forMonth" type="date" className="form-control"></Field>
                                        
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>
                                            Amount
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="amount" className="form-control"></Field>
                                       
                                    </FormGroup>
                                </div>
                                <div className="col-md-6">
                                    <FormGroup>
                                        <label>Remark
                                        </label>
                                        <Field name="remark" className="form-control"></Field>
                                    </FormGroup>
                                </div>
                            </div>
                            <input type="submit" className="btn btn-primary" value={this.state.gratuity.id > 0 ? "Update" : "Submit"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
