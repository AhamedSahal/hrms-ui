import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getSurveyMessage, saveSurveyMessage } from './service';
import HtmlMceEditor from '../../../../HtmlMceEditor';
import { SurveyMessageSchema } from './validation';
import { Accordion, Card } from 'react-bootstrap';
import { getUserType } from '../../../../utility';
import { getSurveyById } from '../service';



export default class SurveyMessageTemplate extends Component {
    constructor(props) {
        super(props);
        let surveyData = this.props.surveyData;
        this.state = {
            id: props.survey.id,
            isVisible: false,
            surveyTemplate: {
                id: "",
                invitationEmailSubject: 'Your Participation Requested: Take our Survey and Help Us Improve!',
                invitationEmail: '<p>Greetings {{name}},<br>Please take a moment to participate in our short survey. Your feedback is valuable to us!</p><p>Access the survey here: {{URL}}</p><p>OR Scan below QR code to get started:</p><p><img src="{{QR_Code}}"></p><p>Thank you!</p><p>Best regards,<br>' + this.props.companyName + '</p>',
                reminderStartEmailSubject: 'Your Opinion Matters! Complete the Survey Now',
                reminderStartEmail: '<p>Dear {{name}},<br>We value your feedback! The Employee Survey is still open, and we need your input. It will only take a few minutes to complete.</p>' +
                    '<p>Survey Link: {{URL}}</p>' +
                    '<p><img src="{{QR_Code}}"></p>' +
                    '<p>Don' + "'t" + ' miss this chance to make a difference. Your responses are anonymous, and your opinion matters to us.</p> ' +
                    '<p>Survey Closing Date: {{end_Date}}</p><br>' +
                    '<p>Thank you for your time!</p>' +
                    '<p>Best regards,<br>' + this.props.companyName + '</p>',
                reminderEndEmailSubject: 'Last Call: Complete the Employee Survey',
                reminderEndEmail: '<p>Dear {{name}},<br>This is your final chance to participate in the Employee Survey.</p><p>Survey Link: {{URL}}</p><p><img src="{{QR_Code}}"></p><p>Your input is crucial, and the survey will close on {{end_Date}}. It takes just few minutes to complete.</p><p>Help us shape our workplace. Your responses are confidential.</p><p>Thank you for your cooperation!</p><p>Best regards,<br>' + this.props.companyName + '</p>',
                thankYouEmailSubject: 'Thank you for your valuable feedback! Your input is greatly appreciated.',
                thankYouEmail: '<p>Greetings {{name}},</p><p>Thank you for taking our survey! Your feedback is greatly appreciated.</p><p>Best regards,<br>' + this.props.companyName + '</p>',
                invitationWhatsapp: "",
                reminderWhatsapp: "",
                thankYouWhatsapp: "",
                thankYouMessage: '<p>Thank you for taking our survey! Your feedback is greatly appreciated.</p><br><img src="src/assets/img/check-thank-you-message.png"/>',
                surveyId: ""
            },
            surveyData: surveyData,
        };

    }

