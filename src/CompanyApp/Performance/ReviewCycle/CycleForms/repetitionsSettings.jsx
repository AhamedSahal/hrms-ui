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
});

export default class RepetitionsSettings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            active: this.props.formData.repetitionValue6?.repetitionSettings.active || false,
            cycleTimePeriod: this.props.formData.repetitionsPeriods || [],
            currentPage: 0,
            rowsPerPage: 4,
            frequency: this.props.formData.repetitionSettings?.frequencyType || '',
            formValue: {
                id: 0,
                frequencyType: this.props.formData.repetitionSettings?.frequencyType || "",
                recurrence: this.props.formData.repetitionSettings?.recurrence || '',

            }
        }
    }
    handleFieldChange = (e) => {
        e.preventDefault();
        const { value } = e.target;
        const { frequency } = this.state
        const startDate = this.props.formData.appraisalCycletime5?.cycleStartDate
        const endDate = this.props.formData.appraisalCycletime5?.cycleEndDate
        const instance = this.props.formData.appraisalCycletime5?.instancename
        const dateStart = new Date(startDate);
        const dateEnd = new Date(endDate)
        if (frequency === "monthly") {
            const result = []
            for (let i = 0; i < value; i++) {
                const nextMonthDate = new Date(dateStart);
                const nextMonthEndDate = new Date(dateEnd);

                nextMonthDate.setMonth(dateEnd.getMonth() + i);
                nextMonthDate.setDate(nextMonthDate.getDate() + 30);
                const formattedDate = nextMonthDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                nextMonthEndDate.setMonth(dateEnd.getMonth() + i);
                nextMonthEndDate.setDate(nextMonthEndDate.getDate() + 30);
                const formattedEndDate = nextMonthEndDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                result.push({ startDate: formattedDate, endDate: formattedEndDate, instanceName: instance });
            }
            this.setState({ cycleTimePeriod: result })
        } else if (frequency === "quarterly") {
            const result = []
            for (let i = 0; i < value; i++) {
                const nextMonthDate = new Date(dateStart);
                const nextMonthEndDate = new Date(dateEnd);

                nextMonthDate.setMonth(dateStart.getMonth() + i * 3);
                nextMonthDate.setDate(nextMonthDate.getDate() + 90);
                const formattedDate = nextMonthDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
                nextMonthEndDate.setMonth(dateEnd.getMonth() + i * 3);
                nextMonthEndDate.setDate(nextMonthEndDate.getDate() + 90);
                const formattedEndDate = nextMonthEndDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                result.push({ startDate: formattedDate, endDate: formattedEndDate, instanceName: instance });

            }
            this.setState({ cycleTimePeriod: result })
        } else if (frequency === "semiannually") {
            const result = []
            for (let i = 0; i < value; i++) {
                const nextMonthDate = new Date(dateStart);
                const nextMonthEndDate = new Date(dateEnd);

                nextMonthDate.setMonth(dateStart.getMonth() + i * 6);
                nextMonthDate.setDate(nextMonthDate.getDate() + 180);
                const formattedDate = nextMonthDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
                nextMonthEndDate.setMonth(dateEnd.getMonth() + i * 6);
                nextMonthEndDate.setDate(nextMonthEndDate.getDate() + 180);
                const formattedEndDate = nextMonthEndDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                result.push({ startDate: formattedDate, endDate: formattedEndDate, instanceName: instance });
            }
            this.setState({ cycleTimePeriod: result })
        } else if (frequency === "annually") {
            const result = []
            for (let i = 0; i < value; i++) {
                const nextMonthDate = new Date(dateStart);
                const nextMonthEndDate = new Date(dateEnd);

                nextMonthDate.setMonth(dateStart.getMonth() + i * 12);
                nextMonthDate.setDate(nextMonthDate.getDate() + 365);
                const formattedDate = nextMonthDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
                nextMonthEndDate.setMonth(dateEnd.getMonth() + i * 6);
                nextMonthEndDate.setDate(nextMonthEndDate.getDate() + 365);
                const formattedEndDate = nextMonthEndDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });

                result.push({ startDate: formattedDate, endDate: formattedEndDate, instanceName: instance });

            }
            this.setState({ cycleTimePeriod: result })
        }
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
            repetitionPeriods: this.state.cycleTimePeriod,
            repetitionSettings: data
        }
        this.props.handleFormData({ repetitionValue6: repetitionSettings })
        action.setSubmitting(true);
        savePerformanceCycle(this.props.formData).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
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
    render() {
        const { cycleTimePeriod } = this.state;
        const { currentPage, rowsPerPage } = this.state;
        const startIndex = currentPage * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const currentRows = cycleTimePeriod.slice(startIndex, endIndex);

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
                                            onChange={e => {
                                                this.handleFrequency(e);
                                                setFieldValue('frequencyType', e.target.value);
                                            }}
                                        >
                                            <option value="">Select Frequency</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                            <option value="semiannually">Semiannually</option>
                                            <option value="annually">Annually</option>
                                        </select>
                                        <ErrorMessage name="frequencyType">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </div>

                                    <FormGroup className="col-md-4">
                                        <label>Recurrences
                                            <span style={{ color: "red" }}>*</span>

                                        </label>
                                        <Field disabled={!this.state.frequency} name="recurrence" type="number" className="form-control"
                                            onChange={e => {
                                                this.handleFieldChange(e);
                                                setFieldValue('recurrence', e.target.value);
                                            }} ></Field>
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
                                                    <td className='p-0 text-start border-0'>{item.instanceName}({index})</td>
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
