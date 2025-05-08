import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import PerformanceTemplateDropdown from '../../ModuleSetup/Dropdown/PerformanceTemplateDropdown';
import { createNew } from './service';
import { PerformanceReviewSchema } from './validation';

export default class PerformanceReviewForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            performanceReview: props.performanceReview || {
                id: 0,
                fromDate:null,
                toDate:null,
                employeeId:props.self?0:null,
                templateId:null,
            },
            objectiveGroups: props.objectiveGroups || [],
            self:props.self||false,

        }
        if (!this.state.performanceReview.objectiveGroupIds) {
            this.state.performanceReview.objectiveGroupIds = []
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.performanceReview && nextProps.performanceReview != prevState.performanceReview) {
            return ({ performanceReview: nextProps.performanceReview })
        } else if (!nextProps.performanceReview) {
            return prevState.performanceReview || ({
                performanceReview: {
                    id: 0,
                    fromDate:null,
                    toDate:null,
                    employeeId:null,
                    templateId:null,
                }
            })
        }
        return null;
    }
    save = (data, action) => { 
        action.setSubmitting(true);
        createNew(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Performance Review");

            action.setSubmitting(false);
        })
    }
    render() {

        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.performanceReview}
                    onSubmit={this.save}
                    validationSchema={PerformanceReviewSchema}
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
                        <Form>
                            <div className="row">
                                <div className="col-6">
                                    <FormGroup>
                                        <label>Review Period From
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="fromDate" type="date" defaultValue={values.fromDate} className="form-control"></Field>
                                        <ErrorMessage name="fromDate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-6">
                                    <FormGroup>
                                        <label>Review Period To
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="toDate" type="date" defaultValue={values.toDate} className="form-control"></Field>
                                        <ErrorMessage name="toDate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            {/* {this.state.self && <Field type="hidden" name="employeeId" defaultValue="0"></Field>} */}
                              <div className="row"> 
                                 <div className="col-12">
                                 <label>Employee
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                 <Field name="employeeId"  render={field => {
                                    return <EmployeeDropdown  defaultValue={values.employeeId?.id} onChange={e => {
                                        setFieldValue("employeeId", e.target.value);                                        
                                    }}></EmployeeDropdown>
                                }}></Field>
                                 <ErrorMessage name="employeeId">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                 </div>
                             </div>
                             <div className="row mt-3">
                                 <div className="col">
                                 <input type="submit" className="btn btn-primary" value="Save" />
                                 </div>
                             
                             </div>
                            
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
