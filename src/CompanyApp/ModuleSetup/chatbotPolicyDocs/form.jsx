import React, { useState, useEffect } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveChatbotDocs } from './service';

const ChatbotDocsForm = ({ chatbotMessage, updateList }) => {
    const [chatbotdocument, setChatbotDocument] = useState({
        id: 0,
        policiesName: "",
        fileName: "",
        file: null
    });

    useEffect(() => {
        if (chatbotMessage) {
            setChatbotDocument(chatbotMessage);
        } else if (chatbotdocument.id !== 0) {
            setChatbotDocument({
                id: 0,
                policiesName: "",
                fileName: "",
                file: null
            });
        }
    }, [chatbotMessage]);

    const save = (data, action) => {
        action.setSubmitting(true);
        saveChatbotDocs(data).then(res => {
            if (res.status === "OK") {
                toast.success(res.message);
                if (typeof updateList === 'function') {
                    updateList(res.data);
                }
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false);
        }).catch(err => {
            toast.error(err?.message || err);
            action.setSubmitting(false);
        });
    };

    return (
        <div>
            <Formik
                enableReinitialize={true}
                initialValues={chatbotdocument}
                onSubmit={save}
            >
                {({
                    isSubmitting,
                    setFieldValue,
                }) => (
                    <Form autoComplete='off'>
                        <FormGroup>
                            <label>Document Name
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <Field name="policiesName" className="form-control" />
                            <ErrorMessage name="policiesName">
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                        </FormGroup>
                        <FormGroup>
                            <label>Upload Policy/Document
                                <span style={{ color: "red" }}>*</span>
                            </label>
                            <input name="file" type="file" className="form-control" onChange={e => {
                                setFieldValue('file', e.target.files[0]);
                            }} />
                            <ErrorMessage name="file">
                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                        </FormGroup>
                        <input type="submit" className="btn btn-primary" value={chatbotdocument.id > 0 ? "Update" : "Save"} disabled={isSubmitting} />
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChatbotDocsForm;
