
import { getPaginationQueryString } from '../../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../../HttpRequest';

const servicePath = "/performance-objective-group";

export function getObjectiveGroupList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveObjectiveGroup(objectivegroup) {
    let post = objectivegroup.id == 0 ? postWithAuth(servicePath, objectivegroup)
    : putWithAuth(`${servicePath}?id=${objectivegroup.id}`, objectivegroup);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteObjectiveGroup(objectivegroupId) {
    debugger;
    let path = servicePath + "?id=" + encodeURIComponent(objectivegroupId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}