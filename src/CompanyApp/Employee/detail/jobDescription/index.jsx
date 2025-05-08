import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Modal, Anchor } from 'react-bootstrap';
import { FormGroup } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getLogo,verifyEditPermission} from '../../../../utility';
import { getJobDescriptionById, saveJobDescriptionById } from './service';
import { PeoplesJobDescriptionSchema } from './validation';


const { Header, Body, Footer, Dialog } = Modal;
export default class PeoplejobDescription extends Component {
    constructor(props) {
        super(props)
        this.state = {
            employeeId: props.employeeId || 0,
            logo: getLogo(),
            editable: false,
            jobdescription: {
                employeeId: props.employeeId || 0,
                id: 0 ,
                name: "", 
                jobpurpose: "",
                keyAccResp: "",
                keyskills: "",
                qualiExper: "",
                addreq: "",
                editedStatus: false
                
            }
            
        }
    }

    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        getJobDescriptionById(this.state.employeeId).then(res => {
            if (res.status == "OK") {
                this.setState({
                    jobdescription: res.data,
                })
              }
        })
    }
    save = (data, action) => {
        data["employeeId"] = this.state.employeeId;
        action.setSubmitting(true);
        saveJobDescriptionById(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.updateList(res.data);
            } else {

                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error(err);
            action.setSubmitting(false);
        })
    }

    hideForm = () => {
        this.setState({
          showForm: false
        })
        this.fetchList();
}
updateList = (JobDescription) => {
        this.setState({ JobDescription: JobDescription },
          () => {
            this.hideForm();
          });
      }

    render() {
        let { editable, employeeId } = this.state;
        const isEditAllowed = verifyEditPermission("EMPLOYEE");
        if (editable && !isEditAllowed) {
            editable = true;
        }
        const { logo } = this.state;
        const { jobdescription } = this.state;
        const { jobpurpose, keyAccResp, qualiExper, keyskills, addreq, editedStatus } = this.state.jobdescription;
        return (
            <>
                <> 
                <div className="row">
                  <div className='d-flex' style={{ padding: '20px', justifyContent: 'flex -end' }}>
                  {editedStatus && <span className='p-1 badge bg-inverse-success'><i className="pr-2 fa fa-check text-success"></i> Personalized Edit</span>}
                   </div>
            
                    <div style={{ padding: '20px', justifyContent: 'flex-end'}} className="text-end" >
                        <a href={'#'} onClick={() => this.setState({ editable: true, showForm: true})} className="btn btn-success btn-sm" >
                            <i className="fa fa-edit"></i>
                            &nbsp;Edit
                        </a>
                    </div>
                    </div>
                  
                    <table className="table table-bordered" id="card">
                        <div className="card-body">
                            <h3 className="jd-title" align="center" style={{ fontFamily: 'Lucida Sans', color: "#6D7B8D" }}>JOB DESCRIPTION</h3>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div>
                                        <table className="table table-bordered" style={{ "borderWidth": "2px", 'borderColor': "#000000", 'borderStyle': 'solid' }}>
                                            <tr>
                                                <td className="block-example border border-dark" colSpan={"4"} align="center" style={{ backgroundColor: "#808080", color: "white" }} ><strong>JOB PURPOSE</strong></td>
                                            </tr>
                                            <tbody>
                                                <tr className="col-md-12">
                                                    <td className="block-example border border-dark"> {jobpurpose} </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div>
                                        <table className="table table-bordered" style={{ "borderWidth": "2px", 'borderColor': "#000000", 'borderStyle': 'solid' }}>
                                            <tr>
                                                <td className="block-example border border-dark" colSpan={"4"} align="center" style={{ backgroundColor: "#808080", color: "white" }} ><strong>KEY ACCOUNTABILITIES AND RESPONSIBILITIES</strong></td>
                                            </tr>
                                            <tbody>
                                                <tr >
                                                    <td className="block-example border border-dark">
                                                        {keyAccResp}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div>

                                        <table className="table table-bordered" style={{ "borderWidth": "2px", 'borderColor': "#000000", 'borderStyle': 'solid' }}>
                                            <tr>
                                                <td className="block-example border border-dark" colSpan={"4"} align="center" style={{ backgroundColor: "#808080", color: "white" }} ><strong> JOB REQUIREMENTS </strong></td>
                                            </tr>
                                            <tbody>
                                                <tr >
                                                    <td className="block-example border border-dark"><strong bgcolor="#E5E4E2">Minimum Qualifications and Experience:</strong>
                                                        <p>{qualiExper}
                                                        </p></td>
                                                </tr>
                                                <tr >
                                                    <td className="block-example border border-dark"><strong>Key Skills and Competencies:</strong>
                                                        <p>{keyskills}
                                                        </p></td>

                                                </tr>
                                                <tr >
                                                    <td className="block-example border border-dark"><strong>Additional Requirements:</strong>
                                                        <p> {addreq}
                                                        </p></td>

                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </table>

                    <Modal enforceFocus={false} size={"xl"} show={this.state.showForm} onHide={this.hideForm}>
                        <Header closeButton>
                            <h5 className="modal-title">Edit Job Description</h5>
                        </Header>
                        <Body>
                            <Formik
                                enableReinitialize={true}
                                initialValues={this.state.jobdescription}
                                onSubmit={this.save}
                                validationSchema={PeoplesJobDescriptionSchema}
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
                                    <Form autoComplete='off'>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="card">
                                                    <div className="card-header">
                                                        <div className="row align-items-center"><div className="col"><h4>Job Purpose</h4> </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <FormGroup>
                                                                    <Field name="jobpurpose" className="form-control" placeholder="Job Purpose" component="textarea" rows="3"></Field>
                                                                    <ErrorMessage name="jobpurpose">
                                                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                </ErrorMessage>
                                                                </FormGroup>
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="card">
                                                    <div className="card-header">
                                                        <div className="row align-items-center"><div className="col"><h4>Key Accountabilities And Responsibilities</h4> </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <FormGroup>
                                                                    <Field name="keyAccResp" className="form-control" placeholder="Key Accountabilities And Responsibilities" component="textarea" rows="3"></Field>
                                                                    <ErrorMessage name="keyAccResp">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-sm-12">
                                                <div className="card">
                                                    <div className="card-header">
                                                        <div className="row align-items-center"><div className="col"><h4>Job Requirements </h4> </div>
                                                        </div>
                                                    </div>
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <FormGroup>
                                                                    <label>Minimum Qualifications and Experience
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field name="qualiExper" className="form-control" component="textarea" rows="3"></Field>
                                                                    <ErrorMessage name="qualiExper">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <FormGroup>
                                                                    <label>Key Skills and Competencies
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field name="keyskills" className="form-control" component="textarea" rows="3"></Field>
                                                                    <ErrorMessage name="keyskills">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <FormGroup>
                                                                    <label>Additional Requirements
                                                                        <span style={{ color: "red" }}>*</span>
                                                                    </label>
                                                                    <Field name="addreq" className="form-control" component="textarea" rows="3"></Field>
                                                                    <ErrorMessage name="addreq">
                                                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                                    </ErrorMessage>
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <input disabled={!editable} type="submit" className="btn btn-primary" value={this.state.jobdescription?.id > 0 ? "Update" : "Save"} />
                                        &nbsp;
                                        <Anchor onClick={() => { this.setState({ editable: false, showForm: false }) }} className="btn btn-secondary btn-sm" ><span>Cancel</span></Anchor>
                                    </Form>
                                )
                                }
                            </Formik>
                        </Body>
                    </Modal>

                </>

            </>
        )
    }
}