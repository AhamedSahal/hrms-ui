import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import SurveyQuestionForm from '../QuestionsAnswer/questionForm';
import SurveyMessageTemplate from './SurveyMessageTemplate/SurveyMessageTemplate';
import SurveyParticipantList from './SurveyParticipant/surveyParticipant';
import SurveyForm from './form';
import { getSurveyById, publishSurvey } from './service';
import Settings from './settingsSurvey/settings';
import { Step, StepLabel, Stepper } from '@mui/material';
import { getCompanyName } from './SurveyMessageTemplate/service';
import { getUserType, verifyOrgLevelViewPermission } from '../../../utility';
import { getSurveySettings } from './settingsSurvey/service';
import { Button } from 'react-bootstrap';

const ManageActionsLanding = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const surveyFromState = location.state?.data;
console.log('cell surveyFromState', surveyFromState);

    const [survey, setSurvey] = useState(surveyFromState || {
        name: "",
        id: 0,
        description: "",
        languageId: 1,
        surveyStatus: ''
    });
    const [activeTab, setActiveTab] = useState('details');
    const [companyName, setCompanyName] = useState('');
    const [refreshPage, setRefreshPage] = useState(false);
    const [surveyData, setSurveyData] = useState([]);
    const [surveySettings, setSurveySettings] = useState({});
    const [disablePublish, setDisablePublish] = useState(false);
    const [activeTabIndex, setActiveTabIndex] = useState(0);

    const handleNextButtonClick = () => {
        if (activeTabIndex === 2) {
            publishSurveyAction();
        } else {
            setActiveTabIndex(prevIndex => prevIndex + 1);
        }
    };

    const handleBackButtonClick = () => {
        setActiveTabIndex(prevIndex => prevIndex - 1);
    };

    const handleTabClick = (index) => {
        setActiveTabIndex(index);
    };

    const getSurveyByIdAction = (id) => {
        if (!id) {
            setSurveyData([{ isPublished: false }]);
            return;
        }

        getSurveyById(id).then(res => {
            if (res.status === "OK") {
                setSurveyData(res.data);
            } else {
                setSurveyData([{ isPublished: false }]);
            }
        });
    };

    const publishSurveyAction = () => {
        const { id, name } = survey;
        confirmAlert({
            title: `Publish Survey`,
            message: 'Are you sure, you want to publish ' + name + '?',
            buttons: [
                {
                    className: "btn btn-danger",
                    label: 'Yes',
                    onClick: () => publishSurvey(id).then(res => {
                        if (res.status === "OK") {
                            toast.success(res.message);
                            setRefreshPage(true);
                            getSurveyByIdAction(survey.id);
                            redirectToList();
                        } else {
                            toast.error(res.message);
                        }
                    })
                        .catch(err => {
                            console.error(err);
                        })
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    };

    const fetchCompanyName = () => {
        if (getUserType() === "SUPER_ADMIN") {
            setCompanyName("Template Company Name");
        } else {
            getCompanyName().then((res) => {
                if (res.status === "OK") {
                    setCompanyName(res.data.name);
                } else {
                    console.log(res.message);
                }
            })
                .catch((err) => {
                    console.log({ err });
                    toast.error("Error while saving message");
                });
        }
    };

    const redirectToList = () => {
        navigate(-1);
    };

    const getSurveySetting = (id) => {
        getSurveySettings(id).then(res => {
            if (res.status === 'OK') {
                setSurveySettings(res.data);
            }
        });
    };

    useEffect(() => {
        fetchCompanyName();
        getSurveySetting(survey.id);
        console.log('cell survey    ID', survey);
    }, [survey.id]);

    const steps = [
        'Draft Survey',
        'Invitee',
        'Schedule',
    ];

    const isRecordSaved = survey.id > 0;
    const disableTabs = !isRecordSaved;
    const hideMessageTemplate = !isRecordSaved;
    const buttonLabel = activeTabIndex === 2 ? 'Publish' : 'Next';
    const prevButton = 'Back';
    const buttonIcon = activeTabIndex === 2 ? <i className="fa fa-upload"></i> : null;
    const isSettingsTab = activeTabIndex === 2;

    return (
        <div className="page-wrapper">
            <div className="pb-4 p-5 content container-fluid">
                <div className="surveyFormBody tab-content">
                    <div className="">
                        <div className="row user-tabs">
                            <div style={{ borderRadius: '10px 10px 0px 0px', height: '64px' }} className="card tab-box tab-position">
                                <div className="col-lg-12 col-md-12 col-sm-12 line-tabs">
                                    <h1 className="mt-2 modal-title">
                                        {activeTabIndex === 1
                                            ? "Manage Survey Participants"
                                            : activeTabIndex === 2
                                                ? "Survey Timeline"
                                                : "Survey Details"}</h1>
                                    <p className="ml-auto mb-3" onClick={redirectToList}>
                                        <i className="surveyCloseBtn fa fa-times" aria-hidden="true"></i>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-3 mb-2'>
                        <Stepper alternativeLabel activeStep={activeTabIndex}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel style={{ marginTop: '1px' }} >{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </div>
                    <div id="Details" className={`pro-overview tab-pane  fade ${activeTabIndex === 0 ? 'show active' : ''}`}>
                        <SurveyForm survey={survey} setSurvey={setSurvey} activeTab={activeTab} hideMessageTemplate={hideMessageTemplate} refreshPage={refreshPage} isPublished={surveyData.isPublished} />
                        {hideMessageTemplate ? null : <SurveyQuestionForm survey={survey} activeTab={activeTab} refreshPage={refreshPage} isPublished={surveyData.isPublished} />}
                        {hideMessageTemplate ? null : (companyName && <SurveyMessageTemplate survey={survey} activeTab={activeTab} companyName={companyName} surveyData={surveyData} refreshPage={refreshPage} isPublished={surveyData.isPublished} />)}
                    </div>
                    <div id="Invitee" className={`pro-overview tab-pane  fade ${disableTabs ? 'disabled' : ''} ${activeTabIndex === 1 ? 'show active' : ''}`}>
                        <SurveyParticipantList survey={survey.id} surveyData={surveyData} />
                    </div>
                    <div id="Settings" className={`pro-overview tab-pane  fade ${disableTabs ? 'disabled' : ''} ${activeTabIndex === 2 ? 'show active' : ''}`}>
                        <Settings survey={survey.id} surveyData={surveyData} activeTab={activeTab} refreshPage={refreshPage} isPublished={surveyData.isPublished} />
                    </div>
                    <div className='surveyNavBtn'>
                        {!activeTabIndex === 0 && survey.surveyStatus === 'DRAFT' && getUserType() === 'COMPANY_ADMIN' && !hideMessageTemplate && (
                            <button
                                type="button"
                                className='p-0 survey_prevbtn btn btn-secondary'
                                onClick={handleBackButtonClick}
                            >
                                {prevButton}
                            </button>
                        )}
                        {survey.surveyStatus === 'DRAFT' && (getUserType() === 'COMPANY_ADMIN' || verifyOrgLevelViewPermission("Survey")) && !hideMessageTemplate && (
                            <button
                                type="button"
                                className='survey_btn btn btn-success'
                                onClick={handleNextButtonClick}
                                disabled={isSettingsTab && disablePublish}
                            >
                                {buttonIcon}
                                {buttonLabel}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageActionsLanding;
