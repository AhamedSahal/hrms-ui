import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveTimesheet } from './service';
import { TimesheetSchema } from './validation';
import { getUserType, verifyApprovalPermission, getPermission, getEmployeeId } from '../../utility';
import EmployeeDropdown from '../ModuleSetup/Dropdown/EmployeeDropdown';
import ActivityDropdown from '../ModuleSetup/Dropdown/ActivityDropdown';
import ProjectDropdown from './../ModuleSetup/Dropdown/ProjectDropdown';
import TimesheetRow from './timesheetRow';

const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';
export default class CreateTimesheetForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            timesheet: props.timesheet || {
                id: 0,
                employeeId: 0,
                date: "",
                hours: 0,
                project: "",
                activity: "",
                description: ""
            },
            timesheets:[],
            self : props.self,
            count:0,
        }
    }
    componentDidMount(){
        if(this.state.timesheet.id==0){
            this.addRecord();
        }else{
            let tmp = this.state.timesheets;
            tmp.push(this.state.timesheet);
            this.setState({   
                timesheets:tmp
             });
        }
    }
    addRecord() {
        let tmp = this.state.timesheets;
        tmp.push({id:0,employeeId:this.props.employeeId || getEmployeeId(),  
            date: "",
            hours: 0,
            project: "",
            activity: "",
            description: ""});
        this.setState({   
            timesheets:tmp,
            count :this.state.count + 1
        });
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.timesheet && nextProps.timesheet != prevState.timesheet) {
            return ({ timesheet: nextProps.timesheet })
        } else if (!nextProps.timesheet) {

            return prevState.timesheet || ({
                timesheet: {
                    id: 0,
                    employeeId: 0,
                    date: "",
                    hours: 0,
                    project: "",
                    activity: "",
                    description: ""
                }
            })
        }
        return null;
    }
    updateState = (updatedTimesheet, index) =>{
        let {timesheets} = this.state;
        timesheets[index] = updatedTimesheet;
        this.setState({   
            timesheets:timesheets
         });
    }
    save = (data, action) => {
        data.map((a,i)=>{
            a["date"] = new Date(`${a["date"]} GMT`).toISOString().substring(0, 10);
            console.log(a);
            action.setSubmitting(true);
            saveTimesheet(a).then(res => {
               
                if (res.status == "OK") {
                    if(i == data.length -1){
                        // toast.success(res.message);
                        this.props.showAlert('submit');
                    }
                    
                    this.props.updateList(res.data);
                } else {
                    toast.error(res.message);
                   
                }
                if(i == data.length -1){
                action.setSubmitting(false)
                }
            }).catch(err => {
                toast.error("Error while submitting timesheet.");
                action.setSubmitting(false);
            })
        })
        
    }
    removeRow = (index) => {
        const tmp = [...this.state.timesheets];
        tmp.splice(index, 1);
        this.setState({
          timesheets: tmp,
          count: this.state.count - 1,
        });
      };
    render() {
        let {timesheets,count} = this.state;
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.timesheets}
                    onSubmit={this.save}
                    validationSchema={TimesheetSchema}
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
                        <Form>
                            {
                                timesheets && timesheets.length> 0 && timesheets.map((timesheet,index)=>{
                                    return  <TimesheetRow  key={`${index}-${this.state.count}`} self={ this.props.self} timesheet={timesheet} index={index} updateState={this.updateState} removeRow={this.removeRow}></TimesheetRow>
                                })
                            }
                           
                            <div className="row">                             
                            <div className="col-md-3">
                            <input type="submit" className="btn btn-primary" value={this.state.timesheet.id > 0 ? "Update" : "Submit"} />
                            </div>
                            {this.state.timesheet.id == 0 && count < 7 && <div className="col-md-9 text-right">
                            <i className="text-success fa fa-plus fa-2x pointer" onClickCapture={()=>this.addRecord()}></i>
                            </div>}
                            </div>
                        </Form>
                )
                    }
            </Formik>
            </div >
        )
    }
}
