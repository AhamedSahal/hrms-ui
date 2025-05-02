import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/permission-type";

export function getPermissionTypeList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function savePermissionType(permissionType) {
    let post = permissionType.id == 0 ? postWithAuth(servicePath, permissionType)
    : putWithAuth(`${servicePath}?id=${permissionType.id}`, permissionType);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deletePermissionType(leaveTypeId) {
    let path = servicePath + "?id=" + encodeURIComponent(leaveTypeId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}