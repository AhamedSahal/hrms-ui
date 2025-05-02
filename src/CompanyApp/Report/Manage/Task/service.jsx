import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";


export function getTaskReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/task?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// task status report

export function getTaskStatusReport(q,fromDate,toDate,taskStatus,companyId) {
    let path = `${servicePath}/taskStatusReport?fromDate=${fromDate}&toDate=${toDate}&taskStatus=${taskStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// task summary report
export function getTaskSummaryReport(q,fromDate,toDate,companyId) {
    let path = `${servicePath}/taskSummaryReport?fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}