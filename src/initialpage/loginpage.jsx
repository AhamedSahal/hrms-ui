/**
 * Signin Firebase
 */

import { Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { connect } from 'react-redux';
import { loginLogo, loginbg, appleIcon, googlePlay } from '../Entryfile/imagepath.jsx';
import { getUserName, deleteTokenCookie, deleteUserData, setUserData, getQueryParam } from '../utility.jsx';
import { authService } from './authService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAPIUrl } from '../HttpRequest.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

class Loginpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ssoStatus: '',
      showPassword: false,
    }
  }
  componentDidMount() {
    localStorage.removeItem('showdropId');
    console.log(getUserName());
    if (getUserName()) {
      this.clearLoginData();
      console.log("Reloading.....");
      window.location.href = "/login";
      return;
    }

    const error = getQueryParam("sso-error-message");
    if (error) {
      toast.error(error)
    }
    this.postSSLStatus();
  }
  clearLoginData = () => {
    deleteTokenCookie();
    deleteUserData();
  }
  postSSLStatus = () => {
    this.props.onSSOCheck().then(res => {
      if (res.status === "OK") {
        this.setState({ ssoStatus: res.data })
      }
    })
  }

  postLogin = (data, action) => {
    this.props.onLogin(data).then(res => {
      if (res.status === "OK") {
        window.location.href = "/app/main/dashboard";
        setUserData(res.data);
      }
    })
  }

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  render() {
    const { ssoStatus } = this.state;
    const { showPassword } = this.state;
    return (


      <div className="loginPage main-wrapper container-fluid">
        <Helmet>
          <title>Login - WorkPlus</title>
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
            <div style={{ marginTop: '90px' }} className="account-logo">
              <h3><p><img src={loginLogo} alt="WorkPlus" /></p></h3>
              <div className="account-box">
                <div className="account-wrapper">
                  <h3 className="account-title">Welcome</h3>
                  {/* Account Form */}
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      userName: '',
                      password: '',
                      source: 'WEB'
                    }}
                    onSubmit={this.postLogin}
                  // validationSchema={PlanSchema}
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
                        <Field name="source" type="hidden" value="WEB" />
                        <div className="form-group">
                          {/* <label>Email Address</label> */}
                          <Field name="userName" type="text" required className="form-control" placeholder="Email Address *" />
                        </div>
                        <div className="pswrdField">
                          <div className="input-wrapper">
                            <span onClick={this.togglePasswordVisibility} className={showPassword ? `fa fa-eye-slash` : `fa fa-eye`}></span>
                            <Field
                              name="password"
                              type={showPassword ? 'text' : 'password'}
                              required
                              className="form-control"
                              placeholder="Password *"
                            />
                            <span
                              className={showPassword ? `fa fa-eye-slash` : `fa fa-eye`}
                              onClick={this.togglePasswordVisibility}
                            ></span>
                          </div>
                        </div>
                        <div className="text-center form-group">
                          <input style={{ height: '40px', padding: '2px' }} type="submit" className="btn btn-primary account-btn" value="Sign in" />

                        </div>
                        <Link className="simpleLink orange text-center forgotPass-link d-block" to={'/forgot-password'}>Forgot Password?</Link>

                      </Form>)}
                  </Formik>
                  {ssoStatus && ssoStatus.length > 1 && <div className='mt-4'>
                    <label className='text-secondary'>OR Login with</label>
                    <div class="social-login mb-3 mt-3">
                      <div class="social-icons2">
                        {ssoStatus && ssoStatus.indexOf("G,") != -1 && <button type="button" onClick={() => {
                          this.clearLoginData();
                          window.location = getAPIUrl() + '/identity/verify/google'
                        }} class="login-with-google-btn mr-3" > Google
                        </button>}
                        {ssoStatus && ssoStatus.indexOf("M,") != -1 && <button onClick={() => {
                          this.clearLoginData();
                          window.location = getAPIUrl() + '/identity/verify/microsoft'
                        }} type="button" class="login-with-microsoft-btn" > Microsoft
                        </button>}
                      </div>
                    </div>
                  </div>}
                </div>

              </div>
              <div style={{ marginTop: '2em', justifyContent: 'center' }} className='d-flex  text-center'>
                <img className="img-fluid mr-2" src={googlePlay} alt="WorkPlus" />
                <img className="img-fluid" src={appleIcon} alt="WorkPlus" />
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
  onLogin: (data) => dispatch(authService.login(data)),
  onSSOCheck: (data) => dispatch(authService.ssoCheck())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loginpage)