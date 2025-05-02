import { getPaginationQueryString } from '../../../../utility';
import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from '../../../../HttpRequest';

const servicePath = "/request-permission";

export function getReqPermissionList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveReqPermission(permissionType) {
    let post = permissionType.id == 0 ? postWithAuth(servicePath, permissionType)
    : putWithAuth(`${servicePath}?id=${permissionType.id}`, permissionType);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteReqPermission(leaveTypeId) {
    let path = servicePath + "?id=" + encodeURIComponent(leaveTypeId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateStatus(id, status,remark) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status + "&remark=" + remark;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}