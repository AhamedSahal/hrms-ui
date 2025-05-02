// import { getWithAuth } from "../../../../HttpRequest";
import { getWithAuth } from "../../../../../HttpRequest";

const servicePath = "/report";

export function getRequisitionReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/requisition?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// Requisition summary report
export function getRequisitionSummaryReport(q,fromDate,toDate,departmentId,companyId) {
    let path = `${servicePath}/requisitionSummaryReport?fromDate=${fromDate}&toDate=${toDate}&departmentId=${departmentId}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// status
export function getRequisitionStatusReport(q,fromDate,toDate,requisitionStatus,companyId) {
    let path = `${servicePath}/requisitionStatusReport?fromDate=${fromDate}&toDate=${toDate}&requisitionStatus=${requisitionStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}