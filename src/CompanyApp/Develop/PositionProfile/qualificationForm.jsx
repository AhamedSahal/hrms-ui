import React, { Component } from 'react';
import { Table, Input, Button, Select } from 'antd';
import { ErrorMessage, Field, Formik } from 'formik';
import * as Yup from 'yup';
import { CitySelect, CountrySelect, StateSelect } from "@davzon/react-country-state-city";
import "@davzon/react-country-state-city/dist/react-country-state-city.css";
import { saveQualificationFrom } from './service';
import { toast } from 'react-toastify';

export default class QualificationForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      qualificationProfile:  props.formData || {
        id: 1,
        degree: '',
        major: '',
      },
    };
  }



  handleSubmit = (values, action) => {
    const qualificationData = {
      degree: values.degree,
      id: 1,
      major: values.major,
      empJobtitleId: this.props.empJobtitle

    }
    saveQualificationFrom(qualificationData).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }

    }).catch(err => {
      toast.error("Error while saving Qualification form");
      action.setSubmitting(false);
    })
  };



  render() {
    const { countryid, stateid } = this.state;
    const columns = [
      {
        title: 'Sr.N',
        dataIndex: 'id',
        key: 'id',
        className: 'text-center',
      },
      {
        title: 'Field',
        dataIndex: 'field',
        key: 'field',
        width: '25em',
        render: (text, record) => (
          <>
            {record.field} {record.field === 'Degree' && <span style={{ color: "red" }}>*</span>}

          </>
        ),
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value",
        width: '25em',
        render: (text, record, index) => {

          if (record.field === "Major") {
            return (
              <>
                <Field onChange={(e) =>
                  this.formikProps.setFieldValue('major', e.target.value)
                } name="major" className="form-control" />
              </>
            );
          }
          if (record.field === "Degree") {
            return (
              <>
                <select
                  data-toggle="dropdown"
                  className='form-control'
                  onChange={(e) =>
                    this.formikProps.setFieldValue('degree', e.target.value)
                  }
                  name='degree'
                >
                  <option value="PHD">PHD</option>
                  <option value="Masters">Masters</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Diploma">Diploma</option>
                  <option value="High Diploma">High Diploma</option>
                  <option value="High School">High School</option>
                </select>
                <ErrorMessage name='degree'>
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
              </>
            );
          }
        },
      },
    ];

    const data = [
      { id: 1, field: 'Degree' },
      { id: 2, field: 'Major' },
    ];
    const validationSchema = Yup.object().shape({
      degree: Yup.string().required('Degree is required'),

    });

    return (
      <Formik
        initialValues={this.state.qualificationProfile}
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
                pagination={false}
                rowKey={(record) => record.id}
              />
              <input type="submit" className="mt-3 m-3 float-right btn btn-primary" value={'Save'} />
              <input onClick={() => this.props.onClose('qualificationForm')} style={{ width: '73px' }} className="mt-3 m-3 float-right btn btn-primary" value={'Cancel'} />
            </form>
          );
        }}
      </Formik>
    );
  }
}