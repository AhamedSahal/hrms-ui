import React, { Component } from 'react';
import { Table, Input, Button, Select } from 'antd';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { saveTrainingCourse } from './service';
import { toast } from 'react-toastify';


export default class TrainingCourse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            countryid: 0,
            stateid: 0,
            trainingProfile: props.formData || {
                id: 1,
                license: '',
                issueDate: '',
                courseName: '',
                attachment: '',
                issuedby: '',
                deliveryMode: '',
                trainingHours: ''


            },
        };
    }

    handleFieldChange = (fieldName, value) => {
        this.setState((prevState) => ({
            trainingProfile: {
                ...prevState.trainingProfile,
                [fieldName]: value,
            },
        }));
    };
    handleSubmit = (values, action) => {
        const trainingData = {
            deliveryMode: values.deliveryMode,
            issuedby: values.issuedby,
            trainingHours: values.trainingHours,
            attachment: values.attachment,
            courseName: values.courseName,
            issueDate: values.issueDate,
            license: values.license,
            id: 1,
            employeeId: this.props.employeeId
        }
        saveTrainingCourse(trainingData).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            toast.error("Error while saving Training Course form");
            action.setSubmitting(false);
        })
    };
    render() {

        const columns = [
            {
                title: 'Sr.N',
                dataIndex: 'id',
                key: 'id',
                className: 'text-center'
            },
            {
                title: 'Field',
                dataIndex: 'field',
                key: 'field',
                width: '25em',
                render: (text, record) => (
                    <>

                        {record.field} {record.field === 'License/Certificate' && <span style={{ color: "red" }}>*</span>}
                        {record.field === 'Course Name' && <span style={{ color: "red" }}>*</span>}
                    </>
                ),
            },
            {
                title: "Value",
                dataIndex: "value",
                key: "value",
                width: '25em',
                render: (text, record, index) => {
                    if (record.field === "Issue Date") {
                        return (
                            <Field name={'issueDate'} className="form-control" type="date" ></Field>
                        )
                    }
                    if (record.field === "Add Attachment") {
                        return (
                            <input name="attachment" type="file" required className="form-control" onChange={e => {
                                this.formikProps.setFieldValue('attachment', e.target.files[0])
                            }} />
                        )
                    }
                    if (record.field === "License/Certificate") {
                        return (
                            <>
                                <Field onChange={(e) =>
                                    this.formikProps.setFieldValue('license', e.target.value)
                                } name="license" className="form-control" ></Field>
                                <ErrorMessage name='license'>
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </>
                        )
                    }
                    if (record.field === "Course Name") {
                        return (
                            <>
                                <Field onChange={(e) => this.formikProps.setFieldValue('courseName', e.target.value)
                                } name="courseName" className="form-control" ></Field>
                                <ErrorMessage name='courseName'>
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </>
                        )
                    }
                    if (record.field === "Number of Training Hours") {
                        return (
                            <>
                                <Field onChange={(e) => this.formikProps.setFieldValue('trainingHours', e.target.value)
                                } name="trainingHours" className="form-control" ></Field>
                            </>
                        )
                    }
                    if (record.field === "Delivery Mode") {
                        return (
                            <>
                                <Field onChange={(e) => this.formikProps.setFieldValue('deliveryMode', e.target.value)
                                } name="deliveryMode" className="form-control" ></Field>
                            </>
                        )
                    }
                    if (record.field === "Issue by") {
                        return (
                            <>
                                <Field onChange={(e) => this.formikProps.setFieldValue('issuedby', e.target.value)
                                } name="issuedby" className="form-control" ></Field>
                            </>
                        )
                    }

                },
            },
        ];

        const data = [
            { id: 1, field: 'License/Certificate', },
            { id: 2, field: 'Issue Date', },
            { id: 3, field: 'Issue by', },
            { id: 4, field: 'Course Name', },
            { id: 5, field: 'Number of Training Hours', },
            { id: 6, field: 'Delivery Mode', },
            { id: 7, field: 'Add Attachment', },
        ];

        const validationSchema = Yup.object().shape({
            license: Yup.string().required('License/Certificate is required'),
            courseName: Yup.string().required('Course Name is required'),

        });

        return (
            <Formik
                initialValues={this.state.trainingProfile}
                onSubmit={this.handleSubmit}
                validationSchema={validationSchema}
            >
                {(formikProps) => {
                    this.formikProps = formikProps;
                    return (
                        <form onSubmit={formikProps.handleSubmit}>
                            <Table id='Table-style' className="table-striped"
                                dataSource={data}
                                columns={columns}
                                bordered
                                pagination={false}
                                rowKey={(record) => record.id}
                            />
                            <input type="submit" className="mt-3 m-3 float-right btn btn-primary" value={'Save'} />
                            <input onClick={() => this.props.onClose('trainingForm')} style={{ width: '73px' }} className="mt-3 m-3 float-right btn btn-primary" value={'Cancel'} />
                        </form>
                    )
                }}
            </Formik>
        );
    }
}
