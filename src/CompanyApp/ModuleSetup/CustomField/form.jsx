import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import {CustomValidation} from './Validation';
import { FormGroup } from 'reactstrap';
import ApplicantDropDown from '../Dropdown/ApplicantDropDown'
import {saveCustomData} from './service'
import { getCustomFieldInfo } from '../../Hire/Job/service';



export default class CustomForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
           customField: [],
           custom : props.custom || {
                id: 0,
                applicantId: 0,
                required: true,
                active:true,
                defaults:true
            }
        }
    }

    componentDidMount() {
        this.fetchList();
      }
    
      fetchList = () => {
         getCustomFieldInfo().then((res) => {
          if (res.status == "OK") {
    
            this.setState({ customField: res.data });
          }
        });
    
      }

    save = (data, action) => {
        console.log(data)
        let validation = true
        let check = this.state.customField.length > 0 && this.state.customField.map((res) => {
          if (res.name.toLowerCase() == data.name.toLowerCase()) {
            validation = false;
          }
        })
        if (validation) {
        if(!data.applicantId){
            data = {...data,applicantId: data.applicant.id}
         }

        saveCustomData(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                this.props.updateData();
                }
        }).catch(err => {
            toast.error("Error while saving Custom Field");
        })
    }else{
        toast.error("Name Already exist");
    }
    }

    render() {
        return(
            <div>
                 <Formik
                    enableReinitialize={true}
                    initialValues={this.state.custom}
                    onSubmit={this.save}
                    validationSchema={CustomValidation}
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

                            {/* dropdown */}
                            <FormGroup>
                                <label>Field Type
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <ApplicantDropDown defaultValue={values.applicant?.id} onChange={e => {
                                    setFieldValue("applicantId", e.currentTarget.value);
                                }}></ApplicantDropDown>
                                <ErrorMessage name="applicantId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            {/* is active */}
                            <div  className="row">
                            <FormGroup  className="col-md-4">
                                <div type="checkbox" name="active" onClick={e => {
                                    let { custom } = this.state;
                                    custom.active = !custom.active;
                                    setFieldValue("active", custom.active);
                                    this.setState({
                                        custom
                                    });
                                }} >
                                    <label>Active</label><br />
                                    <i className={`fa fa-2x ${this.state.custom
                                        && this.state.custom.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup> 

                            {/* is required */}
                            <FormGroup  className="col-md-4">
                                <div type="checkbox" name="required" onClick={e => {
                                    let { custom } = this.state;
                                    custom.required = !custom.required;
                                    setFieldValue("required", custom.required);
                                    this.setState({
                                        custom
                                    });
                                }} >
                                    <label>Required</label><br />
                                    <i className={`fa fa-2x ${this.state.custom
                                        && this.state.custom.required
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup> 

                            <FormGroup  className="col-md-4">
                                <div type="checkbox" name="defaults" onClick={e => {
                                    let { custom } = this.state;
                                    custom.defaults = !custom.defaults;
                                    setFieldValue("defaults", custom.defaults);
                                    this.setState({
                                        custom
                                    });
                                }} >
                                    <label>Default</label><br />
                                    <i className={`fa fa-2x ${this.state.custom
                                        && this.state.custom.defaults
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup> 
                            </div>
                            <input type="submit" className="btn btn-primary" value={this.state.custom.id>0?"Update":"Save"} />
                        </Form>
                    )}

                </Formik>

            </div>
        )
    }
}