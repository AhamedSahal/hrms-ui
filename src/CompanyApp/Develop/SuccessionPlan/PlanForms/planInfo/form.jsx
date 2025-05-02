
import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FormGroup, Label } from 'reactstrap';
import JobTitlesDropdown from '../../../../ModuleSetup/Dropdown/JobTitlesDropdown';
import EmployeeDropdown from '../../../../ModuleSetup/Dropdown/EmployeeDropdown';
import { planInfoValidation } from './validation';
import { toast } from 'react-toastify';
import { saveSuccessionInfo } from './service';



export default class PlanInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      planTypeDropdown: '',
      typeOfSuccessor: props.planInfo?.typeOfSuccessor || 0,
      planInfo: props.planInfo || {
        id: 0,
        planName: '',
        planType: '',
        typeOfSuccessor: '',
        employeeId: '',
        createdDate: '',
        jobTitlesId: '',
        description: "",
        active: false
      }
    };
  }

  handlePlanType = (e) => {
    const value = e.target.value
    if (value === 'position') {
      this.setState({ planType: 1 })
    } else if (value === 'person') {
      this.setState({ planType: 2 })
    }

  }

  save = (data, action) => {

    // saveSuccessionInfo(data).then(res => {
    //   if (res.status == "OK") {
    //     toast.success(res.message);
    //   } else {
    //     toast.error(res.message);
    //   }
    //   if (res.status == "OK") {
    //     setTimeout(function () {
    //       window.location.reload()
    //     }, 6000)
    //   }
    //   action.setSubmitting(false)
    // }).catch(err => {
    //   toast.error("Error while saving Succession Info");

    //   action.setSubmitting(false);
    // })
    this.props.nextForm(1);
  }

  render() {
    const {  planInfo, typeOfSuccessor } = this.state
    
   
    return (
      <>

        <Formik
          enableReinitialize={true}
          initialValues={planInfo}
          onSubmit={this.save}
          validationSchema={planInfoValidation}
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
                  <label>Plan Name
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field name="planName" className="form-control"></Field>
                  <ErrorMessage name="planName">
                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                  </ErrorMessage>
                </FormGroup>
                <FormGroup className='col-md-6'>
                  <label>Plan Type
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <select defaultValue={values.typeOfSuccessor} name='typeOfSuccessor' onChange={(e) => {
                    this.handlePlanType(e)
                    this.setState({ typeOfSuccessor: e.target.value })
                    setFieldValue("typeOfSuccessor", e.target.value);
                  }} className="form-control" >
                    <option value="">Select PlanType</option>
                    <option value="1" >Position</option>
                    <option value="2" >Person</option>

                  </select>
                  <ErrorMessage name="typeOfSuccessor">
                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                  </ErrorMessage>
                </FormGroup>
                {typeOfSuccessor === '1' && <div className="col-md-6 form-group">
                  <label>Position
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field name="jobTitlesId" className="col-md-6" render={field => {
                    return <JobTitlesDropdown defaultValue={values.jobTitlesId} onChange={e => {
                      this.setState({
                        jobTitlesId: e.target.value
                      })
                      setFieldValue("jobTitlesId", e.target.value);
                      setFieldValue("jobTitles", { id: e.target.value });
                    }}></JobTitlesDropdown>
                  }}></Field>
                  <ErrorMessage name="jobTitlesId">
                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                  </ErrorMessage>
                </div>}
                {typeOfSuccessor === '2' && <FormGroup className="col-md-6">
                  <label>Select Person<span style={{ color: "red" }}>*</span> </label>
                  <Field name="employeeId" className="col-md-6" render={field => {
                    return <EmployeeDropdown defaultValue={values.employeeId} onChange={e => {
                      setFieldValue("employeeId", e.target.value);
                      setFieldValue("employee", { id: e.target.value });
                    }}></EmployeeDropdown>
                  }}></Field>
                  <ErrorMessage name="employeeId">
                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                  </ErrorMessage>
                </FormGroup>}
                <FormGroup className='col-md-6'>
                  <label>Start Date
                    <span style={{ color: "red" }}>*</span>
                  </label>
                  <Field type='date' name="createdDate" className="form-control"></Field>
                  <ErrorMessage name="createdDate">
                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                  </ErrorMessage>
                </FormGroup>
                <FormGroup>
                  <label>Description</label>
                  <Field name="description"
                    component="textarea" rows="4"
                    className="form-control"
                    placeholder="Description"
                  >
                  </Field>
                </FormGroup>
                <FormGroup>
                  <div defaultValue={values.active} type="checkbox" name="active" onClick={e => {
                    let { planInfo } = this.state;
                    planInfo.active = !planInfo.active;
                    setFieldValue("active", planInfo.active);
                    this.setState({
                      planInfo
                    });
                  }} >
                    <label>Is Active</label><br />
                    <i className={`fa fa-2x ${this.state.planInfo
                      && this.state.planInfo.active
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
