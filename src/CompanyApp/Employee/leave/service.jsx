import { deleteWithAuth, getWithAuth, getWithAuthDashboard, patchWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/leave";

export function getLeaveList(employeeId, branchId, departmentId, jobTitleId, searchText, fromDate, toDate, pageNumber, pageSize, sort, self) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}&self=${self}`;
    path += `&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}`;
    return getWithAuthDashboard(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// get leave
export function getEmployeeLeaveInformation(leaveTypeId,leaveEmployeeId,leaveYear) {
    let path = `${servicePath}/employee-leavebalance?leaveTypeId=${leaveTypeId}&employeeId=${leaveEmployeeId}&leaveYear=${leaveYear}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}



export function saveLeave(leave) {
    let post = leave.id == 0 ? postWithAuth(`${servicePath}?id=${leave.id}&employeeId=${leave.employeeId}&leaveTypeId=${leave.leaveTypeId}&startDate=${leave.startDate}&endDate=${leave.endDate}&leaveReason=${leave.leaveReason}&remark=${leave.remark}&startDateDayType=${leave.startDateDayType}&endDateDayType=${leave.endDateDayType}`, {file:leave.file}, true)
        : putWithAuth(`${servicePath}?id=${leave.id}&employeeId=${leave.employeeId}&leaveTypeId=${leave.leaveTypeId}&startDate=${leave.startDate}&endDate=${leave.endDate}&leaveReason=${leave.leaveReason}&remark=${leave.remark}&startDateDayType=${leave.startDateDayType}&endDateDayType=${leave.endDateDayType}`, {file:leave.file}, true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function deleteLeave(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id);
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

export function updateStatusLeaveTrack(comments, id, status) {
    let path = servicePath + "/leaveTrack?id=" + encodeURIComponent(id) + "&status=" + status + "&comments=" + comments;
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

// GET multi approval leave list
export function getMultiApprovalLeaveList(leaveId) {
    let path = `${servicePath}/multi-approval-leavelist?leaveId=${leaveId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
