import { getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from "../../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../../utility";


const servicePath = "/onboard-list";

export function getTaskList(searchText, pageNumber, pageSize, sort , employeeId) {
    let path = `${servicePath}?employeeId=${employeeId}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getSubtaskList(searchText, pageNumber, pageSize, sort, id) {
    let path = `${servicePath}?taskId=${id}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOnboardChecklist(departmentId,branchId, searchText,jobTitleId, pageNumber, pageSize,q, sort, fromDate, toDate) {
    let path = `${servicePath}?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}?&fromDate=${fromDate}&toDate=${toDate}?&q=${q}${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function updateTaskStatus(data) {
    let payload = { id: data.id, status: data.status };
    let path = servicePath + "/status?status=" + payload.status;
    return patchWithAuth(path, payload.id).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function updateAllTaskStatus(data) {
    let path = servicePath + "/allstatus?status=" + data;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}