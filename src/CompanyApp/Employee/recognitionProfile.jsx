
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { employeeProfilePhotoURL } from '../../HttpRequest';
import { getDefaultProfilePicture } from '../../utility'
import EmployeePhoto from './employeePhoto';
export default class RecognitionProfilePhoto extends Component {
    constructor(props) {
        super(props)
        this.state = {
             name: props.name || "",
            employeeId: props.employeeId || "", 
            id: props.id || 0,
        }
       
    }
    componentDidMount() { 
      
        
     }
    render() {
        return <h2 style={{wordSpacing: '-5px'}} className="table-avatar">
            <Link className="recognitionAvatar" to={`/app/company-app/employee/detail/${this.state.id}`}>
            <EmployeePhoto className="recognitionAvatar" id={this.state.id} alt={this.state.name}></EmployeePhoto>
            </Link>
            {/* <Link to={`/app/company-app/employee/detail/${this.state.id}`}>{this.state.name}
                <span>{this.state.employeeId}</span></Link> */}
                </h2>
    }
}