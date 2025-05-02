import React from 'react';
import { toast } from 'react-toastify';

class SubjectiveAnswerType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textareaValue: '',
    };
  }

  handleBlur = () => {
    const { participantAttendees, surveyQuestionResponse, surveyResponseAnswers } = this.props;
    const { textareaValue } = this.state;

    const participantQuestion = {
      answerIds: '0',
      answers: textareaValue,
      id: surveyResponseAnswers.id || 0,
      participantId: participantAttendees.participantId,
      question: surveyResponseAnswers.question || surveyQuestionResponse.question,
      questionId: surveyResponseAnswers.questionId || surveyQuestionResponse.id,
      surveyId: surveyQuestionResponse.surveyId,
      languageId:surveyQuestionResponse.languageId
    };
  };

  handleChange = (event) => {
    const newValue = event.target.value;
    this.setState({ textareaValue: newValue });
  };

  render() {
    const{surveyResponseAnswers} = this.props;
    return (
      <textarea
        className='col-12 form-control survey-muted-textarea mt-2'
        defaultValue={surveyResponseAnswers.answers}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        placeholder='Enter Answer Here...'
        disabled={true}
      />
    );
  }
}

export default SubjectiveAnswerType;
