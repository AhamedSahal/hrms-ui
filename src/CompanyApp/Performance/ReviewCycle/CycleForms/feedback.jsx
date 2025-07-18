import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { ModalFooter } from 'react-bootstrap';
import { FormGroup } from 'reactstrap';
import { feedbackValidationSchema } from './validation';
import RoleDropdown from '../../../ModuleSetup/Dropdown/RoleDropdown';

export default class FeedbackFlow extends Component {
    constructor(props) {
        super(props);

            this.state = {
                visibleLevels: props.formData.feedbackFlow4?.feedback?.length ? Math.max(...props.formData.feedbackFlow4.feedback.map(Number)) < 5? [...props.formData.feedbackFlow4.feedback.map(Number),Math.max(...props.formData.feedbackFlow4.feedback.map(Number)) + 1,]: props.formData.feedbackFlow4.feedback.map(Number): [1],

                selectedReviewers: {
                    1: props.formData.feedbackFlow4?.reviewer1 || '',
                    2: props.formData.feedbackFlow4?.reviewer2 || '',
                    3: props.formData.feedbackFlow4?.reviewer3 || '',
                    4: props.formData.feedbackFlow4?.reviewer4 || '',
                    5: props.formData.feedbackFlow4?.reviewer5 || '',
                },
                formValue: {
                    feedback: props.formData.feedbackFlow4?.feedback || [],
                    id: props.formData.feedbackFlow4?.id || 0,
                    roleId: props.formData.feedbackFlow4?.roleId || '',
                    reviewer1: props.formData.feedbackFlow4?.reviewer1 || '',
                    reviewer2: props.formData.feedbackFlow4?.reviewer2 || '',
                    reviewer3: props.formData.feedbackFlow4?.reviewer3 || '',
                    reviewer4: props.formData.feedbackFlow4?.reviewer4 || '',
                    reviewer5: props.formData.feedbackFlow4?.reviewer5 || '',
                    roleName: props.formData.feedbackFlow4?.roleName || '',
                }
            };

    }

   

    save = (data, action) => {
        data.id = this.state.formValue.id; 
       
        this.props.handleFormData({ feedbackFlow4: data ,id: this.props.formData?.id || 0});
        this.props.nextStep();
    };

