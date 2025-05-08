import React, { Component } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { saveCoupon } from './service';
import { FormGroup } from 'reactstrap';
import { CouponSchema } from './validation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class CouponForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            coupon: props.coupon || {
                id: 0,
                code: "",
                name: "",
                description: "",
                discount: "",
                active: true,
                maxLimit: ""
            }
        }
    }
    
    static getDerivedStateFromProps(nextProps, prevState) {
        
        if (nextProps.coupon && nextProps.coupon!= prevState.coupon) {
            return ({ coupon: nextProps.coupon })
        } else if(!nextProps.coupon){
            return ({
                coupon: {
                    id: 0,
                    code: "",
                    name: "",
                    description: "",
                    discount: "",
                    active: true,
                    maxLimit: ""
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveCoupon(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving coupon");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.coupon}
                    onSubmit={this.save}
                    validationSchema={CouponSchema}
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
                                <label>Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup>
                                <label>Code
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="code" className="form-control"></Field>
                                <ErrorMessage name="code">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>

                            </FormGroup>

                            <FormGroup>
                                <label>
                                    Discount
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="discount" className="form-control"></Field>
                                <ErrorMessage name="discount">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>
                                    Max Limit
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="maxLimit" className="form-control"></Field>
                                <ErrorMessage name="maxLimit">
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

                                <div type="checkbox" name="active" onClick={e => {
                                    let { coupon } = this.state;
                                    coupon.active = !coupon.active;
                                    setFieldValue("active", coupon.active);
                                    this.setState({
                                        coupon
                                    });

                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.coupon && this.state.coupon.active ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>

                            <input type="submit" className="btn btn-primary" value={this.state.coupon.id>0?"Update":"Save"}/>

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
