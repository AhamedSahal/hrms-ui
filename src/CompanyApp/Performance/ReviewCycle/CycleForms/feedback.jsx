import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { ModalFooter } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import * as Yup from 'yup';
import { feedbackValidationSchema } from './validation';

export default class FeedbackFlow extends Component {
    constructor(props) {
        super(props)

        this.state = {
            performanceResult: this.props.formData.feedbackFlow4?.performanceResult || false,
            appraisalCycle: this.props.formData.feedbackFlow4?.appraisalCycle || false,
            formValue: {
                id: 0,
                feedback: this.props.formData.feedbackFlow4?.feedback || '',
                hierarchy: this.props.formData.feedbackFlow4?.hierarchy || '',
                numberOfDays: this.props.formData.feedbackFlow4?.numberOfDays || '',
                performanceResult: this.props.formData.feedbackFlow4?.performanceResult || false,
                appraisalCycle: this.props.formData.feedbackFlow4?.appraisalCycle || false,
            }
        }
    }


    save = (data, action) => {
        this.props.handleFormData({ feedbackFlow4: data })
        this.props.nextStep();
    }
    render() {

        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.formValue}
                    onSubmit={this.save}
                    validationSchema={feedbackValidationSchema}
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
                            <p className="cycleFormTitle">Which parties do you want to include in this review cycle?</p>
                            <FormGroup>
                                <label>Add below reviewers automatically to all individuals
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <ErrorMessage name="feedback">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                                <div
                                >
                                    <Field className='ml-2' type="checkbox" value="1" name="feedback" /> Employee Self evaluation <br />
                                    <Field className='ml-2' type="checkbox" value="2" name="feedback" /> Immediate manager <br />
                                    <Field className='ml-2' type="checkbox" value="3" name="feedback" /> Second level reporting manager <br />
                                    <Field className='ml-2' type="checkbox" value="4" name="feedback" /> Third level reporting manager
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <label>How would you want feedback flow in hierarchy?
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                
                                <div
                                >
                                    <Field className='ml-2' type="radio" value="1" name="hierarchy" /> Send request sequentially in the hierarchy after the self rating are completed
                                    <br />
                                    <Field className='ml-2' type="radio" value="2" name="hierarchy" /> Send request simultaneously to all

                                </div>
                                <ErrorMessage name="hierarchy">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <div className='cycleTogglebtn' type="checkbox" name="performanceResult" onClick={e => {
                                    this.state.performanceResult = !this.state.performanceResult;
                                    this.setState({ performanceResult: this.state.performanceResult });
                                    setFieldValue("performanceResult", this.state.performanceResult);

                                }} >
                                    <label>Do you want employees to dispute their performance result ?</label>
                                    <i className={`float-right mr-3 fa fa-2x ${this.state.performanceResult
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <div className='cycleTogglebtn' type="checkbox" name="appraisalCycle" onClick={e => {
                                    this.state.appraisalCycle = !this.state.appraisalCycle;
                                    this.setState({ appraisalCycle: this.state.appraisalCycle });
                                    setFieldValue("appraisalCycle", this.state.appraisalCycle);
                                }} >
                                    <label>Do you want to schedule 1-on-1s after appraisal cycle ?</label>
                                    <i className={`float-right mr-3 fa fa-2x ${this.state.appraisalCycle
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                    <p style={{ borderTop: '1px solid grey' }} className='mb-0'>if you will select this option as "Yes", you will need to determine the amount of times
                                        for managers to complete their 1-on1-s</p>
                                </div>
                            </FormGroup>
                            {this.state.appraisalCycle && <FormGroup>
                                <label>Within how many days all reporting managers need to finish 1-on-1s?
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field placeholder="Enter the Days" name="numberOfDays" type='number' className="col-md-4 form-control"
                                ></Field>
                                <ErrorMessage name="numberOfDays">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>}
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
