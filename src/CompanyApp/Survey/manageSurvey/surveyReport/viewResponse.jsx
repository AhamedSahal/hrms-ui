import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SingleAnswerType from "./answerTypes/singleAnswerType";
import { getAllQuestionAndAnswer } from "./service";
import MultipleAnswerType from "./answerTypes/multipleAnswerType";
import NumberScaleComponent from "./answerTypes/numberscaleAnswerType";
import SubjectiveAnswerType from "./answerTypes/subjectiveAnserType";

const ViewResponse = () => {
    const location = useLocation();
    const survey = location.state;
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchList();
    }, []);

    const fetchList = () => {
        console.log("called");
        getAllQuestionAndAnswer(survey.surveyId, survey.id)
            .then((res) => {
                console.log(res);
                if (res.status === "OK") {
                    setData(res.data);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const surveyQuestionAnswer = data.surveyQuestionAnswer || [];

    return (
        <>
            <div className="page-wrapper">
                <div className="view-response-survey-title"><h1>{survey.surveyName}</h1></div>

                <div className="view-response-content">
                    <h4>
                        {survey.name}
                        {survey.email ? ` (${survey.email})` : ''}
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
                                    fetchList={fetchList}
                                />
                            ) : item.surveyQuestionResponse.answerType === "MULTIPLE_ANSWER" ? (
                                <MultipleAnswerType
                                    answers={item.surveyQuestionResponse.answers}
                                    surveyQuestionResponse={item.surveyQuestionResponse}
                                    surveyResponseAnswers={item.surveyResponseAnswers}
                                    fetchList={fetchList}
                                />
                            ) : item.surveyQuestionResponse.answerType === "NUMBER_SCALE" ? (
                                <NumberScaleComponent
                                    answers={item.surveyQuestionResponse.answers}
                                    surveyQuestionResponse={item.surveyQuestionResponse}
                                    surveyResponseAnswers={item.surveyResponseAnswers}
                                    fetchList={fetchList}
                                />
                            ) : item.surveyQuestionResponse.answerType === "SUBJECTIVE" ? (
                                <SubjectiveAnswerType
                                    answers={item.surveyQuestionResponse.answers}
                                    surveyQuestionResponse={item.surveyQuestionResponse}
                                    surveyResponseAnswers={item.surveyResponseAnswers}
                                    fetchList={fetchList}
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
};

export default ViewResponse;
