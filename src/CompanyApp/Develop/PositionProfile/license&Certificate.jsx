import React, { Component } from 'react';
import { Table, Input, Button, Select } from 'antd';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { saveLicenseAndCertificate } from './service';


export default class LicenseAndCertificate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            leadershipCompetencies:  props.formData || {
                id: 1,
                license: '',
                issuedBy: '',
            },
        };
    }

    handleSubmit = (values, action) => {
        const license = {
            issuedBy: values.issuedBy,
            license: values.license ,
            id: 1,
            empJobtitleId: this.props.empJobtitle,
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

                },
            },
        ];

        const data = [
            { snum: 1, field: 'License/Certificate' },
            { snum: 2, field: 'Issued By' },

        ];

        const validationSchema = Yup.object().shape({
            license: Yup.string().required('Organization is required'),
            issuedBy: Yup.string().required('Name is required'),

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
