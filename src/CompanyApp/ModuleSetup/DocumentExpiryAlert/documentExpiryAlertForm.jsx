import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getDocumentExpiryAlertDays, saveExpiryDocumentAlert } from './service';
import { Button, Modal, InputGroup } from 'react-bootstrap';
import { verifyOrgLevelViewPermission } from '../../../utility';
import AccessDenied from '../../../MainPage/Main/Dashboard/AccessDenied';
const { Header, Body, Footer, Dialog } = Modal;




export default class DocumentExpiryAlert extends Component {
    constructor(props) {
        super(props)
        this.state = {
            xDays: "",
        }
    }
    componentDidMount = () => {
        this.fetchList();
    }
    save = () => {
        try {
            saveExpiryDocumentAlert(this.state.xDays).then(res => {
                if (res.status === "OK") {
                    toast.success(res.message);
                    //   this.props.updateList(res.data);
                } else {
                    toast.error(res.message);
                }
            })
        } catch (error) {
            toast.error("Error while saving Document Expiry Alert");
        }
    };


    fetchList = () => {
        if(verifyOrgLevelViewPermission("Module Setup Notification Alert")){
        getDocumentExpiryAlertDays().then(res => {
            if (res.status === 'OK') {
                this.setState({
                    xDays: res.data,
                })
            } else {
                console.log("Error: " + res.error);
            }
        })
            .catch(error => { console.log("Error: " + error); });
        }
    }

    render() {
        return (
            <div>
                {verifyOrgLevelViewPermission("Module Setup Notification Alert") &&
                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.documentExpiryAlert}
                //onSubmit={this.save}
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

                        <table className="table mt-4">
                            <tbody>
                                <tr>
                                    <td>
                                        <label className='mt-2'><strong>Document expiry alert before “x” days</strong>
                                            <span style={{ color: "red" }}>*</span>
                                        </label>
                                    </td>
                                    <td>
                                        <Field name="xDays" className="form-control" value={this.state.xDays} onChange={(e) => this.setState({ xDays: e.target.value })} />
                                        <ErrorMessage name="xDays">
                                            {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </td>
                                    <td>
                                        <input type="button" className="btn btn-primary" value={"Update"} onClick={this.save} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    )}
                </Formik>}
                      {!verifyOrgLevelViewPermission("Module Setup Notification Alert") && <AccessDenied></AccessDenied>}
            </div>
        )
    }
}