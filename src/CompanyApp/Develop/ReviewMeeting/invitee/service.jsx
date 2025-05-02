import { deleteWithAuth } from "../../../../HttpRequest";


const servicePath = "/talentReview"

export function deleteCandidates(candidateId) {
    let path = servicePath + "?id=" + encodeURIComponent(candidateId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}