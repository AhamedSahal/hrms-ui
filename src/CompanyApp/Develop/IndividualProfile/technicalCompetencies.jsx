import React, { Component } from 'react';
import { Table, Input, Button, Select } from 'antd';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { saveTechnicalCompetencies } from './service';


export default class TechnicalCompetencies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            technicalCompetencies: props.formData || {
                id: 1,
                competencies: '',
                proficiencyLevel: '',
                proficiencyRating: '',
                evaluationComment: '',
            },
        };
    }

    handleSubmit = (values, action) => {
        const technicalData = {
            evaluationComment: values.evaluationComment,
            competencies: values.competencies,
            proficiencyLevel: values.proficiencyLevel,
            proficiencyRating: values.proficiencyRating,
            id: 1,
            employeeId: this.props.employeeId
        }
        saveTechnicalCompetencies(technicalData).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }

        }).catch(err => {
            toast.error("Error while saving Technical Competencies form");
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
                                    onChange={(e) => this.formikProps.setFieldValue('competencies', e.target.value)}
                                >
                                    <option value="Business awareness">Business awareness</option>
                                    <option value="Communication">Communication</option>
                                    <option value="Self confidence">Self confidence</option>
                                    <option value="Customer orientation">Customer orientation</option>
                                    <option value="Personal Motivation">Personal Motivation</option>
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
                    if (record.field === "Proficiency Rating") {
                        return (
                            <select name='proficiencyRating' data-toggle="dropdown" className='form-control '
                                onChange={(e) => this.formikProps.setFieldValue('proficiencyRating', e.target.value)}
                            >
                                <option value="1 point scale">1 point scale</option>
                                <option value="2 point scale">2 point scale</option>
                                <option value="3 point scale">3 point scale</option>
                                <option value="4 point scale">4 point scale</option>
                                <option value="5 point scale">5 point scale</option>
                            </select>
                        );
                    }
                    if (record.field === "Evaluation Comment") {
                        return (
                            <Field onChange={(e) => this.formikProps.setFieldValue('evaluationComment', e.target.value)
                            } name="evaluationComment" className="form-control" ></Field>
                        );
                    }

                },
            },
        ];

        const data = [
            { snum: 1, field: 'Competency', },
            { snum: 3, field: 'Proficiency Level', },
            { snum: 2, field: 'Proficiency Rating', },
            { snum: 4, field: 'Evaluation Comment', },

        ];
        const validationSchema = Yup.object().shape({
            competencies: Yup.string().required('Competencies is required'),
        });

        return (
            <Formik
                initialValues={this.state.technicalCompetencies}
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
                            <input onClick={() => this.props.onClose('technicalForm')} style={{ width: '73px' }} className="mt-3 m-3 float-right btn btn-primary" value={'Cancel'} />
                        </form>
                    )
                }
                }
            </Formik >
        );
    }
}
