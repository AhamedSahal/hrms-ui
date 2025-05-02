import React, { Component } from 'react';

class SingleAnswerType extends Component {

  render() {
    const { answers, surveyResponseAnswers } = this.props;
    console.log(answers);
    return (
      <div className='answer-type-options mt-2'>
        {answers.map((answer) => (
          <label className='survey-label2 h5' key={answer.id}>
            <input
              type="radio"
              name={`question-${surveyResponseAnswers.questionId}`}
              value={answer.id}
              defaultChecked={parseInt(surveyResponseAnswers.answerIds) === answer.id}
              disabled={true}
            />
            {!answer.image && <label className='survey-label2 h4'>{answer.answer}</label>}
            {answer.image && <img className='square-image' style={{marginLeft: "25px", borderRadius: '5%'}} src={answer.image} alt={answer.answer} />}
          </label>
        ))}
      </div>
    );
  }
}

export default SingleAnswerType;
