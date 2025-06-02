import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveHoliday } from './service';
import { getBranchInformation } from '../Branch/service';
import { HolidaySchema } from './validation';
import { toDateWithGMT } from '../../../utility';

export default class HolidayForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            locationId: props.locationId || 0,
            locationName: props.locationName || "",
            holiday: props.holiday || {
                id: 0,
                occasion: "",
                date: "",
                branchId: props.locationId,

            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.holiday && nextProps.holiday != prevState.holiday) {
            return ({ holiday: nextProps.holiday })
        } else if (!nextProps.holiday) {

            return prevState.holiday || ({
                holiday: {
                    id: 0,
                    occasion: "",
                    date: "",
                    branchId: prevState.locationId,
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        console.log("holidayyy: ", data.date)
        data.date = toDateWithGMT(data.date);
        action.setSubmitting(true);
        saveHoliday(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving holiday");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.holiday}
                    onSubmit={this.save}
                    validationSchema={HolidaySchema}
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
                        <Form autoComplete='off'>
                            <FormGroup>
                                <label>Location</label>
                                <p>
                                    <span style={{ fontWeight: 'bold' }}>{this.state.locationName}</span></p>
                            </FormGroup>
                            <FormGroup>
                                <label>Date
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="date" className="form-control" type="date"></Field>
                                <ErrorMessage name="date">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Occasion
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="occasion" className="form-control"></Field>
                                <ErrorMessage name="occasion">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <input type="submit" className="btn btn-primary" value={this.state.holiday.id > 0 ? "Update" : "Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
