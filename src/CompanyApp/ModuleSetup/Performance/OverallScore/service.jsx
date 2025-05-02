
import { getPaginationQueryString } from '../../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../../HttpRequest';

const servicePath = "/performance-overall-score";
const servicePath1 = "/potential-overall-score";

export function getOverallScoreList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getPotentialScoreList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath1}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveOverallScore(objectivegroup) {
    let post = objectivegroup.id == 0 ? postWithAuth(servicePath1, objectivegroup)
    : putWithAuth(`${servicePath}?id=${objectivegroup.id}`, objectivegroup);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function savePotentialScore(objectivegroup) {
    let post = objectivegroup.id == 0 ? postWithAuth(servicePath1, objectivegroup)
    : putWithAuth(`${servicePath1}?id=${objectivegroup.id}`, objectivegroup);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteOverallScore(overallscoreId) {
    debugger;
    let path = servicePath + "?id=" + encodeURIComponent(overallscoreId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function deletePotentialScore(overallscoreId) {
    debugger;
    let path = servicePath1 + "?id=" + encodeURIComponent(overallscoreId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}