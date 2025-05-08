import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { Helmet } from 'react-helmet';
import { getTitle, verifyOrgLevelViewPermission, verifyOrgLevelEditPermission } from '../../../utility';
import { getOrgSettings, updateOrgSettings } from './service';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';


export default class OrgSetupForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orgsetup: props.orgsetup || {
        id: 0,
        division: true,
        department: true,
        section: true,
        function: true,
        location: true,
        grades: true,
        entity: true
      }
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {

    if (nextProps.orgsetup && nextProps.orgsetup != prevState.orgsetup) {
      return ({ orgsetup: nextProps.orgsetup })
    } else if (!nextProps.orgsetup) {
      return prevState.orgsetup || ({
        orgsetup: nextProps.orgsetup || {
          id: 0,
          division: true,
          department: true,
          section: true,
          function: true,
          location: true,
          grades: true,
          entity: true
        }
      })
    }
    return null;
  }
  componentDidMount() {
    if(verifyOrgLevelViewPermission("Module Setup Organise")){
    getOrgSettings().then(res => {
      if (res.status == "OK") {
        this.setState({ orgsetup: res.data })
      }
    })
    }
  }

  save = (data, action) => {
    action.setSubmitting(true);
    updateOrgSettings(data).then(res => {
      if (res.status == "OK") {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      action.setSubmitting(false)
    }).catch(err => {
      console.log({ err });
      toast.error("Error while saving Organization Setup");
      action.setSubmitting(false);
    })
  }

  render() {
    return (

      <div className="page-container content container-fluid">
        {/* Page Header */}
        <div className="tablePage-header">
          <div className="row pageTitle-section">
            <div className="col">
              <h3 className="tablePage-title" >Organization Setup</h3>
              <ul hidden className="breadcrumb">
                <li className="breadcrumb-item"><a href="/app/main/dashboard">Dashboard</a></li>
                <li className="breadcrumb-item active">Organization Setup</li>
              </ul>
            </div>


          </div>
        </div>

        {/* /Page Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="card-body ">
              {verifyOrgLevelViewPermission("Module Setup Organise") && <Formik
                enableReinitialize={true}
                initialValues={this.state.orgsetup}
                onSubmit={this.save}
              // validationSchema={overtimeSchema}
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
                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                      <div className="row">
                        <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                          <h6 className="card-title m-b-20">Organization Access</h6>
                          <div className="m-b-30">
                            <ul className="list-group notification-list">
                             <li className="list-group-item" style={{ height: "60px" }}>
                                <FormGroup>
                                  <div type="checkbox" name="entity" onClick={e => {
                                    let { orgsetup } = this.state;
                                    if (verifyOrgLevelEditPermission("Module Setup Organise")) {
                                      orgsetup.entity = !orgsetup.entity;
                                      setFieldValue("entity", orgsetup.entity);
                                      this.setState({
                                        orgsetup
                                      });
                                    }
                                  }} >
                                    <label>Entity</label>
                                    <div className="status-toggle"><i className={`fa fa-3x ${this.state.orgsetup
                                      && this.state.orgsetup.entity
                                      ? 'fa-toggle-on text-success' :
                                      'fa fa-toggle-off text-danger'}`}></i></div>
                                  </div>
                                </FormGroup>
                              </li>
                              <li className="list-group-item" style={{ height: "60px" }}>
                                <FormGroup>
                                  <div type="checkbox" name="division" onClick={e => {
                                    let { orgsetup } = this.state;
                                    if (verifyOrgLevelEditPermission("Module Setup Organise")) {
                                      orgsetup.division = !orgsetup.division;
                                      setFieldValue("division", orgsetup.division);
                                      this.setState({
                                        orgsetup
                                      });
                                    }
                                  }} >
                                    <label>Division</label>
                                    <div className="status-toggle" ><i className={`fa fa-3x ${this.state.orgsetup.division
                                      ? 'fa-toggle-on text-success' :
                                      'fa fa-toggle-off text-danger'}`}></i></div>
                                  </div>
                                </FormGroup>
                              </li>
                              <li className="list-group-item" style={{ height: "60px" }}>
                                <FormGroup>
                                  <div type="checkbox" name="department" onClick={e => {
                                    let { orgsetup } = this.state;
                                    if (verifyOrgLevelEditPermission("Module Setup Organise")) {
                                      orgsetup.department = !orgsetup.department;
                                      setFieldValue("department", orgsetup.department);
                                      this.setState({
                                        orgsetup
                                      });
                                    }
                                  }} >
                                    <label>Department</label>
                                    <div className="status-toggle"><i className={`fa fa-3x ${this.state.orgsetup
                                      && this.state.orgsetup.department
                                      ? 'fa-toggle-on text-success' :
                                      'fa fa-toggle-off text-danger'}`}></i></div>
                                  </div>
                                </FormGroup>
                              </li>
                              <li className="list-group-item" style={{ height: "60px" }}>
                                <FormGroup>
                                  <div type="checkbox" name="section" onClick={e => {
                                    let { orgsetup } = this.state;
                                    if (verifyOrgLevelEditPermission("Module Setup Organise")) {
                                      orgsetup.section = !orgsetup.section;
                                      setFieldValue("section", orgsetup.section);
                                      this.setState({
                                        orgsetup
                                      });
                                    }
                                  }} >
                                    <label>Section</label>
                                    <div className="status-toggle"><i className={`fa fa-3x ${this.state.orgsetup
                                      && this.state.orgsetup.section
                                      ? 'fa-toggle-on text-success' :
                                      'fa fa-toggle-off text-danger'}`}></i></div>
                                  </div>
                                </FormGroup>
                              </li>
                              <li className="list-group-item" style={{ height: "60px" }}>
                                <FormGroup>
                                  <div type="checkbox" name="function" onClick={e => {
                                    let { orgsetup } = this.state;
                                    if (verifyOrgLevelEditPermission("Module Setup Organise")) {
                                      orgsetup.function = !orgsetup.function;
                                      setFieldValue("function", orgsetup.function);
                                      this.setState({
                                        orgsetup
                                      });
                                    }
                                  }} >
                                    <label>Function</label>
                                    <div className="status-toggle"><i className={`fa fa-3x ${this.state.orgsetup
                                      && this.state.orgsetup.function
                                      ? 'fa-toggle-on text-success' :
                                      'fa fa-toggle-off text-danger'}`}></i></div>
                                  </div>
                                </FormGroup>
                              </li>
                              <li className="list-group-item" style={{ height: "60px" }}>
                                <FormGroup>
                                  <div type="checkbox" name="location" onClick={e => {
                                    let { orgsetup } = this.state;
                                    if (verifyOrgLevelEditPermission("Module Setup Organise")) {
                                      orgsetup.location = !orgsetup.location;
                                      setFieldValue("location", orgsetup.location);
                                      this.setState({
                                        orgsetup
                                      });
                                    }
                                  }} >
                                    <label>Location</label>
                                    <div className="status-toggle"><i className={`fa fa-3x ${this.state.orgsetup
                                      && this.state.orgsetup.location
                                      ? 'fa-toggle-on text-success' :
                                      'fa fa-toggle-off text-danger'}`}></i></div>
                                  </div>
                                </FormGroup>
                              </li>
                              <li className="list-group-item" style={{ height: "60px" }}>
                                <FormGroup>
                                  <div type="checkbox" name="grades" onClick={e => {
                                    let { orgsetup } = this.state;
                                    if (verifyOrgLevelEditPermission("Module Setup Organise")) {
                                      orgsetup.grades = !orgsetup.grades;
                                      setFieldValue("grades", orgsetup.grades);
                                      this.setState({
                                        orgsetup
                                      });
                                    }
                                  }} >
                                    <label>Grades</label>
                                    <div className="status-toggle"><i className={`fa fa-3x ${this.state.orgsetup
                                      && this.state.orgsetup.grades
                                      ? 'fa-toggle-on text-success' :
                                      'fa fa-toggle-off text-danger'}`}></i></div>
                                  </div>
                                </FormGroup>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: "25px" }}>
                      {verifyOrgLevelEditPermission("Module Setup Organise") && <input type="submit" style={{ color: 'white', background: '#102746' }} className="btn" value="Update" />}</div>
                  </Form>
                )
                }
              </Formik>}
              {!verifyOrgLevelViewPermission("Module Setup Organise") && <AccessDenied></AccessDenied>}
            </div>
          </div>
        </div>
      </div>




    )
  }
}
