
import { getPaginationQueryString } from '../../../utility';
import { getWithAuth, postWithAuth, putWithAuth, patchWithAuth } from '../../../HttpRequest';

const servicePath = "/projectMain";
const servicePath1 = "/projectMain/Activity";
const servicePath2 = "/projectMain/CostEstimation";

export function getList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getActivityList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}/ActivityList?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getMainActivityList(searchText, pageNumber, pageSize, sort, id) {
    let path = `${servicePath}/MainActivityList?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += '&id=' + id;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getCostEstimationList(searchText, pageNumber, pageSize, sort, id) {
    let path = `${servicePath2}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += '&id=' + id;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
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
export function updateActivityStatus(id, status) {
    let path = servicePath + "/MainActivityList?id=" + encodeURIComponent(id) + "&status=" + status;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function save(projectMain) {
    let post = projectMain.id == 0 ? postWithAuth(servicePath, projectMain)
        : putWithAuth(`${servicePath}?id=${projectMain.id}`, projectMain);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function saveCostEstimation() {
    let post = postWithAuth(servicePath2);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function saveActivity(projectActivityMain) {
    let post = postWithAuth(servicePath1, projectActivityMain);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}