import { getPaginationQueryString } from '../../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth,patchWithAuth } from '../../../../HttpRequest';

const servicePath="/multi-approval";
const service = "/multi-approval/multi-approval-list"

export function getMultiApprovalMaster() {
    return getWithAuth(servicePath).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

// get multi approve master list
export function getMultiApprovalMasterList() {
    return getWithAuth(`${servicePath}/master-leave-list`).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

export function saveMultiApprovalMaster(multiApprovalMaster) {
    let post = postWithAuth(servicePath, multiApprovalMaster)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// multi approval list
export function saveMultiApprovallist(multiApprovalMaster) {
    let post = postWithAuth(service, multiApprovalMaster)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// patch 
export function saveMultiApprovalPatch(id, status) {
    let path = servicePath + "/status?id=" + encodeURIComponent(id) + "&status=" + status;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}