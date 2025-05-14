import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getTitle, getUserType, toLocalDateTime } from '../../../utility';
import { Helmet } from 'react-helmet';
import { getDocumentById, updateDocumentRequestStatus } from './service';
import { Modal, FormGroup } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import SignatureDropdown from '../Dropdown/SignatureDropdown';
import { Button } from 'reactstrap';
import { toast } from "react-toastify";
const { Header, Body } = Modal;
const signatureRegex = /\${signature}/g;
const signatureWithDesignationRegex = /\${signatureDesignation}/g;

const DocumentRequestView = () => {
    const location = useLocation();
    const id = location.state?.id;
    const [state, setState] = useState({
        id: id,
        signatureSelectedArr: [],
        signatureWithDesignationSelectedArr: [],
        data: null,
        document: '',
        downloadableDocument: '',
        downloadableDocumentWithSignature: '',
        signatureCount: 0,
        signatureWithDesignationCount: 0,
        show: false
    });

    useEffect(() => {
        if (id) {
            getDocumentById(id).then(res => {
                if (res.status === "OK") {
                    setState(prevState => ({
                        ...prevState,
                        data: res.data,
                        document: `${res.data.templateDetails?.header} ${res.data.templateDetails?.body} ${res.data.templateDetails?.footer}`,
                        downloadableDocument: res.data.document,
                        downloadableDocumentWithSignature: res.data.document
                    }));
                    calculateSignatureCount(res.data.document);
                }
            });
        }
    }, [id]);

    const calculateSignatureCount = (downloadableDocument) => {
        const signatureCount = (downloadableDocument.match(signatureRegex) || []).length;
        const signatureWithDesignationCount = (downloadableDocument.match(signatureWithDesignationRegex) || []).length;
        setState(prevState => ({
            ...prevState,
            signatureCount,
            signatureWithDesignationCount,
            signatureSelectedArr: Array(signatureCount)
        }));
    };

    const updateSignature = (signature, index) => {
        let signatureSelectedArr = [...state.signatureSelectedArr];
        signatureSelectedArr[index - 1] = signature;
        setState(prevState => ({ ...prevState, signatureSelectedArr }));
        replaceSignature(signatureSelectedArr, state.signatureWithDesignationSelectedArr, state.downloadableDocument);
    };

    const updateSignatureWithDesignation = (signature, designation, index) => {
        let signatureWithDesignationSelectedArr = [...state.signatureWithDesignationSelectedArr];
        signatureWithDesignationSelectedArr[index - 1] = { signature, designation };
        setState(prevState => ({ ...prevState, signatureWithDesignationSelectedArr }));
        replaceSignature(state.signatureSelectedArr, signatureWithDesignationSelectedArr, state.downloadableDocument);
    };

    const replaceSignature = (signatureSelectedArr, signatureWithDesignationSelectedArr, downloadableDocument) => {
        let downloadableDocumentWithSignature = downloadableDocument;
        let n = signatureSelectedArr.length - 1;
        for (let index = signatureSelectedArr.length - 1; index >= 0; index--) {
            const signature = signatureSelectedArr[index] ? `<img style='max-width:200px;' src='${signatureSelectedArr[index]}'/>` : "${signature}";
            downloadableDocumentWithSignature = downloadableDocumentWithSignature.replace(signatureRegex, v => {
                if (n-- == index) {
                    return signature;
                } else {
                    return v;
                }
            });
        }

        let m = signatureWithDesignationSelectedArr.length - 1;
        for (let index = signatureWithDesignationSelectedArr.length - 1; index >= 0; index--) {
            const signature = signatureWithDesignationSelectedArr[index] ? `<div style="max-width"><img style='max-width:200px;' src='${signatureWithDesignationSelectedArr[index].signature}'/><br/>${signatureWithDesignationSelectedArr[index].designation}</div>` : "${signatureDesignation}";
            downloadableDocumentWithSignature = downloadableDocumentWithSignature.replace(signatureWithDesignationRegex, v => {
                if (m-- == index) {
                    return signature;
                } else {
                    return v;
                }
            });
        }

        setState(prevState => ({ ...prevState, downloadableDocumentWithSignature }));
    };

    const updateStatus = (data, action) => {
        if (getUserType() == 'COMPANY_ADMIN') {
            action.setSubmitting(true);
            data.document = state.downloadableDocumentWithSignature;
            updateDocumentRequestStatus(data).then(res => {
                toast.success(res.message);
                action.setSubmitting(false);
                hideApprovalForm();
            });
        }
    };

    const hideApprovalForm = () => {
        setState(prevState => ({ ...prevState, show: false }));
    };

    const { data, document, downloadableDocumentWithSignature, signatureCount, signatureWithDesignationCount, show } = state;

    if (!id) {
        return <div>Error: Document ID not found.</div>;
    }

    return (
        <>
            <div className="page-wrapper">
                <Helmet>
                    <title>DocumentRequest | {getTitle()}</title>
                    <meta name="description" content="Role page" />
                </Helmet>
                <div className="ml-3 pr-4 content container-fluid">
                    <div className="page-header">
                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                            <Button className="btn btn-primary">
                                <a href="/app/company-app/document-request"><i className="fa fa-arrow-left" style={{ color: 'black' }} /><span style={{ color: 'black' }}>  Back </span></a>
                            </Button>
                        </div>
                        <div className="row align-items-center">
                            <div className="float-right col">
                                {data && <div className="card">
                                    <div className="card-header">
                                        <div className="row">
                                            <div className="col-md-8" dangerouslySetInnerHTML={{
                                                __html: `Employee <strong>${data.employee?.name}</strong> has requested <strong>${data.template?.name}</strong> on <strong>${toLocalDateTime(data.createdOn)}</strong> having current status <strong>${data.status}</strong>`
                                            }}>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {signatureCount > 0 && data.status != "APPROVED" && <>
                                            <h4>Assign Signature</h4>
                                            {[...Array(signatureCount)].map((item, i) => {
                                                return <>
                                                    <div className="form-group col-md-6 offset-md-3">
                                                        <label>Select Signature {i + 1}</label>
                                                        <SignatureDropdown defaultValue={""} onChange={e => {
                                                            updateSignature(e.currentTarget.value, i + 1);
                                                        }}></SignatureDropdown>
                                                    </div>
                                                </>
                                            })}
                                        </>}

                                        {signatureWithDesignationCount > 0 && data.status != "APPROVED" && <>
                                            <hr />
                                            <h4>Assign Signature With Designation</h4>
                                            {[...Array(signatureWithDesignationCount)].map((item, i) => {
                                                return <>
                                                    <div className="form-group col-md-6 offset-md-3">
                                                        <label>Select Signature With Designation {i + 1}</label>
                                                        <SignatureDropdown defaultValue={""} onChange={e => {
                                                            updateSignatureWithDesignation(e.currentTarget.value, e.currentTarget.designation, i + 1);
                                                        }}></SignatureDropdown>
                                                    </div>
                                                </>
                                            })}
                                        </>}
                                        <hr />
                                        <div className="row" dangerouslySetInnerHTML={{
                                            __html: `<div class="col-md-6 offset-md-3"><div style='width: 600px;border: 1px solid #ccc;padding: 5px;'>${downloadableDocumentWithSignature}</div></div>`
                                        }}></div>
                                        <hr />
                                        {getUserType() == 'COMPANY_ADMIN' &&
                                            <center>
                                                <div className="">
                                                    {data.status != "APPROVED" && <p onClick={() => {
                                                        data.status = "APPROVED";
                                                        setState(prevState => ({
                                                            ...prevState,
                                                            show: true,
                                                            data
                                                        }));
                                                    }} className="btn btn-sm btn-success mr-3">Issue</p>}
                                                    {data.status != "REJECTED" && <p onClick={() => {
                                                        data.status = "REJECTED";
                                                        setState(prevState => ({
                                                            ...prevState,
                                                            show: true,
                                                            data
                                                        }));
                                                    }} className="btn btn-sm btn-warning">Reject</p>}
                                                </div>
                                            </center>}
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                enforceFocus={false}
                size={"xl"}
                show={show}
                onHide={hideApprovalForm}
            >
                <Header closeButton>
                    <h5 className="modal-title">
                        Approve/Reject Document Request
                    </h5>
                </Header>
                <Body>
                    <Formik
                        enableReinitialize={true}
                        onSubmit={updateStatus}
                        initialValues={{
                            approverComment: data ? data.approverComment : "",
                            downloadAllowed: data && data.downloadAllowed || false,
                            id: id,
                            numberOfDaysAllowedToDownload: data ? data.numberOfDaysAllowedToDownload : 0,
                            status: data && data.status
                        }}
                        validationSchema={Yup.object().shape({
                            approverComment: Yup.string().required("Please provide Comment"),
                            numberOfDaysAllowedToDownload: Yup.number().typeError("Please enter valid Number").required("Please provide Number of Days"),
                        })}
                    >
                        {({
                            values,
                            setFieldValue,
                            /* and other goodies */
                        }) => (
                            <Form>
                                <FormGroup>
                                    <label>Comment</label>
                                    <Field name="approverComment"
                                        onChange={e => {
                                            setFieldValue("approverComment", e.currentTarget.value);
                                            data.approverComment = e.currentTarget.value;
                                            setState(prevState => ({ ...prevState, data }));
                                        }}
                                        placeholder="Please enter comment"
                                        className="form-control"></Field>
                                    <ErrorMessage name="approverComment">
                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                                {data && data.status === "APPROVED" && <><FormGroup>
                                    <label>Number of days for Download</label>
                                    <Field name="numberOfDaysAllowedToDownload"
                                        onChange={e => {
                                            setFieldValue("numberOfDaysAllowedToDownload", e.currentTarget.value);
                                            data.numberOfDaysAllowedToDownload = e.currentTarget.value;
                                            setState(prevState => ({ ...prevState, data }));
                                        }}
                                        placeholder="Please enter how many days download should be allowed. 0 means no restriction of days" className="form-control"></Field>
                                    <ErrorMessage name="numberOfDaysAllowedToDownload">
                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>

                                    <FormGroup>
                                        <div type="checkbox" name="downloadAllowed" onClick={e => {
                                            let data = { ...state.data };
                                            data.downloadAllowed = !data.downloadAllowed;
                                            setFieldValue("active", data.downloadAllowed);
                                            setState(prevState => ({
                                                ...prevState,
                                                data
                                            }));
                                        }} >
                                            <label>Download Allowed</label><br />
                                            <i className={`fa fa-2x ${values?.downloadAllowed
                                                ? 'fa-toggle-on text-success' :
                                                'fa fa-toggle-off text-danger'}`}></i>
                                        </div>
                                    </FormGroup></>}

                                <input type="submit" className={`btn btn-${data && data.status === "APPROVED" ? "success" : "warning"}`} value={data && data.status === "APPROVED" ? "Approve" : "Reject"} />
                            </Form>
                        )}</Formik>
                </Body>
            </Modal>
        </>
    );
};

export default DocumentRequestView;
