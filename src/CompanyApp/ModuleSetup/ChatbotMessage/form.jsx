import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { saveChatbotMessage } from './service';
import { ChatbotMessageSchema } from './validation';


export default class ChatbotMessageForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            chatbotMessage: props.chatbotMessage || {
                id: 0,
                code: "",
                message:"",
                questionDescription:"",
                
            }
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (nextProps.chatbotMessage && nextProps.chatbotMessage != prevState.chatbotMessage) {
            return ({ chatbotMessage: nextProps.chatbotMessage })
        } else if (!nextProps.chatbotMessage ) {
            
            return prevState.chatbotMessage || ({
                chatbotMessage: {
                    id: 0,
                    name: "",
                    required: true,
                    active:true
                }
            })
        }
        return null;
    }
    save = (data, action) => {
        action.setSubmitting(true);
        saveChatbotMessage(data).then(res => {
            if (res.status == "OK") {
                toast.success(res.message);
                this.props.updateList(res.data);
            } else {
                toast.error(res.message);
            }
            action.setSubmitting(false)
        }).catch(err => {
            toast.error("Error while saving Chatbot Message");

            action.setSubmitting(false);
        })
    }
    render() {
        return (
            <div>

                <Formik
                    enableReinitialize={true}
                    initialValues={this.state.chatbotMessage}
                    onSubmit={this.save}
                    validationSchema={ChatbotMessageSchema}
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
                        <Form className="row" autoComplete='off'>
                            
                            <FormGroup className="col-md-12">
                                <label>Code
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="code" className="form-control"></Field>
                                <ErrorMessage name="code">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>

                            <FormGroup className="col-md-12">
                                <label>Message
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="message" className="form-control"></Field>
                                <ErrorMessage name="message">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <FormGroup className="col-md-12">
                                <label>Question Description
                                    <span style={{ color: "red" }}>*</span>
                                </label>
                                <Field name="questionDescription" className="form-control" component="textarea" rows="6" onChange={e => {
                                    setFieldValue('questionDescription', e.currentTarget.value);
                                }}></Field>
                                <ErrorMessage name="questionDescription">
                                    {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                            </FormGroup>
                            <input type="submit" className="ml-2 btn btn-primary" value={this.state.chatbotMessage.id>0?"Update":"Save"} />
                        </Form>
                    )
                    }
                </Formik>
            </div>
        )
    }
}