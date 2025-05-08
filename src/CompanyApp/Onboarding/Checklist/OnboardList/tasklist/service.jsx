import { getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from "../../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../../utility";


const servicePath = "/onboard-list";
const servicePath1 = "/onboard-list-task";
const servicePath2 = "/onboard-list-subtask";
const servicePath4 = "/onboard-task-history";
const servicePath3 = "/onboard-subtask-history";
const servicePath5 = "/onboard-dueDate";

export function getTaskList( employeeId) {
    let path = `${servicePath1}?employeeId=${employeeId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getSubtaskList(id,employeeId) {
    let path = `${servicePath2}?taskId=${id}&employeeId=${employeeId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getHistoryList(id,status) {
    let path = `${servicePath4}?taskId=${id}&taskStatus=${status}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOnboardChecklist(branchId,departmentId,jobTitleId, q, fromDate ,toDate) {
    let path = `${servicePath}?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}




export function updateTaskStatus(id, status) {
    let path = servicePath4 + "?id=" + id + "&completed=" + status;  
    console.log(path); 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// update due date
export function updateDueDate(id, status,dueDate,taskId) {
    let path = servicePath5 + "?id=" + id + "&status=" + status + "&dueDate=" + dueDate + "&taskId=" + taskId;  
    console.log(path); 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateSubTaskStatus(id, status) {
    let path = servicePath3 + "?id=" + id + "&completed=" + status;  
    console.log(path); 
    return patchWithAuth(path).then(res => {
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