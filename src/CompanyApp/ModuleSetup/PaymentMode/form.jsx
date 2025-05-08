import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { savePaymentMode } from './service';
import { PaymentModeSchema } from './validation';

export default class PaymentModeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            paymentMode: props.paymentMode || {
                id: 0,
                name: "",
            }
        }
    }
    save = (data, action) => {
        action.setSubmitting(true);
        savePaymentMode(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            
            if (res.status == "OK") { 
                this.props.updateList(res.data);
            }
        }).catch(err => {
            toast.error("Error while saving payment mode");
            action.setSubmitting(false);
        })
    }
     
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.paymentMode}
                    onSubmit={this.save}
                    validationSchema={PaymentModeSchema}
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
                                <label>Payment Mode Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            
                            <input type="submit" className="btn btn-primary" value={this.state.paymentMode.id >0 ? "update":"Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}