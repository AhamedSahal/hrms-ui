import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";

export function getBenefitsReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/benefits?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// status
export function getBenefitsStatusReport(q,fromDate,toDate,benefitStatus,companyId) {
    let path = `${servicePath}/benefitsStatusReport?fromDate=${fromDate}&toDate=${toDate}&benefitStatus=${benefitStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// Detail
export function getBenefitsDetailReport(q,fromDate,toDate,companyId) {
    let path = `${servicePath}/benefitsDetailReport?fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}