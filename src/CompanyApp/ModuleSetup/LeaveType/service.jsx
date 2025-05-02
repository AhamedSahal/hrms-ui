
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/leave-type";

export function getLeaveTypeList(searchText, pageNumber, pageSize, sort,id) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&locationId=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getLeaveTypeCompanyList(defaultEmployeeId) {
    let path = `${servicePath}/companyList?employeeId=${defaultEmployeeId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// get half day count
export function getHalfdayCount() {
    let path = `${servicePath}/halfDay`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveLeaveType(leaveType) {
    let post = leaveType.id == 0 ? postWithAuth(servicePath, leaveType)
    : putWithAuth(`${servicePath}?id=${leaveType.id}`, leaveType);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteLeaveType(leaveTypeId) {
    let path = servicePath + "?id=" + encodeURIComponent(leaveTypeId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}