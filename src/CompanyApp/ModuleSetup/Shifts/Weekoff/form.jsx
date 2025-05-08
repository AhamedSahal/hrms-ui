import { ErrorMessage, Field, Form, Formik } from 'formik'; 
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { Helmet } from 'react-helmet'; 
import {  saveWeekoff } from './service'; 
import { WeekOffSchema } from './validation'; 
import WeekDaysDropdown from '../../../ModuleSetup/Dropdown/WeekDaysDropdown';

export default class Weekoff extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Weekoff: props.Weekoff || {
                id: 0, 
                weekoffname: "",
                weekoffcodename: "",
                description: "",
                weeklyOffs:""
          }
        }
    } 
    static getDerivedStateFromProps(nextProps, prevState) {

      if (nextProps.Weekoff && nextProps.Weekoff != prevState.Weekoff) {
          return ({ Weekoff: nextProps.Weekoff })
      } else if (!nextProps.Weekoff ) { 
          return prevState.Weekoff || ({
            Weekoff: {
                id: 0, 
                weekoffname: "",
                weekoffcodename: "",
                description: "",
                weeklyOffs:""
            }
          })
      }
      return null;
  }
    
  save = (data, action) => { 
    action.setSubmitting(true); 
    console.log(data);  
    saveWeekoff(data).then(res => {
        if (res.status == "OK") {
            toast.success(res.message); 
             this.props.updateList(res.data);
        } else {
            toast.error(res.message);
        }
        action.setSubmitting(false)
    }).catch(err => { 
        toast.error("Error while saving Weekly off");
        action.setSubmitting(false);
    })
}
    render() { 
        return (
          <div >
           
          {/* Page Content */}
          
                  <Formik
                      enableReinitialize={true}
                      initialValues={this.state.Weekoff}
                      onSubmit={this.save}
                      validationSchema={WeekOffSchema}
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
                        <Form autoComplete="off"> 
                        <div className="row"  style={{paddingTop : "25px"}} >
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Weekly Off Name
                                    <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="weekoffname" className="form-control"  placeholder="Weekly Off Name"></Field>
                                    <ErrorMessage name="weekoffname">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup>
                                    <label>Weekly Off Code Name
                                    <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="weekoffcodename" className="form-control" placeholder="Weekly Off Code Name"></Field>
                                    <ErrorMessage name="weekoffcodename">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                        </div>
                        <div className="row"  >
                             <div className="col-md-12">
                                <FormGroup>
                                    <label>Description</label>
                                    <Field name="description" className="form-control"  placeholder="Description"  component="textarea" rows="3"></Field>
                                </FormGroup>
                            </div> 
                        </div>
                        <div className="row"  >
                            <div className="col-md-12">
                                <FormGroup>
                                    <label>Weekly Off 
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="weeklyOffs" render={field => {
                                        return <WeekDaysDropdown id="weeklyOffs" isMultiple={true} defaultValue={values.weeklyOffs} onChange={e => {
                                            setFieldValue("weeklyOffs", Array.from(e.target.selectedOptions, option => option.value).join(","));
                                            //console.log(Array.from(e.target.selectedOptions, option => option.value).join(","));
                                        }}></WeekDaysDropdown>
                                    }}></Field>
                                    <ErrorMessage name="weeklyOffs">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                        </div>
                            < div >
                              <input type="submit" className="btn btn-primary"  value={this.state.Weekoff.id>0?"Update":"Create"}  /> </div>   
                        
                    </Form>
                      )
                      }
                  </Formik>
              </div>
                     

        )
    }
}
