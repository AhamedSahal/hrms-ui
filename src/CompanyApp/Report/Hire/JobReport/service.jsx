import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";

// status
export function getJobStatusReport(q,fromDate,toDate,jobStatus,companyId) {
    let path = `${servicePath}/jobStatusReport?fromDate=${fromDate}&toDate=${toDate}&jobStatus=${jobStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// Job summary report
export function getJobSummaryReport(q,fromDate,toDate,companyId) {
    let path = `${servicePath}/jobSummaryReport?fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
