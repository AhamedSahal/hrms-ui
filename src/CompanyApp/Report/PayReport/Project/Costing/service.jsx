import { getWithAuth } from "../../../../../HttpRequest";

const servicePath = "/report";

// CostingReport summary report
export function getCostingSummaryReport(q,fromDate,toDate,projectId,companyId) {
    let path = `${servicePath}/costingSummaryReport?fromDate=${fromDate}&toDate=${toDate}&projectId=${projectId}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
