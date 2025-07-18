import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { ModalFooter } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import * as Yup from 'yup';
import { savePerformanceCycle } from './service';
import { toast } from "react-toastify";


const repetitionValidationSchema = Yup.object().shape({
    frequencyType: Yup.string().when('active', {
        is: true,
        then: Yup.string().required('Select frequency'),
        otherwise: Yup.string(),
    }),
    recurrence: Yup.number().when('active', {
        is: true,
        then: Yup.number()
            .required('Number of recurrences is required')
            .min(1, 'Must be at least 1')
            .integer('Must be a whole number'),
        otherwise: Yup.number(),
    }),
});

export default class RepetitionsSettings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            active: this.props.formData.repetitionValue6?.repetitionSettings.active || false,
            cycleTimePeriod: this.props.formData.repetitionValue6?.repetitionsPeriods || [],
            currentPage: 0,
            rowsPerPage: 4,
            frequency: this.props.formData.repetitionValue6?.repetitionSettings?.frequencyType || '',
            formValue: {
                id: this.props.formData.repetitionValue6?.id || 0,
                frequencyType: this.props.formData.repetitionValue6?.repetitionSettings?.frequencyType || "",
                recurrence: this.props.formData.repetitionValue6?.repetitionSettings?.recurrence || '',

            }
        }
    }

    componentDidMount() {

        const recurrence = this.props.formData.repetitionValue6?.repetitionSettings?.recurrence;
        const frequencyType = this.props.formData.repetitionValue6?.repetitionSettings?.frequencyType;

        if (this.state.active && recurrence && frequencyType) {
            this.setState({ frequency: frequencyType }, () => {
                const fakeEvent = {
                    target: {
                        value: recurrence
                    },
                    preventDefault: () => { }
                };
                this.handleFieldChange(fakeEvent);
            });
        }
   
    }

    handleFieldChange = (e) => {
        e.preventDefault();
        const { value } = e.target;
        const { frequency } = this.state;
        const startDate = this.props.formData.appraisalCycletime5?.cycleStartDate;
        const endDate = this.props.formData.appraisalCycletime5?.cycleEndDate;
        const instance = this.props.formData.appraisalCycletime5?.instancename;

        if (!startDate || !endDate || !frequency || !value) return;

        const originalStart = new Date(startDate);
        const originalEnd = new Date(endDate);
        const result = [];
        const numRecurrences = parseInt(value);

        let monthsPerCycle;
        switch (frequency) {
            case 'monthly':
                monthsPerCycle = 1;
                break;
            case 'quarterly':
                monthsPerCycle = 3;
                break;
            case 'semiannually':
                monthsPerCycle = 6;
                break;
            case 'annually':
                monthsPerCycle = 12;
                break;
            default:
                return;
        }

        for (let i = 0; i < numRecurrences; i++) {
            const cycleStart = new Date(originalStart);
            cycleStart.setMonth((originalStart.getMonth()+1) + (i * monthsPerCycle));

            const cycleEnd = new Date(cycleStart);
            cycleEnd.setMonth((cycleStart.getMonth()) + monthsPerCycle);
            cycleEnd.setDate(cycleEnd.getDate() - 1);

            if (cycleEnd > originalEnd) {
                cycleEnd.setTime(originalEnd.getTime());
            }

            const formattedStartDate = cycleStart.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });

            const formattedEndDate = cycleEnd.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });

            result.push({
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                instanceName: `${instance} - Cycle ${i + 1}`
            });

            // Stop if we've reached the original end date
            if (cycleEnd >= originalEnd) {
                break;
            }
        }

        this.setState({ cycleTimePeriod: result });
    }
    
    handleNextClick = () => {
        this.setState((prevState) => ({
            currentPage: prevState.currentPage + 1,
        }));
    };
    handleFrequency = (e) => {
        const value = e.target.value
        this.setState({ frequency: value })
    }

    save = (data, action) => {
       
        const repetitionSettings = {
            active: this.state.active,
            id: this.state.formValue.id,
            repetitionPeriods: this.state.cycleTimePeriod,
            repetitionSettings: data
        }
        
        this.props.handleFormData({ repetitionValue6: repetitionSettings, id: this.props.formData?.id || 0 })
        action.setSubmitting(true);
       
        savePerformanceCycle(this.props.formData).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                 this.props.refreshActiveCycle();
                 this.props.hideForm();
            } else {
                toast.error(res.message);
            }
            if (res.status == "OK") {
                this.redirectToList();
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log(err)
            toast.error("Error while creating Performance cycle");
            action.setSubmitting(false);
        })
        this.props.hideForm()
    }
    getAvailableFrequencies = () => {
        const startDate = this.props.formData.appraisalCycletime5?.cycleStartDate;
        const endDate = this.props.formData.appraisalCycletime5?.cycleEndDate;

        if (!startDate || !endDate) {
            return [];
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const calculatePreciseMonths = (startDate, endDate) => {
            const start = new Date(startDate);
            const end = new Date(endDate);

            let months = 0;
            let currentDate = new Date(start);

            while (currentDate < end) {
                const nextMonth = new Date(currentDate);
                nextMonth.setMonth(nextMonth.getMonth() + 1);

                if (nextMonth <= end) {
                    months++;
                    currentDate = nextMonth;
                } else {
                    const remainingDays = Math.ceil((end - currentDate) / (1000 * 60 * 60 * 24));
                    const daysInCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                    months += remainingDays / daysInCurrentMonth;
                    break;
                }
            }

            return months;
        };

        const exactMonths = calculatePreciseMonths(start, end);
        const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        const availableOptions = [];

        if (exactMonths >= 1) {
            availableOptions.push({ value: "monthly", label: "Monthly" });
        }

        if (exactMonths >= 3) {
            availableOptions.push({ value: "quarterly", label: "Quarterly" });
        }

        if (exactMonths >= 6) {
            availableOptions.push({ value: "semiannually", label: "Semiannually" });
        }

        if (exactMonths >= 12) {
            availableOptions.push({ value: "annually", label: "Annually" });
        }

        return availableOptions;
    }
    getMaxRecurrences = () => {
        const startDate = this.props.formData.appraisalCycletime5?.cycleStartDate;
        const endDate = this.props.formData.appraisalCycletime5?.cycleEndDate;
        const { frequency } = this.state;

        if (!startDate || !endDate || !frequency) {
            return null;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const calculatePreciseMonths = (startDate, endDate) => {
            const start = new Date(startDate);
            const end = new Date(endDate);

            let months = 0;
            let currentDate = new Date(start);

            while (currentDate < end) {
                const nextMonth = new Date(currentDate);
                nextMonth.setMonth(nextMonth.getMonth() + 1);

                if (nextMonth <= end) {
                    months++;
                    currentDate = nextMonth;
                } else {
                    break;
                }
            }

            return months;
        };

        const exactMonths = calculatePreciseMonths(start, end);

        switch (frequency) {
            case 'monthly':
                return Math.floor(exactMonths);
            case 'quarterly':
                return Math.floor(exactMonths / 3);
            case 'semiannually':
                return Math.floor(exactMonths / 6);
            case 'annually':
                return Math.floor(exactMonths / 12);
            default:
                return null;
        }
    }
    handleFrequency = (e) => {
        const value = e.target.value;
        this.setState({ frequency: value }, () => {
            const maxRecurrences = this.getMaxRecurrences();
            if (maxRecurrences && this.state.formValue.recurrence > maxRecurrences) {
                this.setState({
                    formValue: {
                        ...this.state.formValue,
                        recurrence: ''
                    },
                    cycleTimePeriod: []
                });
            }
        });
    }
    render() {
        const { cycleTimePeriod } = this.state;
        const { currentPage, rowsPerPage } = this.state;
        const startIndex = currentPage * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const currentRows = cycleTimePeriod.slice(startIndex, endIndex);
        const availableFrequencies = this.getAvailableFrequencies();
        const maxRecurrences = this.getMaxRecurrences();

        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.formValue}
                    validationSchema={repetitionValidationSchema}
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
                            <div>
                                <p className="cycleFormTitle">Repititions Settings</p>
                            </div>
                            <FormGroup>
                                <div className='cycleTogglebtn' type="checkbox" name="active" onClick={e => {
                                    this.state.active = !this.state.active;
                                    this.setState({ active: this.state.active });
                                    setFieldValue('active', this.state.active);

                                }} >
                                    <label>Would you want the assesment cycle to recur ?</label>
                                    <i className={`float-right mr-3 fa fa-2x ${this.state.active
                                        ? 'fa-toggle-on text-success' :
                                        'fa fa-toggle-off text-danger'}`}></i>
                                    <p style={{ borderTop: '1px solid grey' }} className='mb-0'>If you select this option as "Yes", you will need to specify the frequency and number of recurrences</p>
                                </div>
                            </FormGroup>
                            {this.state.active && <>
                                <div className='d-flex'>
                                    <div className="pl-0 col-md-4">
                                        <label>Frequency
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <select
                                            className="form-control"
                                            name="frequencyType"
                                            value={values.frequencyType}
                                            onChange={e => {
                                                this.handleFrequency(e);
                                                setFieldValue('frequencyType', e.target.value);
                                            }}
                                        >
                                            <option value="">
                                                {availableFrequencies.length === 0
                                                    ? "No frequency options available for selected date range"
                                                    : "Select Frequency"
                                                }
                                            </option>
                                            {availableFrequencies.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <ErrorMessage name="frequencyType">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </div>
                                    <FormGroup className="col-md-4">
                                        <label>Recurrences
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field
                                            disabled={!this.state.frequency}
                                            name="recurrence"
                                            type="number"
                                            min="1"
                                            max={maxRecurrences || undefined}
                                            className="form-control"
                                            onChange={e => {
                                                const value = parseInt(e.target.value);
                                                if (maxRecurrences && value > maxRecurrences) {
                                                    // Optionally show a warning or prevent the input
                                                    return;
                                                }
                                                this.handleFieldChange(e);
                                                setFieldValue('recurrence', e.target.value);
                                            }}
                                        />
                                        {maxRecurrences && values.recurrence > maxRecurrences && (
                                            <div style={{ color: 'red', fontSize: '12px' }}>
                                                Maximum {maxRecurrences} recurrences allowed for selected frequency and date range
                                            </div>
                                        )}
                                        <ErrorMessage name="recurrence">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div>
                                    <h5>Assessment Cycle Time Period</h5>
                                </div>


                                <div >
                                    <table className="table table-borderless">
                                        <tr>
                                            <th className='p-0' >Instance name</th>
                                            <th className='p-0' >Start date</th>
                                            <th className='p-0' >End date</th>
                                        </tr>

                                        {currentRows.map((item, index) => (
                                            <tbody key={index}>
                                                <tr >
                                                    <td className='p-0 text-start border-0'>{item.instanceName}</td>
                                                    <td className='p-0 text-start border-0'>{item.startDate}</td>
                                                    <td className='p-0 text-start border-0'>{item.endDate}</td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </table>
                                </div>

                                {endIndex < cycleTimePeriod.length && (
                                    <button onClick={this.handleNextClick}>Next</button>
                                )}
                            </>}
                            <ModalFooter className="cycle-modal-footer">
                                <div className='mt-2' style={{ marginLeft: 'auto' }}>
                                    <p onClick={this.props.prevStep} className="mb-0 cycle_btn btn btn-dark">Back</p>
                                    <button type='submit'
                                        className="ml-2 btn btn-primary"
                                    >
                                        Submit
                                    </button>
                                </div>

                            </ModalFooter>
                        </Form>
                    )
                    }
                </Formik>

            </div >
        )
    }
}
