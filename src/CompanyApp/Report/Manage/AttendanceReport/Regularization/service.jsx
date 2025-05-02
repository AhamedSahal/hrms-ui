import { getWithAuth } from "../../../../../HttpRequest";

const servicePath = "/report";

export function getRegularizationReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/regularization?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// status report
export function getRegularizationStatusReport(q,fromDate,toDate,regularizationStatus,approvalStatus,companyId) {
    let path = `${servicePath}/regularizationStatusReport?fromDate=${fromDate}&toDate=${toDate}&regularizationStatus=${regularizationStatus}&approvalStatus=${approvalStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// detail report
export function getRegularizationDetailReport(q,fromDate,toDate,companyId) {
    let path = `${servicePath}/regularizationDetailReport?fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}