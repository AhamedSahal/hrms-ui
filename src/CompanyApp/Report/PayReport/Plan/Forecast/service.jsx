import { getWithAuth } from "../../../../../HttpRequest";

const servicePath = "/report";

export function getForecastReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/forecast?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// forecast summary report
export function getForecastSummaryReport(q,fromDate,toDate,departmentId,companyId) {
    let path = `${servicePath}/forecastSummaryReport?fromDate=${fromDate}&toDate=${toDate}&departmentId=${departmentId}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// forecast Request report
export function getForecastRequestReport(q,fromDate,toDate,companyId) {
    let path = `${servicePath}/forecastRequestReport?fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}