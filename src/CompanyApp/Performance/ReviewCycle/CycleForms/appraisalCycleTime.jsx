import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { ModalFooter } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { cycleTimeValidationSchema } from './validation';



export default class AppraisalCycleTime extends Component {
    constructor(props) {
        super(props)

        this.state = {
            goal: this.props.formData.appraisalCycletime5?.goal || false,
            interim: this.props.formData.appraisalCycletime5?.interim || false,
            formValue: {
                id: this.props.formData.appraisalCycletime5?.id || 0,
                instancename: this.props.formData.appraisalCycletime5?.instancename || '',
                cycleStartDate: this.props.formData.appraisalCycletime5?.cycleStartDate || '',
                cycleEndDate: this.props.formData.appraisalCycletime5?.cycleEndDate || '',
                // hrConfirmation_startDate: this.props.formData.appraisalCycletime5?.hrConfirmation_startDate || '',
                // hrConfirmation_endDate: this.props.formData.appraisalCycletime5?.hrConfirmation_endDate || '',
                // hrConfirmation_startTime: this.props.formData.appraisalCycletime5?.hrConfirmation_startTime || '',
                // hrConfirmation_endTime: this.props.formData.appraisalCycletime5?.hrConfirmation_endTime || '',
                // appraisal_startDate: this.props.formData.appraisalCycletime5?.appraisal_startDate || '',
                // appraisal_endDate: this.props.formData.appraisalCycletime5?.appraisal_endDate || '',
                // appraisal_startTime: this.props.formData.appraisalCycletime5?.appraisal_startTime || '',
                // appraisal_endTime: this.props.formData.appraisalCycletime5?.appraisal_endTime || '',
                // goalTimeline_startDate: this.props.formData.appraisalCycletime5?.goalTimeline_startDate || '',
                // goalTimeline_endDate: this.props.formData.appraisalCycletime5?.goalTimeline_endDate || '',
                // interim_startDate: this.props.formData.appraisalCycletime5?.interim_startDate || '',
                // interim_endDate: this.props.formData.appraisalCycletime5?.interim_endDate || '',
                regular: this.props.formData.appraisalCycletime5?.regular || false,
                regularCheck_ins: this.props.formData.appraisalCycletime5?.regularCheck_ins || '',
            }
        }
    }
    

    
    save = (data, action) => {
        data.id = this.state.formValue.id;
        data.regular = this.state.formValue.regular;
       
        this.props.handleFormData({ appraisalCycletime5: data, id: this.props.formData?.id || 0 })
        this.props.nextStep();
    }

    render() {

        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.formValue}
                    validationSchema={cycleTimeValidationSchema}
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
                            <p className="cycleFormTitle">Define appraisal cycle time</p>

                            <h6>CYCLE TIME</h6>

                            <div className='d-flex mb-2' >
                                <FormGroup className='mr-3'>
                                    <label>Start Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="cycleStartDate" type="date" className="form-control"></Field>
                                    <ErrorMessage name="cycleStartDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='mr-3'>
                                    <label>End Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field min={new Date(`${values.cycleStartDate ? values.cycleStartDate : Date()}`).toISOString().split('T')[0]} name="cycleEndDate" type="date" className="form-control"></Field>
                                    <ErrorMessage name="cycleEndDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup>
                                    <label>Instance Name
                                        <span style={{ color: "red" }}>*</span>

                                    </label>
                                    <Field placeholder="Enter instance name" name="instancename" className="form-control"></Field>
                                    <ErrorMessage name="instancename">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                           
                            <div>
                                <FormGroup>
                                    <div className='cycleTimeCheckbox' type="checkbox" name="regular" onClick={e => {
                                        const updatedRegular = !this.state.formValue.regular;

                                        this.setState(prevState => ({
                                        formValue: {
                                            ...prevState.formValue,
                                            regular: updatedRegular
                                        }
                                        }));

                                        setFieldValue('regular', updatedRegular);

                                    }} >
                                        <label className='mb-0'>Regular Check-ins</label>
                                        <i className={`float-right mr-3 fa fa-2x ${this.state.formValue.regular 
                                            ? 'fa-toggle-on text-success' :
                                            'fa fa-toggle-off text-danger'}`}></i>
                                    </div>
                                </FormGroup>
                                {this.state.formValue.regular && <div className='d-flex'>
                                    <FormGroup className='mr-3'>
                                        <Field
                                            className="form-control"
                                            name="regularCheck_ins"
                                            as="select"
                                            onChange={e => {
                                                setFieldValue("regularCheck_ins", e.target.value);

                                            }}
                                        >
                                            <option value="">Select the Check-ins</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="15 Days">15 Days</option>
                                            <option value="monthly">Monthly</option>
                                        </Field>
                                        <ErrorMessage name="regularCheck_ins">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>}
                            </div>
                          
                            <ModalFooter className="cycle-modal-footer">
                                <div className='mt-2' style={{ marginLeft: 'auto' }}>
                                    <p onClick={this.props.prevStep} className="mb-0 cycle_btn btn btn-dark">Back</p>
                                    <button type='submit'
                                        className="cycle_btn ml-2 btn btn-dark"
                                    >
                                        Next
                                    </button>
                                </div>

                            </ModalFooter>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
