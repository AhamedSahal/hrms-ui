import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";

export function getAssetsReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/assets?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// assets summary report
export function getAssetsSummaryReport(q,fromDate,toDate,companyId) {
    let path = `${servicePath}/assetsSummaryReport?fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// task status report

export function getAssetStatusReport(q,fromDate,toDate,assetStatus,companyId) {
    let path = `${servicePath}/assetStatusReport?fromDate=${fromDate}&toDate=${toDate}&assetStatus=${assetStatus}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}