import React, { Component } from 'react'
import { employeeProfilePhotoURL } from '../../../HttpRequest';
import { getDefaultProfilePicture } from '../../../utility';

export default class EmployeeOrgChartPhoto extends Component {
    constructor(props) {
        super(props)

    } 
    triggerProfilePhotoLoad = (id)=>{
        employeeProfilePhotoURL(id)
        .then((url) => {
         window.bindProfilePhoto(id,url);
        })
        .catch((error) => {
          console.warn('Error retrieving employee profile photo:', error);
        });
    }
    render() {
        const { id } = this.props;
        this.triggerProfilePhotoLoad(id)
              
        return (
                <img className='events-proPic' src={getDefaultProfilePicture()} data-load-profile-image={id} data-profile-photo-id={id}/>
        )
    }
} 
