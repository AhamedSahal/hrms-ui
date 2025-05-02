import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";


// detail
export function getPayVarianceDetailReport(q,compare,withIn,companyId) {
    let path = `${servicePath}/payvariancedetail?compare=${compare}&withIn=${withIn}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// status report

export function getPayVarianceStatusReport(q,fromDate,toDate,payVarianceStatus,companyId) {
    let path = `${servicePath}/payVarianceStatusReport?fromDate=${fromDate}&toDate=${toDate}&payVarianceStatus=${payVarianceStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// custom
export function getPayVarianceReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/payvariance?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}