import React, { Component } from "react";
import SingleAnswerType from "./answerTypes/singleAnswerType";
import { getAllQuestionAndAnswer } from "./service";
import MultipleAnswerType from "./answerTypes/multipleAnswerType";
import NumberScaleComponent from "./answerTypes/numberscaleAnswerType";
import SubjectiveAnswerType from "./answerTypes/subjectiveAnserType";

class ViewResponse extends Component {
    constructor(props) {
        super(props);
        let survey = props.location.state;
        console.log(survey);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        console.log("called");
        getAllQuestionAndAnswer(
            this.props.location.state.surveyId,
            this.props.location.state.id
        )
            .then((res) => {
                console.log(res);
                if (res.status === "OK") {
                    this.setState({
                        data: res.data
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        const { data } = this.state;
        console.log("view-response page");
        console.log(data);
        const surveyQuestionAnswer = data.surveyQuestionAnswer || [];
        return (
            <>
                <div className="page-wrapper">
                    <div className="view-response-survey-title"><h1>{this.props.location.state.surveyName}</h1></div>

                    <div className="view-response-content">
                        <h4>
                            {this.props.location.state.name}
                            {this.props.location.state.email ? ` (${this.props.location.state.email})` : ''}
                        </h4>

                    </div>
                    {surveyQuestionAnswer.length > 0 &&
                        surveyQuestionAnswer.map((item, index) => (
                            <div
                                className="each-question"
                                style={{
                                    marginTop: "0px",
                                    marginBottom: "0px",
                                    borderRadius: "0px"
                                }}
                                key={`${index}-${item.surveyQuestionResponse.id}`}
                            >
                                <br />
                                <label className="h1">
                                    {index + 1}.{" "}
                                    {item.surveyQuestionResponse.isMandatory ? (
                                        <span>
                                            {item.surveyQuestionResponse.question}
                                            <span style={{ color: "red" }}>*</span>
                                        </span>
                                    ) : (
                                        <span>{item.surveyQuestionResponse.question}</span>
                                    )}
                                </label>

                                <div className="form-froup">
                                    {/* <label className='survey-label'>Category Name</label> */}
                                    <input
                                        className="survey-input-muted"
                                        type="hidden"
                                        value={item.surveyQuestionResponsecategoryName}
                                        readOnly
                                    />
                                </div>

                                {item.surveyQuestionResponse.answerType === "SINGLE_ANSWER" ? (
                                    <SingleAnswerType
                                        answers={item.surveyQuestionResponse.answers}
                                        surveyQuestionResponse={item.surveyQuestionResponse}
                                        surveyResponseAnswers={item.surveyResponseAnswers}
                                        fetchList={this.fetchList}
                                    />
                                ) : item.surveyQuestionResponse.answerType === "MULTIPLE_ANSWER" ? (
                                    <MultipleAnswerType
                                        answers={item.surveyQuestionResponse.answers}
                                        surveyQuestionResponse={item.surveyQuestionResponse}
                                        surveyResponseAnswers={item.surveyResponseAnswers}
                                        fetchList={this.fetchList}
                                    />
                                ) : item.surveyQuestionResponse.answerType === "NUMBER_SCALE" ? (
                                    <NumberScaleComponent
                                        answers={item.surveyQuestionResponse.answers}
                                        surveyQuestionResponse={item.surveyQuestionResponse}
                                        surveyResponseAnswers={item.surveyResponseAnswers}
                                        fetchList={this.fetchList}
                                    />
                                ) : item.surveyQuestionResponse.answerType === "SUBJECTIVE" ? (
                                    <SubjectiveAnswerType
                                        answers={item.surveyQuestionResponse.answers}
                                        surveyQuestionResponse={item.surveyQuestionResponse}
                                        surveyResponseAnswers={item.surveyResponseAnswers}
                                        fetchList={this.fetchList}
                                    />
                                ) : (
                                    item.surveyQuestionResponse.answers.map((answer) => (
                                        <div key={answer.id}>{answer.answer}</div>
                                    ))
                                )}
                            </div>
                        ))}
                </div>
            </>
        );
    }
}

export default ViewResponse;
