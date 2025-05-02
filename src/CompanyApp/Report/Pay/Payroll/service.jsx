import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";

export function getPayrollReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/payroll?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// Payroll status report

export function getPayrollStatusReport(q,fromDate,toDate,payrollStatus,entityId,companyId) {
    let path = `${servicePath}/payrollStatusReport?fromDate=${fromDate}&toDate=${toDate}&payrollStatus=${payrollStatus}&entityId=${entityId}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}