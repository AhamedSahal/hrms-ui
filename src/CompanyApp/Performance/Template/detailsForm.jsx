import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { getTitle } from '../../../utility';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { savePerformanceTemplateConfig,getPerformanceTemplateById } from './service';
import { PerformanceSchema } from './validation';


export default class PerformanceTemplateDetailsForm extends Component {
    constructor(props) {
        super(props) 
        this.state = {
            id: props.match.params.id,
            performanceTemplate: {},
        } 
        this.getTemplate(this.state.id);
    } 
    getTemplate(id) {
        getPerformanceTemplateById(id).then(res => {
            if (res.status == "OK") {
                this.setState({
                    performanceTemplate: res.data
                })
            }else{
                toast.error(res.message);
            }
        })
    }
    setGroupWeightage=(val,groupId)=> {
        let performanceTemplate = this.state.performanceTemplate;
        performanceTemplate.performanceTemplateObjectiveGropEntities.map((objectiveGroup, index) => {
            if(objectiveGroup.id == groupId){
                objectiveGroup.weightage = val;
            }
        })
        this.setState({
            performanceTemplate: performanceTemplate
        })  
    }
    setObjectiveTaskWeightage=(val,groupId,objectId,taskId)=>
    {
        let performanceTemplate = this.state.performanceTemplate;
        performanceTemplate.performanceTemplateObjectiveGropEntities.map((objectiveGroup, index) => {
            if(objectiveGroup.id == groupId){
                objectiveGroup.performanceTemplateObjectiveList.map((objective, index) => {
                    objective.performanceTemplateObjectiveTaskList.map((task, index) => {
                        if(task.id == taskId){
                            task.weightage = val;
                        }
                    })
                })
            }
        })
        this.setState({
            performanceTemplate: performanceTemplate
        }) 
    }
    setObjectiveTaskName=(val,groupId,objectId,taskId)=>
    {
        let performanceTemplate = this.state.performanceTemplate;
        performanceTemplate.performanceTemplateObjectiveGropEntities.map((objectiveGroup, index) => {
            if(objectiveGroup.id == groupId){
                objectiveGroup.performanceTemplateObjectiveList.map((objective, index) => {
                    if(objective.id == objectId){
                        objective.performanceTemplateObjectiveTaskList.map((task, index) => {
                            if(task.id == taskId){
                                task.name = val;
                            }
                        })
                    }
                })
            }
        })
        this.setState({
            performanceTemplate: performanceTemplate
        }) 
        console.log(performanceTemplate)
    }
    save = (data, action) => {  
        action.setSubmitting(true);
        savePerformanceTemplateConfig(this.state.performanceTemplate).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Performance Template");

            action.setSubmitting(false);
        })
    }
    render() {
        console.log(this.state.performanceTemplate)
        return (
            <div>
                <div className="page-wrapper">
                    <Helmet>
                    <title>Performance Template Details  | {getTitle()}</title>
                    <meta name="description" content="Performance Template Details" />
                    </Helmet>
                      <div className="content container-fluid">         
                 <div className="page-header">
                        <div className="row align-items-center">
                        <div className="col">
                            <h3 className="page-title">Performance Template : {this.state.performanceTemplate?.name}</h3>
                             <ul className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                                <li className="breadcrumb-item active">Performance Template</li>
                             </ul>
                        </div>
                 </div>
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.performanceTemplate}
                    onSubmit={this.save}
                    validationSchema={PerformanceSchema}
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
                        
                <Form>
                    
                   { this.state.performanceTemplate?.performanceTemplateObjectiveGropEntities?.map((objectiveGroup, index) => { 
                   return <section className="review-section professional-excellence mt-2" key={index}> 
                   <div className="review-header text-center col-12"> 
                     <div className="row">
                         <h3 className="review-title col-8">{objectiveGroup.name}</h3>
                         <div className="form-group col-4 mb-0">
                                                   <div className="input-group">
                                                       <div className="input-group-prepend">
                                                         <span className="input-group-text">Group Weightage %</span>
                                                       </div>
                                                       <input required defaultValue={objectiveGroup.weightage>0?objectiveGroup.weightage:''} type="number" min={1} max={100} className="form-control" onBlur={e=>this.setGroupWeightage(e.target.value,objectiveGroup.id)}/>
                                                     </div> 
                                                 </div>
                     </div>
                   </div>
                   <div className="row">
                     <div className="col-md-12">
                       <div className="table-responsive">
                         <table className="table table-bordered review-table mb-0">
                           <thead>
                             <tr>
                               <th style={{width: '50px'}}>#</th>
                               <th>{objectiveGroup.columnOneHeader}</th>
                               <th>{objectiveGroup.columnTwoHeader}</th>
                               <th style={{width: '100px'}}>Weightage %</th>
                             </tr>
                           </thead>
                           <tbody>
                           {
                            objectiveGroup.performanceTemplateObjectiveList.map((objective, index) => {                              
                             return <tr key={index}>
                               <td>{index+1}</td>
                               <td className='pre-wrap'>{objective.name}</td>
                               {
                                   objective.performanceTemplateObjectiveTaskList.map((task, index) => {
                                    return     <><td><input type="text" defaultValue={task.name} className="form-control" onBlur={e=>this.setObjectiveTaskName(e.target.value,objectiveGroup.id,objective.id,task.id)}  /></td>
                                            <td><input type="number" defaultValue={task.weightage} min={1} max={100} className="form-control" onBlur={e=>this.setObjectiveTaskWeightage(e.target.value,objectiveGroup.id,objective.id,task.id)} /></td></>
                                   })
                               }
                               
                             </tr> 
                             })}
                           </tbody>
                         </table>
                       </div>
                     </div>
                   </div>
                 </section> 
                    })}
                       {this.state.performanceTemplate?.performanceTemplateObjectiveGropEntities?.length>0 && <input type="submit" className="btn btn-primary" value="Save"/>    }
                </Form>
                    )
                    }
                </Formik>
           
            </div>
            </div>
            </div>
            </div>
        )
    }
}
