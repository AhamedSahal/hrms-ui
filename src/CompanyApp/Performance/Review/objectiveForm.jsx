import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import EmployeeDropdown from '../../ModuleSetup/Dropdown/EmployeeDropdown';
import { manageObjectives } from './service';


export default class ObjectiveForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            objectiveGroup: props.objectiveGroup || {},
            reviewId: props.reviewId || 0,
        }
        if (!this.state.objectiveGroup || !this.state.objectiveGroup.employeePerformanceObjectiveEntity) {
            this.state.objectiveGroup.employeePerformanceObjectiveEntity = []
        }
        this.addRecord();
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.objectiveGroup && nextProps.objectiveGroup != prevState.objectiveGroup) {
            return ({ objectiveGroup: nextProps.objectiveGroup })
        } else if (!nextProps.objectiveGroup) {
            return prevState.objectiveGroup || {}
        }
        return null;
    }
    addRecord() {
        let obj = this.state.objectiveGroup;
        obj.employeePerformanceObjectiveEntity.push({id:0,name:""});
        this.setState({   
            objectiveGroup:obj
         });
    }
    save = (data, action) => { 
        action.setSubmitting(true);
        manageObjectives(this.state.objectiveGroup.employeePerformanceObjectiveEntity,this.state.reviewId,this.state.objectiveGroup.id).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.callBack();
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Performance Review");

            action.setSubmitting(false);
        })
    }
    render() {
        console.log(this.state.objectiveGroup)
        console.log(this.state.reviewId)
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.objectiveGroup.employeePerformanceObjectiveEntity}
                    onSubmit={this.save}>
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
                        <Form> 
                             <div className="row">
                                 <div className="col-md-12 text-right">
                                     <i className="text-success fa fa-plus fa-2x pointer" onClickCapture={()=>this.addRecord()}></i>
                                 </div>
                                 <div className='col-md-12 row'>
                                    {
                                        this.state.objectiveGroup.employeePerformanceObjectiveEntity.map((item, index) => (
                                           <> <div className="col-md-10" key={index}>
                                                <FormGroup>
                                                  <label>Objective
                                                    <span style={{ color: "red" }}>*</span>
                                                   </label>
                                                <Field name={'name['+index+']'} type="text" defaultValue={item.name} onBlur={(e)=>{
                                                    let obj = this.state.objectiveGroup;
                                                    obj.employeePerformanceObjectiveEntity[index].name = e.target.value;
                                                    this.setState({
                                                        objectiveGroup:obj
                                                    })
                                                }}  className="form-control" required></Field>
                                                </FormGroup>
                                            </div>
                                            <div className="col-md-2">
                                                <i className="fa fa-2x fa-trash mt-4 pt-2 pointer text-danger" onClick={()=>{
                                                    let obj = this.state.objectiveGroup;
                                                    var indx=obj.employeePerformanceObjectiveEntity.indexOf(item);
                                                    obj.employeePerformanceObjectiveEntity.splice(indx,1);
                                                    this.setState({
                                                        objectiveGroup:obj
                                                    })
                                                }} title="remove"></i>
                                            </div></>
                                        ))
                                    }
                                 </div>
                                 <div className="col-md-12">
                                 {this.state.objectiveGroup.employeePerformanceObjectiveEntity && this.state.objectiveGroup.employeePerformanceObjectiveEntity.length>0 && <input type="submit" className="btn btn-primary" value="Save" />}
                                 </div>
                             
                             </div>
                            
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}
