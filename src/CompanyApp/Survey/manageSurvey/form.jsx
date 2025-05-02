import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { FormGroup } from 'reactstrap';
import { getUserType } from '../../../utility';
import { getSurveyById, getSurveyByLanguageIdAndSurveyId, saveSurvey } from './service';
import { SurveySchema } from './validation';
import SurveyLanguageDropdown from '../../ModuleSetup/Dropdown/SurveyLanguageDropdown';
import SurveyDropdown from '../../ModuleSetup/Dropdown/SurveyDropdown';
import 'react-toastify/dist/ReactToastify.css';
import { Accordion, Card } from 'react-bootstrap';
import HtmlMceEditor from '../../../HtmlMceEditor';



export default class SurveyForm extends Component {
    constructor(props) {
        super(props);
        let survey = this.props.survey;
        this.state = {
            survey: survey || {
                name: '',
                id: 0,
                description: '',
                languageId: 0,
                participantId: 0,
                surveyId: 0,
                surveyStatus: 'DRAFT'
            },
            editable: false,
            copySurvey: false,
            surveyData: [],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.survey && nextProps.survey.id !== prevState.survey.id) {
            return { survey: nextProps.survey };
        }
        return null;
    }
    componentDidMount() {
        this.fetchList(this.props.survey.id, 1);
        this.getSurveyById(this.props.survey.id);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.activeTab !== this.props.activeTab && this.props.activeTab === 'details') {
            this.componentDidMount();
        }
    }
    save = (data, { setSubmitting }) => {
        this.componentDidMount();
        let newData;
        if (getUserType() === 'SUPER_ADMIN') {
            newData = {
                ...data,
                surveyStatus: 'TEMPLATE',
            };
        } else {
            newData = {
                ...data,
                surveyStatus: 'DRAFT',
            };
        }

        setSubmitting(true);
        if(data.name == '' && this.state.copySurvey == false)
            {
            toast.error("Please provide name");
        }
        else if(data.description == '' && this.state.copySurvey == false)
            {
            toast.error("Please provide description");
        }
        else{
            saveSurvey(newData)
                .then(async res => {
                    if (res.status === 'OK') {
                        toast.success(res.message);
                        this.setState({ survey: res.data });
                        if (getUserType() === 'SUPER_ADMIN') {
                            newData = {
                                ...res.data,
                                surveyStatus: 'TEMPLATE',
                            };
                        } else {
                            newData = {
                                ...res.data,
                                surveyStatus: 'DRAFT',
                            };
                        }
                        this.props.setSurvey(newData);
                    } else {
                        toast.error(res.message);
                    }
                })
                .catch(err => {
                    console.error(err);
                })
                .finally(() => {
                    setSubmitting(false);
                });
        }
    };
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


    handleLanguageChange = async (e, setFieldValue) => {
        const newLanguageId = parseInt(e.target.value);
        setFieldValue('languageId', newLanguageId);
        await this.fetchList(this.state.survey.id, newLanguageId);
    };

    handleSurveyChange = async (e, setFieldValue) => {
        const newSurveyId = parseInt(e.target.value);
        setFieldValue('surveyId', newSurveyId);
    };

    fetchList = async (surveyId, languageId) => {
        try {
            const res = await getSurveyByLanguageIdAndSurveyId(surveyId, languageId);
            if (res.status === 'OK') {
                console.log(res.data);
                if (res.data) {
                    this.setState(prevState => ({
                        survey: {
                            ...prevState.survey,
                            id: res.data.id,
                            name: res.data.name,
                            description: res.data.description,
                            languageId: res.data.languageId,
                            participantId: 0,
                            surveyId: res.data.surveyId,
                        }
                    }), () => {
                        console.log(this.state.survey);
                        window.ApplyMCEEditor();
                    });
                } else {
                    this.setState(prevState => ({
                        survey: {
                            ...prevState.survey,
                            name: '',
                            description: '',
                            languageId: languageId,
                            participantId: 0,
                            surveyId: 0,
                        }
                    }), () => {
                        console.log(this.state.survey);
                        window.ApplyMCEEditor();
                    });
                }
            } else {
                console.log(res.message);
            }
        } catch (error) {
            console.log(error);
        }
    };


    onDescriptionChange = async (e, setFieldValue) => {
        setFieldValue('description', e);
    };

    handleCopySurveyClick = () => {
        this.setState(prevState => ({
            copySurvey: !prevState.copySurvey
        }))
    };


    render() {
        const { survey, copySurvey, surveyData } = this.state;
        const { isPublished } = this.state;
       
        return (
                    <div>
                        <Card.Body>
                            <div>
                                <div className="content container-fluid mt-2">
                                    {/* Page Header */}
                                    <div></div>
                                    <Formik
                                        enableReinitialize={true}
                                        initialValues={survey}
                                        onSubmit={this.save}
                                    // validationSchema={SurveySchema}
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
                                            setSubmitting,
                                        }) => (
                                            <Form autoComplete="off">
                                                {this.props.hideMessageTemplate && <>
                                                    <div className="row mb-2">
                                                        {getUserType() !== 'SUPER_ADMIN' && (<div className="col-md-12">
                                                            <input
                                                                className="form-check-input survey-form-check"
                                                                type="checkbox"
                                                                checked={copySurvey}
                                                                onClick={e => this.handleCopySurveyClick()}
                                                                disabled={surveyData.isPublished || isPublished}
                                                            />
                                                            <label className="form-check-label survey-form-check-label">
                                                                Do you want to copy from an existing survey template ?
                                                            </label>
                                                        </div>)}
                                                    </div>
                                                    {copySurvey && <div className="row">
                                                        <div className="col-md-12">
                                                            <FormGroup className="d-flex align-items-center">
                                                                <SurveyDropdown
                                                                    defaultValue={values.surveyId}
                                                                    onChange={e => this.handleSurveyChange(e, setFieldValue)}
                                                                />
                                                            </FormGroup>
                                                        </div>
                                                    </div>}
                                                </>}
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <label className="message-label">
                                                            Language<span style={{ color: 'red' }}>*</span>
                                                        </label>
                                                        <FormGroup className="d-flex align-items-center">
                                                            <SurveyLanguageDropdown
                                                                activeTab={this.props.activeTab}
                                                                surveyId={survey.id}
                                                                readOnly={getUserType() !== 'SUPER_ADMIN' && survey.surveyStatus == 'TEMPLATE'}
                                                                defaultValue={values.languageId}
                                                                onChange={e => this.handleLanguageChange(e, setFieldValue)}

                                                            />
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <FormGroup >
                                                            <label className="message-label">
                                                                Name<span style={{ color: 'red' }}>*</span>
                                                            </label>
                                                            <Field name="name" className="form-control col-md-4" disabled={getUserType() !== 'SUPER_ADMIN' && survey.surveyStatus == 'TEMPLATE' || surveyData.isPublished || isPublished} />
                                                            <ErrorMessage name="name">
                                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                                            </ErrorMessage>
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <FormGroup >
                                                    <label className='message-label'>Description
                                                        <span style={{ color: "red" }}>*</span>
                                                    </label>
                                                    <HtmlMceEditor
                                                        name="description"
                                                        value={survey.description}
                                                        onChange={val => this.onDescriptionChange(val, setFieldValue)}
                                                        disabled={getUserType() !== 'SUPER_ADMIN' && survey.surveyStatus == 'TEMPLATE' || surveyData.isPublished || isPublished}
                                                    ></HtmlMceEditor>
                                                    <ErrorMessage name="description">
                                                        {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                                                    </ErrorMessage>
                                                </FormGroup>
                                            </div>
                                        </div>
                                                <input type="submit" className="btn btn-primary mx-3" value={survey.id > 0 ? 'Update' : 'Save'} disabled={getUserType() !== 'SUPER_ADMIN' && survey.surveyStatus == 'TEMPLATE' || surveyData.isPublished || isPublished} />

                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </Card.Body>
                    </div>
                
        );
    }
}
