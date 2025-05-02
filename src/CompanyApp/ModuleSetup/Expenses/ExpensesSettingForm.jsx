import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveExpenses } from './service';
import { GratuitySchema } from './validation';
import { verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';

export default class ExpensesSettingForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            expensecategories: props.expensecategories || {
                id: 0,
                name: "",
                policy: ""
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.expensecategories && nextProps.expensecategories != prevState.expensecategories) {
            return ({ expensecategories: nextProps.expensecategories })
        } else if (!nextProps.expensecategories ) { 
            return prevState.expensecategories || ({
                expensecategories: {
                    id: 0,
                    name: "",
                    policy: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveExpenses(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            
            if (res.status == "OK") { 
                this.props.updateList(res.data);
            }
        }).catch(err => {
            toast.error("Error while saving expense category");
            action.setSubmitting(false);
        })
    }
     
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.expensecategories}
                    onSubmit={this.save}
                    validationSchema={GratuitySchema}
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
                            <FormGroup>
                                <label>Expense Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Policy Name
                                </label>
                                <Field name="policy" className="form-control"></Field>
                            </FormGroup> 
                            
                            <input type="submit" className="btn btn-primary" value={this.state.expensecategories.id >0 ? "update":"Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
