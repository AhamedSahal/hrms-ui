import React, { Component } from 'react';
import { Table, Input, Button, Select } from 'antd';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { saveLicenseAndCertificate } from './service';
import { toast } from 'react-toastify';


export default class LicenseAndCertificate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            leadershipCompetencies: props.formData || {
                id: 1,
                license: '',
                issuedBy: '',
                issueDate: '',
                renewalDate: '',
                expireDate: '',
                attachment: '',
                certificateNumber: ''
            },
        };
    }


    handleSubmit = (values, action) => {
        const license = {
            certificateNumber: values.certificateNumber,
            expireDate: values.expireDate,
            issueDate: values.issueDate ,
            issuedBy: values.issuedBy,
            license: values.license ,
            attachment: values.attachment,
            id: 1,
            employeeId: this.props.employeeId,
            renewalDate: values.renewalDate
        }
        saveLicenseAndCertificate(license).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            toast.error("Error while saving License and Certificate form");
            action.setSubmitting(false);
        })
    };
    
    render() {

        const columns = [
            {
                title: 'Sr.N',
                dataIndex: 'snum',
                key: 'snum',
            },
            {
                title: 'Field',
                dataIndex: 'field',
                key: 'field',
                width: '25em',
                render: (text, record) => (
                    <>
                        {record.field} {record.field === 'License/Certificate' && <span style={{ color: "red" }}>*</span>}
                        {record.field === 'Issued By' && <span style={{ color: "red" }}>*</span>}
                        {record.field === 'Issue Date' && <span style={{ color: "red" }}>*</span>}
                        {record.field === 'Attachments' && <span style={{ color: "red" }}>*</span>}
                    </>
                ),
            },
            {
                title: "Value",
                dataIndex: "value",
                key: "value",
                width: '25em',
                render: (text, record, index) => {
                    if (record.field === "License/Certificate") {
                        return (
                            <>
                                <Field name="license" className="form-control"  ></Field>
                                <ErrorMessage name='license'>
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </>
                        )
                    }
                    if (record.field === "Issued By") {
                        return (
                            <>
                                <Field name="issuedBy" className="form-control" ></Field>
                                <ErrorMessage name='issuedBy'>
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </>
                        )
                    }
                    if (record.field === "Issue Date") {
                        return (
                            <>
                                <Field name="issueDate" type="date" className="form-control" ></Field>
                                <ErrorMessage name='issueDate'>
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </>
                        )
                    }
                    if (record.field === "Renewal Date") {
                        return (
                            <>
                                <Field name="renewalDate" type="date" className="form-control" ></Field>
                            </>
                        )
                    }
                    if (record.field === "Expiration Date") {
                        return (
                            <>
                                <Field name="expireDate" type="date" className="form-control" ></Field>
                            </>
                        )
                    }
                    if (record.field === "Certificate Number") {
                        return (
                            <>
                                <Field name="certificateNumber" className="form-control" ></Field>
                            </>
                        )
                    }
                    if (record.field === "Attachments") {
                        return (
                            <>
                               <input name="attachment" type="file" required className="form-control" onChange={e => {
                                this.formikProps.setFieldValue('attachment', e.target.files[0])
                            }} />
                            </>
                        )
                    }

                },
            },
        ];

        const data = [
            { snum: 1, field: 'License/Certificate' },
            { snum: 2, field: 'Issued By' },
            { snum: 3, field: 'Certificate Number' },
            { snum: 4, field: 'Issue Date' },
            { snum: 5, field: 'Expiration Date' },
            { snum: 6, field: 'Renewal Date' },
            { snum: 7, field: 'Attachments', }

        ];

        const validationSchema = Yup.object().shape({
            license: Yup.string().required('Organization is required'),
            issuedBy: Yup.string().required('Name is required'),
            attachment: Yup.mixed().required('Attachment is required'),
            issueDate: Yup.date().required('Date Awarded is required'),

        });

        return (
            <Formik
                initialValues={this.state.leadershipCompetencies}
                validationSchema={validationSchema}
                onSubmit={this.handleSubmit}
            >
                {(formikProps) => {
                    this.formikProps = formikProps;
                    return (
                        <form onSubmit={formikProps.handleSubmit}>
                            <Table id='Table-style' className="table-striped"
                                dataSource={data}
                                columns={columns}
                                pagination={false}
                                rowKey={(record) => record.snum}
                            />
                            <input type="submit" className="mt-3 m-3 float-right btn btn-primary" value={'Save'} />
                            <input onClick={() => this.props.onClose('licenseForm')} style={{ width: '73px' }} className="mt-3 m-3 float-right btn btn-primary" value={'Cancel'} />
                        </form>
                    )
                }}
            </Formik>
        );
    }
}
