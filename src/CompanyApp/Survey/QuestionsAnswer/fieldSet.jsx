import React, { Component } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup } from 'reactstrap';
import { getUserType } from '../../../utility';
import { ANSWER_TYPE } from '../../../Constant/enum';
import EnumDropdown from '../../ModuleSetup/Dropdown/EnumDropdown';
import CategoryDropdown from '../../ModuleSetup/Dropdown/CategoryDropdown';
import { deleteSurveyQuestion, getSurveyQuestionList, saveSurveyAnswer, saveSurveyQuestion } from './service';
import InputAnswerOptions from './SurveyAnswer/InputAnswerOptions';
import NumberScale from './SurveyAnswer/NumberScale';
import { confirmAlert } from 'react-confirm-alert';
import { QuestionSchema } from './questionSchema';
import { getSurveyById } from '../manageSurvey/service';
import { Button, Modal } from 'react-bootstrap';
import CategoryForm from '../SurveyCategory/categoryForm';
const { Header, Body, Footer, Dialog } = Modal;

export default class FieldSet extends Component {
    constructor(props) {
        super(props);
        let surveyQuestionAnswer = this.props.data;
        let surveyData = this.props.survey;
        let placeHolderData = this.props.placeHolderData;
        let answersArray = [];
        if (typeof surveyQuestionAnswer === 'undefined') {
            if (typeof placeHolderData !== 'undefined') {
                placeHolderData.answers.forEach(element => {
                    answersArray = [...answersArray, {
                        id: '',
                        answer: '',
                        iconFileName: '',
                        iconFilePath: '',
                        sortOrder: ''
                    }];
                });
            }
        }
        this.state = {
            surveyQuestionAnswer: surveyQuestionAnswer || {
                id: 0,
                question: '',
                isMandatory: false,
                categoryId: '',
                answerType: '',
                sortOrder: '',
                answers: answersArray,
                surveyId: this.props.survey.id,
                data: [],
                showInputBox: false,
                showNumberScale: false,
                languageId: parseInt(this.props.languageId, 10)
            },
            placeHolderData: placeHolderData || {
                question: 'Enter Question Here',
                answerType: 'Select Answer Type From Dropdown',
                answers: [{
                    id: '',
                    answer: 'Enter Answer',
                    iconFileName: '',
                    iconFilePath: '',
                    sortOrder: ''
                }],
                surveyId: this.props.survey.id,
                data: [],
                showInputBox: false,
                showNumberScale: false,
                languageId: parseInt(this.props.languageId, 10),
                isReadonly: false
            },
            surveyData: surveyData,
            showCategoryForm: false,
            category: undefined,
            refreshCategory: false,
        };
    }
    componentDidMount() {
        this.getSurveyById(this.props.survey.id)
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

    delete = (data) => {
        if (data.id > 0) {

            confirmAlert({
                title: `Delete Question`,
                message: 'Are you sure, you want to delete ' + data.question + '?',
                buttons: [
                    {
                        className: "btn btn-danger",
                        label: 'Yes',
                        onClick: () => deleteSurveyQuestion(data.id).then(res => {
                            if (res.status == "OK") {
                                toast.success(res.message);
                                this.props.handleLanguageChange(this.props.languageId);
                                this.props.setInitialFieldCount();
                            } else {
                                toast.error(res.message)
                            }
                        })
                    },
                    {
                        label: 'No',
                        onClick: () => { }
                    }
                ]
            });
        }
        else {
            this.props.onRemove(this.props.id);
        }
    }
    hideForm = () => {
        this.setState({
            showCategoryForm: false,
            category: undefined,
            refreshCategory:true,
        })
    }
    updateList = (category) => {
        this.hideForm();
      }

    base64ToBlob(base64Data) {
        const mimeType = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/)[1];
        const byteCharacters = atob(base64Data.split(',')[1]);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);

            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, { type: mimeType });
    }

    base64ToFile(base64Data, fileName) {
        const blob = this.base64ToBlob(base64Data);
        return new File([blob], fileName, { type: blob.type });
    }

    save = (data, { setSubmitting }) => {
        if (this.props.refreshPage) {
            this.props.fetchList();
        }
        else {
            const { surveyQuestionAnswer, placeHolderData } = this.state;
            setSubmitting(true);
            data.answers = surveyQuestionAnswer.answers;
            data.answerType = placeHolderData.answerType;
            if (data.languageId !== 1) {
                data.id = placeHolderData.id;
                for (let i = 0; i < placeHolderData.answers.length; i++) {
                    data.answers[i].sortOrder = placeHolderData.answers[i].sortOrder;
                    if (placeHolderData.answers[i].image !== null) {
                        let file = this.base64ToFile(placeHolderData.answers[i].image, placeHolderData.answers[i].iconFileName);
                        data.answers[i].file = file;
                    }
                }
            }
            data.isMandatory = placeHolderData.isMandatory;
            data.sortOrder = placeHolderData.sortOrder;
            data.categoryId = placeHolderData.categoryId;
            saveSurveyQuestion(data)
                .then(res => {
                    if (res.status === "OK") {
                        toast.success(res.message);
                        this.props.handleLanguageChange(this.props.languageId);
                        this.props.setInitialFieldCount();
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
        // this.fetchList();
    }

    handleInputChange = (index, event) => {
        const { surveyQuestionAnswer } = this.state;
        const updatedAnswers = [...surveyQuestionAnswer.answers];

        updatedAnswers[index].answer = event.target.value;
        updatedAnswers[index].sortOrder = index;
        this.setState(prevState => ({
            surveyQuestionAnswer: {
                ...prevState.surveyQuestionAnswer,
                answers: updatedAnswers
            }
        }), () => {
            console.log(this.state.surveyQuestionAnswer.answers);
        });
    };
    
    handleFileChange = (index, event) => {
        const { surveyQuestionAnswer } = this.state;
        const updatedAnswers = [...surveyQuestionAnswer.answers];
        const file = event.target.files[0];

        const image = new Image();
        const reader = new FileReader();

        reader.onload = () => {
            image.onload = () => {
                if (image.width === 32 && image.height === 32) {
                    updatedAnswers[index].file = file;
                    this.setState(prevState => ({
                        surveyQuestionAnswer: {
                            ...prevState.surveyQuestionAnswer,
                            answers: updatedAnswers
                        }
                    }), () => {
                        console.log(this.state.surveyQuestionAnswer.answers);
                    });
                } else {
                    toast.error('Select image of size 32px x 32px.');
                }
            };

            image.src = reader.result;
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    handleAddInputBox = () => {
        const { surveyQuestionAnswer } = this.state;
        const updatedAnswers = [...surveyQuestionAnswer.answers, {
            id: '',
            answer: '',
            iconFileName: '',
            iconFilePath: '',
            sortOrder: ''
        }];
        this.setState(prevState => ({
            surveyQuestionAnswer: {
                ...prevState.surveyQuestionAnswer,
                answers: updatedAnswers

            }
        }));
    };

    handleRemoveInputBox = (index) => {
        const { surveyQuestionAnswer } = this.state;
        const updatedAnswers = [...surveyQuestionAnswer.answers]; 
        updatedAnswers.splice(index, 1);
        this.setState(prevState => ({
            surveyQuestionAnswer: {
                ...prevState.surveyQuestionAnswer,
                answers: updatedAnswers

            }
        }));
    };

    handleSelectChange = (value) => {

        const { surveyQuestionAnswer, placeHolderData } = this.state;
        const selectedValue = parseInt(value, 10) + 1;

        var updatedAnswers = [];
        for (var i = 1; i < selectedValue; i++) {
            updatedAnswers = [...updatedAnswers, {
                id: '',
                answer: i,
                iconFileName: '',
                iconFilePath: '',
                sortOrder: i - 1,
            }];
        }

        this.setState(prevState => ({
            surveyQuestionAnswer: {
                ...prevState.surveyQuestionAnswer,
                answers: updatedAnswers
            }
        }));
    }

    handleRefreshCategory = () => {
        this.setState({
            showCategoryForm: true,
            refreshCategory:true,
        })
    }

    render() {
        const { surveyQuestionAnswer, placeHolderData, surveyData } = this.state;
        const { isPublished } = this.props;
        return (
            <>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        ...surveyQuestionAnswer,
                        sortOrder: placeHolderData.sortOrder || surveyQuestionAnswer.sortOrder,
                        answerType: placeHolderData.answerType || surveyQuestionAnswer.answerType,
                        categoryId: placeHolderData.categoryId || surveyQuestionAnswer.categoryId,
                        question: surveyQuestionAnswer.question,
                    }}
                    onSubmit={this.save}
                    validationSchema={QuestionSchema}
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
                        <Form className='each-question'>

                            <Field
                                name="id"
                                className="form-control"
                                type="hidden"
                                value={surveyQuestionAnswer.id}
                            />
                            <ErrorMessage name="id">
                                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                            </ErrorMessage>
                            <div className="row mt-2">
                                <Field
                                    name="surveyId"
                                    className="form-control"
                                    type="hidden"
                                    value={surveyQuestionAnswer.surveyId}
                                />
                                <ErrorMessage name="surveyId">
                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                                <Field
                                    name="languageId"
                                    className="form-control"
                                    type="hidden"
                                    value={surveyQuestionAnswer.languageId}
                                />
                                <ErrorMessage name="languageId">
                                    {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                </ErrorMessage>
                                <div className="col-md-12">
                                    {/* make read only for other languages */}
                                    <FormGroup>
                                        <label className='survey-label'>
                                            Question<span className='ml-1' style={{ color: 'red' }}>*</span>
                                        </label>
                                        {placeHolderData.isReadonly ? <Field
                                            name="isMandatory"
                                            className="ml-4"
                                            type="checkbox"
                                            checked={placeHolderData.isMandatory}
                                            disabled={placeHolderData.isReadonly || surveyData.isPublished || isPublished}
                                        /> :
                                            <input
                                                className="ml-4 form-check-input survey-check"
                                                type="checkbox"
                                                checked={placeHolderData.isMandatory}
                                                disabled={getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE' || surveyData.isPublished || isPublished}
                                                onChange={e => {
                                                    const { placeHolderData } = this.state;
                                                    placeHolderData.isMandatory = !placeHolderData.isMandatory;
                                                    this.setState({
                                                        placeHolderData: placeHolderData
                                                    })
                                                }}
                                            />}
                                        <label className="form-check-label survey-check-label">
                                            Mark as mandatory
                                        </label>

                                        <Field
                                            name="question"
                                            className="form-control"
                                            placeholder={placeHolderData.question}
                                            value={surveyQuestionAnswer.question}
                                            component="textarea"
                                            onChange={e => {
                                                const { surveyQuestionAnswer } = this.state;
                                                surveyQuestionAnswer.question = e.target.value;
                                                this.setState({
                                                    surveyQuestionAnswer: surveyQuestionAnswer
                                                })
                                            }}
                                            disabled={getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE' || surveyData.isPublished || isPublished}
                                        />
                                        <ErrorMessage name="question">
                                            {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-4">
                                    <FormGroup>
                                        <label className='survey-label'>
                                            Category<span className='ml-1' style={{ color: 'red' }}>*</span>  <Button className="btn add-btn" onClick={() => {
                                                this.setState({
                                                    showCategoryForm: true,
                                                    refreshCategory:false
                                                })
                                            }}><i className="fa fa-plus" /> New</Button>
                                        </label>
                                        {/* make read only */}
                                        <Field
                                            name="categoryId"

                                            render={(field) => (
                                                <CategoryDropdown
                                                refreshCategory={this.state.refreshCategory}
                                                    readOnly={placeHolderData.isReadonly || getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE' || surveyData.isPublished || isPublished}
                                                    defaultValue={surveyQuestionAnswer.categoryId || placeHolderData.categoryId}
                                                    onChange={(e) => {
                                                        const { placeHolderData } = this.state;
                                                        placeHolderData.categoryId = e.target.value;
                                                        surveyQuestionAnswer.categoryId = e.target.value;
                                                        this.setState({
                                                            placeHolderData: placeHolderData,
                                                            surveyQuestionAnswer: surveyQuestionAnswer
                                                        })
                                                    }}
                                                />
                                            )}
                                        />
                                        <ErrorMessage name="categoryId">
                                            {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-4">
                                    <FormGroup>
                                        <label className='survey-label'>
                                            Answer Type<span className='ml-1' style={{ color: 'red' }}>*</span>
                                        </label>
                                        {/* make read only */}
                                        <Field
                                            name="answerType"
                                            className="form-control"
                                            render={(field) => (
                                                <EnumDropdown
                                                    label={'Answer Type'}
                                                    enumObj={ANSWER_TYPE}
                                                    readOnly={placeHolderData.isReadonly || getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE' || surveyData.isPublished || isPublished}
                                                    defaultValue={placeHolderData.answerType}
                                                    onChange={(e) => {
                                                        surveyQuestionAnswer.answerType = e.target.value;
                                                        setFieldValue("answerType", e.target.value);
                                                        const updated = { ...placeHolderData };
                                                        var updatedAnswers = [];
                                                        if (e.target.value === "SINGLE_ANSWER" || e.target.value === "MULTIPLE_ANSWER") {
                                                            updated.showInputBox = true;
                                                            updated.showNumberScale = false;
                                                            updated.answerType = e.target.value;
                                                        } else if (e.target.value === "NUMBER_SCALE") {
                                                            updated.showInputBox = false;
                                                            updated.showNumberScale = true;
                                                            updated.answerType = e.target.value;
                                                            for (var i = 1; i < 6; i++) {
                                                                updatedAnswers = [...updatedAnswers, {
                                                                    id: '',
                                                                    answer: i,
                                                                    iconFileName: '',
                                                                    iconFilePath: '',
                                                                    sortOrder: i - 1,
                                                                }];
                                                            }
                                                            updatedAnswers = [...surveyQuestionAnswer.answers, ...updatedAnswers];
                                                        } else {
                                                            updated.showInputBox = false;
                                                            updated.showNumberScale = false;
                                                            updated.answerType = e.target.value;
                                                        }

                                                        this.setState({
                                                            placeHolderData: updated,
                                                            surveyQuestionAnswer: surveyQuestionAnswer
                                                        }, () => {
                                                            this.setState(prevState => ({
                                                                surveyQuestionAnswer: {
                                                                    ...prevState.surveyQuestionAnswer,
                                                                    answers: updatedAnswers
                                                                }
                                                            }));
                                                        });
                                                    }}
                                                />
                                            )}
                                        />
                                        <ErrorMessage name="answerType">
                                            {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                                <div className="col-md-2">
                                    <FormGroup>
                                        <label className='survey-label'>
                                            Sort Order<span className='ml-1' style={{ color: 'red' }}>*</span>
                                        </label>
                                        {/* make read only */}
                                        <Field
                                            name="sortOrder"
                                            className="form-control survey-dropdown"
                                            type="number"
                                            disabled={placeHolderData.isReadonly || getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE' || surveyData.isPublished || isPublished}
                                            placeholder="Enter sort order here"
                                            value={placeHolderData.sortOrder || values.sortOrder}
                                            onChange={e => {
                                                const { placeHolderData } = this.state;
                                                placeHolderData.sortOrder = e.target.value;
                                                surveyQuestionAnswer.sortOrder = e.target.value;
                                                this.setState({
                                                    placeHolderData: placeHolderData,
                                                    surveyQuestionAnswer: surveyQuestionAnswer
                                                })
                                            }}
                                        />
                                        <ErrorMessage name="sortOrder">
                                            {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
                                        </ErrorMessage>
                                    </FormGroup>
                                </div>
                            </div>
                            {placeHolderData.showInputBox &&
                                <div className="row mt-2">
                                    <div className="col-md-12">
                                        <label className='survey-label'>Options</label>
                                        {this.props.languageId == '1' && <span className='image-validation'>Please ensure 32x32 pixel dimensions</span>}
                                        <div className="answer-type-options">
                                            {placeHolderData.isReadonly ?
                                                placeHolderData.answers.map((answer, index) => (
                                                    <InputAnswerOptions
                                                        key={index}
                                                        value={values.answers[index] ? values.answers[index].answer : ""}
                                                        index={index}
                                                        onChange={(e) => this.handleInputChange(index, e)}
                                                        onRemove={(e) => this.handleRemoveInputBox(index)}
                                                        readOnly={placeHolderData.isReadonly || surveyData.isPublished || isPublished}
                                                        answerReadOnly={getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE' || surveyData.isPublished}
                                                        placeholder={answer.answer}
                                                        image={answer.image}
                                                    />
                                                )) :
                                                values.answers.map((answer, index) => (
                                                    <InputAnswerOptions
                                                        key={index}
                                                        value={answer.answer}
                                                        index={index}
                                                        onChange={(e) => this.handleInputChange(index, e)}
                                                        onRemove={(e) => this.handleRemoveInputBox(index)}
                                                        readOnly={placeHolderData.isReadonly || surveyData.isPublished}
                                                        onFileChange={(e) => this.handleFileChange(index, e)}
                                                        answerReadOnly={getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE' || surveyData.isPublished}
                                                        image={answer.image}
                                                    />
                                                ))
                                            }
                                            {getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE' || !placeHolderData.isReadonly && <button
                                                className="btn btn-primary mx-0"
                                                onClick={e => this.handleAddInputBox()}
                                                type="button"
                                                disabled={!(surveyQuestionAnswer.sortOrder && surveyQuestionAnswer.answerType && surveyQuestionAnswer.categoryId && surveyQuestionAnswer.question) || surveyData.isPublished}
                                            >
                                                Add Option
                                            </button>}
                                        </div>
                                    </div>
                                </div>
                            }
                            {placeHolderData.showNumberScale && (<>
                                <div className="row mt-2">
                                    <div className="col-md-12">
                                        <label className='survey-label'>Number Scale</label>
                                        <select className='ant-select-item' disabled={placeHolderData.isReadonly || getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE' || surveyData.isPublished} value={values.answers.length} onChange={event => this.handleSelectChange(event.target.value)}>
                                            <option value={5}>5</option>
                                            <option value={7}>7</option>
                                            <option value={10}>10</option>
                                        </select>
                                        {placeHolderData.isReadonly ?
                                            placeHolderData.answers.map((answer, index) => (
                                                <InputAnswerOptions
                                                    key={index}
                                                    value={values.answers[index] ? values.answers[index].answer : ""}
                                                    index={index}
                                                    onChange={(e) => this.handleInputChange(index, e)}
                                                    readOnly={true}
                                                    placeholder={answer.answer}
                                                    image={false}
                                                    answerReadOnly={getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE'}
                                                />
                                            )) :
                                            values.answers.map((answer, index) => (
                                                <InputAnswerOptions
                                                    key={index}
                                                    value={answer.answer}
                                                    index={index}
                                                    onChange={(e) => this.handleInputChange(index, e)}
                                                    readOnly={true}
                                                    image={false}
                                                    answerReadOnly={getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE'}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                            </>
                            )}
                            <div className="row">
                                <div className="col-md-12 mt-2">
                                    <button type="submit" className="btn btn-primary btn-success mx-0" disabled={isSubmitting || getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE' || surveyData.isPublished || isPublished}>
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary survey-delete-btn"
                                        onClick={() => this.delete(surveyQuestionAnswer)}
                                        disabled={isSubmitting || getUserType() !== 'SUPER_ADMIN' && surveyData.surveyStatus == 'TEMPLATE' || surveyData.isPublished || isPublished}>
                                        Delete
                                    </button>
                                </div>

                            </div>
                        </Form>
                    )}
                </Formik>
                <Modal enforceFocus={false} size={"md"} show={this.state.showCategoryForm} onHide={this.hideForm} >
                    <Header closeButton>
                        <h5 className="modal-title">Add Survey Category</h5>
                    </Header>
                    <Body>
                        <CategoryForm updateList={this.updateList} category={this.state.category}></CategoryForm>
                    </Body>
                </Modal>
            </>
        );
    }
}
