
import { getPaginationQueryString } from '../../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../../HttpRequest';

const servicePath = "/performance-objective";

export function getObjectiveList(searchText, pageNumber, pageSize, sort) { 
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveObjective(objective) { 
    let post = objective.id == 0 ? postWithAuth(servicePath, objective)
    : putWithAuth(`${servicePath}?id=${objective.id}`, objective);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteObjective(objectiveId) {
    let path = servicePath + "?id=" + encodeURIComponent(objectiveId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}