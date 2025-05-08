
import { getPaginationQueryString } from '../../utility';
import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from '../../HttpRequest';

const servicePath = "/tasks";

export function getTasksList(searchText, pageNumber, pageSize, sort, status, stat) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += '&status=' + status + '&stat=' + stat;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getMyTasksList(searchText, pageNumber, pageSize, sort, status, stat,dashboardView) {
    let path = `${servicePath}/self?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += '&status=' + status + '&stat=' + stat + '&dashboardView=' + dashboardView;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAllTasksList(searchText, pageNumber, pageSize, sort, status, stat) {
    let path = `${servicePath}/All?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += '&status=' + status + '&stat=' + stat;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function saveTasks(Tasks) {
    let post = Tasks.id == 0 ? postWithAuth(servicePath, Tasks, true)
        : putWithAuth(`${servicePath}?id=${Tasks.id}`, Tasks, true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}


export function updateStatus(id, status) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}



