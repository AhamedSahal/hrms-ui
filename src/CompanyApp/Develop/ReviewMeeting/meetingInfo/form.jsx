
import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FormGroup, Label } from 'reactstrap';
import { meetingInfoValidation } from './validation';
import { getSuccessionPlanList } from './service';

const datas =
    [
        {
            id: 0, planName: 'Marketing Director',
            candidates: [{ name: 'Danial George', id: 21 }, { name: "Richard Mike", id: 21 }, { name: "Jason Roy", id: 21 }],
            planType: { id: 1, name: 'Position' },
            date: '20-10-2024', members: '5', status: 'Active',
            description: 'Define the key people in finance organization',
            isPlan: true
        },
        {
            id: 1, planName: 'Financial Manager',
            planType: { id: 1, name: 'Position' },
            candidates: [{ name: 'Danial George', id: 21 }, { name: "Richard Mike", id: 21 }, { name: "Jason Roy", id: 21 }],
            date: '20-10-2024', members: '5', status: 'Active',
            description: 'Define the key people in finance organization',
            isPlan: true
        },

    ]

export default class ReviewMeetingInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: datas,
            reviewMeetingInfo: this.props.formData || {
                id: 0,
                title: '',
                submissionDate: '',
                location: '',
                topic: '',
                description: '',
                successionId: '',
                status: ''
            }
        };
    }

    // componentDidMount() {
    //     this.fetchList();
    //   }
    //   fetchList = () => {
    //     getSuccessionPlanList().then(res => {
    //       if (res.status == "OK") {
    //         this.setState({
    //           data: res.data,
    //         })
    //       }
    //     })
    //   }

    save = (data, action) => {
        this.props.handleFormData(data)
        this.props.nextStep()
    }

    render() {
        const { data } = this.state
        return (
            <>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.reviewMeetingInfo}
                    onSubmit={this.save}
                    validationSchema={meetingInfoValidation}
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
                        <Form >
                            <div className='row'>
                                <FormGroup className='col-md-6'>
                                    <label>Meeting Title
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field onChange={(e) => {
                                        setFieldValue("title", e.target.value);
                                    }} name="title" className="form-control"></Field>
                                    <ErrorMessage name="title">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='col-md-6'>
                                    <label>Select Succession Plan
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <select name='successionId' onChange={(e) => {
                                        setFieldValue("successionId", e.target.value);
                                    }} className="form-control" >
                                        <option value="">Select a Succession plan</option>
                                        {data.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.planName}
                                            </option>
                                        ))}
                                    </select>
                                    <ErrorMessage name="successionId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='col-md-6'>
                                    <label>Location
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="location" className="form-control"></Field>
                                    <ErrorMessage name="location">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='col-md-6'>
                                    <label>Agenda/Topic
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="topic" className="form-control"></Field>
                                    <ErrorMessage name="topic">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='col-md-6'>
                                    <label>Submission Date
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field type='date' name="submissionDate" className="form-control"></Field>
                                    <ErrorMessage name="submissionDate">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                <FormGroup className='col-md-6'>
                                    <label>Meeting Status
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <select name='status' onChange={(e) => {
                                        setFieldValue("status", e.target.value)
                                    }}
                                        className="form-control" >
                                        <option value="">Select status</option>
                                        <option value="1">Not-Started</option>
                                        <option value="2">In-Progress</option>
                                        <option value="3">Canceled</option>

                                    </select>
                                </FormGroup>
                                <FormGroup>
                                    <label>Description</label>

                                    <Field name="description"
                                        component="textarea" rows="4"
                                        className="form-control"
                                        placeholder="Description"
                                    >
                                    </Field>
                                </FormGroup>

                            </div>
                            <input type="submit" className="float-right mt-2 mb-3 btn btn-info" value={"Next"} />
                        </Form>
                    )
                    }
                </Formik>

            </>
        );
    }
}
