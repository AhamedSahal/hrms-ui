import { getWithAuth } from "../../../../../HttpRequest";

const servicePath = "/report";

export function getAttendanceReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/attendance?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAttendanceAbsentReport(q,fromDate,toDate,timeZoneData,companyId) {
    let path = `${servicePath}/attendanceabsent?fromDate=${fromDate}&toDate=${toDate}&timeZoneData=${timeZoneData}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAttendanceLateReport(q,fromDate,toDate,timeZoneData,companyId) {
    let path = `${servicePath}/attendancelate?fromDate=${fromDate}&toDate=${toDate}&timeZoneData=${timeZoneData}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}