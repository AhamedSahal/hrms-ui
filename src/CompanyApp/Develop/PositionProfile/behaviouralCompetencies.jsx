import React, { Component } from 'react';
import { Table, Input, Button, Select } from 'antd';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { saveBehaviouralCompetencies } from './service';
import { toast } from 'react-toastify';


export default class BehaviouralCompetencies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            behaviouralCompetencies: props.formData || {
                id: 1,
                competencies: '',
                proficiencyLevel: '',
            },
        };
    }

    handleSubmit = (values, action) => {
        const BehaviouralData = {
            competencies: values.competencies,
            proficiencyLevel : values.proficiencyLevel,
            id: 1,
            empJobtitleId: this.props.empJobtitle

        }
        saveBehaviouralCompetencies(BehaviouralData).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            toast.error("Error while saving Behavioural Competencies form");
            action.setSubmitting(false);
        })
    };
    
    render() {

        const columns = [
            {
                title: 'Sr.N',
                dataIndex: 'snum',
                key: 'snum',
                className: 'text-center'
            },
            {
                title: 'Field',
                dataIndex: 'field',
                key: 'field',
                width: '25em',
                render: (text, record) => (
                    <>
                        {record.field} {record.field === 'Competency' && <span style={{ color: "red" }}>*</span>}
                    </>
                ),
            },
            {
                title: "Value",
                dataIndex: "value",
                key: "value",
                width: '25em',
                render: (text, record, index) => {
                    if (record.field === "Competency") {

                        return (
                            <>
                                <select name='competencies' data-toggle="dropdown" className='form-control '
                                    onChange={(e) =>
                                        this.formikProps.setFieldValue('competencies', e.target.value)
                                    }
                                >
                                    <option value="Team Work">Team Work</option>
                                    <option value="Organization">Organization</option>
                                    <option value="Social skills">Social skills</option>
                                    <option value="Decision-making">Decision-making</option>
                                    <option value="Time management">Time management</option>

                                </select>
                                <ErrorMessage name='competencies'>
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </>
                        );
                    }
                    if (record.field === "Proficiency Level") {
                        return (
                            <select name='proficiencyLevel' data-toggle="dropdown" className='form-control '
                                onChange={(e) => this.formikProps.setFieldValue('proficiencyLevel', e.target.value)}
                            >
                                <option value="Aware">Aware</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Role Model">Role Model</option>

                            </select>
                        );
                    }

                },
            },
        ];

        const data = [
            { snum: 1, field: 'Competency', },
            { snum: 2, field: 'Proficiency Level', },

        ];

        const validationSchema = Yup.object().shape({
            competencies: Yup.string().required('Competencies is required'),

        });

        return (
            <Formik
                initialValues={this.state.behaviouralCompetencies}
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
                                rowKey={(record) => record.id}
                            />
                            <input type="submit" className="mt-3 m-3 float-right btn btn-primary" value={'Save'} />
                            <input onClick={() => this.props.onClose('behaviouralForm')} style={{width: '73px'}}  className="mt-3 m-3 float-right btn btn-primary" value={'Cancel'} />
                        </form>
                    )
                }}
            </Formik>
        );
    }
}
