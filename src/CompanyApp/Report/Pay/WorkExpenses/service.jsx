import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";

export function getWorkExpensesReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/workexpenses?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// status
export function getWorkExpensesStatusReport(q,fromDate,toDate,workExpensesStatus,companyId) {
    let path = `${servicePath}/workExpensesStatusReport?fromDate=${fromDate}&toDate=${toDate}&workExpensesStatus=${workExpensesStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// Detail
export function getWorkExpensesDetailReport(q,fromDate,toDate,expensesId,companyId) {
    let path = `${servicePath}/workExpensesDetailReport?fromDate=${fromDate}&toDate=${toDate}&expensesId=${expensesId}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}