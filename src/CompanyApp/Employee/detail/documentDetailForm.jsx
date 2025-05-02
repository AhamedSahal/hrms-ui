import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { updateDocumentInformation } from './service';

export default class DocumentDetailEmployeeForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            document: props.document || {
                documentNo: "",
                documentStatus: "PENDING",
                documentType: "",
                documentTypeId: 0,
                downloadId: 0,
                expireOn: null,
                fileName: "",
                issuedOn: null,
                required: true,
            }
        }
    }
    save = (data, action) => {
        try{
        const issuedOn = new Date(data.issuedOn);
        const expiredOn = data.expireOn ? new Date(data.expireOn) : new Date('2099-12-12');

        if (expiredOn <= issuedOn) {
        toast.error("ExpiredOn Should be Greater Than IssuedOn");
        return;
        }
        data["issuedOn"] = issuedOn.toISOString();
        data["expireOn"] = expiredOn.toISOString();

        action.setSubmitting(true);
        updateDocumentInformation(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        })}catch(err) {
            toast.error("Error while saving Document Detail");
            action.setSubmitting(false);
        }
    }
     validateExpireOn = (value) => {
          const selectedDate = new Date(value);
          const currentDate = new Date();
          if (selectedDate <= currentDate) {
            return 'Expire On date must be greater than the current date.';
          }
          return undefined;
        };
    render() {
        const { document } = this.state;
        document.file = "";
        return (
            <div className="row">

                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-header">
                            <div className="row align-items-center"><div className="col"><h3 className="page-title">Document Detail</h3></div>
                                <div className="float-right col-auto ml-auto">{this.state.document.employeeName}</div>
                            </div>
                        </div>
                        <div className="card-body">
                            <Formik
                                enableReinitialize={true}
                                initialValues={document}
                                onSubmit={this.save}
                            // validationSchema={EmployeeSchema}
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
                                        <FormGroup>
                                            <label>Document Type
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field readOnly={true} name="documentType" className="form-control"></Field>

                                        </FormGroup>
                                        <FormGroup>
                                            <label>Document Number
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="documentNo" required className="form-control"></Field>
                                            <ErrorMessage name="documentNo">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                        <FormGroup>
                                            <label>Issued On
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field type="date" name="issuedOn" required className="form-control"></Field>
                                            <ErrorMessage name="issuedOn">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                        <FormGroup>
                                            <label>Expire On
                                            </label>
                                            <Field type="date" name="expireOn" className="form-control" min={new Date().toISOString().split('T')[0]}></Field>
                                            <ErrorMessage name="expireOn">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>

                                        <FormGroup>
                                            <label>File
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <input name="file" type="file" required className="form-control" onChange={e => {
                                                setFieldValue('file', e.target.files[0]);
                                            }} />
                                            <ErrorMessage name="file">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                        <input type="submit" className="btn btn-primary" value={"Update"} />
                                    </Form>
                                )
                                }
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}
