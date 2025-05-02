import React from 'react';
import { toast } from 'react-toastify';

class NumberScaleComponent extends React.Component {
  handleAnswerChange = (e) => {
    let id= e.target.value;
     const { participantAttendees } = this.props;
     const { surveyQuestionResponse } = this.props;
     const { surveyResponseAnswers } = this.props;
     const answer = e.target.nextSibling.textContent;
     const answerIds = id.toString();
 
     const participantQuestion = {
       answerIds: answerIds,
       answers: answer,
       id: surveyResponseAnswers.id || 0,
       participantId: participantAttendees.participantId,
       question: surveyResponseAnswers.question || surveyQuestionResponse.question,
       questionId: surveyResponseAnswers.questionId || surveyQuestionResponse.id,
       surveyId: surveyQuestionResponse.surveyId || '',
       languageId: participantAttendees.languageId,
     };
 
     this.save(participantQuestion);
   };
 
   render() {
     const { answers, surveyResponseAnswers } = this.props;
     return (
        <div className="answer-type-options mt-2">
         {answers.map((answer) => (
           <label className='survey-label2 h5' key={answer.id}>
             <input
               type="radio"
               name={`question-${surveyResponseAnswers.questionId}`}
               value={answer.id}
               defaultChecked={parseInt(surveyResponseAnswers.answerIds) === answer.id}
               onChange={this.handleAnswerChange}
               disabled={true}
             />
             <label className='survey-label2 h4'>{answer.answer}</label>
           </label>
         ))}
         </div>
       
     );
   }
}

export default NumberScaleComponent;
