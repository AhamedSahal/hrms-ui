import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Yup from 'yup';
import { loginLogo,loginbg } from '../Entryfile/imagepath.jsx';
import { forgotPasswordRequest } from './service.jsx';

class ForgotPassword extends Component {

  postForgotPassword = (data) => {
    forgotPasswordRequest(data.email).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      } else {
        toast.error(res.message);
      }
    })
  }
  render() {
    return (<>
        <div className="loginPage main-wrapper container-fluid">
        <Helmet>
          <title>Login - WorkPlus</title>
          <meta name="description" content="Login page" />
        </Helmet>
        <div className="row h-100">
          <div className="col-lg-7 d-none d-sm-flex  login_img" style={{backgroundImage: `url(${loginbg})`}}>
            <div>

            <h2>The Employee experience platform empowering workplaces for a digital future </h2>
              {/* <img className="img-fluid" src={loginbg} alt="WorkPlus" /> */}
            </div>
          </div>
          <div className="col-lg-5 login_form">
            <div className="account-logo">
              <h3><p><img src={loginLogo} alt="WorkPlus" /></p></h3>
              <div className="account-box">
                <div className="account-wrapper">
                  <h3 className="account-title">Welcome</h3>
                  {/* Account Form */}
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      email: ''
                    }}
                    onSubmit={this.postForgotPassword}
                    validationSchema={Yup.object().shape({
                      email: Yup.string()
                        .email('Please provide Valid email')
                    })}
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
                          <label>Email Address 
                          <span style={{ color: "red" }}> *</span></label>
                          <Field name="email" type="text" required className="form-control" placeholder="Email Address" />
                          <ErrorMessage name="email">
                          {msg => <div style={{ color: 'red' }}>{msg}</div>}
                        </ErrorMessage>
                        </div>
                        <div className="text-center form-group">
                          <input type="submit" className="btn btn-primary account-btn" value="Send Link" />

                        </div>


                      </Form>)}
                  </Formik>
                  {/* /Account Form */}
                  <Link className="simpleLink orange" to={'/login'}>Remember your password?</Link>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </>
    );
  }
}


export default ForgotPassword;
