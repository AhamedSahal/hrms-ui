import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';
import { getPaginationQueryString } from '../../../utility';

const servicePath = "entitlement/timeinlieu";

export function getEntitlementTimeinlieuList(branchId, departmentId, jobTitleId, searchText, fromDate, toDate, pageNumber, pageSize, sort) {
    let path = getWithAuth(`${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}`)
    return path.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getTeamEntitlementTimeinlieuList(employeeId,searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function saveTimeinlieu(timeinlieu) {
    let post = timeinlieu.id == 0 ? postWithAuth(servicePath, timeinlieu)
    : putWithAuth(`${servicePath}?id=${timeinlieu.id}`, timeinlieu);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteTimeinlieu(timeinlieuId) {
    let path = servicePath + "?timeinliueId=" + encodeURIComponent(timeinlieuId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateStatus(timeinlieuId,status,approvedHours) {
    let path = servicePath + "?timeinliueId=" + encodeURIComponent(timeinlieuId)+"&approvedHours="+approvedHours+"&status="+status; 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getTimeinLieuStatus() {
    let path = (`${servicePath}/by-pending`);
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function updateTimeinLieuStatus(timeinlieuId,status,approvedHours) {
    let path = servicePath + "?timeinliueId=" + encodeURIComponent(timeinlieuId)+"&approvedHours="+approvedHours+"&status="+status; 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
