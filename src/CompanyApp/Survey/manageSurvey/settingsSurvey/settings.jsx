import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getSurveySettings, saveSurveySettings, getLanguages } from './service';
import { SurveySettingsSchema } from './validation';
import { getSurveyById } from '../service';
import { convertToUserDateTimeZone, convertToUTC, getUserType, toLocalCalendarTime } from '../../../../utility';


export default class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: props.survey,
            surveySetting: {
                // surveyId:"",
                startDateTime: new Date(),
                endDateTime: new Date(),
                status: '',
                surveyStartReminder: "",
                surveyEndReminder: "",
                selectedLanguages: [],
                isConfidential: '',
            },
            dbLanguages: [],
            surveyData: [],
            surveyDetails: this.props.surveyData,
        }
    }

    componentDidMount() {
        this.getSurveySetting(this.state.id);
        this.getLanguage();
        this.getSurveyById(this.state.id);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.activeTab !== this.props.activeTab && this.props.activeTab === 'settings') {
            this.componentDidMount();
        }
    }

    getSurveySetting = (id) => {
        getSurveySettings(id).then(res => {
            let surveySetting = res.data;

            if (surveySetting === null) {
                surveySetting = {
                    startDateTime: new Date(),
                    endDateTime: new Date(),
                    status: '',
                    surveyStartReminder: "",
                    surveyEndReminder: "",
                    selectedLanguages: []
                }
            }
            surveySetting.status = "DRAFT";
            if (res.status == "OK") {
                 if (res.data.startDateTime) {
                    res.data.startDateTime = convertToUserDateTimeZone(res.data.startDateTime)
                }
                if (res.data.endDateTime) {
                    res.data.endDateTime = convertToUserDateTimeZone(res.data.endDateTime)
                }
                this.setState({ surveySetting : res.data })
            }
        });
    }
    getSurveyById = (id) => {
        getSurveyById(id).then(res => {
            if (res.status == "OK") {
                this.setState({ surveyData: res.data })
            }
        });
    }

    getLanguage = () => {
        getLanguages().then(res => {
            let dbLanguages = res.data;

            if (dbLanguages === null) {
                dbLanguages = []
            }
            if (res.status == "OK") {
                this.setState({ dbLanguages },
                    () => {
                        console.log({ dbLanguages })
                    })
            }
        });
    }

    save = (data, action) => {
        this.componentDidMount();
            action.setSubmitting(true);
            const { dbLanguages } = this.state;
            data.surveyId = this.props.survey;
          
        data["startDateTime"] = convertToUTC(data["startDateTime"]);
        data["endDateTime"] = convertToUTC(data["endDateTime"]);

            const selectedLanguages = dbLanguages.filter(language => data.selectedLanguages.includes(language.id))
            data.selectedLanguages = selectedLanguages;
            saveSurveySettings(data).then(res => {
                if (res.status == "OK") {
                    toast.success(res.message);
                    this.getSurveySetting(res.data.surveyId);
                    this.getLanguage();
                    this.props.hasExceededCurrentDateTime(res.data.surveyId);
                   
                } else {
                    toast.error(res.message);
                }
                action.setSubmitting(false)
            }).catch(err => {
                action.setSubmitting(false);
            })
    }

    onSelect = (e) => {
        const { name, value, type, checked } = e.target;
        this.setState((prevState) => {
            const updatedObject = { ...prevState.surveySetting };
            const updatedArray = [...prevState.surveySetting.selectedLanguages];
            updatedArray.push(parseInt(value));
            updatedObject.selectedLanguages = updatedArray;
            return { surveySetting: updatedObject };
        });
    }

    render() {
        const { surveyData, surveyDetails } = this.state;
        const {isPublished} = this.props;
        return (
            <Formik
                enableReinitialize={true}
                initialValues={this.state.surveySetting}
                onSubmit={this.save}
                validationSchema={SurveySettingsSchema}
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
                        <div className="row px-4 mx-2">
                            <div className="row col-md-5">
                                <fieldset className='row border border-dark p-2'>
                                    <legend className='float-none w-auto p-2'>Time Schedule</legend>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label className='survey-label'>Start Date
                                                <span className='ml-1' style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="startDateTime" className="form-control" type="datetime-local" disabled={surveyData.isPublished || isPublished}></Field>
                                            <ErrorMessage name="startDateTime">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-6">
                                        <FormGroup>
                                            <label className='survey-label'>End Date
                                                <span className='ml-1' style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="endDateTime" className="form-control" type="datetime-local"></Field>
                                            <ErrorMessage name="endDateTime">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                </fieldset>
                            </div>
                            <div className="col-md-7">
                                <div className="row mt-3">
                                    <div className="col-md-12">
                                        <FormGroup>
                                        <label className='survey-label'>How many days before the survey starts do you want to be reminded?
                                                <span className='ml-1' style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="surveyStartReminder" type="number" className="form-control" disabled={surveyData.isPublished || isPublished}></Field>
                                            <ErrorMessage name="surveyStartReminder">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                    <div className="col-md-12">
                                        <FormGroup>
                                        <label className='survey-label'>How many days before the survey due date do you want to remind employees to submit feedback?
                                                <span className='ml-1' style={{ color: "red" }}>*</span>
                                            </label>
                                            <Field name="surveyEndReminder" type="number" className="form-control" disabled={surveyData.isPublished || isPublished}></Field>
                                            <ErrorMessage name="surveyEndReminder">
                                                {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                            </ErrorMessage>
                                        </FormGroup>
                                    </div>
                                    <div className='col-md-12 lang-option mx-3'>
                                        <label>
                                            <Field
                                                type='checkbox'
                                                name='isConfidential'
                                                value={this.state.surveySetting.isConfidential}
                                                checked={values.isConfidential}
                                                onClick={(e) => {
                                                    if (values.isConfidential || surveyData.isPublished) {
                                                        e.preventDefault();
                                                    } else {
                                                        handleChange(e);
                                                    }
                                                }}
                                                disabled={values.isConfidential && surveyData.isPublished || isPublished}
                                                className="pointer form-check-input"
                                            />
                                            Confidential Survey
                                        </label>
                                    </div>



                                </div>
                            </div>
                        </div>
                        <div className="row mt-3 mx-1">
                            <div className="col-md-12">
                                <FormGroup className='d-flex flex-wrap'>
                                    <label className='mr-3 survey-label'>Languages
                                        <span className='ml-1' style={{ color: "red" }}>*</span>
                                    </label> <br />
                                    {this.state.dbLanguages.map((dbLanguage) => {
                                        const isChecked = values.selectedLanguages.includes(dbLanguage.id);
                                        const isEnglish = dbLanguage.name === 'English';

                                        return (
                                            <div className='lang-option mx-3' key={dbLanguage.id}>
                                                <label>
                                                    <Field
                                                        type="checkbox"
                                                        name="selectedLanguages"
                                                        value={dbLanguage.id}
                                                        checked={isEnglish || isChecked}
                                                        disabled={isEnglish || getUserType() !== 'SUPER_ADMIN' && (surveyData?.surveyStatus === 'TEMPLATE' || false) || surveyData.isPublished || isPublished}
                                                        className="pointer form-check-input"
                                                        onChange={(e) => {
                                                            const languageId = dbLanguage.id;
                                                            const updatedSelectedLanguages = isChecked
                                                                ? values.selectedLanguages.filter((id) => id !== languageId)
                                                                : [...values.selectedLanguages, languageId];

                                                            setFieldValue('selectedLanguages', updatedSelectedLanguages);
                                                        }}
                                                    />{' '}
                                                    {dbLanguage.name}
                                                </label>
                                            </div>
                                        );
                                    })}
                                    <ErrorMessage name="selectedLanguages">
                                        {msg => <div style={{ color: 'red' }}>{msg}</div>}
                                    </ErrorMessage>
                                </FormGroup>
                            </div>
                        </div>


                        <div className="row">
                            <div className="col-lg-12 ml-3">
                                <input type="submit" className="btn btn-primary" value="Save" disabled={getUserType() !== 'SUPER_ADMIN' && (surveyDetails?.surveyStatus === 'TEMPLATE' || false)} />
                            </div>
                        </div>
                    </Form>
                )
                }
            </Formik>
        )
    }
}
