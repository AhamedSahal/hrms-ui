
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { employeeProfilePhotoURL } from '../../HttpRequest';
import { getDefaultProfilePicture } from '../../utility'
export default class EmployeePhoto extends Component {
    constructor(props) {
        super(props)
        this.state = {
            profileImg: '',
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

    getInitials(name) {
        if (!name) return '';
        const nameParts = name.split('  ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts[1] || '';
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
      }

    hashStringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
          const value = (hash >> (i * 8)) & 0xFF;
          color += ('00' + value.toString(16)).slice(-2);
        }
        return color;
      }

    render() {
        const { className = "", id } = this.props;

        const name = this.props.alt;
        const initials = this.getInitials(name);
        const backgroundColor = this.hashStringToColor(name);
        // console.log(this.props.alt ,'cell : ', this.props.name)
        return (
            this.state.profileImg ? (
                <img className={className} data-id={id} alt={this.state.imgAlt} src={this.state.profileImg} />
            ) : (
                <div className="profile-initials" 
                data-id={id} 
                style={{backgroundColor,  borderRadius: '50%', color: 'white' }}
                >
                    {initials}
                </div>
            )
        );

    }
}