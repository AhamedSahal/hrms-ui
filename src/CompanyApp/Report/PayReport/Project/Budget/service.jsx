import { getWithAuth } from "../../../../../HttpRequest";

const servicePath = "/report";

// status
export function getBudgetStatusReport(q,fromDate,toDate,projectBudgetStatus,companyId) {
    let path = `${servicePath}/projectBudgetStatusReport?fromDate=${fromDate}&toDate=${toDate}&projectBudgetStatus=${projectBudgetStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getBudgetReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/budget?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}