import { getWithAuth } from "../../../HttpRequest";

const servicePath = "/report";

export function getEmployeeReport(branchId, departmentId, jobTitleId, q,status,entityId,companyId) {
    let path = `${servicePath}/employee?branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&q=${q}&status=${status}&entityId=${entityId}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}