    componentDidMount() {
        this.fetchList();
        this.getSurveyById(this.props.survey.id);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.activeTab !== this.props.activeTab && this.props.activeTab === 'details') {
            this.componentDidMount();
        }
    }
    getSurveyById = (id) => {
        if (!id) {
            this.setState({ surveyData: [{ isPublished: false }] });
            return;
        }
        getSurveyById(id).then(res => {
            if (res.status === "OK") {
                this.setState({ surveyData: res.data });
            } else {
                this.setState({ surveyData: [{ isPublished: false }] });
            }
        });
    }
    fetchList = () => {
        getSurveyMessage(this.props.survey.id).then((res) => {
            let surveyTemplate;
            console.log(res);
            if (res.status === "OK") {
                if (res.data === null) {
                    surveyTemplate = {
                        id: 0,
                        invitationEmailSubject: 'Your Participation Requested: Take our Survey and Help Us Improve!',
                        invitationEmail: '<p>Greetings {{name}},<br>Please take a moment to participate in our short survey. Your feedback is valuable to us!</p><p>Access the survey here: {{URL}}</p><p>OR Scan below QR code to get started:</p><p><img src="{{QR_Code}}"></p><p>Thank you!</p><p>Best regards,<br>' + this.props.companyName + '</p>',
                        reminderStartEmailSubject: 'Your Opinion Matters! Complete the Survey Now',
                        reminderStartEmail: '<p>Dear {{name}},<br>We value your feedback! The Employee Survey is still open, and we need your input. It will only take a few minutes to complete.</p>' +
                            '<p>Survey Link: {{URL}}</p>' +
                            '<p><img src="{{QR_Code}}"></p>' +
                            '<p>Don' + "'t" + ' miss this chance to make a difference. Your responses are anonymous, and your opinion matters to us.</p> ' +
                            '<p>Survey Closing Date: {{end_Date}}</p><br>' +
                            '<p>Thank you for your time!</p>' +
                            '<p>Best regards,<br>' + this.props.companyName + '</p>',
                        reminderEndEmailSubject: 'Last Call: Complete the Employee Survey',
                        reminderEndEmail: '<p>Dear {{name}},<br>This is your final chance to participate in the Employee Survey.</p><p>Survey Link: {{URL}}</p><p><img src="{{QR_Code}}"></p><p>Your input is crucial, and the survey will close on {{end_Date}}. It takes just few minutes to complete.</p><p>Help us shape our workplace. Your responses are confidential.</p><p>Thank you for your cooperation!</p><p>Best regards,<br>' + this.props.companyName + '</p>',
                        thankYouEmailSubject: 'Thank you for your valuable feedback! Your input is greatly appreciated.',
                        thankYouEmail: '<p>Greetings {{name}},</p><p>Thank you for taking our survey! Your feedback is greatly appreciated.</p><p>Best regards,<br>' + this.props.companyName + '</p>',
                        invitationWhatsapp: "",
                        reminderWhatsapp: "",
                        thankYouWhatsapp: "",
                        thankYouMessage: '<p>Thank you for taking our survey! Your feedback is greatly appreciated.</p><br><img src="src/assets/img/check-thank-you-message.png"/>',
                        surveyId: this.props.survey.id
                    };
                } else {
                    surveyTemplate = {
                        id: res.data.id,
                        invitationEmailSubject: res.data.invitationEmailSubject,
                        invitationEmail: res.data.invitationEmail,
                        invitationWhatsapp: res.data.invitationWhatsapp,
                        reminderStartEmailSubject: res.data.reminderStartEmailSubject,
                        reminderEndEmailSubject: res.data.reminderEndEmailSubject,
                        reminderStartEmail: res.data.reminderStartEmail,
                        reminderEndEmail: res.data.reminderEndEmail,
                        reminderWhatsapp: res.data.reminderWhatsapp,
                        thankYouEmailSubject: res.data.thankYouEmailSubject,
                        thankYouEmail: res.data.thankYouEmail,
                        thankYouWhatsapp: res.data.thankYouWhatsapp,
                        thankYouMessage: res.data.thankYouMessage,
                        surveyId: res.data.surveyId
                    };
                }

                this.setState({
                    surveyTemplate: surveyTemplate
                });
                window.TriggerSummerNote();
            }
        });
    }
    save = (data, action) => {
        action.setSubmitting(true);
        this.componentDidMount();
        saveSurveyMessage(data)
            .then((res) => {
                if (res.status === "OK") {
                    toast.success(res.message);
                    this.fetchList();
                    // this.redirectToList();
                } else {
                    toast.error(res.message);
                }
                action.setSubmitting(false);
            })
            .catch((err) => {
                console.log({ err });
                toast.error("Error while saving message");
                action.setSubmitting(false);
            });
    };

    onInvitationEmailChange = (value) => {
        console.log(value);
        this.setState((prevState) => ({
            surveyTemplate: {
                ...prevState.surveyTemplate,
                invitationEmail: value
            }
        }));
    };

    onInvitationEmailSubjectChange = (value) => {
        console.log(value);
        this.setState((prevState) => ({
            surveyTemplate: {
                ...prevState.surveyTemplate,
                invitationEmailSubject: value
            }
        }));
    };

    onReminderStartEmailChange = (value) => {
        this.setState((prevState) => ({
            surveyTemplate: {
                ...prevState.surveyTemplate,
                reminderStartEmail: value
            }
        }));
    };
    onReminderEndEmailChange = (value) => {
        this.setState((prevState) => ({
            surveyTemplate: {
                ...prevState.surveyTemplate,
                reminderEndEmail: value
            }
        }));
    };

    onReminderEndEmailSubjectChange = (value) => {
        this.setState((prevState) => ({
            surveyTemplate: {
                ...prevState.surveyTemplate,
                reminderEndEmailSubject: value
            }
        }));
    };
    onReminderStartEmailSubjectChange = (value) => {
        this.setState((prevState) => ({
            surveyTemplate: {
                ...prevState.surveyTemplate,
                reminderStartEmailSubject: value
            }
        }));
    };

    onThankYouEmailChange = (value) => {
        this.setState((prevState) => ({
            surveyTemplate: {
                ...prevState.surveyTemplate,
                thankYouEmail: value
            }
        }));
    };

    onThankYouEmailSubjectChange = (value) => {
        this.setState((prevState) => ({
            surveyTemplate: {
                ...prevState.surveyTemplate,
                thankYouEmailSubject: value
            }
        }));
    };

    onThankYouMessageChange = (value) => {
        this.setState((prevState) => ({
            surveyTemplate: {
                ...prevState.surveyTemplate,
                thankYouMessage: value
            }
        }));
    };



    render() {
        const { surveyTemplate, surveyData } = this.state;
        const { isPublished } = this.props;
        return (
            <>
                <div className='mt-4 surveyMesssageHead' onClick={() => this.setState({ isVisible: !this.state.isVisible })}  >
                    <h3>Communication Templates<i className={`float-right mr-2 fa  ${this.state.isVisible ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden='true' ></i></h3>
                </div>

                {this.state.isVisible && <Card.Body>
                    <div>
                        <div className="surveyPagepd content container-fluid mt-1">
                            {/* Page Header */}
                            <div></div>
                            <Formik
                                enableReinitialize={true}
                                initialValues={surveyTemplate}
                                onSubmit={this.save}
                            // validationSchema={SurveyMessageSchema}
                            >
                                {({
                                    values
                                    /* and other goodies */
                                }) => (
                                    <Form autoComplete="off">
                                        <div className="row">
                                            <div className="mt-4 col-md-12">
                                                <FormGroup className="col-md-10">
                                                    <label className="message-label">
                                                        Invitation Email Subject
                                                        <span className='ml-1' style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <Field
                                                        name="invitationEmailSubject"
                                                        className="form-control"
                                                        as="textarea"
                                                        style={{ height: "80px" }}
                                                        onChange={e => this.onInvitationEmailSubjectChange(e.target.value)}
                                                        value={this.state.surveyTemplate.invitationEmailSubject}
                                                        disabled={getUserType() !== 'SUPER_ADMIN' && (surveyData?.surveyStatus === 'TEMPLATE' || false) || isPublished}
                                                    ></Field>
                                                    <ErrorMessage name="invitationEmailSubject">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <FormGroup className="col-md-10">
                                                    <label className="message-label">
                                                        Invitation Email
                                                        <span className='ml-1' style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <HtmlMceEditor
                                                        className="form-control"
                                                        value={values.invitationEmail}
                                                        onChange={this.onInvitationEmailChange}
                                                        disabled={getUserType() !== 'SUPER_ADMIN' && (surveyData?.surveyStatus === 'TEMPLATE' || false)}
                                                    ></HtmlMceEditor>
                                                    <ErrorMessage name="invitationEmail">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                        </div>


                                        <div className="row">
                                            <div className="col-md-12">
                                                <FormGroup className="col-md-10">
                                                    <label className="message-label">
                                                        Reminder Email Subject Before Starting Survey
                                                        <span className='ml-1' style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <Field
                                                        name="reminderStartEmailSubject"
                                                        className="form-control"
                                                        as="textarea"
                                                        style={{ height: "80px" }}
                                                        onChange={e => this.onReminderStartEmailSubjectChange(e.target.value)}
                                                        value={this.state.surveyTemplate.reminderStartEmailSubject}
                                                        disabled={getUserType() !== 'SUPER_ADMIN' && (surveyData?.surveyStatus === 'TEMPLATE' || false) || isPublished}
                                                    ></Field>
                                                    <ErrorMessage name="reminderStartEmailSubject">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <FormGroup className="col-md-10">
                                                    <label className="message-label">
                                                        Reminder Email Before Starting Survey
                                                        <span className='ml-1' style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <HtmlMceEditor

                                                        value={values.reminderStartEmail}
                                                        onChange={this.onReminderStartEmailChange}
                                                        disabled={getUserType() !== 'SUPER_ADMIN' && (surveyData?.surveyStatus === 'TEMPLATE' || false)}
                                                    ></HtmlMceEditor>
                                                    <ErrorMessage name="reminderStartEmail">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <FormGroup className="col-md-10">
                                                    <label className="message-label">
                                                        Reminder Email Subject Before Ending Survey
                                                        <span className='ml-1' style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <Field
                                                        name="reminderEndEmailSubject"
                                                        className="form-control"
                                                        as="textarea"
                                                        style={{ height: "80px" }}
                                                        onChange={e => this.onReminderEndEmailSubjectChange(e.target.value)}
                                                        value={this.state.surveyTemplate.reminderEndEmailSubject}
                                                        disabled={getUserType() !== 'SUPER_ADMIN' && (surveyData?.surveyStatus === 'TEMPLATE' || false) || isPublished}
                                                    ></Field>
                                                    <ErrorMessage name="reminderEndEndEmailSubject">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <FormGroup className="col-md-10">
                                                    <label className="message-label">
                                                        Reminder Email Before Ending Survey
                                                        <span className='ml-1' style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <HtmlMceEditor
                                                        value={values.reminderEndEmail}
                                                        onChange={this.onReminderEndEmailChange}
                                                        disabled={getUserType() !== 'SUPER_ADMIN' && (surveyData?.surveyStatus === 'TEMPLATE' || false)}
                                                    ></HtmlMceEditor>
                                                    <ErrorMessage name="reminderEndEmail">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-12">
                                                <FormGroup className='col-md-10'>
                                                    <label className='message-label'>Thank You Email Subject
                                                        <span className='ml-1' style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <Field
                                                        name="thankYouEmailSubject"
                                                        className="form-control"
                                                        as="textarea"
                                                        style={{ height: "80px" }}
                                                        onChange={e => this.onThankYouEmailSubjectChange(e.target.value)}
                                                        value={this.state.surveyTemplate.thankYouEmailSubject}
                                                        disabled={getUserType() !== 'SUPER_ADMIN' && (surveyData?.surveyStatus === 'TEMPLATE' || false) || isPublished}
                                                    ></Field>
                                                    <ErrorMessage name="thankYouEmailSubject">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <FormGroup className='col-md-10'>
                                                    <label className='message-label'>Thank You Email
                                                        <span className='ml-1' style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <HtmlMceEditor
                                                        value={values.thankYouEmail}
                                                        onChange={this.onThankYouEmailChange}
                                                        disabled={getUserType() !== 'SUPER_ADMIN' && (surveyData?.surveyStatus === 'TEMPLATE' || false)}
                                                    ></HtmlMceEditor>
                                                    <ErrorMessage name="thankYouEmail">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <FormGroup className="col-md-10">
                                                    <label className="message-label">
                                                        Thank You Message
                                                        <span className='ml-1' style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <HtmlMceEditor
                                                        value={values.thankYouMessage}
                                                        onChange={this.onThankYouMessageChange}
                                                        disabled={getUserType() !== 'SUPER_ADMIN' && (surveyData?.surveyStatus === 'TEMPLATE' || false)}
                                                    ></HtmlMceEditor>
                                                    <ErrorMessage name="thankYouMessage">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <input
                                                    type="submit"
                                                    className="btn btn-primary mx-3"
                                                    value={this.state.surveyTemplate.id > 0 ? 'Update' : 'Save'}
                                                    disabled={
                                                        getUserType() !== 'SUPER_ADMIN' &&
                                                        (surveyData?.surveyStatus === 'TEMPLATE' || false) &&
                                                        (isPublished !== undefined ? isPublished : false) || (surveyData?.isPublished !== undefined ? surveyData.isPublished : false)
                                                    }
                                                />
                                            </div>
                                        </div>

                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </Card.Body>}
            </>
        );
    }
}
