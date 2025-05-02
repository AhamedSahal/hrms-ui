import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../../utility";

const servicePath = "/addCandidate";
const talentPool = "/talentPool";

export function getCandidatesList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function getTalentPoolList(poolId){
    return getWithAuth(`${talentPool}?poolId=${poolId}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}


export function saveCandidate(ownersData) {
    let post = ownersData.id == 0 ? postWithAuth(servicePath, ownersData)
    : putWithAuth(`${servicePath}?id=${ownersData.id}`, ownersData);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteCandidate(ownersId) {
    let path = servicePath + "?id=" + encodeURIComponent(ownersId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}