import { getWithAuth } from "../../../HttpRequest";

const servicePath = "/report";

export function getPayrollReport(branchId, departmentId, jobTitleId,entityId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/payroll?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&entityId=${entityId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOvertimeReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/overtime?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getManageWorkDaysReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/manageworkdays?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getFinalSettlementReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/finalsettlement?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getLeaveSettlementReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/leavesettlement?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getPayVarianceReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/payvariance?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}