import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { Helmet } from 'react-helmet'; 
import {  getFavIcon, getLogo, getPrimaryColor, getTitle, verifyOrgLevelViewPermission } from '../../../utility';
import { updateFavicon, updateLogo } from './service';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';

export default class LogoForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            logos: props.logos || {
                logo: getLogo(),
                favIcon: getFavIcon(), 
            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.logos && nextProps.logos != prevState.logos) {
            return ({ logos: nextProps.logos })
        } else if (!nextProps.logos) {

            return prevState.logos || ({
                logos: {
                logo: getLogo(),
                favIcon: getFavIcon(), 
                }
            })
        }
        return null;
    }
    saveLogo = (data, action) => {
        action.setSubmitting(true);
        updateLogo(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message); 
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log({ err });
            toast.error("Error while saving logo");
            action.setSubmitting(false);
        })
    }  
    saveFavicon = (data, action) => {
        action.setSubmitting(true);
        updateFavicon(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message); 
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            console.log({ err });
            toast.error("Error while saving favicon");
            action.setSubmitting(false);
        })
    }  


    render() {
        return (
            <div className="insidePageDiv">
             
                <div className="mt-4 content container-fluid">
                {verifyOrgLevelViewPermission("Settings System") && <>
                    <div className="row">

                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Logo</h5>
                                </div>
                                <div className="card-body">
                                    <Formik
                                        enableReinitialize={true}
                                        initialValues={this.state.logos}
                                        onSubmit={this.saveLogo}
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
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <FormGroup>
                                                                    <label>Logo
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field name="logoFileName" type="file" onChange={e=>{
                                                                        setFieldValue('logoFile', e.target.files[0]);
                                                                    }}   accept="image/png" className="form-control"></Field>
                                                                    <span className="form-text text-muted">Recommended image size is 100px x 50px</span>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="img-thumbnail text-center mt-3" style={{ width: "110px" }} >
                                                                <img  src={this.state.logos.logo} style={{ width: "100px",backgroundColor:getPrimaryColor() }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div> 
                                                </div>  
                                                
                                                <input type="submit" className="btn btn-primary" value="Save" /> 
                                            </Form>
                                        )
                                        }
                                    </Formik>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title">Favicon</h5>
                                </div>
                                <div className="card-body">
                                    <Formik
                                        enableReinitialize={true}
                                        initialValues={this.state.logos}
                                        onSubmit={this.saveFavicon}
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
                                                <div className="row">
                                                        <div className="col-md-12">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <FormGroup>
                                                                    <label>Favicon
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field name="faviconFileName" type="file" onChange={e=>{
                                                                        setFieldValue('faviconFile', e.target.files[0]);
                                                                    }} accept="image/png" className="form-control"></Field>
                                                                    <span className="form-text text-muted">Recommended image size is 16px x 16px</span>
                                                                </FormGroup>
                                                            </div>
                                                            <div className="col-md-6">
                                                            <div className="img-thumbnail text-center mt-4" style={{ width: "50px" }} >
                                                                <img  src={this.state.logos.favIcon} style={{ width: "30px"}} />
                                                            </div>
                                                            </div>
                                                        </div>
                                                        
                                                        </div>
                                                </div>  
                                                
                                                <input type="submit" className="btn btn-primary" value="Save" /> 
                                            </Form>
                                        )
                                        }
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>}
                     {!verifyOrgLevelViewPermission("Settings System") && <AccessDenied></AccessDenied>}
                </div>
            </div>

        )
    }
}
