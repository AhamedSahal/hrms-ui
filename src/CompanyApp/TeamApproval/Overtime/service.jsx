import { getWithAuth, getWithAuthDashboard, patchWithAuth } from "../../../HttpRequest";

const servicePath = "/overtime";

export function getTeamOvertimeList(searchText, pageNumber, pageSize, sort,fromDate, toDate,branchId, departmentId, jobTitleId) {
    let path = `${servicePath}/team?`;
    path+=`page=${pageNumber}&pageSize=${pageSize}&q=${searchText}&fromDate=${fromDate}&toDate=${toDate}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&sort=${sort}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateStatus(id, approvedHours, status, employeeId) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&approvedHours=" + approvedHours + "&status=" + status + "&employeeId=" + employeeId;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateSelectedStatus(selected, status) {
    let path = servicePath + "/status?status=" + status;
    return patchWithAuth(path, selected).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}