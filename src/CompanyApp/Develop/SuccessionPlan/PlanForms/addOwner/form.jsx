
import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FormGroup, Label } from 'reactstrap';
import EmployeeDropdown from '../../../../ModuleSetup/Dropdown/EmployeeDropdown';
import { ownerFormValidation } from './validation';
import { saveAddOwner } from './service';
import { toast } from 'react-toastify';



export default class AddOwnerForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      owners: props.owners || {
        id: 0,
        employeeId: '',
        ownerType: '',
        active: false
      }
    };
  }


  save = (data, action) => {
    saveAddOwner(data).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      if (res.status == "OK") {
        setTimeout(function () {
          window.location.reload()
        }, 6000)
      }
      action.setSubmitting(false)
    }).catch(err => {
      toast.error("Error while saving Owner");

      action.setSubmitting(false);
    })
  }


  render() {

    return (
      <>

        <Formik
          enableReinitialize={true}
          initialValues={this.state.owners}
          onSubmit={this.save}
          validationSchema={ownerFormValidation}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setSubmitting
            /* and other goodies */
          }) => (
            <Form >
              <div className='row'>
                <FormGroup className='col-md-6'>
                  <label>Select Owner
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field name="employeeId" render={field => {
                    return <EmployeeDropdown defaultValue={values.employee?.id} onChange={e => {
                      setFieldValue("employeeId", e.target.value);
                      setFieldValue("employee", { id: e.target.value });
                    }}></EmployeeDropdown>
                  }}></Field>
                  <ErrorMessage name="employeeId">
                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                  </ErrorMessage>
                </FormGroup>
                <FormGroup className='col-md-6'>
                  <label>Owner Type
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <select onChange={(e) => setFieldValue("ownerType", e.target.value)} defaultValue={values.ownerType} name='ownerType' className='form-control'>
                    <option value="">Select Owner Type</option>
                    <option value="1" >Adminstrator</option>
                    <option value="2" >Candidate Manager</option>
                    <option value="3" >Viewer</option>
                  </select>
                  <ErrorMessage name="ownerType">
                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                  </ErrorMessage>
                </FormGroup>
                <FormGroup>
                  <div defaultValue={values.active} type="checkbox" name="active" onClick={e => {
                    let { owners } = this.state;
                    owners.active = !owners.active;
                    setFieldValue("active", owners.active);
                    this.setState({
                      owners
                    });
                  }} >
                    <label>Is Active</label><br />
                    <i className={`fa fa-2x ${this.state.owners
                      && this.state.owners.active
                      ? 'fa-toggle-on text-success' :
                      'fa fa-toggle-off text-danger'}`}></i>
                  </div>
                </FormGroup>
              </div>
              <input type="submit" className="mt-2 mb-3 btn btn-primary" value={"Save"} />
            </Form>
          )
          }
        </Formik>

      </>
    );
  }
}
