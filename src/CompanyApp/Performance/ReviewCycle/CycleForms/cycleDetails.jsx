import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup, Label } from 'reactstrap';
import Select from "react-select";
import { getBranchLists, getDepartmentLists, getFunctionLists } from './service';
import { ModalFooter } from 'react-bootstrap';
import { cycleDetailsvalidationSchema } from './validation';



class CycleDetails extends Component {
  constructor(props) {
    super(props)
    this.formikRef = React.createRef();
    this.state = {
      templatesName: [],
      function: [],
      department: [],
      branche: [],
      formValue: {
        cyclename: this.props.formData.cycleDetails1?.cyclename || '',
        description: this.props.formData.cycleDetails1?.description || '',
        id: this.props.formData.cycleDetails1?.id || 0,
     //   individualSettings: this.props.formData.cycleDetails1?.individualSettings || '',
        assign: this.props.formData.cycleDetails1?.assign || '',
        branchId: this.props.formData.cycleDetails1?.branchId || '',
        departmentId: this.props.formData.cycleDetails1?.departmentId || '',
        functionId: this.props.formData.cycleDetails1?.functionId || '',
        departments: [],
        branches: [],
        functions: [],
      }
    }
  }
  componentDidMount() {

    getBranchLists().then(res => {
      if (res.status == "OK") {
        this.setState({
          branche: res.data,
        },() => {
        const { branchId } = this.state.formValue;
        if (branchId) {
          const branchIds = branchId.toString().split(',').map(Number);
          const brancheData = res.data.filter(br => branchIds.includes(br.id));
          let formValue = { ...this.state.formValue, branches: brancheData };
          this.setState({ formValue });
        }
      })
      }
    })
    getDepartmentLists().then(res => {
      if (res.status == "OK") {
        this.setState({
          department: res.data,
        },() => {
        const { departmentId } = this.state.formValue;
        if (departmentId) {
          const deptIds = departmentId.toString().split(',').map(Number);
          const departmentData = res.data.filter(d => deptIds.includes(d.id));
          let formValue = { ...this.state.formValue, departments: departmentData };
          this.setState({ formValue });
        }
      })
      }
    })
    getFunctionLists().then(res => {
      if (res.status == "OK") {
        this.setState({
          function: res.data,
        }, () => {
        const { functionId } = this.state.formValue;
        if (functionId) {
          const functionIds = functionId.toString().split(',').map(Number);
          const functionData = res.data.filter(f => functionIds.includes(f.id));
          let formValue = { ...this.state.formValue, functions: functionData };
          this.setState({ formValue });
        }
      })
      }
    })

  }
  onChangeValue(event) {
    this.setState({
      formValue: {
        ...this.state.formValue,
        assign: event.target.value
      }
    });
    // this.setState({ assign: event.target.value })
    // const newFormValue = { ...this.state.formValue, departments: [] };
    // this.setState({ formValue: newFormValue });
  }

  save = (data, action) => {
   
    // const { assign } = this.state.formValue
    
    if (data.assign === 'department') {
      const departmentId = data.departments.map(item => item.id)
      const cycleData = {
        cyclename: data.cyclename,
        description: data.description,
       // individualSettings: data.individualSettings,
        id: this.state.formValue.id,
        departments: data.departments,
        departmentId: departmentId.join(', '),
        assign: data.assign
      }
      
      this.props.handleFormData({ cycleDetails1: cycleData, id: this.props.formData?.id || 0})
      this.props.nextStep();
    } else if (data.assign === 'function') {
      const functionId = data.functions.map(item => item.id)
      const cycleData = {
        cyclename: data.cyclename,
        description: data.description,
      //  individualSettings: data.individualSettings,
        id: this.state.formValue.id,
        functions: data.functions,
        functionId: functionId.join(', '),
        assign: data.assign
      }
     
      this.props.handleFormData({ cycleDetails1: cycleData})
      this.props.nextStep();
    } else if (data.assign === 'location') {
      const branchId = data.branches.map(item => item.id)
      const cycleData = {
        cyclename: data.cyclename,
        description: data.description,
       // individualSettings: data.individualSettings,
        id: this.state.formValue.id,
        branches: data.branches,
        branchId: branchId.join(', '),
        assign: data.assign
      }
      
      this.props.handleFormData({ cycleDetails1: cycleData })
      this.props.nextStep();
    } else {
      const cycleData = {
        cyclename: data.cyclename,
        description: data.description,
        //individualSettings: data.individualSettings,
        id: this.state.formValue.id,
        assign: data.assign
      }
     
      this.props.handleFormData({ cycleDetails1: cycleData})
      this.props.nextStep(); 
    
    }


  }

