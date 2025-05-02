import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";

export function getTimesheetReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/timesheet?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTimesheetDetailReport(q,fromDate,toDate,timeZoneData,companyId) {
    let path = `${servicePath}/timesheetdetail?fromDate=${fromDate}&toDate=${toDate}&timeZoneData=${timeZoneData}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTimesheetStatusReport(q,fromDate,toDate,timesheetStatus,timesheetProject,companyId) {
    let path = `${servicePath}/timesheetStatusReport?fromDate=${fromDate}&toDate=${toDate}&timesheetStatus=${timesheetStatus}&q=${q}&timesheetProject=${timesheetProject}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}