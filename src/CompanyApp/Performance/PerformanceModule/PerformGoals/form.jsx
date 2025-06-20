import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../../../ModuleSetup/Dropdown/EmployeeDropdown';
import { saveGoals, saveSubGoals } from './service';
import PerformanceSubGoalsForm from './subGoalsform';
import {PerformanceGoalSchema} from './validation';
import { Button } from "antd";


export default class PerformanceGoalsForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: 0,
            name: '',
            description: '',
            priority: '',
            deadline: '',
            employeeId: 0,
            goalWeightage: 0,
            active: true,
            subGoalsData: [],
            isWeightage: true,
            issubGoalWeightageMap: {},
            isAutoWeightageExist: {},
            PerformanceGoalsForm:this.props.PerformanceGoalsForm|| {
                    id: 0,
                    name: '',
                    description: '',
                    priority: '',
                    deadline: '',
                    employeeId: 0,
                    goalWeightage: 0,
                    active: true,
                    subGoalsData: [],
                    isWeightage: true,

            }

        }

    }

    componentDidMount() {
        if (this.props.PerformanceGoalsForm != undefined) {

            this.setState({ isWeightage: this.props.PerformanceGoalsForm.isWeightage })
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.PerformanceGoalsForm && nextProps.PerformanceGoalsForm != prevState.PerformanceGoalsForm) {
            return ({ PerformanceGoalsForm: nextProps.PerformanceGoalsForm })
        } else if (!nextProps.PerformanceGoalsForm) {
            return prevState.PerformanceGoalsForm || ({
                PerformanceGoalsForm: {
                    id: 0,
                    name: '',
                    description: '',
                    priority: '',
                    deadline: '',
                    employeeId: 0,
                    goalWeightage: 0,
                    active: true,
                    // isWeightage: true,
                }
            })
        }
        return null;
    }

    handleSubGoals = () => {
        let tempData = this.state.subGoalsData;
        if (tempData.length < 5) {
            let temp = {
                id: 0,
                name: '',
                description: '',
                priority: '',
                deadline: '',
                subgoalWeightage: 0,
                active: true,
                goalsId: 0,
                issubGoalWeightage: true
            }
            let data = tempData.push(temp)
            this.setState({ subGoalsData: tempData })

        }


    }

    updateState = (updateddata, index) => {
        let { subGoalsData } = this.state;
        subGoalsData[index] = updateddata;
        this.setState({
            subGoalsData: subGoalsData
        });
    }

    handleButtonClick = () => {
        this.setState((prevState) => ({
            isWeightage: !prevState.isWeightage,
            preferredMethod: prevState.isWeightage ? 'Auto' : 'Manual'
        }));

    };

//    handleSubGoalButtonClick = (index) => {
//     this.setState(prevState => {
//         const newMap = { ...prevState.issubGoalWeightageMap };
//         newMap[index] = !newMap[index]; 
//         return { issubGoalWeightageMap: newMap };
//     });
// };

