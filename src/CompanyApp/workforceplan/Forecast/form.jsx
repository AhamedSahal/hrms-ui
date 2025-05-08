import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveForecast } from './service';
import { ForecastSchema } from './validation';
import DepartmentDropdown from '../../ModuleSetup/Dropdown/DepartmentDropdown'; 

export default class ForecastForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            forecast: props.forecast || {
                id: 0,
                name: "",
                departmentId: 0,
                    department :{
                        id: 0 },
                persons: 0,
                jobresponsible: "",
                qualification: "",
                experience: 0,
                depReq: "true",
            }
        } 
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.forecast && nextProps.forecast != prevState.forecast) {
            return ({ forecast: nextProps.forecast })
        } else if (!nextProps.forecast ) { 
            return prevState.forecast || ({
                forecast: {
                    id: 0,
                    name: "",
                    departmentId: 0,
                    department :{
                        id: 0
                },
                    persons: 0,
                    jobresponsible: "",
                    qualification: "",
                    experience: 0,
                    depReq: true,
                             
                }
            })
        }
        return null;
    }   
    save = (data, action) => { 
       action.setSubmitting(true);  
        saveForecast(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
            if (res.status == "OK") {
                setTimeout(function () {
                    window.location.reload()
                  }, 6000)
            }
        }).catch(err => {
            console.log(err)
            toast.error("Error while saving Forecast");
            action.setSubmitting(false); 
        })
    }
    
    render() {
        let { forecast } = this.state;
        forecast.departmentId = forecast.department?.id;
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={forecast}
                    onSubmit={this.save}
                    validationSchema={ForecastSchema}
                >
                    {({
                        values,
                        errors,
                        setSubmitting,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        setFieldValue
                        /* and other goodies */
                    }) => (
                        <Form autoComplete='off'> 
                            {forecast.depReq == "true" && <FormGroup>
                                <label>Department
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="departmentId" render={field => {
                                    return <DepartmentDropdown defaultValue={values.department?.id} onChange={e => {
                                        setFieldValue("departmentId", e.target.value);
                                        setFieldValue("department", { id: e.target.value }); 
                                    }}></DepartmentDropdown>
                                }}></Field>
                                <ErrorMessage name="departmentId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>} 
                            <FormGroup>
                                <label>Job Title
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="name" className="form-control"></Field>
                                <ErrorMessage name="name">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <div className="row">
                                <div className="col-md-6"> 
                            <FormGroup>
                                <label>No of Resources
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="persons" className="form-control"></Field>
                                <ErrorMessage name="persons">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup> 
                                </div>
                                <div className="col-md-6"> 
                                <FormGroup>
                                <label>Job Responsible
                                     
                                </label>
                                <Field name="jobresponsible" className="form-control"></Field>
                                <ErrorMessage name="jobresponsible">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                                </FormGroup> 
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6"> 
                                <FormGroup>
                                <label>Qualification/Education
                                     
                                </label>
                                <Field name="qualification" className="form-control"></Field>
                                <ErrorMessage name="qualification">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                                </FormGroup> 
                              </div>
                              <div className="col-md-6"> 
                                <FormGroup>
                                <label>Experience(In Years)
                                     
                                </label>
                                <Field name="experience" className="form-control"></Field>
                                <ErrorMessage name="experience">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                                </FormGroup> 
                              </div>
                            </div>
                            <input type="submit" className="btn btn-primary" value={this.state.forecast.id>0?"Update Request":"Send Request"} 
                            />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
