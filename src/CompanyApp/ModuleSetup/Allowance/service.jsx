
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/allowancetype";

export function getAllwoanceTypeList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveAllowancetype(allowancetype) {
    let post = allowancetype.id == 0 ? postWithAuth(servicePath, allowancetype)
    : putWithAuth(`${servicePath}?id=${allowancetype.id}`, allowancetype);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteAllowanceType(allowancetypeId) {
    let path = servicePath + "?id=" + encodeURIComponent(allowancetypeId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}