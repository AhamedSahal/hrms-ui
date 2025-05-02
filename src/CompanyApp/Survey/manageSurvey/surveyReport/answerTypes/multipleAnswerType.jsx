import React, { Component } from 'react';

import { toast } from 'react-toastify';

class MultipleAnswerType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedAnswerIds: [],
      selectedAnswers: [],
      answerIdsResponse: [],
      answersResponse: [],
    };
  }

  handleAnswerClick = (e) => {
    const isChecked = e.target.checked;
    const answerId = e.target.value;
    const answerText = e.target.nextSibling.textContent;

    this.setState((prevState) => {
      let selectedAnswerIds = [...prevState.selectedAnswerIds];
      let selectedAnswers = [...prevState.selectedAnswers];

      if (isChecked) {
        if (!selectedAnswerIds.includes(answerId)) {
          selectedAnswerIds.push(answerId);
        }
        const answer = { id: answerId, answer: answerText };
        if (!selectedAnswers.find((item) => item.id === answerId)) {
          selectedAnswers.push(answer);
        }
      } else {
        selectedAnswerIds = selectedAnswerIds.filter((id) => id !== answerId);
        selectedAnswers = selectedAnswers.filter((item) => item.id !== answerId);
      }

      return { selectedAnswerIds, selectedAnswers };
    }, () => {
    });
  };

  handleSave = () => {
    const { participantAttendees, surveyQuestionResponse, surveyResponseAnswers } = this.props;
    const { selectedAnswerIds, selectedAnswers } = this.state;

    const participantQuestion = {
      answerIds: JSON.stringify(selectedAnswerIds),
      answers: JSON.stringify(selectedAnswers),
      id: surveyResponseAnswers.id || 0,
      participantId: participantAttendees.participantId,
      question: surveyResponseAnswers.question || surveyQuestionResponse.question,
      questionId: surveyResponseAnswers.questionId || surveyQuestionResponse.id,
      surveyId: surveyQuestionResponse.surveyId || '',
      languageId:surveyQuestionResponse.languageId
    };
  };

  componentDidMount() {
    const { surveyResponseAnswers } = this.props;
    const answerIds = JSON.parse(surveyResponseAnswers.answerIds || '[]');
    const answers = JSON.parse(surveyResponseAnswers.answers || '[]');
    this.setState({
      selectedAnswerIds: answerIds,
      selectedAnswers: answers,
    })
  }
  render() {
    const { answers } = this.props;
    const { selectedAnswerIds } = this.state;
    return (
      <div className="answer-type-options mt-2">
        {answers.map((answer) => (
          <label className="d-flex multi-answer-type-label" key={answer.id}>
            <input
              className="form-check-input survey-check-input"
              type="checkbox"
              name="answerids"
              value={answer.id}
              checked={selectedAnswerIds.includes(answer.id.toString())}
              onClick={this.handleAnswerClick}
              disabled={true}
             
            />
            {!answer.image && <label className="survey-label3 h4">{answer.answer}</label>}
            {answer.image && <img className='square-image' style={{marginLeft: "25px", borderRadius: '5%'}} src={answer.image} alt={answer.answer} />}
          </label>
        ))}
      </div>
    );
  }
}

export default MultipleAnswerType;
