import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveCompositePayscale } from './service';

export default class CompositeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            compositeScale: props.composite || {
                id: 0,
                min: "",
                mid: "",
                max: "",
                basic: "",
                complementary: "",
                active: true,
            }
        }
    }



    save = (data, action) => {
        console.log('cell : DATA', data)
        saveCompositePayscale(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error(err);
            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.compositeScale}
                    onSubmit={this.save}
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
                    }) => (
                        <Form autoComplete='off'>
                            <div className="row">
                                <FormGroup className="col-md-4">
                                    <label>Min
                                    </label>
                                    <Field name="minSalary" className="form-control" type="number"></Field>
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <label>Mid
                                    </label>
                                    <Field name="midSalary" className="form-control" type="number"></Field>
                                </FormGroup>
                                <FormGroup className="col-md-4">
                                    <label>Max
                                    </label>
                                    <Field name="maxSalary" className="form-control" type="number"></Field>
                                </FormGroup>
                            </div>
                            <FormGroup className='m-0'>
                                <label>
                                    Basic Allowance
                                </label>
                                <Field name="basic" className="form-control" type="number"></Field>
                            </FormGroup>
                            <FormGroup className='m-0'>
                                <label>
                                    Supplementary Allowance
                                </label>
                                <Field name="supplementary" className="form-control" type="number"></Field>
                            </FormGroup>
                            
                            <input type="submit" className="mt-3 btn btn-primary" value='Update' />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
