import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";

// custom
export function getLeaveSettlementReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/leavesettlement?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// status
export function getLeaveSettlementStatusReport(q,fromDate,toDate,leaveSettlementStatus,companyId) {
    let path = `${servicePath}/leaveSettlementStatusReport?fromDate=${fromDate}&toDate=${toDate}&leaveSettlementStatus=${leaveSettlementStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// Detail
export function getLeaveSettlementDetailReport(q,fromDate,toDate,companyId) {
    let path = `${servicePath}/leaveSettlementDetailReport?fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}