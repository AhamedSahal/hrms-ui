

import { deleteWithAuth, getWithAuth, postWithAuth,putWithAuth, patchWithAuth } from '../../HttpRequest';
import { getPaginationQueryString } from '../../utility'; 

const servicePath = "/timesheet";
const servicePathV2 = "/timesheet-v2";

export function getTimesheet(branchId,departmentId,jobTitleId,searchText,fromDate,toDate, pageNumber, pageSize, sort, self) {
    let path = `${servicePathV2}?`;
    path+=`page=${pageNumber}&pageSize=${pageSize}&fromDate=${fromDate}&toDate=${toDate}&q=${searchText}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&self=${self}&sort=${sort}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveTimesheet(timesheetObj) {
    let post = timesheetObj.id == 0 ? postWithAuth(`${servicePath}`, timesheetObj)
    : putWithAuth(`${servicePath}?id=${timesheetObj.id}`, timesheetObj);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteTimesheet(timesheetId) {
    let path = servicePath + "?id=" + encodeURIComponent(timesheetId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateStatus(id, approvedHours, status) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&approvedHours=" + approvedHours + "&status=" + status; 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateSelectedStatus(paySlipIds, status) {
    let path = servicePath + "/status?status=" + status;
    return patchWithAuth(path, paySlipIds).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}