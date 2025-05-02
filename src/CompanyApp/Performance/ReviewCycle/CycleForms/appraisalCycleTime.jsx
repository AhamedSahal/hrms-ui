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
            regular: this.props.formData.appraisalCycletime5?.regular || false,
            interim: this.props.formData.appraisalCycletime5?.interim || false,
            formValue: {
                id: 0,
                instancename: this.props.formData.appraisalCycletime5?.instancename || '',
                cycleStartDate: this.props.formData.appraisalCycletime5?.cycleStartDate || '',
                cycleEndDate: this.props.formData.appraisalCycletime5?.cycleEndDate || '',
                hrConfirmation_startDate: this.props.formData.appraisalCycletime5?.hrConfirmation_startDate || '',
                hrConfirmation_endDate: this.props.formData.appraisalCycletime5?.hrConfirmation_endDate || '',
                hrConfirmation_startTime: this.props.formData.appraisalCycletime5?.hrConfirmation_startTime || '',
                hrConfirmation_endTime: this.props.formData.appraisalCycletime5?.hrConfirmation_endTime || '',
                appraisal_startDate: this.props.formData.appraisalCycletime5?.appraisal_startDate || '',
                appraisal_endDate: this.props.formData.appraisalCycletime5?.appraisal_endDate || '',
                appraisal_startTime: this.props.formData.appraisalCycletime5?.appraisal_startTime || '',
                appraisal_endTime: this.props.formData.appraisalCycletime5?.appraisal_endTime || '',
                goalTimeline_startDate: this.props.formData.appraisalCycletime5?.goalTimeline_startDate || '',
                goalTimeline_endDate: this.props.formData.appraisalCycletime5?.goalTimeline_endDate || '',
                interim_startDate: this.props.formData.appraisalCycletime5?.interim_startDate || '',
                interim_endDate: this.props.formData.appraisalCycletime5?.interim_endDate || '',
                regularCheck_ins: this.props.formData.appraisalCycletime5?.regularCheck_ins || '',
            }
        }
    }
    
    save = (data, action) => {
        this.props.handleFormData({ appraisalCycletime5: data })
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
                            <div >
                                <div>
                                    <FormGroup >
                                        <div className='cycleTimeCheckbox' type="checkbox" name="active" onClick={e => {
                                            this.state.goal = !this.state.goal;
                                            this.setState({ goal: this.state.goal });
                                            setFieldValue("goal", this.state.goal);
                                        }} >
                                            <label className='mb-0'>Goal Setting Timeline</label>
                                            <i className={`float-right mr-3 fa fa-2x ${this.state.goal
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}></i>
                                        </div>
                                    </FormGroup>
                                </div>
                                {this.state.goal && <div className='d-flex'>
                                    <FormGroup className='mr-3'>
                                        <label>Start Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field min={new Date(`${values.cycleStartDate ? values.cycleStartDate : Date()}`).toISOString().split('T')[0]} name="goalTimeline_startDate" type="date" className="form-control"></Field>
                                        <ErrorMessage name="goalTimeline_startDate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                    <FormGroup className='mr-3'>
                                        <label>End Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field min={new Date(`${values.goalTimeline_startDate ? values.goalTimeline_startDate : Date()}`).toISOString().split('T')[0]} name="goalTimeline_endDate" type="date" className="form-control"></Field>
                                        <ErrorMessage name="goalTimeline_endDate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>}
                            </div>
                            <div>
                                <FormGroup>
                                    <div className='cycleTimeCheckbox' type="checkbox" name="active" onClick={e => {
                                        this.state.regular = !this.state.regular;
                                        this.setState({ regular: this.state.regular });
                                        setFieldValue("regular", this.state.regular);
                                    }} >
                                        <label className='mb-0'>Regular Check-ins</label>
                                        <i className={`float-right mr-3 fa fa-2x ${this.state.regular
                                            ? 'fa-toggle-on text-success' :
                                            'fa fa-toggle-off text-danger'}`}></i>
                                    </div>
                                </FormGroup>
                                {this.state.regular && <div className='d-flex'>
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
                            <div>
                                <FormGroup>
                                    <div className='cycleTimeCheckbox' type="checkbox" name="active" onClick={e => {
                                        this.state.interim = !this.state.interim;
                                        this.setState({ interim: this.state.interim });
                                        setFieldValue("interim", this.state.interim);
                                    }} >
                                        <label className='mb-0'>Interim Review Timeline</label>
                                        <i className={`float-right mr-3 fa fa-2x ${this.state.interim
                                            ? 'fa-toggle-on text-success' :
                                            'fa fa-toggle-off text-danger'}`}></i>
                                    </div>
                                </FormGroup>
                                {this.state.interim && <div className='d-flex'>
                                    <FormGroup className='mr-3'>
                                        <label>Start Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field min={new Date(`${values.cycleStartDate ? values.cycleStartDate : Date()}`).toISOString().split('T')[0]} name="interim_startDate" type="date" className="form-control"></Field>
                                        <ErrorMessage name="interim_startDate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                    <FormGroup className='mr-3'>
                                        <label>End Date
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field min={new Date(`${values.interim_startDate ? values.interim_startDate : Date()}`).toISOString().split('T')[0]} name="interim_endDate" type="date" className="form-control"></Field>
                                        <ErrorMessage name="interim_endDate">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>}
                            </div>
                            <h6>HR CONFIRMATION STAGE</h6>
                            <div className='d-flex '>
                                <FormGroup className='mr-3'>
                                    <label>Start Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field min={new Date(`${values.cycleStartDate ? values.cycleStartDate : Date()}`).toISOString().split('T')[0]} name="hrConfirmation_startDate" type="date" className="form-control"></Field>
                                    <ErrorMessage name="hrConfirmation_startDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='mr-3'>
                                    <label>End Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field min={new Date(`${values.hrConfirmation_startDate ? values.hrConfirmation_startDate : Date()}`).toISOString().split('T')[0]} name="hrConfirmation_endDate" type="date" className="form-control"></Field>
                                    <ErrorMessage name="hrConfirmation_endDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='mr-3'>
                                    <label >Start Time
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="hrConfirmation_startTime" type="time" className="form-control" ></Field>
                                    <ErrorMessage name="hrConfirmation_startTime">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>

                                <FormGroup>
                                    <label>End Time
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="hrConfirmation_endTime" type="time" className="form-control" ></Field>
                                    <ErrorMessage name="hrConfirmation_endTime">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                            <h6>APPRAISAL</h6>
                            <FormGroup>
                                <Field onChange={e => { setFieldValue("emailreminder", true)}} type="checkbox" name="emailreminder" /> Send email reminder to confirm employee details on this date
                                <label for="emailreminder"></label>
                            </FormGroup>
                            <div className='mb-4 d-flex '>

                                <FormGroup className='mr-3'>
                                    <label>Start Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field min={new Date(`${values.hrConfirmation_startDate ? values.hrConfirmation_startDate : Date()}`).toISOString().split('T')[0]} name="appraisal_startDate" type="date" className="form-control"></Field>
                                    <ErrorMessage name="appraisal_startDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>

                                <FormGroup className='mr-3'>
                                    <label>End Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field min={new Date(`${values.appraisal_startDate ? values.appraisal_startDate : Date()}`).toISOString().split('T')[0]} name="appraisal_endDate" type="date" className="form-control"></Field>
                                    <ErrorMessage name="appraisal_endDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='mr-3'>
                                    <label >Start Time
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="appraisal_startTime" type="time" className="form-control" ></Field>
                                    <ErrorMessage name="appraisal_startTime">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup>
                                    <label>End Time
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="appraisal_endTime" type="time" className="form-control" ></Field>
                                    <ErrorMessage name="appraisal_endTime">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
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
