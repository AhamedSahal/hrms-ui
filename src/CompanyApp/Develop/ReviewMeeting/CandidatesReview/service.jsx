import { getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";

const servicePath1 = "/successionPlan";
const servicePath = "/candidateReview"

export function saveTalentCandidateReview(review) {
    // let post = review.id == 0 ? postWithAuth(servicePath, review)
    // : putWithAuth(`${servicePath}?id=${review.id}`, review);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({err})
    //     return Promise.reject(err);
    // });
}



export function getSuccessionPlanList(planId) {
    const path = `${servicePath1}?id=${planId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// export function getCandidatesReviewList() {
//     return getWithAuth(servicePath1).then(res => {
//         return Promise.resolve(res.data);
//     }).catch(err => {
//         return Promise.reject(err);
//     });
// }
