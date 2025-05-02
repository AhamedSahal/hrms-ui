import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getDocumentInformation, updateDocumentInformation } from '../../../CompanyApp/Employee/detail/service';
import { getEmployeeId, getUserName, verifyEditPermission } from '../../../utility';

export default class UploadDocsEmployeeForm extends Component {
    constructor(props) {
        super(props)


        this.state = {
            document: {
                documentNo: "",
                documentStatus: "PENDING",
                documentType: "",
                documentTypeId: 0,
                downloadId: 0,
                expireOn: null,
                fileName: "",
                issuedOn: null,
                required: true,
            },
            documentList: [],
            dounmentValidation: true,
            pendingDocuments: [],
            id:  getEmployeeId() || 0,
        }
    }

    componentDidMount () {
        this.fetchList()
    }

    fetchList = () => {
        getDocumentInformation(this.state.id).then(res => {
            if (res.status === "OK") {
                const pendingDocuments = res.data.filter(doc => doc.documentStatus === 'PENDING');
                
                this.setState({
                    documentList: res.data,
                    pendingDocuments,
                });
            }
        })
    }

    handleDocsType = (e) => {
       const selectId = e.target.value
    if(selectId > 0){
        const selectedDocument = this.state.pendingDocuments.find(doc => doc.documentTypeId === parseInt(selectId));
        this.setState({document: selectedDocument})
        if( (selectedDocument.edit || verifyEditPermission("COMPANY_ADMIN") )){
            this.setState({dounmentValidation : true})
        }else{
            toast.error("No permission");
            this.setState({dounmentValidation : false})
        }
    }else{
        this.setState({dounmentValidation : false})
    }
    }

    save = (data, action) => {
        try {
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
                    // toast.success(res.message);
                    this.props.showAlert('submit');
                    this.props.updateList(res.data);
                } else {
                    toast.error(res.message);
                }
                action.setSubmitting(false)
            })
        } catch {
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
                                <div style={{fontWeight: 'bold'}} className="float-right col-auto ml-auto">{getUserName()}</div>
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
                                    setFieldValue,
                                }) => (
                                    <Form autoComplete='off'>
                                        <FormGroup>
                                            <label>Document Type
                                                <span style={{ color: "red" }}>*</span>
                                            </label>
                                            <select  onChange={(e) => this.handleDocsType(e)}   name='proficiencyLevel' data-toggle="dropdown" className='form-control '
                                            >
                                                <option value={0}>Select Document</option>
                                                {this.state.pendingDocuments.map(doc => (
                                                    <option key={doc.documentTypeId} value={doc.documentTypeId}>
                                                        {doc.documentType}
                                                    </option>
                                                ))}
                                            </select>

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
                                        <input type="submit" disabled={!this.state.dounmentValidation} className="btn btn-primary" value={"Update"} />
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
