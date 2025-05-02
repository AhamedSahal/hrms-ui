import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveWorkflowProcess,getAssigneeDetails } from './service';
import WorkFlowAutomateDropdown from '../../ModuleSetup/Dropdown/WorkFlowAutomateDropdown';
import { getWorkflow } from '../../ModuleSetup/Automate/service';  
import { WorkflowProcessSchema } from './validation';
import WorkFlowStepAutomateDropdown from '../../ModuleSetup/Dropdown/WorkFlowStepAutomateDropdown';
import { getEmployeeId, getRoleId,getUserType } from '../../../utility';
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';


export default class WorkflowProcessForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            Assigneedata:[],  
             q: "",
             page: 0,
             size: 10,
             sort: "id,desc",
             flag : false,
            workflowprocess: props.workflowprocess || {
                id: 0, 
                workflowId: 0,
                comment: '',
                file: null
            },

        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.workflowprocess && nextProps.workflowprocess != prevState.workflowprocess) {
            return { workflowprocess: nextProps.workflowprocess };
        } else if (!nextProps.workflowprocess) {
            return ({
                workflowprocess: {
                    id: 0, 
                    workflowId: 0,
                    comment: '',
                    file: null
                },
            }
            );
        }
        return null;
    }
    getAssigneeDetail = () =>{
        { 
        (this.state.workflowStepId != 0 && getAssigneeDetails(this.state.q, this.state.page, this.state.size, this.state.sort,this.state.workflowStepId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    Assigneedata: res.data.list
                },() =>{
                this.AssignFlag();}) 
            }else{
                toast.error(res.message);
            }
        })
        )
    }}
    AssignFlag = () =>{ 
        const { Assigneedata } = this.state;
        let roleId = isCompanyAdmin?2:getRoleId();  
        Assigneedata.map((res) => {
            if(res.start != 0){
                if((res.assignTo == 0 && res.employeeId == getEmployeeId()) || 
                (res.assignTo == 2) || (res.assignTo == 1 && res.roleId == roleId != 0 ? roleId : null)){
                this.setState({ flag : true})
            }else{
                this.setState({flag : false})
            }}
            else{
                this.setState({flag : false})
            }
        })
    }
    fetchList = () => {
        {
            (this.state.workflowId != 0 && getWorkflow(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.workflowId).then(res => {
                if (res.status == "OK") {
                    this.setState({
                        data: res.data.list,
                        totalPages: res.data.totalPages,
                        totalRecords: res.data.totalRecords,
                        currentPage: res.data.currentPage + 1
                    })

                }
            }))
        }
    }
    save = (data, action) => {
        action.setSubmitting(true);  
        saveWorkflowProcess(data).then(res => {
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
            console.log(err)
            toast.error("Error while creating workflow process");
            action.setSubmitting(false);
        })
    }
    render() {
        
        let { workflowprocess } = this.state;
        workflowprocess.file = ""; 
        return (
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.workflowprocess}
                    onSubmit={this.save}
                  //  validationSchema={WorkflowProcessSchema}
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
                            <div>
                            <FormGroup>
                                <label>Workflow Name
                                <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="workflowId" render={field => {
                                    return <WorkFlowAutomateDropdown className="form-control" defaultValue="Select Workflow"
                                        onChange={(e) => {
                                            setFieldValue("workflowId", e.target.value);
                                            
                                        }}
                                    >
                                    </WorkFlowAutomateDropdown>
                                }}></Field>
                                <ErrorMessage name="workflowId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>

                            </FormGroup>
                            <FormGroup>
                                <label>Step Name
                                <span style={{ color: "red" }}>*</span>
                                </label>
                             
                                <WorkFlowStepAutomateDropdown workflowId={values.workflowId} defaultValue={values.workflowStepId}  
                                        onChange={(e) => { 
                                            setFieldValue("workflowStepId", e.target.value);
                                            setFieldValue("workFlowSecondStepValue" , e.nativeEvent.target[e.nativeEvent.target.selectedIndex+1].value)
                                            this.setState({ "workflowStepId": e.target.value },
                                               () => { this.getAssigneeDetail(); }
                                            )
                                          
                                        }}>
                                </WorkFlowStepAutomateDropdown>
                                <ErrorMessage name="workflowStepId">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup>
                                <label>Comment
                                </label>
                                <Field name="comment" className="form-control"  placeholder="Enter Comment"  component="textarea" rows="3"></Field>
                               
                            </FormGroup>
                            <FormGroup>
                                <label>
                                    Attachment
                                </label>
                                <input name="file" type="file" className="form-control" onChange={e => {
                                    setFieldValue('file', e.target.files[0]);
                                }}></input>
                                <p style={{ fontSize: "10px", fontFamily: "Arial" }}>
                                    Please upload a file of less than 5MB and of format (pdf, .doc, .docx, .jpg, .jpeg, .png, .xls, .xlsx, .ppt, .pptx, .txt, .csv.)</p>
                            </FormGroup></div>
                             { this.state.flag == true && <> 
                                <input type="submit" className="btn btn-primary" value={"Send"} />
                                   </>} 
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
