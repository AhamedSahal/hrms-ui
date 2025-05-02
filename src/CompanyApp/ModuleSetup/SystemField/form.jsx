import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { FormGroup } from 'reactstrap';
import ApplicantDropDown from '../Dropdown/ApplicantDropDown'
import {saveSystemData} from "./service"
import { getSystemFieldInfo } from '../../Hire/Job/service';

export default class SystemForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
           systemField: [],
           system : props.system || {
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
        getSystemFieldInfo().then((res) => {
          if (res.status == "OK") {
    
            this.setState({ systemField: res.data });
          }
        });
    
      }

    // save
    save = (data, action) => {
        console.log(data)
        let validation = true
        let check = this.state.systemField.length > 0 && this.state.systemField.map((res) => {
          if (res.name.toLowerCase() == data.name.toLowerCase()) {
            validation = false;
          }
        })
        if (validation) {
         if(!data.applicantId){
            data = {...data,applicantId: data.applicant.id}
         }
        saveSystemData(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                this.props.updateData();
                }
        }).catch(err => {
            toast.error("Error while saving System Field");
        })
    }else{
        toast.error("Name Already exist");
    }
    }
render(){
    return(
       <div>
         <Formik
                    enableReinitialize={true}
                    initialValues={this.state.system}
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
                                    let { system } = this.state;
                                    system.active = !system.active;
                                    setFieldValue("active", system.active);
                                    this.setState({
                                        system
                                    });
                                }} >
                                    <label>Active</label><br />
                                    <i className={`fa fa-2x ${this.state.system
                                        && this.state.system.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>

                         {/* Required */}
                            <FormGroup  className="col-md-4">
                                <div type="checkbox" name="required" onClick={e => {
                                    let { system } = this.state;
                                    system.required = !system.required;
                                    setFieldValue("required", system.required);
                                    this.setState({
                                        system
                                    });
                                }} >
                                    <label>Is Required</label><br />
                                    <i className={`fa fa-2x ${this.state.system
                                        && this.state.system.required
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>

                            {/* default */}
                            <FormGroup  className="col-md-4">
                                <div type="checkbox" name="defaults" onClick={e => {
                                    let { system } = this.state;
                                    system.defaults = !system.defaults;
                                    setFieldValue("defaults", system.defaults);
                                    this.setState({
                                        system
                                    });
                                }} >
                                    <label>Default</label><br />
                                    <i className={`fa fa-2x ${this.state.system
                                        && this.state.system.defaults
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup> 
                             </div>
                             <input type="submit" className="btn btn-primary" value={this.state.system.id>0?"Update":"Save"} />
                        </Form>
                    )}
                </Formik>
       </div>
    )
}
}