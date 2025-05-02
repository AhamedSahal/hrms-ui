import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";

export function getLeaveReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/leave?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getLeaveDetailReport(q,fromDate,toDate,leaveType,companyId) {
    let path = `${servicePath}/leavedetail?fromDate=${fromDate}&toDate=${toDate}&leaveType=${leaveType}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// leave balance report

export function getLeaveBalanceReport(q,fromDate,leaveType) {
    let path = `${servicePath}/leavebalance?fromDate=${fromDate}&leaveType=${leaveType}&q=${q}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}