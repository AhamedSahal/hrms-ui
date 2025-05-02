import { getWithAuth } from "../../../../HttpRequest";

const servicePath = "/report";

export function getReviewsReport(branchId, departmentId, jobTitleId, q,fromDate,toDate,companyId) {
    let path = `${servicePath}/performCustom?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}