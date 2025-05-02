/**
 * Signin Firebase
 */

 import { Field, Form, Formik } from 'formik';
 import React, { Component } from 'react';
 import { Helmet } from "react-helmet";
 import { connect } from 'react-redux';
 import { loginLogo, loginbg } from '../Entryfile/imagepath.jsx';
 import { setUserData } from '../utility.jsx';
 import { authService } from './authService';
 import { Link } from 'react-router-dom';
 
 class OTPPage extends Component {
   constructor(props) {
     super(props);
     this.state = {
     }
   }
   postOtp = (data, action) => {
     this.props.onValidateOtp(data.otp).then(res => {
       if (res.data === 1) {
         window.location.href = "/app/main/dashboard";
       }
     })
   }
 
   render() {
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

              <h2>The <span> employee experience platform </span> for <br />
                 empowering a digital and eco-friendly workspace</h2>
              {/* <img className="img-fluid" src={loginbg} alt="WorkPlus" /> */}
            </div>
          </div>
          <div className="col-lg-5 login_form">
            <div style={{ marginTop: '90px' }} className="account-logo">
              <h3><p><img src={loginLogo} alt="WorkPlus" /></p></h3>
              <div className="account-box">
                <div className="account-wrapper">
                  <h3 className="account-title">OTP</h3>
                  {/* Account Form */}
                  <Formik
                     enableReinitialize={true}
                     initialValues={{
                       otp: '',
                     }}
                     onSubmit={this.postOtp}
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
                           <label>OTP</label>
                           <Field name="otp" type="text" required className="form-control" placeholder="One time password" />
                         </div>
                         <div className="text-center form-group">
                           <input type="submit" className="btn btn-primary account-btn" value="Verify" /> 
                         </div> 
 
                       </Form>)}
                   </Formik>
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
  onValidateOtp: (otp) => dispatch(authService.validateOtp(otp))
 })
 
 export default connect(
   mapStateToProps,
   mapDispatchToProps
 )(OTPPage)