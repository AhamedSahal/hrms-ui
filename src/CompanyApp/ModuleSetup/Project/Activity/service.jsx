
import { getPaginationQueryString } from '../../../../utility';
import {  getWithAuth, postWithAuth, putWithAuth } from '../../../../HttpRequest';

const servicePath = "/activity";

export function getList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function save(activity) {
    let post = activity.id == 0 ? postWithAuth(servicePath, activity)
    : putWithAuth(`${servicePath}?id=${activity.id}`, activity);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}