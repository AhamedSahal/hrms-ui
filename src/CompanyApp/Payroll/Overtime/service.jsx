import { getWithAuth,patchWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/overtime";

export function getOvertimeList(branchId, departmentId, jobTitleId, searchText, fromDate, toDate, pageNumber, pageSize, sort, self) {
    let get = getWithAuth(`${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&self=${self}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTeamOvertimeList(self, searchText, pageNumber, pageSize, sort) {
    let get = getWithAuth(`${servicePath}?self=${self}&${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateStatus(id, approvedHours,employeeId, status) {  
    let path = servicePath + "?id=" + id + "&approvedHours=" + approvedHours + "&status=" + status+"&employeeId="+employeeId; 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getDashboardOtStatus() {
    let get = getWithAuth(`${servicePath}/get-by-pendingstatus`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateOverTimeForAttendance(id, approvedHours,status,employeeId) {  
    let path = servicePath + "?id=" + id + "&approvedHours=" + approvedHours + "&status=" + status+"&employeeId="+employeeId; 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}