import { Form, Formik } from 'formik';
import React, { Component } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getUserType } from '../../../utility';
import FieldSet from './fieldSet';
import SurveyLanguageDropdown from '../../ModuleSetup/Dropdown/SurveyLanguageDropdown';
import { setRandomized, getSurveyQuestionList } from './service';
import { getSurveyById } from '../manageSurvey/service';


const isCompanyAdmin = getUserType() == 'COMPANY_ADMIN';


export default class SurveyQuestionForm extends Component {
    constructor(props) {
        super(props);
        let survey = this.props.survey;
        console.log(survey);
        this.state = {
            survey: survey || {
                id: 0,
                question: '',
                isMandatory: false,
                answerType: '',
                categoryId: '',
                sortOrder: ''
            },
            fieldCount: [{ id: 0 },],
            formRecords: [],
            editable: false,
            languageId: 0,
            data: [],
            languageData: [],
            fetchedData: [],
            fetchedPlaceHolderData: [],
            pairedRecord: [],
            statusname: "SORTED",
            status: false,
            surveyData: survey,
            surveyDetails: [],
            isVisible: false,
        };
    }

    handleLanguageChange = (e) => {
        let selectedValue;

        if (typeof e === "object" && e.target && e.target.value) {
            selectedValue = e.target.value;
        } else {
            selectedValue = e;
        }

        this.setState(
            (prevState) => ({
                languageId: selectedValue,
                pairedRecord: []
            }),
            () => {
                const { languageId } = this.state;
                var pairedRecord = [];
                if (languageId === "1") {
                    this.fetchList(1)
                        .then((dbData) => {
                            dbData.forEach((item, index) => {
                                item.isReadonly = false;
                                let dbPairedRecord = {
                                    data: item,
                                    placeHolderData: item
                                };
                                pairedRecord.push(dbPairedRecord);
                            });

                            this.setState(
                                {
                                    pairedRecord: [...pairedRecord]
                                },
                                () => {
                                }
                            );
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } else {
                    Promise.all([
                        this.fetchList(languageId),
                        this.fetchList(1)
                    ])
                        .then(([dbData, dbPlaceHolderData]) => {
                            dbPlaceHolderData.forEach((item, index) => {
                                item.isReadonly = true;
                                let tempData = dbData.filter(val => val && val.sortOrder === item.sortOrder);
                                if (tempData.length === 0) {
                                    tempData = undefined;
                                } else {
                                    tempData = tempData[0];
                                }
                                let dbPairedRecord = {

                                    data: tempData,
                                    placeHolderData: item
                                };
                                pairedRecord.push(dbPairedRecord);
                            });

                            this.setState(
                                {
                                    pairedRecord: [...pairedRecord]
                                },
                                () => {
                                }
                            );
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            }
        );
    };

    componentDidUpdate(prevProps) {
        if (prevProps.activeTab !== this.props.activeTab && this.props.activeTab === 'details') {
            this.fetchList(1);
            this.getSurveyById(this.props.survey.id);
        }
    }
    componentDidMount() {
        this.getSurveyById(this.props.survey.id);
    }
    getSurveyById = (id) => {
        if (!id) {
            this.setState({ surveyDetails: [{ isPublished: false }] });
            return;
        }
        getSurveyById(id).then(res => {
            if (res.status === "OK") {
                this.setState({ surveyDetails: res.data });
            } else {
                this.setState({ surveyDetails: [{ isPublished: false }] });
            }
        });
    }

    fetchList = async (languageId) => {
        try {
            const res = await getSurveyQuestionList(languageId, this.props.survey.id);
            if (res.status == "OK") {
                res.data.map(e => {
                    if (e.answerType === "SINGLE_ANSWER" || e.answerType === "MULTIPLE_ANSWER") {
                        e.showInputBox = true;
                        e.showNumberScale = false;
                    } else if (e.answerType === "NUMBER_SCALE") {
                        e.showInputBox = false;
                        e.showNumberScale = true;
                    } else {
                        e.showInputBox = false;
                        e.showNumberScale = false;
                    }
                });

                return res.data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.survey && nextProps.survey !== prevState.survey) {
            return { survey: nextProps.survey };
        } else if (!nextProps.survey) {
            return { survey: prevState.survey || { name: '' } };
        }
        return null;
    }

    addNewField = () => {
        this.setState((prevState) => ({
            fieldCount: [...prevState.fieldCount, { id: prevState.fieldCount.length }],
        }));
    };


    handleRemoveRecord = (id) => {
        this.setState(prevState => ({
            fieldCount: prevState.fieldCount.filter(record => record.id !== id),
        }));
    };
    setInitialFieldCount = () => {
        this.setState({
            fieldCount: [{ id: 0 },]
        });
    }

    updateSelf = () => {
        setRandomized(!this.state.status, this.props.survey.id)
            .then(res => {
                if (res.status === "OK") {
                    this.setState({
                        status: !this.state.status,
                        statusname: this.state.status == true ? "RANDOMIZED" : "SORTED",
                    });
                    toast.success(res.message);
                } else {
                    toast.error(res.message);
                }
            })
            .catch(err => {
                console.error(err);
            });

    }

    render() {
        const { survey, fieldCount, editable, languageId, data, pairedRecord, surveyData, surveyDetails } = this.state;
        const { isPublished } = this.props;
        return (
            <>
                <div className='surveyMesssageHead' onClick={() => this.setState({ isVisible: !this.state.isVisible })}  >
                    <h3>Survey Questions & Answers<i className={`float-right mr-2 fa  ${this.state.isVisible ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden='true' ></i></h3>
                </div>
               

                {this.state.isVisible && <Card.Body>
                    <div>
                        <div className="surveyQuepg content container-fluid mt-1">
                            <div className="d-flex align-items-center mb-1">
                                <label className='survey-label'>Order of questions in survey:</label>
                                <i
                                    style={
                                        getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus === 'TEMPLATE' || surveyData.isPublished || isPublished
                                            ? { pointerEvents: 'none' }
                                            : {}
                                    }
                                    onClick={() => this.updateSelf()}
                                    className={this.state.status ? 'pl-3 fa-2x fa fa-toggle-on text-success' : 'pl-3 fa-2x fa fa-toggle-off text-danger'}
                                ></i>
                                <label className="pl-2 mb-1">{this.state.status ? 'Randomized' : 'Sorted'}</label>
                            </div>

                            <SurveyLanguageDropdown
                                surveyId={survey.id}
                                readOnly={editable}
                                defaultValue={languageId}
                                onChange={this.handleLanguageChange}
                            />

                            {/* Render existing records */}
                            {pairedRecord.map((questionData) => (
                                <FieldSet
                                    key={questionData.placeHolderData.id}
                                    id={questionData.placeHolderData.id}
                                    onRemove={this.handleRemoveRecord}
                                    survey={this.props.survey}
                                    languageId={languageId}
                                    data={questionData.data}
                                    placeHolderData={questionData.placeHolderData}
                                    fetchList={this.fetchList}
                                    handleLanguageChange={this.handleLanguageChange}
                                    setInitialFieldCount={this.setInitialFieldCount}
                                    isPublished={isPublished}
                                />
                            ))}
                            {languageId == 1 ? (
                                <>
                                    {fieldCount.length > 1 && fieldCount.slice(0, fieldCount.length - 1).map((record, index) => (
                                        <FieldSet
                                            key={record.id}
                                            id={record.id}
                                            onRemove={this.handleRemoveRecord}
                                            survey={this.props.survey}
                                            languageId={languageId}
                                            handleLanguageChange={this.handleLanguageChange}
                                            setInitialFieldCount={this.setInitialFieldCount}
                                            refreshPage={this.props.refreshPage}
                                            isPublished={isPublished}
                                        />
                                    ))}
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button type="button" className="btn btn-primary my-2 mx-0" onClick={this.addNewField} disabled={surveyDetails.isPublished || isPublished}>
                                                <i className='fa fa-plus'> Add New  </i>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : ""}
                        </div>
                    </div>
                </Card.Body>}
            </>
        );
    }


}
