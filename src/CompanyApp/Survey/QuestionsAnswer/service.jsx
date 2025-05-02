import { deleteWithAuthSurvey, getWithAuthSurvey, postWithAuthSurvey, putWithAuthSurvey } from "../../../HttpRequest";
import { getCompanyId, getPaginationQueryString } from "../../../utility";


const servicePath = "/survey-question";

export function getSurveyQuestionList(languageId, surveyId) {
    let path = `${servicePath}?&languageId=${languageId}&surveyId=${surveyId}&companyId=${getCompanyId()}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveSurveyQuestion(surveyQuestion) {
    console.log(surveyQuestion);
    surveyQuestion.companyId=getCompanyId();
    let post = surveyQuestion.id == 0 ? postWithAuthSurvey(`${servicePath}`,surveyQuestion, false) :
    putWithAuthSurvey(`${servicePath}`,surveyQuestion, false);
    return post.then(async res => {
        let data = null;
        await Promise.resolve(res.data).then(async val=>{
            data = val.data;
            console.log(data);
            await saveAnswer(surveyQuestion.answers, data);
        });

        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

async function saveAnswer(answers, data){
    let newAnswerId = null;
    for (let i = 0; i < answers.length; i++) { 
        try { 

            let path = servicePath+ "/answer?id=" + encodeURIComponent(answers[i].id)+"&answer="+answers[i].answer+"&iconFileName="+answers[i].iconFileName+
                    "&iconFilePath="+answers[i].iconFilePath+"&sortOrder="+answers[i].sortOrder+"&questionId="+data.questionId+"&languageId="+data.languageId
                    +"&newAnswerId="+newAnswerId;
            const ansRes = await putWithAuthSurvey(path,{file:answers[i].file},true);
            newAnswerId = ansRes.data.id;
        } catch (error) { 
            console.error(error); 
        } 
    }

}
export function saveSurveyAnswer(surveyAnswer) {
    let post = surveyAnswer.id == 0 ? postWithAuthSurvey(`${servicePath}`,surveyAnswer) :
    putWithAuthSurvey(`/answer`,surveyAnswer);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function deleteSurveyQuestion(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id);
    return deleteWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function setRandomized(isRandomized, surveyId) {
    let path = "/survey/randomized?isRandomized=" + isRandomized + "&surveyId=" + surveyId;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