    renderLevelRow = (levelNum, values, setFieldValue) => {
        const feedbackValue = String(levelNum);
        const reviewerField = `reviewer${levelNum}`;
        const prevLevel = levelNum - 1;

        if (!this.state.visibleLevels.includes(levelNum)) return null;

        const allOptions = [
            { value: "1", label: "Employee Self evaluation" },
            { value: "2", label: "Immediate manager" },
            { value: "3", label: "Second level reporting manager" },
            { value: "4", label: "Third level reporting manager" },
            { value: "5", label: "Roles" }
        ];

        const usedValues = Object.entries(this.state.selectedReviewers)
            .filter(([lvl, val]) => Number(lvl) !== levelNum)
            .map(([lvl, val]) => val);

        const options = allOptions.filter(opt => !usedValues.includes(opt.value));

        const handleReviewerChange = (e) => {
            const selectedVal = e.target.value;
            setFieldValue(reviewerField, selectedVal);

            this.setState(prev => {
                const updatedReviewers = { ...prev.selectedReviewers, [levelNum]: selectedVal };
                const updatedVisible = [...prev.visibleLevels];

                if (
                    values.feedback.includes(feedbackValue) &&
                    selectedVal !== "" &&
                    levelNum < 5 &&
                    !updatedVisible.includes(levelNum + 1)
                ) {
                    updatedVisible.push(levelNum + 1);
                }

                return {
                    selectedReviewers: updatedReviewers,
                    visibleLevels: updatedVisible
                };
            });
        };

        return (
            <div className='d-flex align-items-center mb-3' key={levelNum}>
                <label className='ml-2 mb-0' style={{ width: '100px' }}>
                    <Field
                        type="checkbox"
                        name="feedback"
                        value={feedbackValue}
                        onClick={(e) => {
                            const checked = e.target.checked;
                            setFieldValue("feedback", checked
                                ? [...values.feedback, feedbackValue]
                                : values.feedback.filter(f => f !== feedbackValue));

                            this.setState(prev => {
                                const updated = [...prev.visibleLevels];
                                if (checked && values[reviewerField] && levelNum < 5 && !updated.includes(levelNum + 1)) {
                                    updated.push(levelNum + 1);
                                }
                                return { visibleLevels: updated };
                            });
                        }}
                    />
                    {' '}Level {levelNum}
                </label>

                {values.feedback.includes(feedbackValue) && (
                    <>
                        <FormGroup className='mb-0 mr-3' style={{ minWidth: '250px' }}>
                            <Field
                                as="select"
                                name={reviewerField}
                                className="form-control"
                                onChange={handleReviewerChange}
                            >
                                <option value="">Select Reviewer Type</option>
                                {options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </Field>
                            <ErrorMessage name={reviewerField}>
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                        </FormGroup>

                        {values[reviewerField] === "5" && (
                            <FormGroup className='mb-0'>
                                <Field name="roleId">
                                    {({ field, form }) => (
                                        <RoleDropdown value={field.value} onChange={e => {
                                            form.setFieldValue("roleId", e.target.value);
                                        }} />
                                    )}
                                </Field>
                                <ErrorMessage name="roleId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                        )}
                    </>
                )}
            </div>
        );
    };


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
                        <Form autoComplete="off">
                            <p className="cycleFormTitle">Which parties do you want to include in this review cycle?</p>

                            <FormGroup>
                                <label>Add below reviewers automatically to all individuals
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <ErrorMessage name="feedback">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>

                                {[1, 2, 3, 4, 5].map(level =>
                                    this.renderLevelRow(level, values, setFieldValue)
                                )}

                            </FormGroup>

                            {/* <FormGroup>
//                                 <label>How would you want feedback flow in hierarchy?
//                                     <span style={{ color: "red" }}>*</span>
//                                 </label>

//                                 <div
//                                 >
//                                     <Field className='ml-2' type="radio" value="1" name="hierarchy" /> Send request sequentially in the hierarchy after the self rating are completed
//                                     <br />
//                                     <Field className='ml-2' type="radio" value="2" name="hierarchy" /> Send request simultaneously to all

//                                 </div>
//                                 <ErrorMessage name="hierarchy">
//                                     {msg => <div style={{ color: 'red' }}>{msg}</div>}
//                                 </ErrorMessage>
//                             </FormGroup> */}
                            {/* <FormGroup>
//                                 <div className='cycleTogglebtn' type="checkbox" name="performanceResult" onClick={e => {
//                                     this.state.performanceResult = !this.state.performanceResult;
//                                     this.setState({ performanceResult: this.state.performanceResult });
//                                     setFieldValue("performanceResult", this.state.performanceResult);

//                                 }} >
//                                     <label>Do you want employees to dispute their performance result ?</label>
//                                     <i className={`float-right mr-3 fa fa-2x ${this.state.performanceResult
//                                         ? 'fa-toggle-on text-success' :
//                                         'fa fa-toggle-off text-danger'}`}></i>
//                                 </div>
//                             </FormGroup>
//                             <FormGroup>
//                                 <div className='cycleTogglebtn' type="checkbox" name="appraisalCycle" onClick={e => {
//                                     this.state.appraisalCycle = !this.state.appraisalCycle;
//                                     this.setState({ appraisalCycle: this.state.appraisalCycle });
//                                     setFieldValue("appraisalCycle", this.state.appraisalCycle);
//                                 }} >
//                                     <label>Do you want to schedule 1-on-1s after appraisal cycle ?</label>
//                                     <i className={`float-right mr-3 fa fa-2x ${this.state.appraisalCycle
//                                         ? 'fa-toggle-on text-success' :
//                                         'fa fa-toggle-off text-danger'}`}></i>
//                                     <p style={{ borderTop: '1px solid grey' }} className='mb-0'>if you will select this option as "Yes", you will need to determine the amount of times
//                                         for managers to complete their 1-on1-s</p>
//                                 </div>
//                             </FormGroup>
//                             {this.state.appraisalCycle && <FormGroup>
//                                 <label>Within how many days all reporting managers need to finish 1-on-1s?
//                                     <span style={{ color: "red" }}>*</span>
//                                 </label>
//                                 <Field placeholder="Enter the Days" name="numberOfDays" type='number' className="col-md-4 form-control"
//                                 ></Field>
//                                 <ErrorMessage name="numberOfDays">
//                                     {msg => <div style={{ color: 'red' }}>{msg}</div>}
//                                 </ErrorMessage>
//                             </FormGroup>} */}

                            <ModalFooter className="cycle-modal-footer">
                                <div className='mt-2' style={{ marginLeft: 'auto' }}>
                                    <p onClick={this.props.prevStep} className="mb-0 cycle_btn btn btn-dark">Back</p>
                                    <button type='submit' className="cycle_btn ml-2 btn btn-dark">Next</button>
                                </div>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}
