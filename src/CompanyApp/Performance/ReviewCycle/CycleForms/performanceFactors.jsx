import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import { Checkbox, FormControlLabel } from '@mui/material';
import { Button, Modal, ModalFooter } from 'react-bootstrap';


const { Header, Body, Footer } = Modal;
export default class PerformanceFactors extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValues: {
                goals: this.props.formData.performanceValue2?.performanceScore.goals || "",
                competencies: this.props.formData.performanceValue2?.performanceScore.competencies || "",
                leadership: this.props.formData.performanceValue2?.performanceScore.leadership || "",
                multiRaterFeedback: this.props.formData.performanceValue2?.performanceScore.multiRaterFeedback || "",
            },
            checkbox: {
                goals: this.props.formData.performanceValue2?.factorField.goals || false,
                competencies: this.props.formData.performanceValue2?.factorField.competencies || false,
                leadership: this.props.formData.performanceValue2?.factorField.leadership || false,
                multiRaterFeedback: this.props.formData.performanceValue2?.factorField.multiRaterFeedback || false,
            },
            total: 0,
        };
    }


    calculateTotal = () => {
        const { goals, competencies, leadership, multiRaterFeedback } = this.state.formValues;

        const total = Number(goals || 0) + Number(competencies || 0) + Number(leadership || 0) + Number(multiRaterFeedback || 0);
        this.setState({ total });
    };
    componentDidMount() {
        this.calculateTotal()
    }
    handleInputChange = (fieldName, e) => {
        const { formValues } = this.state;
        formValues[fieldName] = e.target.value;
        this.setState({ formValues }, () => {
            this.calculateTotal();
        });
    };

    handleCheckboxChange = (event) => {
        const { formValues } = this.state;
        const { name, checked } = event.target;
        this.setState((prevState) => ({
            checkbox: {
                ...prevState.checkbox,
                [name]: checked,
            },
        }));
        if (name === 'goals') {
            formValues["goals"] = '';
            this.setState({ formValues }, () => {
                this.calculateTotal();
            });
        } else if (name === 'competencies') {
            formValues["competencies"] = '';
            this.setState({ formValues }, () => {
                this.calculateTotal();
            });
        } else if (name === 'leadership') {
            formValues["leadership"] = '';
            this.setState({ formValues }, () => {
                this.calculateTotal();
            });
        } else if (name === 'multiRaterFeedback') {
            formValues["multiRaterFeedback"] = '';
            this.setState({ formValues }, () => {
                this.calculateTotal();
            });
        }

    };
    save = (data, action) => {
        const performanceValue = {
            performanceScore: data,
            factorField: this.state.checkbox
        }
        this.props.handleFormData({ performanceValue2 : performanceValue })
        this.props.nextStep();
    }

    render() {
        const { formValues, total, checkbox } = this.state;
        return (
            <div>
                <p className="cycleFormTitle">Which Performance Factors do you want to include in this review cycle ?</p>
                <Formik initialValues={formValues} onSubmit={this.save}>
                    <Form>
                        <div className='perfomanceCycleScore'>
                            <div >
                                <FormControlLabel control={<Checkbox checked={checkbox.goals}
                                    onChange={this.handleCheckboxChange}
                                    name="goals" />} label="Goals" />
                                <Field
                                    type="number"
                                    name="goals"
                                    placeholder="%"
                                    disabled={!checkbox.goals}
                                    className={checkbox.goals ? 'cycleScoreField' : 'disabled-inputField'}
                                    value={formValues.goals}
                                    onChange={(e) => this.handleInputChange("goals", e)}
                                />

                            </div>
                            <div>
                                <FormControlLabel control={<Checkbox checked={checkbox.competencies}
                                    onChange={this.handleCheckboxChange}
                                    name="competencies" />} label="Competencies" />
                                <Field
                                    type="number"
                                    name="competencies"
                                    placeholder="%"
                                    disabled={!checkbox.competencies}
                                    className={checkbox.competencies ? 'cycleScoreField' : 'disabled-inputField'}
                                    value={formValues.competencies}
                                    onChange={(e) => this.handleInputChange("competencies", e)}
                                />
                            </div>
                            <div>
                                <FormControlLabel control={<Checkbox checked={checkbox.leadership}
                                    onChange={this.handleCheckboxChange}
                                    name="leadership" />} label="Leadership Feedback" />
                                <Field
                                    type="number"
                                    name="leadership"
                                    placeholder="%"
                                    disabled={!checkbox.leadership}
                                    className={checkbox.leadership ? 'cycleScoreField' : 'disabled-inputField'}
                                    value={formValues.leadership}
                                    onChange={(e) => this.handleInputChange("leadership", e)}
                                />
                            </div>
                            <div>
                                <FormControlLabel control={<Checkbox checked={checkbox.multiRaterFeedback}
                                    onChange={this.handleCheckboxChange}
                                    name="multiRaterFeedback" />} label="360 Degree Feedback" />
                                <Field
                                    type="number"
                                    name="multiRaterFeedback"
                                    placeholder="%"
                                    disabled={!checkbox.multiRaterFeedback}
                                    className={checkbox.multiRaterFeedback ? 'cycleScoreField' : 'disabled-inputField'}
                                    value={formValues.multiRaterFeedback}
                                    onChange={(e) => this.handleInputChange("multiRaterFeedback", e)}
                                />
                            </div>
                            <div className=''>
                                <h4 className='m-0'>Total</h4>
                                <label className='totelwheightage'>{total}%</label>
                                {total === 0 ? <span style={{ color: 'red', marginLeft: '32%' }}>Please Provide Performance score</span> : null}
                                {total > 100 ? <span style={{ color: 'red', marginLeft: '32%' }}>Total weigtage should be 100% only</span> : null}
                            </div>

                        </div>
                        <div className='performanceText'>
                            <p>Performance score should be 100%</p>
                        </div>
                        <ModalFooter className="cycle-modal-footer">
                            <div className='d-flex mt-2' style={{ marginLeft: 'auto' }}>
                                <p onClick={this.props.prevStep} className="mb-0 cycle_btn btn btn-dark">Back</p>
                                {total === 100 ? <button type='submit'
                                    className="cycle_btn ml-2 btn btn-dark"
                                >
                                    Next
                                </button> : <p
                                    className="cycle_disable_btn ml-2 "
                                >
                                    Next
                                </p>}
                            </div>

                        </ModalFooter>
                    </Form>

                </Formik>
            </div>
        );
    }
}
