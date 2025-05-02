/**
 * Signin Firebase
 */

import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';
import { loginLogo, loginbg } from '../Entryfile/imagepath.jsx';
import { getQueryParam, setTokenCookie, setUserData } from '../utility.jsx';
import { authService } from './authService';

class AutoLoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount() {
    var token = getQueryParam("auth");
    setTokenCookie(token);
    this.autoLogin(token);
  }
  autoLogin = (token) => {
    this.props.autoLogin(token).then(res => {
      if (res.status === "OK") {
        window.location.href = "/app/main/dashboard";
        setUserData(res.data);
      } else {
        window.location.href = "/login";
      }
    })
  }


  render() {

    return (


      <div className="loginPage main-wrapper container-fluid">
        <Helmet>
          <title>Verify User - WorkPlus</title>
          <meta name="description" content="Login page" />
        </Helmet>
        <div className="row h-100">
          <div className="col-lg-7 d-none d-sm-flex login_img" style={{
            backgroundImage: `url(${loginbg})`
          }}>
            <div>

              <h2>The employee experience platform <br /> empowering workplaces <br /> for a digital future </h2>
              {/* <img className="img-fluid" src={loginbg} alt="WorkPlus" /> */}
            </div>
          </div>
          <div className="col-lg-5 login_form">
            <div className="account-logo">
              <h3><p><img src={loginLogo} alt="WorkPlus" /></p></h3>
              <div className="account-box">
                <div className="account-wrapper">
                  <h3 className="account-title text-center" style={{ marginTop: "100px" }}>Verifying Account Please wait... <i className="fa fa-spin fa-spinner"></i></h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  user: state.auth.user
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  autoLogin: () => dispatch(authService.autoLogin())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AutoLoginPage)