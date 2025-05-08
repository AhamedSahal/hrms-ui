import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../Dropdown/EmployeeDropdown';
import RoleDropdown from '../Dropdown/RoleDropdown';
import { connect } from 'react-redux';
import { WorkflowStepSchema } from './validation';
import { saveWorkflow } from './service';


class WorkflowStepForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Workflow: props.name || {
                id: 0,
                name: "",
                assign: '',
                checked: [],
                roleId: 0,
                workflowName: this.props.workflow
            },
            stepsData: [],
            completeStepValidation: true,
            role: [],
            assignRole: '',
            disabled: false,
            completed: false,
            comdisabled: false,
            reportingManagerId: 0,
            isSend: 0
        }   
    }


    deleteItem = (index) => {
        const { stepsData } = this.state;
        const updatedItems = [...stepsData];
        updatedItems.splice(index, 1);
        this.setState({ stepsData: updatedItems });
    };


    save = (data, action) => {
        if(data.assign == '1' && data.roleId == 1 && this.state.reportingManagerId > 0){
            let stepData = {...data,reportingManagerId: this.state.reportingManagerId}
            this.setState((prevState) => ({
                stepsData: [...prevState.stepsData, stepData]
            }));
            this.setState({reportingManagerId: 0})
        }else{
            this.setState((prevState) => ({
                stepsData: [...prevState.stepsData, data]
            }));

        }
        action.resetForm();
    }

 // validate step complete
 handleStepCompleteValidation = (len,data) => {
    this.setState({completeStepValidation: true})
    for(let i = 0; i < len; i++){
       if(len-1 != i){
      let  flag =  data[i].completed?true:false  
        if(flag){
            this.setState({completeStepValidation: false})
            break;
        }   
       } 
    }
 }





    saveWorkflows = async (action) => {
        let data = this.state.stepsData
        let len = data.length; 
        
      
        if(this.state.completeStepValidation){
            if(data[len-1].completed){
                for (let i = 0; i < len; i++) {  
                    await saveWorkflow(data[i]).then(res => {
                        if (res.status == "OK") {
                            if (i === len - 1) {
                                toast.success(res.message);
                            }
        
                        } else {
                            toast.error(res.message);
                        }
                        if (res.status == "OK" && i === len - 1){
                            setTimeout(function () {
                                window.location.reload()
                              }, 6000)
                        }
                    }).catch(err => {
                        toast.error("Error while saving Workflow");
                    });
                }

            }else{
                toast.error("Last step should be completed.");
            }
           

        } else{
            toast.error("Multiple Workflow Complete found.Please make it only once.");
        }
      

    }

    render() {

        return (
            <div>


                <div className='d-flex'>
                    <div>
                        <Formik
                            enableReinitialize={true}
                            initialValues={this.state.Workflow}
                            onSubmit={this.save}
                            validationSchema={WorkflowStepSchema}
                           
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
                                <Form autoComplete='off'>
                                    <FormGroup>
                                        <label>Workflow Name
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="name" value={this.props.workflow} disabled className="form-control"></Field>

                                    </FormGroup>
                                    <FormGroup>
                                        <label>Add Step
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="name" className="form-control"></Field>
                                        <ErrorMessage name="name">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>

                                    <FormGroup>

                                        <label>Assign To
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <div>
                                            <label className='mr-2' >
                                                <Field className='mr-1' type="radio" name="assign" value="0" />
                                                Employee
                                            </label>
                                            <label className='mr-2'>
                                                <Field className='mr-1' type="radio" name="assign" value="1" />
                                                Role
                                            </label>
                                            <label className='mr-2'>
                                                <Field className='mr-1' type="radio" name="assign" value="2" />
                                                Everyone
                                            </label >
                                        </div>
                                        <ErrorMessage name="assign">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>

                                    {values.assign === '1' && <FormGroup> <label>Role
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <div onChange={(e) => {
                                            setFieldValue("roleId", e.target.value === "1"?1:e.target.value === "2"?2:0);
                                            setFieldValue("roleName", e.target.value === "1"?"Reporting Manager":e.target.value === "2"?"HR":null);
                                        }}>
                                            <input type="radio" value="1" name="roleId" disabled={this.state.stepsData.length == 0 || this.state.stepsData[this.state.stepsData.length-1].roleId == 2}/> Reporting Manager
                                            <input className='ml-2' type="radio" value="2" name="roleId" /> HR 

                                        </div>
                                        <ErrorMessage name="roleId">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>}
                                    {values.assign === '0' && <FormGroup> <label>Employee
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                        <Field
                                            name="employeeId"
                                            render={(field) => {

                                                return (
                                                    <EmployeeDropdown
                                                        defaultValue={values.employeeId}
                                                        onChange={(e) => {
                                                            setFieldValue("employeeId", e.target.value);
                                                            this.setState({reportingManagerId: e.target.value})
                                                            setFieldValue("employee", { id: e.target.value });
                                                            setFieldValue("empName", this.props.employees.filter(item => item.id === parseInt(e.target.value) && item.name));
                                                        }}
                                                    ></EmployeeDropdown>
                                                );
                                            }}
                                        >
                                        </Field>
                                        <ErrorMessage name="employeeId">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>

                                    </FormGroup>

                                    }

                                    <FormGroup>
                                        < div>
                                            <label>Actions
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <table className='empInfoTable table table-bordered'>

                                                <tr onChange={(e) => {
                                                    setFieldValue(e.target.value, 1);
                                                }}>
                                                    <td className='text-secondary changeStatus'><Field name="checked" value="start" className=" mr-1 leading-tight" type="checkbox" disabled={this.state.isSend == 1} onClick={e =>{this.setState({isSend: 1})}}/>Send</td> 
                                                    <td className='text-success changeStatus'><Field name="checked" value="approve" className=" mr-1 leading-tight" type="checkbox" disabled={this.state.stepsData.length == 0} />Approve</td>
                                                    <td className='text-danger changeStatus'> <Field name="checked" value="reject" className=" mr-1 leading-tight" type="checkbox" disabled={this.state.stepsData.length == 0} />Reject</td>
                                                    <td className='text-primary changeStatus'><Field name="checked" value="onHold" className="mr-1 leading-tight" type="checkbox" disabled={this.state.stepsData.length == 0}/>OnHold</td>
                                                    <td className='text-info changeStatus'> <Field name="checked" value="acknowledge" className=" mr-1 leading-tight" type="checkbox" disabled={this.state.stepsData.length == 0} />Acknowledge</td>
                                                </tr>
                                            </table>
                                            <ErrorMessage name="checked">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>

                                        </div>

                                    </FormGroup>
                                    <FormGroup> 
                                        <label>Do you want to Complete the workflow ?</label><br />
                                        <div type="checkbox" name="completed" onClick={e => {
                                            let { Workflow } = this.state;
                                            Workflow.completed = !Workflow.completed;
                                            setFieldValue("completed", Workflow.completed);
                                            this.setState({
                                                Workflow,
                                                completed: Workflow.completed
                                            });
                                        }} >
                                            <i className={`fa fa-2x ${this.state.Workflow
                                                && this.state.Workflow.completed
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}></i>
                                        </div> 
                                    </FormGroup> 
                                 
                                       <input type="submit" className="mt-2 float-right btn btn-primary" value={'Add Steps'}></input>  
                                     

                                </Form>
                            )
                            }
                        </Formik>
                    </div>
                    <div className='stepCardDiv' >

                    {this.state.stepsData.map((item, index) => (
                        <div className='d-flex'>
                            <div className='stepCardStyle ml-2 '>
                                <div className='d-flex float-right' style={{ color: '#64b5f6' }} >
                                    <i onClick={() => this.deleteItem(index)} role="button" className=" pe-auto fa fa-trash fa-lg" aria-hidden="true"></i>
                                </div>
                                <small style={{color: 'grey'}} >Step {index + 1}</small>
                                <p className='mb-1 text-white'>{item.name}</p>
                                
                                <small style={{color: 'grey'}}>Assignee</small>
                                {item.empName?.map(data => <p className='mb-1'>{data.name}</p>)}
                                {item.roleName != null ? <p className='mb-1'>{item.roleName}</p> : null}
                                {item.assign == '2' && <p className='mb-1'>Everyone</p>}
                                <small style={{color: 'grey'}}>Actions</small>
                                <div className='d-flex'>
                                {item.checked.map((item, index) => <p className='mb-1'>{ (index ? ', ' : '') + item }</p>)}
                           
                                </div>
                                <small style={{color: 'grey'}}>Complete the workflow</small> <br />
                                <p className='mb-1'>{item.completed == true ? "yes" : "no"}</p>
                            
                            </div>

                        </div>
                    ))}

                    </div>

                </div>
                <button onClick={(e) => this.saveWorkflows()} className='btn btn-success float-right mt-3'>Create</button>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        employees: state.dropdown.employees,
        roles: state.dropdown.roles
    }
}

export default connect(mapStateToProps)(WorkflowStepForm);