import React, { Component } from 'react';
import { Table, Input, Button, Select } from 'antd';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { saveHonoursAndAward } from './service';
import { toast } from 'react-toastify';


export default class HonoursAndAward extends Component {
    constructor(props) {
        super(props);

        this.state = {
            honoursAndAward: props.formData || {
                id: 1,
                name: '',
                organization: '',
            },
        };
    }


    handleSubmit = (values, action) => {
        const honours = {
            organization: values.organization,
            name: values.name,
            id: 1,
            empJobtitleId: this.props.empJobtitle
        }
        saveHonoursAndAward(honours).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            toast.error("Error while saving Honours and Awards form");
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
                key: 'field',
                width: '25em',
                render: (text, record) => (
                    <>
                        {record.field} {record.field === 'Name' && <span style={{ color: "red" }}>*</span>}
                        {record.field === 'Date Awarded' && <span style={{ color: "red" }}>*</span>}
                        {record.field === 'Organization' && <span style={{ color: "red" }}>*</span>}
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
                    if (record.field === "Name") {
                        return (
                            <>
                                <Field name="name" className="form-control" ></Field>
                                <ErrorMessage name='name'>
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </>
                        )
                    }
                    if (record.field === "Organization") {
                        return (
                            <>
                                <Field name="organization" className="form-control" ></Field>
                                <ErrorMessage name='organization'>
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </>
                        )
                    }
                },
            },
        ];

        const data = [
            { snum: 1, field: 'Name', },
            { snum: 2, field: 'Organization', },

        ];
        const validationSchema = Yup.object().shape({
            organization: Yup.string().required('Organization is required'),
            name: Yup.string().required('Name is required'),

        });
        return (
            <Formik
                initialValues={this.state.honoursAndAward}
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
                            <input onClick={() => this.props.onClose('honoursForm')} style={{ width: '73px' }} className="mt-3 m-3 float-right btn btn-primary" value={'Cancel'} />
                        </form>
                    )
                }}
            </Formik>
        );
    }
}
