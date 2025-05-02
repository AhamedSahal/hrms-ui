import React, { Component } from 'react';
import { Table, Input, Button, Select } from 'antd';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { saveMembership } from './service';


export default class Membership extends Component {
    constructor(props) {
        super(props);

        this.state = {
            membership: props.formData || {
                id: 1,
                affiliantion: '',
                membershipStartDate: '',
                membershipEndDate: '',
                membershipNumber: '',
                communityName:''
            },
        };
    }


    handleSubmit = (values, action) => {
        const membership = {
            membershipNumber: values.membershipNumber,
            communityName: values.communityName,
            affiliantion: values.affiliantion,
            membershipEndDate: values.membershipEndDate,
            membershipStartDate: values.membershipStartDate,
            id: 1,
            employeeId: this.props.employeeId,
        }
        saveMembership(membership).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            toast.error("Error while saving Membership form");
            action.setSubmitting(false);
        })
    };

    render() {
        const { values, setFieldValue } = this.props;

        const columns = [
            {
                title: 'Sr.N',
                dataIndex: 'snum',

                key: 'snum',
            },
            {
                title: 'Field',
                dataIndex: 'field',
                width: '25em',
                key: 'field',
                render: (text, record) => (
                    <>

                        {record.field} {record.field === 'Affiliation or Professional Body' && <span style={{ color: "red" }}>*</span>}
                        {record.field === 'Membership Start Date' && <span style={{ color: "red" }}>*</span>}
                    </>
                ),
            },
            {
                title: "Value",
                dataIndex: "value",
                key: "value",
                width: '25em',
                render: (text, record, index) => {
                    if (record.field === "Membership Start Date") {
                        return (
                            <>
                                <Field name='membershipStartDate' className="form-control" type="date" ></Field>
                                <ErrorMessage name='membershipStartDate'>
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </>
                        )
                    }
                    if (record.field === "Membership End Date") {
                        return (
                            <>
                                <Field name='membershipEndDate' className="form-control" type="date" ></Field>

                            </>
                        )
                    }
                    if (record.field === "Affiliation or Professional Body") {
                        return (
                            <>
                                <Field name='affiliantion' className="form-control"  ></Field>
                                <ErrorMessage name='affiliantion'>
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </>
                        )
                    }
                    if (record.field === "Membership Number") {
                        return (
                            <>
                                <Field name='membershipNumber' className="form-control"  ></Field>
                            </>
                        )
                    }
                    if (record.field === "Community Name") {
                        return (
                            <>
                                <Field name='communityName' className="form-control"  ></Field>
                            </>
                        )
                    }
                   
                },
            },
        ];

        const data = [
            { snum: 1, field: 'Affiliation or Professional Body', },
            { snum: 2, field: 'Membership Start Date', },
            { snum: 3, field: 'Membership End Date', },
            { snum: 4, field: 'Membership Number', },
            { snum: 5, field: 'Community Name', },

        ];

        const validationSchema = Yup.object().shape({
            affiliantion: Yup.string().required('Affiliation or Professional Body is required'),
            membershipStartDate: Yup.date().required('Membership Start Date is required'),

        });
        return (
            <Formik
                initialValues={this.state.membership}
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
                                bordered
                                pagination={false}
                                rowKey={(record) => record.snum}
                            />
                            <input type="submit" className="mt-3 m-3 float-right btn btn-primary" value={'Save'} />
                            <input onClick={() => this.props.onClose('membershipForm')} style={{ width: '73px' }} className="mt-3 m-3 float-right btn btn-primary" value={'Cancel'} />
                        </form>
                    )
                }}
            </Formik>
        );
    }
}
