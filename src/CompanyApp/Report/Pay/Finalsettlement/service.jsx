import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";


export function getFinalSettlementReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/finalsettlement?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// status
export function getFinalSettlementStatusReport(q,fromDate,toDate,finalSettlementStatus,companyId) {
    let path = `${servicePath}/finalSettlementStatusReport?fromDate=${fromDate}&toDate=${toDate}&finalSettlementStatus=${finalSettlementStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// Detail
export function getFinalSettlementDetailReport(q,fromDate,toDate,companyId) {
    let path = `${servicePath}/finalSettlementDetailReport?fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}