import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";

export function getOvertimeReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/overtime?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOvertimeDetailReport(q,fromDate,toDate,timeZoneData,companyId) {
    let path = `${servicePath}/overtimeDetail?fromDate=${fromDate}&toDate=${toDate}&timeZoneData=${timeZoneData}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// status
export function getOvertimeStatusReport(q,fromDate,toDate,overtimeStatus,companyId) {
    let path = `${servicePath}/overtimeStatusReport?fromDate=${fromDate}&toDate=${toDate}&overtimeStatus=${overtimeStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}