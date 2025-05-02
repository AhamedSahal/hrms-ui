
import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { FormGroup, Label } from 'reactstrap';
import { addPoolMembersValidation } from './validation';
import {  getTalentPoolList } from './service';


const poolData = [
  {
    active: true,
    candidates: [{ name: 'Jhon Rick', id: 21 }, { name: "Jack William", id: 21 }, { name: "Praveen Kumar", id: 21 }],
    description: "Sample ....",
    id: 0,
    poolDate: "2024-02-07",
    poolName: "Hr Consultant ",
  },
  {
    active: true,
    candidates: [{ name: 'Danial George', id: 21 }, { name: "Richard Mike", id: 21 }, { name: "Jason Roy", id: 21 }],
    description: "Sample ....",
    id: 1,
    poolDate: "2024-02-07",
    poolName: "Key people for finance",
  },
  {
    active: false,
    candidates: [{ name: 'Ahamed Sahal', id: 21 }, { name: "Hassan", id: 21 }, { name: "Irfan Ahmed", id: 21 }],
    description: "Sample text ....",
    id: 2,
    poolDate: "2024-02-07",
    poolName: "Marketing ",
  },
]

export default class AddPoolMembers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPool: [],
      selectedPoolId: false,
      poolMembers: {
        id: 0,
        active: false,
        candidateId: '',
        readiness: '',
        poolId: 0,
      }

    };

  }

  handleSelectChange = (e) => {
    const selectedPool = poolData.find((pool) => pool.id === parseInt(e.target.value, 10));
    this.setState({ selectedPool: selectedPool, selectedPoolId: true })
  };

  fetchList = () => {
    getTalentPoolList().then(res => { 
      if (res.status == "OK") {
        this.setState({
          selectedPool: res.data.list,
        })
      }
    })  
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
    const { selectedPool, selectedPoolId } = this.state

    return (


      <Formik
        enableReinitialize={true}
        initialValues={this.state.poolMembers}
        onSubmit={this.save}
        validationSchema={addPoolMembersValidation}
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
              <FormGroup className='col-md-8'>
                <label>Select Talent pool
                  <span style={{ color: "red" }}>*</span>
                </label>
                <select name='poolId' onChange={(e) => {
                  setFieldValue("poolId", e.target.value);
                  this.handleSelectChange(e);
                }} className="form-control" >
                  <option value="">Select a pool</option>
                  {poolData.map((pool) => (
                    <option key={pool.id} value={pool.id}>
                      {pool.poolName}
                    </option>
                  ))}
                </select>
                <ErrorMessage name="poolId">
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>
              {selectedPoolId &&
                <>
                  <FormGroup className='col-md-6'>
                    <label>Select Candidate
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <select name='candidateId' onChange={(e) => {
                      setFieldValue("candidateId", e.target.value);
                      setFieldValue("employee", { id: e.target.value })
                    }} className="form-control">
                      <option value="">Select a candidate</option>
                      {selectedPool?.candidates.map((candidate) => (
                        <option data-profile-photo-id={candidate.id} key={candidate.id} value={candidate.id}>
                          {candidate.name}
                        </option>
                      ))}
                    </select>
                    <ErrorMessage name="candidateId">
                      {msg => <div style={{ color: 'red' }}>{msg}</div>}
                    </ErrorMessage>
                  </FormGroup>
                  <FormGroup className='col-md-6'>
                    <label>Readiness
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <select name='readiness' onChange={(e) => {
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
                </>
              }

              <FormGroup>
                <div type="checkbox" name="active" onClick={e => {
                  let { poolMembers } = this.state;
                  poolMembers.active = !poolMembers.active;
                  setFieldValue("active", poolMembers.active);
                  this.setState({
                    poolMembers
                  });
                }} >
                  <label>Is Active</label><br />
                  <i className={`fa fa-2x ${this.state.poolMembers
                    && this.state.poolMembers.active
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
