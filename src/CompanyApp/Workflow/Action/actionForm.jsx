import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveWorkflowProcess, getAssigneeDetails } from '../Process/service';
import WorkFlowAutomateDropdown from '../../ModuleSetup/Dropdown/WorkFlowAutomateDropdown';
import { getWorkflow } from '../../ModuleSetup/Automate/service';
import { WorkflowProcessSchema } from '../Process/validation'
import WorkFlowStepAutomateDropdown from '../../ModuleSetup/Dropdown/WorkFlowStepAutomateDropdown';
import { getEmployeeId, getRoleId, getUserType } from '../../../utility';
import {getWorkFlowStepList} from "./service"
const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';


export default class WorkflowActionForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            Assigneedata: [],
            q: "",
            page: 0,
            size: 10,
            sort: "id,desc",
            workflowStepData: [],
            flag: false,
            validBeforeStep: 0,
            workFlowMainData: props.workFlowMainData || {},
            previousStepId: props.stepId || 0,
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
                    file: null,
                    approve: false,
                    reject: false,
                    onHold: false,
                    acknowledge: false,
                },
            }
            );
        }
        return null;
    }
    getAssigneeDetail = () => {
        {
            (this.state.workflowStepId != 0 && getAssigneeDetails(this.state.q, this.state.page, this.state.size, this.state.sort, this.state.workflowStepId).then(res => {
                if (res.status == "OK") {
                    this.setState({
                        Assigneedata: res.data.list
                    }, () => {
                        this.AssignFlag();
                    })
                } else {
                    toast.error(res.message);
                }
            })
            )
        }
    }
    AssignFlag = () => {
        const { Assigneedata,workFlowMainData,validBeforeStep } = this.state;
        let roleId = isCompanyAdmin?2:getRoleId();
        Assigneedata.map((res) => {
                if ((res.assignTo == 0 && res.employeeId == getEmployeeId()) ||
                    (res.assignTo == 2) || (res.assignTo == 1 && res.roleId == roleId != 0 ? roleId : null) || (res.assignTo == 1 && res.roleId == 1 && res.reportingManagerId == getEmployeeId())) {
                    if (res.approve === 1 && workFlowMainData.workflowstepautomate?.id == validBeforeStep) {
                        this.setState({ approve: true })
                    } else {
                        this.setState({ approve: false })
                    }
                    if (res.reject === 1 && workFlowMainData.workflowstepautomate?.id == validBeforeStep) {

                        this.setState({ reject: true })
                    } else {
                        this.setState({ reject: false })
                    }
                    if (res.onHold === 1 && workFlowMainData.workflowstepautomate?.id == validBeforeStep) {
                        this.setState({ onHold: true })
                    } else {
                        this.setState({ onHold: false })
                    }
                    if (res.acknowledge === 1 && workFlowMainData.workflowstepautomate?.id == validBeforeStep) {
                        this.setState({ acknowledge: true })
                    } else {
                        this.setState({ acknowledge: false })
                    }
                } else {
                    this.setState({ acknowledge: false })
                    this.setState({ onHold: false })
                    this.setState({ reject: false })
                    this.setState({ approve: false })
                    // this.setState({flag : false})
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
    // get work flow step value
    handleWorkFlowStep = (id) => {
        getWorkFlowStepList(id).then(res => {
            if (res.status == "OK") {
                this.setState({workflowStepData: res.data})
            } else {
                toast.error(res.message);
            }
        }).catch(err => {
            console.log(err)
            toast.error("Error while creating workflow process");
        })

    }

    save = (data, action) => {
        action.setSubmitting(true);
        let actionData = {...data,previousStepId: this.state.previousStepId}
        saveWorkflowProcess(actionData).then(res => {
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
                    validationSchema={WorkflowProcessSchema}
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
                                               
                                                this.setState({ acknowledge: false })
                                                this.setState({ onHold: false })
                                                this.setState({ reject: false })
                                                this.setState({ approve: false })
                                                this. handleWorkFlowStep(e.target.value)

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
                                            setFieldValue("workflowStepName", e.target.value);
                                            let validBeforeStep = this.state.workflowStepData[0].id != e.target.value? e.nativeEvent.target[e.nativeEvent.target.selectedIndex-1].value:0;
                                            let setsecondStep = this.state.workflowStepData[this.state.workflowStepData.length-1].id != e.target.value? e.nativeEvent.target[e.nativeEvent.target.selectedIndex+1].value:0;
                                            setFieldValue("workFlowSecondStepValue" , setsecondStep);
                                            this.setState({validBeforeStep: validBeforeStep})
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
                                    <Field name="comment" className="form-control" placeholder="Enter Comment" component="textarea" rows="3"></Field>

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
                            <div className='d-flex float-left'>
                                {this.state.approve && <input onClick={(event) => {
                                    setFieldValue('status', 'PROCESS');
                                }} name="action" type="Submit" value={'Approve'} className="ml-2 btn btn-success" />}
                                {this.state.reject && <input onClick={(event) => {
                                    setFieldValue('status', "REJECTED");
                                }} name="action" type="Submit" value={'Reject'} className="ml-2 btn btn-danger"  />}
                                {this.state.onHold && <input onClick={(event) => {
                                    setFieldValue('status', 'ONHOLD');
                                }} name="action" type="Submit" value={'On Hold'} className="ml-2 btn btn-warning" style={{background: "#f1c40f"}}/>}
                                {this.state.acknowledge && <input onClick={(event) => {
                                    setFieldValue('status', 'ACKNOWLEDGE'
                                    );
                                }} name="action" type="Submit" value={'Acknowledge'} className="ml-2 btn btn-secondary" style={{background: "#757575"}}/>}

                            </div>
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
