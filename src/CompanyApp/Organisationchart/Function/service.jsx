
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/functions";

export function getFunctionList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveFunction(functions) {
    let post = functions.id == 0 ? postWithAuth(servicePath, functions)
    : putWithAuth(`${servicePath}?id=${functions.id}`, functions); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteFunction(functionId) {
    let path = servicePath + "?id=" + encodeURIComponent(functionId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}