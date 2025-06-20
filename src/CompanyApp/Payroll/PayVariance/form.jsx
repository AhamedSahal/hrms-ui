import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { savePayVariance } from './service';
import { PayVarianceSchema } from './validation';
import { DatePicker } from 'antd';
import moment from 'moment';

export default class PayVarianceForm extends Component {
    constructor(props) {
        super(props)
        let payVariance = props.payVariance;

        try {
            payVariance.fromDate = payVariance.fromDate ? payVariance.fromDate.substr(0, 7) : moment().startOf('month').format('YYYY-MM');
            payVariance.toDate = payVariance.toDate ? payVariance.toDate.substr(0, 7) : moment().startOf('month').format('YYYY-MM');
        } catch (error) {
            console.error(error);
        }

        this.state = {
            payVariance: payVariance || {
                id: 0,
                employeeId: props.employeeId,
                fixDuration: false,
                amount: '',
            },
            amount: payVariance.amount ? payVariance.amount : '',
            installmentDetails: [],
        }
    }

    componentDidMount() {
        this.calculateInstallments()
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.payVariance && nextProps.payVariance != prevState.payVariance) {
            let payVariance = nextProps.payVariance;
            try {
                payVariance.fromDate = payVariance.fromDate ? payVariance.fromDate.substr(0, 7) : "";
                payVariance.toDate = payVariance.toDate ? payVariance.toDate.substr(0, 7) : "";
            } catch (error) {
                console.error(error);
            }
            return ({ payVariance })
        } else if (!nextProps.payVariance) {
            return ({
                payVariance: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                }
            })
        }

        return null;
    }

    handleDateChange = (date) => {
        const firstDayOfMonth = moment(date).startOf('month');
        const formattedFirstDay = firstDayOfMonth.format('YYYY-MM-DD');
        this.setState(
            (prevState) => ({
                payVariance: {
                    ...prevState.payVariance,
                    fromDate: formattedFirstDay,
                },
            }), () => {
                this.calculateInstallments();
            }
        );
    };

    handleToDateChange = (date) => {
        const toDate = moment(date).endOf('month').format('YYYY-MM-DD');
        if (toDate < this.state.payVariance.fromDate) {
            toast.error("End Month should be greater then Start Month ");
        }
        const updatedPayVariance = { ...this.state.payVariance, toDate };

        this.setState({ payVariance: updatedPayVariance }, () => {
            this.calculateInstallments();
        });
    };

    save = (data, action) => {
        if (data.toDate < data.fromDate) {
            return toast.error("End Month should be greater then Start Month");
        }
        if (!data.fixDuration) {
            const currentMonthStart = moment().startOf('month').format('YYYY-MM-DD');
            const currentMonthEnd = moment().endOf('month').format('YYYY-MM-DD');

            data.fromDate = new Date(`${currentMonthStart} GMT`);
            data.toDate = new Date(`${currentMonthEnd} GMT`);
        }
        else {
            data["fromDate"] = new Date(`${data["fromDate"]} GMT`);
            data["toDate"] = new Date(`${data["toDate"]} GMT`);
        }
        action.setSubmitting(true);
        savePayVariance(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.error(err);
            toast.error("Error while saving pay variance");
            action.setSubmitting(false);
        })
    }

    calculateInstallments = () => {
        const { payVariance } = this.state;
        const { fromDate, toDate, amount } = payVariance;

        const startDate = moment(fromDate);
        const endDate = moment(toDate);
        const totalMonths = endDate.diff(startDate, 'months') + 1;

        const installmentAmount = parseFloat(amount) / totalMonths;
        const installmentDetails = [];

        for (let i = 0; i < totalMonths; i++) {
            const currentMonth = startDate.clone().add(i, 'months');
            const monthYear = currentMonth.format('MMMM YYYY');

            installmentDetails.push({
                installmentNumber: i + 1,
                monthYear: monthYear,
                amount: installmentAmount.toFixed(2),
            });
        }

        this.setState({ installmentDetails });
    };

    render() {
        const { payVariance, installmentDetails } = this.state;
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.payVariance}
                    onSubmit={this.save}
                // validationSchema={PayVarianceSchema}
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
                        <Form>
                            <FormGroup>
                                <label>Title
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="title" required className="form-control"></Field>
                                <ErrorMessage name="title">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Total Amount
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="amount" required className="form-control"
                                    onChange={(e) => {
                                        let { payVariance } = this.state;
                                        payVariance.amount = e.target.value;
                                        setFieldValue("amount", e.target.value);
                                        this.setState({ payVariance });
                                        this.calculateInstallments();
                                    }}
                                />
                                <ErrorMessage name="amount">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <div type="fixDuration" name="active" onClick={e => {
                                    let { payVariance } = this.state;
                                    payVariance.fixDuration = !payVariance.fixDuration;
                                    setFieldValue("fixDuration", payVariance.fixDuration);
                                    this.setState({
                                        payVariance
                                    });
                                }} >
                                    <label>Apply Duration</label><br />
                                    <i className={`fa fa-2x ${this.state.payVariance && this.state.payVariance.fixDuration ? 'fa-toggle-on text-success' : 'fa fa-toggle-off text-danger'}`}></i>
                                </div>
                            </FormGroup>
                            <div className="row">
                                {this.state.payVariance.fixDuration && <>
                                    <div className="pl-0 col-md-6">
                                        <div className="form-group col-md-10">
                                            <label>Start Month
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field
                                                name="date"
                                                type="month"
                                                className="form-control"
                                                onChange={(date) => {
                                                    this.handleDateChange(date);
                                                    const startDate = moment(date).startOf('month').format('YYYY-MM-DD');
                                                    let { payVariance } = this.state;
                                                    payVariance.fromDate = startDate;
                                                    setFieldValue("fromDate", startDate);
                                                    this.setState({ payVariance });
                                                }}
                                                defaultValue={payVariance?.fromDate}

                                            />
                                        </div>
                                    </div>
                                    <div className="pl-0 col-md-6">
                                        <div className="form-group col-md-10">
                                            <label>End Month
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field
                                                name="date"
                                                type="month"
                                                className="form-control"
                                                onChange={(date) => {
                                                    this.handleToDateChange(date);
                                                    const toDate = moment(date).endOf('month').format('YYYY-MM-DD');
                                                    let { payVariance } = this.state;
                                                    payVariance.toDate = toDate;

                                                    setFieldValue("toDate", toDate);
                                                    this.setState({ payVariance });
                                                }}
                                                defaultValue={payVariance?.toDate}

                                            />

                                        </div>
                                    </div>
                                </>}
                            </div>
                            <FormGroup>
                                <label>Description
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="description" required className="form-control" component="textarea" rows="4"></Field>
                                <ErrorMessage name="description">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            {payVariance.fixDuration && payVariance.fromDate && payVariance.toDate && (
                                <div className="col-md-12">
                                    <div className="expireDocs-table">
                                        <table className="table">
                                            <thead>
                                                <tr style={{ borderBottom: "none", background: '#c4c4c4' }}>
                                                    <th style={{ fontWeight: "600" }}>Installment</th>
                                                    <th style={{ fontWeight: "600" }}>Month & Year</th>
                                                    <th style={{ fontWeight: "600" }}>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {installmentDetails.map((installment, index) => (
                                                    <tr key={index}>
                                                        <td>{installment.installmentNumber}</td>
                                                        <td>{installment.monthYear}</td>
                                                        <td>{installment.amount}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            <input type="submit" className="btn btn-primary" value={this.state.payVariance.id > 0 ? "Update" : "Save"} />

                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}
