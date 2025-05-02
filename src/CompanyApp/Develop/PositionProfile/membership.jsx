import React, { Component } from 'react';
import { Table, Input, Button, Select } from 'antd';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { saveMembership } from './service';
import { toast } from 'react-toastify';


export default class Membership extends Component {
    constructor(props) {
        super(props);

        this.state = {
            membership: props.formData || {
                id: 1,
                affiliantion: '',
            },
        };
    }



    handleSubmit = (values, action) => {
        const membership = {
            communityName: values.communityName,
            affiliantion: values.affiliantion,
            id: 1,
            empJobtitleId: this.props.empJobtitle,
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
            { snum: 2, field: 'Community Name', },

        ];

        const validationSchema = Yup.object().shape({
            affiliantion: Yup.string().required('Affiliation or Professional Body is required'),

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