  render() {
    const { assign } = this.state.formValue;
    let options = [];
    if (assign === 'location') {
      options.push(...this.state.branche)

    } else if (assign === 'department') {
      options.push(...this.state.department)
    } else if (assign === 'function') {
      options.push(...this.state.function)
    }
    const CustomSelect = ({ field, setFieldValue, form }) => {
      const { name } = field;
      const {values } = form;

      options = [];
      if (values.assign === 'location') {
        options.push(...this.state.branche)
      } else if (values.assign === 'department') {
        options.push(...this.state.department)
      } else if (values.assign === 'function') {
        options.push(...this.state.function)
      }

      const handleChange = (data) => {
        if (values.assign === 'location') {
          setFieldValue("departments", [])
          setFieldValue("functions", [])
        } else if (values.assign === 'department') {
          setFieldValue("branches", [])
          setFieldValue("functions", [])
        } else if (values.assign === 'function') {
          setFieldValue("departments", [])
          setFieldValue("branches", [])
        }
       
        setFieldValue(name, data);
      };
      return (
        <Select
          {...field}
          onChange={handleChange}
          options={options}
          isMulti
          getOptionValue={(options) => options.id}
          getOptionLabel={(options) => options.name}
        />
      );
    };

    return (
      <div>

        <Formik
          enableReinitialize={true}
          initialValues={this.state.formValue}
          validationSchema={cycleDetailsvalidationSchema}
          onSubmit={this.save}
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
          }) => (
            <Form onSubmit={handleSubmit} autoComplete='off'>

              <FormGroup>
                <label>Cycle Name
                  <span style={{ color: "red" }}>*</span>
                </label>
                <Field placeholder="Enter Cycle Name" name="cyclename" className="form-control"></Field>
                <ErrorMessage name="cyclename">
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup>
              <FormGroup>
                <label>Description
                </label>
                <Field name="description"
                  className="form-control" placeholder="Enter description" component="textarea" rows="3"></Field>

              </FormGroup>
              <FormGroup>
                <label>Applicable For
                  <span style={{ color: "red" }}>*</span>
                </label>

                <div className='d-flex' onChange={(e) => {
                  // this.onChangeValue(e)
                  setFieldValue("assign", e.target.value)
                }}>
                  <Field className='mr-1' type="radio" value="everyone" name="assign" /> Everyone
                  <Field className='ml-4 mr-1' type="radio" value="department" name="assign" /> Department
                  <Field className='ml-4 mr-1' type="radio" value="function" name="assign" /> Function
                  <Field className='ml-4 mr-1' type="radio" value="location" name="assign" /> Location

                </div>
                <ErrorMessage name="assign">
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
                {values.assign === 'department' &&
                  <div className='col-md-12'>
                    <FormGroup >
                      <label>Select Department
                      <span style={{ color: "red" }}>*</span>
                      </label>
                      <Field
                        name="departments"
                        component={CustomSelect}
                        isMulti
                        options={options}
                        setFieldValue={setFieldValue}
                      />
                      <ErrorMessage name="departments">
                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                      </ErrorMessage>
                    </FormGroup>
                  </div>
                }

                {values.assign === 'location' &&
                  <div className='col-md-12'>
                    <FormGroup >
                      <label>Select Branches  <span style={{ color: "red" }}>*</span></label>
                      <Field
                        name="branches"
                        component={CustomSelect}
                        isMulti
                        options={options}
                        setFieldValue={setFieldValue}
                      />
                      <ErrorMessage name="branches">
                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                      </ErrorMessage>
                    </FormGroup>
                  </div>
                }
                {values.assign === 'function' &&
                  <div className='col-md-12'>
                    <FormGroup >
                      <label>Select Functions  <span style={{ color: "red" }}>*</span></label>
                      <Field
                        name="functions"
                        component={CustomSelect}
                        isMulti
                        options={options}
                        setFieldValue={setFieldValue}
                      />
                      <ErrorMessage name="functions">
                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                      </ErrorMessage>
                    </FormGroup>
                  </div>
                }
              </FormGroup>
              {/* <FormGroup>
                <label>This setting is for individuals. What details should they see on sharing their feedback?
                  <span style={{ color: "red" }}>*</span>
                </label>

                <div>
                  <Field className='ml-2' type="radio" value="1" name="individualSettings" /> Details without individual responses and responders are anonymous <br />
                  <Field className='ml-2' type="radio" value="2" name="individualSettings" /> Score summary without details

                </div>
                <ErrorMessage name="individualSettings">
                  {msg => <div style={{ color: 'red' }}>{msg}</div>}
                </ErrorMessage>
              </FormGroup> */}
              <ModalFooter className="cycle-modal-footer">
                <div className='mt-2' style={{ marginLeft: 'auto' }}>
                  <button type='submit'
                    className="cycle_btn ml-2 btn btn-secondary"
                  >
                    Next
                  </button>
                </div>

              </ModalFooter>
            </Form>
          )
          }
        </Formik>
      </div>
    )
  }

}


export default CycleDetails