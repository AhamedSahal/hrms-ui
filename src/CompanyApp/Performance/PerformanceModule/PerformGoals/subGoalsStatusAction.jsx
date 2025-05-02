import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
 import { updateSubGoalStatus,updateGoalStatus,getSubGoalsActionList } from './service';
import { Button, Stack } from '@mui/material';


export default class subGoalsStatusAction extends Component {
    constructor(props) {
        super(props)

        this.state = {
            subgoalsEditView: props.subgoalsEditView || {
                id: 0,
                employeeId: props.employeeId, 
                achievement: 0,
                achRadius: 0,
                comments: ""
            }, 
            no: 0,
            page: 0,
            size: 10,
            sort: "id,desc",
            totalPages: 0,
            totalRecords: 0,
            currentPage: 1, 
            data: [],
            achievement: 0
            // status:props.status||"APPROVED",
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.subgoalsEditView && nextProps.subgoalsEditView != prevState.subgoalsEditView) {
            return ({ subgoalsEditView: nextProps.subgoalsEditView })
        } else if (!nextProps.subgoalsEditView) {
            return ({
                subgoalsEditView: {
                    id: 0,
                    employeeId: nextProps.employeeId,
                    achievement: nextProps.achievement,
                    achRadius: 0,
                    comments: nextProps.comments
                }
            })
        }

        return null;
    }

    componentDidMount() {
        if(this.props.subGoalsStatusId > 0){
            this.fetchList(); 
        }     
        
    }


    fetchList = () => { 
        getSubGoalsActionList(this.props.subGoalsStatusId,this.props.subGoalValidationStatus).then(res => {
            if (res.status == "OK") {
                this.setState({
                    data: res.data,
                    achievement: res.data.achievement
                })

            }
        })
    }

    updateSubGoalStatus = () => { 
        if(this.props.GoalsStatusValidation){
            updateGoalStatus(this.state.subgoalsEditView.id, this.state.file,this.state.achievement,this.state.comments).then(res => {
                
                    if (res.status == "OK") {
                        toast.success(res.message);
        
                    } else {
                        toast.error(res.message);
                    }
                    if (res.status == "OK") {
                       
                        this.props.updateList()
                    }
                }).catch(err => {
                    console.error(err);
                    toast.error("Error while updating status");
                })

        }else{

        
        updateSubGoalStatus(this.state.subgoalsEditView.id, this.state.file,this.state.achievement,this.state.comments).then(res => {
          
                if (res.status == "OK") {
                    toast.success(res.message);
    
                } else {
                    toast.error(res.message);
                }
                if (res.status == "OK") {
                    
                    this.props.updateList()
                }
            }).catch(err => {
                console.error(err);
                toast.error("Error while updating status");
            })
        }
         
        }

    
    render() {
        const { subgoalsEditView } = this.state;
        return (
            <div>
                {subgoalsEditView && <> <table className="table">
                    <tr>
                        {this.props.subGoalValidationStatus?
                        <th>Sub Goal Name</th>:
                        
                        <th>Goal Name</th>
                        }
                        <td>{subgoalsEditView.name}</td>
                    </tr>
                    <tr>
                        <th>
                            Achievement <span style={{ color: "red" }}>*</span>
                        </th>
                        <td>
                            <input name="achRadius" type="range" id="achRadius" min="0" max="100" class="form-range" value={this.state.achievement}  style={{ paddingTop: "10px", paddingBottom: "10px" }}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    this.setState({ achievement: value });
                                }}
                            />
                            <input
                                name="achievement" type="number" maxLength="100" className="input" value={this.state.achievement}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value >= 0 && value <= 100) {
                                        this.setState({ achievement: value });
                                    }
                                }}
                                required
                            />
                        </td>
                    </tr>
                    <tr>
                        <th> Comments <span style={{ color: "red" }}>*</span></th>
                        <td><input name="comments" type="text" className="multi-input" required defaultValue={subgoalsEditView.comments}
                            onChange={(e) => { this.setState({ comments: e.target.value }); }} /></td> 
                    </tr> 
                    <tr>
                        <th> Upload Document</th>
                       <td><FormGroup>
                            <input name="file" type="file" className="form-control" onChange={e => {
                                if (e.currentTarget.files.length > 0)
                                    this.setState({
                                        file: e.target.files[0]
                                    });
                            }}></input>

                        </FormGroup></td>
                    </tr> 

                </table>
                    <hr />
                    <Stack direction="row" spacing={1}>

                    <Button sx={{ textTransform: 'none' }} size="small" onClick={() => this.updateSubGoalStatus()}
                        variant="contained" color="warning">
                        Update
                    </Button>

                    </Stack>
                   
                   
                </>}
            </div>
        )
    }
}