handleSubGoalButtonClick = (index) => {
  this.setState(prevState => {
    const newMap = { ...prevState.issubGoalWeightageMap };
    newMap[index] = !newMap[index];

    const subMapValuesUpToIndex = Object.keys(newMap)
      .filter(key => parseInt(key) < index)
      .map(key => newMap[key]);

    const isAnyManual = subMapValuesUpToIndex.some(val => val === false);

    return {
      issubGoalWeightageMap: newMap,
      isAutoWeightageExist: !isAnyManual,
    };
  });
};



    removeRow = (index) => {
        const tmp = this.state.subGoalsData;
        tmp.splice(index, 1);
        this.setState({
            subGoalsData: tmp,
        });
    };

    save = (data, action) => {
      
        action.setSubmitting(true);
        data["isWeightage"] = this.state.isWeightage;
        data["weightage"] = this.state.isWeightage;
        if (this.weightageValidation()) {  // weightage validation
            saveGoals(data).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") {
                    if (data.subGoalsData.length > 0) {
                        this.saveSubGoalsData(res.data.id,data.subGoalsData,data)
                        // this.weightageValidation(res.data.id)
                    } else {
                        this.props.updateList(data);
                    }
                    // setTimeout(function () {
                    //     window.location.reload()
                    // }, 3000)
                }
                action.setSubmitting(false)
            }).catch(err => {
                toast.error("Error while saving Performance Goals");

                action.setSubmitting(false);
            })
        }
    }

    // weigthage validation
    weightageValidation = () => {
        if (this.state.subGoalsData.length > 0) {
            let manualCount = 0
            let autoCount = 0
            let manualWeigthage = 0
            let autoApproveArray = []
            // 100% validation s
            this.state.subGoalsData.map((data, i) => {
                if (data.issubGoalWeightage) {
                    autoApproveArray.push(i)
                    autoCount++
                } else {
                    manualCount++
                    manualWeigthage = Number(manualWeigthage) + Number(data.subgoalWeightage)
                }
            })
            if (manualWeigthage > 100 || (manualWeigthage == 100 && autoCount > 0)) {
                toast.error("Weighage should be less than or equals to 100.");
                return false;
            } else {


                if (autoCount > 0 && autoApproveArray.length > 0) {
                    let autoWeight = (100 - manualWeigthage) / autoCount
                    let tempData = this.state.subGoalsData;
                    autoApproveArray.map((res) => {
                        tempData[res].subgoalWeightage = autoWeight

                    })
                    
                    this.setState({ subGoalsData: tempData })

                }
                return true;
            }
            // 100% validation e
        } else {
            return true;
        }

    }

    // save goals sub tables
    saveSubGoalsData = (goalsId, subGoals,data ) => {
        var partialSuccess=0
        if (subGoals.length > 0) {
            subGoals.map((datas, i) => {
                let dataUpdate = { ...datas, goalsId: goalsId, issubGoalWeightage:this.state.issubGoalWeightageMap[datas.index] };
                saveSubGoals(dataUpdate).then(res => {
                    if (res.status == "OK") {
                        toast.success(res.message); 
                        partialSuccess = 1;
                    } else {
                        toast.error(res.message);
                    }
                   
                        if (partialSuccess==1) {
                            this.props.updateList(data);
                        }
                      

                }).catch(err => {
                    toast.error("Error while saving Performance Sub Goals");


                })
            })
        }
    }


    render() {
        const isEmployeeId = this.props?.isEmployeeGoals
        const { isWeightage } = this.state

        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.PerformanceGoalsForm}
                    onSubmit={this.save}
                    validationSchema={PerformanceGoalSchema}
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
                        <Form autoComplete='off'>
                            <div className="row">
                                <div className="mb-3 col-12">
                                    <label>Employee
                                        <span style={{ color: "red" }}>*</span>
                                    </label>
                                    <Field name="employeeId" render={field => {
                                        return <EmployeeDropdown 
                                            defaultValue={isEmployeeId || values.employeeId} 
                                            onChange={e => {
                                                setFieldValue("employeeId", e.target.value);
                                            }} 
                                           
                                            readOnly={isEmployeeId} 
                                        ></EmployeeDropdown>
                                    }} ></Field>
                                    <ErrorMessage name="employeeId">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </div>
                                <div className="col-6">
                                    <FormGroup>
                                        <label>Goal Name
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="name" type="text" className="form-control" ></Field>
                                        <ErrorMessage name="name">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-4">
                                    <FormGroup>
                                        <label>Weightage</label>
                                        <div onClick={e => {
                                            // this.updateSelf()
                                            this.handleButtonClick()
                                        }} className="toggles-btn-view" id="button-container">

                                            <div id="my-button" className="toggle-button-element" style={{ transform: isWeightage ? 'translateX(0px)' : 'translateX(80px)' }}>
                                                <p className='m-0 self-btn'>{isWeightage ? 'Auto' : 'Manual'}</p>

                                            </div>
                                            <p className='m-0 team-btn' style={{ transform: isWeightage ? 'translateX(-10px)' : 'translateX(-80px)' }}>{isWeightage ? 'Manual' : 'Auto'}</p>
                                        </div>


                                    </FormGroup>
                                </div>
                                {!isWeightage && <div className="col-2"> <FormGroup><label></label><Field name="goalWeightage" type="number" className="form-control" required={!isWeightage} ></Field> </FormGroup></div>}
                            </div> <div className="row">
                                <div className="col-12">
                                    <FormGroup>
                                        <label>Description
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="description" component="textarea" rows="4" className="form-control" placeholder="Description" ></Field>
                                        <ErrorMessage name="description">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <FormGroup>
                                        <label>Priority
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <select id="priority" className="form-control" name="priority"
                                            onChange={e => {
                                                setFieldValue("priority", e.target.value)
                                            }} defaultValue={values.priority} >
                                            <option value="">Select Priority</option>
                                            <option value="0">Low</option>
                                            <option value="1">Medium</option>
                                            <option value="2">High</option>
                                        </select>
                                        <ErrorMessage name="priority">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-6">
                                    <FormGroup>
                                        <label>Deadline
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                        <Field name="deadline" type="date" className="form-control" ></Field>
                                        <ErrorMessage name="deadline">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            {/* {this.state.self && <Field type="hidden" name="employeeId" defaultValue="0"></Field>} */}
                            <br />
                            <div className="row">
                                <div className="col-md-4">
                                    <FormGroup>
                                        <div type="checkbox" name="active"  >
                                            <label>Is Active</label><br />
                                            <i className={`fa fa-2x ${this.state.PerformanceGoalsForm
                                                && this.state.PerformanceGoalsForm.active
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`} onClick={e => {
                                                    let { PerformanceGoalsForm } = this.state;
                                                    PerformanceGoalsForm.active = !PerformanceGoalsForm.active;
                                                    setFieldValue("active", PerformanceGoalsForm.active);

                                                }}></i>
                                        </div>
                                    </FormGroup>
                                </div>
                            </div>
                            {/*  sub goals forms */}

             <FormGroup>
                {values.subGoalsData.length > 0 && values.subGoalsData.map((res, index) => 
                   (
                  
                    <div key={index} >
                        {index === 0 && <h3>Sub Goals</h3>}

                        <div className="row">
                            <div className="col-md-6">
                            <FormGroup>
                                <label>Sub Goal Name<span style={{ color: "red" }}>*</span></label>
                                <Field name={`subGoalsData[${index}].name`} type="text" className="form-control" />
                                <ErrorMessage name={`subGoalsData[${index}].name`}>
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div>

                            <div className="col-4">
                            <FormGroup>
                                <label>Weightage</label>
                                <div onClick={() => {
                                        if (!(this.state.issubGoalWeightageMap?.[index + 1] !== undefined)) {
                                            this.handleSubGoalButtonClick(index);
                                            setFieldValue(`subGoalsData[${index}].issubGoalWeightage`, this.state.issubGoalWeightageMap?.[index]);
                                        }
                                        }} className="toggles-btn-view" id="button-container">
                                <div id="my-button" className="toggle-button-element" style={{ transform: (this.state.issubGoalWeightageMap?.[index]?? true) ? 'translateX(0px)':'translateX(80px)' }}>
                                    <p className='m-0 self-btn'>{(this.state.issubGoalWeightageMap?.[index]?? true) ? 'Auto':'Manual' }</p>
                                </div>
                                <p className='m-0 team-btn' style={{ transform: (this.state.issubGoalWeightageMap?.[index]?? true) ? 'translateX(-10px)':'translateX(-80px)'}}>
                                    {(this.state.issubGoalWeightageMap?.[index]?? true) ? 'Manual':'Auto'}
                                </p>
                                </div>
                            </FormGroup>
                            </div>

                            { !this.state.issubGoalWeightageMap?.[index] && <div className="col-2">
                            <FormGroup>
                                <label></label>
                                <Field
                                name={`subGoalsData[${index}].subgoalWeightage`}
                                type="number"
                                className="form-control"
                                min={1}
                                max={(this.state.isAutoWeightageExist[index] || index==0 )? 100 : 99}
                                />
                            </FormGroup>
                            </div>}
                        </div>

                        <div className="row">
                            <div className="col-12">
                            <FormGroup>
                                <label>Description<span style={{ color: "red" }}>*</span></label>
                                <Field
                                name={`subGoalsData[${index}].description`}
                                component="textarea"
                                rows="4"
                                className="form-control"
                                placeholder="Description"
                                />
                                <ErrorMessage name={`subGoalsData[${index}].description`}>
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-6">
                            <FormGroup>
                                <label>Priority<span style={{ color: "red" }}>*</span></label>
                                <Field as="select" name={`subGoalsData[${index}].priority`} className="form-control">
                                <option value="">Select Priority</option>
                                <option value="0">Low</option>
                                <option value="1">Medium</option>
                                <option value="2">High</option>
                                </Field>
                                <ErrorMessage name={`subGoalsData[${index}].priority`}>
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div>

                            <div className="col-6">
                            <FormGroup>
                                <label>Deadline<span style={{ color: "red" }}>*</span></label>
                                <Field name={`subGoalsData[${index}].deadline`} type="date" className="form-control" />
                                <ErrorMessage name={`subGoalsData[${index}].deadline`}>
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4">
                            <FormGroup>
                                <label>Is Active</label><br />
                                <i
                                className={`fa fa-2x ${res.active ? 'fa-toggle-on text-success' : 'fa-toggle-off text-danger'}`}
                                onClick={() => {
                                    const { subGoalsData } = this.state;
                                    subGoalsData[index].active = !subGoalsData[index].active;
                                    this.setState({ subGoalsData });
                                    setFieldValue(`subGoalsData[${index}].active`, subGoalsData[index].active);
                                }}
                                ></i>
                            </FormGroup>
                            </div>
                        </div>

                        <hr />
                    </div>
                    
                ))}
                </FormGroup>


                            {/* sub form */}
                            <div className="row">
                                <div className="col">
                                    <input type="submit" className="btn btn-success" value={(this.props.PerformanceGoalsForm == undefined || this.props.PerformanceGoalsForm?.id == 0) ? "Publish" : "Update"} />
                                </div>
                                {(this.props.PerformanceGoalsForm == undefined || this.props.PerformanceGoalsForm?.id == 0) && <div className="col text-end">
                                    <input type='button' className="btn btn-primary" onClick={() => {
                                                    const newIndex = values.subGoalsData.length;
                                                    let subGoalsData = values.subGoalsData || [];
                                                    subGoalsData.push({ 
                                                    id: 0,
                                                    name: '',
                                                    description: '',
                                                    priority: '',
                                                    deadline: '',
                                                    subgoalWeightage: 0,
                                                    active: true,
                                                    goalsId: 0,
                                                    goals:{},
                                                    issubGoalWeightage: true,
                                                    index:newIndex
                                                    });
                                                    setFieldValue("subGoalsData", subGoalsData);
                                                    this.setState(prevState => ({
                                                        issubGoalWeightageMap: {
                                                        ...prevState.issubGoalWeightageMap,
                                                        [newIndex]: true 
                                                        }, 
                                                        isAutoWeightageExist:{
                                                        ...prevState.isAutoWeightageExist,
                                                        [newIndex]: true 
                                                        },
                                                    }))

                                    }} value="Add Sub Goal" />
                                </div>}

                            </div>

                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
