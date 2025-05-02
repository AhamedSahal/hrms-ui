
import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FormGroup, Label } from 'reactstrap';
import EmployeeDropdown from '../../../../ModuleSetup/Dropdown/EmployeeDropdown';
import { addCandidatesValidation } from './validation';
import { saveCandidate } from './service';
import { toast } from 'react-toastify';



export default class AddCadidateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidate: props.candidate || {
        id: 0,
        active: false,
        candidateId: '',
        readiness: '',
        planId: 0
      }

    };

  }

 
  save = (data, action) => {
    this.props.nextForm(2)
    // saveCandidate(data).then(res => {
    //     if (res.status == "OK") {
    //         toast.success(res.message);
    //     } else {
    //         toast.error(res.message);
    //     }
    //     if (res.status == "OK") {
    //         setTimeout(function () {
    //             window.location.reload()
    //         }, 6000)
    //     }
    //     action.setSubmitting(false)
    // }).catch(err => {
    //     toast.error("Error while saving Candidate");

    //     action.setSubmitting(false);
    // })
}


  render() {


    return (


      <Formik
        enableReinitialize={true}
        initialValues={this.state.candidate}
        onSubmit={this.save}
        validationSchema={addCandidatesValidation}
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
                <label>Select Candidate
                  <span style={{ color: "red" }}>*</span>
                </label>
                <Field name="candidateId" className="col-md-6" render={field => {
                  return <EmployeeDropdown defaultValue={values.employee?.id} onChange={e => {
                    setFieldValue("candidateId", e.target.value);
                    setFieldValue("employee", { id: e.target.value });
                  }}></EmployeeDropdown>
                }}></Field>
                <ErrorMessage name="candidateId">
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup className='col-md-6'>
                <label>Readiness
                  <span style={{ color: "red" }}>*</span>
                </label>
                <select defaultValue={values.readiness?.id} name='readiness' onChange={(e) => {
                  setFieldValue("readiness", e.target.value);
                }} className="form-control" >
                  <option value="">Select Readiness</option>
                  <option value="1">Less than 1 year</option>
                  <option value="2" >1 to 2 Years</option>
                  <option value="3" >3 to 4 Years</option>
                </select>
                <ErrorMessage name="readiness">
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup>
                <div defaultValue={values.active} type="checkbox" name="active" onClick={e => {
                  let { candidate } = this.state;
                  candidate.active = !candidate.active;
                  setFieldValue("active", candidate.active);
                  this.setState({
                    candidate
                  });
                }} >
                  <label>Is Active</label><br />
                  <i className={`fa fa-2x ${this.state.candidate
                    && this.state.candidate.active
                    ? 'fa-toggle-on text-success' :
                    'fa fa-toggle-off text-danger'}`}></i>
                </div>
              </FormGroup>

            </div>
            <input type="submit" className="mt-2 btn btn-primary" value={"Save"} />
          </Form>
        )
        }
      </Formik>

    );
  }
}
