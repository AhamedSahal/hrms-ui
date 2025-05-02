import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";

export function getApplicantReport(q,fromDate,toDate,applicantType,companyId) {
    let path = `${servicePath}/applicantreport?fromDate=${fromDate}&toDate=${toDate}&applicantType=${applicantType}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// Applicant summary report
export function getApplicantSummaryReport(q,fromDate,toDate,companyId) {
    let path = `${servicePath}/applicantSummaryReport?fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}