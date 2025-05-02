import { postWithAuth, putWithAuth } from "../../../../HttpRequest";

const servicePath = "/talentReviewMeeting"

export function saveTalentReviewMeeting(meetingData) {
    // let post = meetingData.id == 0 ? postWithAuth(servicePath, meetingData)
    //     : putWithAuth(`${servicePath}?id=${meetingData.id}`, meetingData);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({ err })
    //     return Promise.reject(err);
    // });
}