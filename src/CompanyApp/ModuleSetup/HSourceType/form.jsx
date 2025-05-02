import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { FormGroup } from 'reactstrap';
import {saveSourceTypeData} from './service'

export default class HSourceTypeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sourceType : props.sourceType || {
                id: 0,
                applicantId: 0,
                active:true
                
            }
        }
    }

    save = (data, action) => {
       
        saveSourceTypeData(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                this.props.updateData();
                }
        }).catch(err => {
            toast.error("Error while saving Source Type");
        })
    }

    render(){
        return(
            <div>
                 <Formik
                    enableReinitialize={true}
                    initialValues={this.state.sourceType}
                    onSubmit={this.save}
                    // validationSchema={CustomValidation}
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
                            {/* name */}
                            <FormGroup>
                                <label>Name
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control" required></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            {/* is active */}
                            <FormGroup>
                                <div type="checkbox" name="active" onClick={e => {
                                    let { sourceType } = this.state;
                                    sourceType.active = !sourceType.active;
                                    setFieldValue("active", sourceType.active);
                                    this.setState({
                                        sourceType
                                    });
                                }} >
                                    <label>Active</label><br />
                                    <i className={`fa fa-2x ${this.state.sourceType
                                        && this.state.sourceType.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.sourceType.id>0?"Update":"Save"} />
                        </Form>
                 )}
                </Formik>
            </div>
        )
    } 

}