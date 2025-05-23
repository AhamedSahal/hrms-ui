import React, { useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Helmet } from "react-helmet";
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { loginLogo, loginbg } from '../Entryfile/imagepath.jsx';
import { forgotPasswordReset, validateToken } from './service.jsx';
import PasswordField from './PasswordField.jsx';
import { FormGroup } from 'react-bootstrap';
import { setUserData } from '../utility.jsx';

const ForgotPasswordReset = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');
  
  const [state, setState] = React.useState({
    isTokenValidated: false,
    isTokenValid: false,
    invalidTokenMessage: "",
    showPassword: false,
    showConfirmPassword: false,
  });

  useEffect(() => {
    validateToken(token).then(res => {
      if (res.status === "OK") {
        setUserData({
          companySetting: res.data,
        });
        setState(prevState => ({
          ...prevState,
          isTokenValidated: true,
          isTokenValid: true,
        }));
      } else {
        setState(prevState => ({
          ...prevState,
          isTokenValidated: true,
          isTokenValid: false,
          invalidTokenMessage: res.message,
        }));
      }
    });
  }, [token]);

  const postForgotPasswordReset = (data) => {
    forgotPasswordReset({
      email: data.email,
      password: data.password,
      token: data.token,
    }).then(res => {
      if (res.status === "OK") {
        toast.success(res.message);
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
      } else {
        toast.error(res.message);
      }
    });
  };

  const togglePasswordVisibility = () => {
    setState(prevState => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  const toggleConfirmPasswordVisibility = () => {
    setState(prevState => ({
      ...prevState,
      showConfirmPassword: !prevState.showConfirmPassword,
    }));
  };

  const { isTokenValid, isTokenValidated, invalidTokenMessage, showPassword, showConfirmPassword } = state;

  return (
    <div className="loginPage main-wrapper container-fluid">
      <Helmet>
        <title>Reset Password - WorkPlus</title>
        <meta name="description" content="Login page" />
      </Helmet>
      <div className="row h-100">
        <div className="col-lg-7 d-none d-sm-flex login_img" style={{ backgroundImage: `url(${loginbg})` }}>
          <div>
            <h2>The <span> employee experience platform </span> for <br />
              empowering a digital and eco-friendly workspace</h2>
          </div>
        </div>
        <div className="col-lg-5 login_form">
          <div style={{ marginTop: '90px' }} className="account-logo">
            <h3><p><img src={loginLogo} alt="WorkPlus" /></p></h3>
            <div className="account-box">
              <div className="account-wrapper">
                <h3 className="account-title">Reset Password</h3>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    password: '',
                    token: token,
                    email: '',
                    confirmPassword: ''
                  }}
                  onSubmit={postForgotPasswordReset}
                  validationSchema={Yup.object().shape({
                    email: Yup.string().email("Please enter valid Email"),
                    confirmPassword: Yup.string()
                      .required("Please provide confirm password")
                      .oneOf([Yup.ref('password'), null], 'Passwords must match')
                  })}
                >
                  {({ values, setFieldValue }) => (
                    <Form autoComplete='off'>
                      <FormGroup>
                        <Field name="email" className="form-control" required placeholder="Enter Email*" />
                        <ErrorMessage name="email">{msg => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                      </FormGroup>
                      <FormGroup>
                        <div className="pswrdField">
                          <div className="input-wrapper">
                            <PasswordField
                              placeholder="Password *"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              required
                              onChange={(value) => setFieldValue("password", value)}
                            />
                            <span
                              className={showPassword ? `fa fa-eye-slash` : `fa fa-eye`}
                              onClick={togglePasswordVisibility}
                            ></span>
                          </div>
                        </div>
                        <ErrorMessage name="password">{msg => <div style={{ color: "red" }}>{msg}</div>}</ErrorMessage>
                      </FormGroup>
                      <FormGroup>
                        <div className="pswrdField">
                          <div className="input-wrapper">
                            <Field
                              name="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              required
                              className="form-control"
                              placeholder="Confirm Password *"
                            />
                            <span
                              className={showConfirmPassword ? `fa fa-eye-slash` : `fa fa-eye`}
                              onClick={toggleConfirmPasswordVisibility}
                            ></span>
                          </div>
                        </div>
                        <ErrorMessage name="confirmPassword">{msg => <div style={{ color: 'red' }}>{msg}</div>}</ErrorMessage>
                      </FormGroup>
                      <div className="text-center form-group">
                        <input type="hidden" name="token" value={values.token} />
                        <input type="submit" className="btn btn-primary account-btn" value="Reset Password" />
                      </div>
                      {isTokenValidated && !isTokenValid && <div className='text text-danger'>
                        <strong>{invalidTokenMessage}</strong>
                      </div>}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordReset;
