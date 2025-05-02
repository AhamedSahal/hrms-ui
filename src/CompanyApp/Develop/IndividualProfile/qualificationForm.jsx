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
      countryid: 0,
      stateid: 0,
      qualificationProfile: props.formData || {
        id: 1,
        degree: '',
        major: '',
        dateAcquired: '',
        country: '',
        state: '',
        city: '',
        attachment: '',
        school: '',
        schoolName: ''
      },
    };
  }



  handleSubmit = (values, action) => {
    const qualificationData = {
      school: values.school,
      schoolName: values.schoolName,
      attachment: values.attachment,
      city: values.city,
      country: values.country,
      dateAcquired: values.dateAcquired,
      degree: values.degree,
      id: 1,
      major: values.major,
      state: values.state,
      employeeId: this.props.employeeId

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

  handleCountryChange = (e) => {
    this.setState({ countryid: e.id });
    this.formikProps.setFieldValue('country', e.name)
  };

  handleStateChange = (e) => {
    this.setState({ stateid: e.id });
    this.formikProps.setFieldValue('state', e.name)
  };

  handleCityChange = (e) => {
    this.formikProps.setFieldValue('city', e.name)
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
            {record.field === 'Major' && <span style={{ color: "red" }}>*</span>}
            {record.field === 'Date Acquired' && <span style={{ color: "red" }}>*</span>}
          </>
        ),
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value",
        width: '25em',
        render: (text, record, index) => {
          if (record.field === "Date Acquired") {
            return (
              <>
                <Field name='dateAcquired' className="form-control" type="date" ></Field>
                <ErrorMessage name={'dateAcquired'}>
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
              </>
            );
          }
          if (record.field === "Country") {
            return (
              <CountrySelect
                className='form-control '
                onChange={this.handleCountryChange}
                placeHolder="Select Country"
              />
            );
          }
          if (record.field === "State") {
            return (
              <StateSelect
                className='form-control '
                countryid={countryid}
                onChange={this.handleStateChange}
                placeHolder="Select State"
              />
            );
          }
          if (record.field === "City") {
            return (
              <CitySelect
                className='form-control'
                countryid={countryid}
                stateid={stateid}
                onChange={this.handleCityChange}
                placeHolder="Select City"
              />
            );
          }
          if (record.field === "Add Attachment") {
            return (
              <input name="file" type="file"  className="form-control" onChange={e => {
                this.formikProps.setFieldValue('attachment', e.target.files[0])
            }} />
            );
          }
          if (record.field === "Major") {
            return (
              <>
                <Field onChange={(e) =>
                  this.formikProps.setFieldValue('major', e.target.value)
                } name="major" className="form-control" />
                <ErrorMessage name='major'>
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
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
                  <option value="High School">High School</option>
                  <option value="High Diploma">High Diploma</option>
                </select>
                <ErrorMessage name='degree'>
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
              </>
            );
          }

          if (record.field === "School") {
            return (
              <>
                <Field onChange={(e) =>
                  this.formikProps.setFieldValue('school', e.target.value)
                } name="school" className="form-control" />
              </>
            );
          }
          if (record.field === "School Name") {
            return (
              <>
                <Field onChange={(e) =>
                  this.formikProps.setFieldValue('schoolName', e.target.value)
                } name="schoolName" className="form-control" />
              </>
            );
          }
        },
      },
    ];

    const data = [
      { id: 1, field: 'Degree' },
      { id: 2, field: 'Major' },
      { id: 3, field: 'School' },
      { id: 4, field: 'School Name' },
      { id: 5, field: 'Date Acquired' },
      { id: 6, field: 'Country' },
      { id: 7, field: 'State' },
      { id: 8, field: 'City' },
      { id: 9, field: 'Add Attachment' },
    ];
    const validationSchema = Yup.object().shape({
      degree: Yup.string().required('Degree is required'),
      major: Yup.string().required('Major is required'),
      dateAcquired: Yup.date().required('Date Acquired is required'),

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