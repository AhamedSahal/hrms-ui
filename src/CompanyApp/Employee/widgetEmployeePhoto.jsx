
import React, { Component } from 'react';
import { employeeProfilePhotoURL } from '../../HttpRequest';
import { getDefaultProfilePicture } from '../../utility'
export default class EmployeeProfilePhoto extends Component {
    constructor(props) {
        super(props)
        this.state = {
            profileImg:  getDefaultProfilePicture(),
            id: props.id,
            imgAlt: props.alt
        }
       
    }
    componentDidMount() { 
        employeeProfilePhotoURL(this.props.id)
      .then((url) => {
        this.setState({
            profileImg: url
        });
        
      })
      .catch((error) => {
        console.warn('Error retrieving employee profile photo:', error);
      });
        
     }
    render() {
        var className=this.props.className?? "";
        return <img className={className} data-id={this.props.id} alt={this.state.imgAlt}  src={this.state.profileImg} />
    }
}