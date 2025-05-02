import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../HttpRequest';
import { getPaginationQueryString } from '../../utility';

const servicePath = "/employee";
const importBulkPath = "/import-job";

export function getEmployeeList(searchText, pageNumber, pageSize, sort, status, branchId, departmentId, designationId,divisionId,entityId) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += `&branchId=${branchId}&departmentId=${departmentId}&designationId=${designationId}&divisionId=${divisionId}&entityId=${entityId}`;
    if (status != null && status != undefined && status != '') {
        path += '&status=' + status;
    }
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveEmployee(employee) {
    let post = employee.id == 0 ? postWithAuth(servicePath+"/quick", employee)
        : putWithAuth(`${servicePath}?id=${employee.id}`, employee);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function deleteEmployee(employeeId) {
    let path = servicePath + "?id=" + encodeURIComponent(employeeId);
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function resetUsername(id, username) {
    let post = putWithAuth(`/profile/reset-employee-username`, { employeeId: id, newUserName: username });
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function resetPassword(id, password) {
    let post = putWithAuth(`/profile/reset-employee-password`, { employeeId: id, newPassword: password });
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function updateProfilePicture(id, file) {
    let post = putWithAuth(`/profile/employee-profile-picture?employeeId=${id}`, { file: file }, true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function getEmployeeAttendanceList(branchId, departmentId, jobTitleId, searchText, fromDate, toDate, pageNumber, pageSize, sort, self) {
    let path = `/attendance?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += `&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&self=${self}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAttendancePhotos(id,clockInIp,clockOutIp) {
    let path = `/attendance/photos?id=${id}&clockInIp=${clockInIp}&clockOutIp=${clockOutIp}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function assignRoleToEmployee(id, roleId) {
    let post = putWithAuth(`user/role?employeeId=${id}&roleId=${roleId}`, {});
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function saveAttendance(data) {
    let post = postWithAuth('/attendance/admin', data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}


export function getLeaveTrackList(id) {
    let path = `/leave/leavetrack?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getEmployeeCalender(employeeId, firstDayOfMonth) {
    let path = `/attendance/calender?employeeId=${employeeId}&date=${firstDayOfMonth}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveImportJobsAttendance(data,importType,overrideData,timeZone) {
    let post = postWithAuth(`${importBulkPath}?name=${importType}&overrideData=${overrideData}&timeZone=${timeZone}`, { file: data.file },true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function saveImportJobsJobTitle(data,importType,overrideData,timeZone) {
    let post = postWithAuth(`${importBulkPath}/job-title?name=${importType}&overrideData=${overrideData}&timeZone=${timeZone}`, { file: data.file },true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function saveImportJobsEarnings(data,importType,overrideData,timeZone) {
    let post = postWithAuth(`${importBulkPath}/job-earnings?name=${importType}&overrideData=${overrideData}&timeZone=${timeZone}`, { file: data.file },true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function saveImportJobsDeductions(data,importType,overrideData,timeZone) {
    let post = postWithAuth(`${importBulkPath}/job-deductions?name=${importType}&overrideData=${overrideData}&timeZone=${timeZone}`, { file: data.file },true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function saveImportJobsEmployees(data,importType,overrideData,timeZone) {
    let post = postWithAuth(`${importBulkPath}/job-employees?name=${importType}&overrideData=${overrideData}&timeZone=${timeZone}`, { file: data.file },true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function saveOwner(data) {
     let post = data.id == 0 ? postWithAuth(`/owners`,data)
                :putWithAuth(`/owners`,data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function getOwners() {
    let path = `/owners`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function deleteOwners(employeeId) {
    let path = `owners/?employeeId=${encodeURIComponent(employeeId)}`; 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOwnerDepartment() {
    let path = `/owners/owners-department`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOwnersEmployee() {
    let path = `/owners/owners-employee`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOvertimeActive() {
    let path = `/overtime/settings`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getTeamListOfEmployees(searchText, pageNumber, pageSize, sort, status, branchId, departmentId, designationId,divisionId) {
    let path = (`${servicePath}/team?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&branchId=${branchId}&departmentId=${departmentId}&designationId=${designationId}&divisionId=${divisionId}&status=${status}`);
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}