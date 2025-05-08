import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';  
import { saveFunction } from './service';
import { FunctionSchema } from './validation'; 

export default class FunctionForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            functions: props.functions || {
                id: 0,
                name: "",
                active: true
            }
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.functions && nextProps.functions != prevState.functions) {
            return ({ functions: nextProps.functions })
        } else if (!nextProps.functions ) { 
            return prevState.functions || ({
                functions: {
                    id: 0,
                    name: "",
                    active: true
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true); 
        saveFunction(data).then(res => {
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
                    initialValues={this.state.functions}
                    onSubmit={this.save}
                     validationSchema={FunctionSchema} 
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
                                <label>Function
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control" ></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { functions } = this.state;
                                    functions.active = !functions.active;
                                    setFieldValue("active", functions.active);
                                    this.setState({
                                        functions
                                    });
                                }} >
                                    <label>Is Active</label><br />
                                    <i className={`fa fa-2x ${this.state.functions
                                        && this.state.functions.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.functions.id>0?"Update":"Save"}/>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
