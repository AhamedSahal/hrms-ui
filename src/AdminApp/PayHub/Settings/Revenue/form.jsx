import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { revenueSchema } from './validation';
import { savePayHubRevenue } from './service';


export default class RevenueForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            revenue: props.revenue || {
                id: 0,
                name: "",
                active: false
            }
        }
    }

   
    save = (data, action) => {
        action.setSubmitting(true);
        savePayHubRevenue(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Revenue");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.revenue}
                    onSubmit={this.save}
                    validationSchema={revenueSchema}
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
                                <label>Revenue
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { revenue } = this.state;
                                    revenue.active = !revenue.active;
                                    setFieldValue("active", revenue.active);
                                    this.setState({
                                        revenue
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.revenue
                                        && this.state.revenue.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>

                            <input type="submit" className="btn btn-primary" value={this.state.revenue.id > 0 ? "Update" : "Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
