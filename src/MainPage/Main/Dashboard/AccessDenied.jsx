import React, { Component } from 'react'
import { Link } from 'react-router-dom';

export default class AccessDenied extends Component {
  render() {
    return (<>
      <div className='p-5 text-center access-denied'> <i className="fa fa-lock"></i> Access Denied

      </div>
      <div className='p-5 text-center'>
        <Link to={'/app/main/dashboard'} className='btn btn-primary'> <i className='fa fa-home'></i> Go To Home</Link>
      </div></>
    )
  }
}
