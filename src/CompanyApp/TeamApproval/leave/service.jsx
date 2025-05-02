import { deleteWithAuth, getWithAuth, getWithAuthDashboard, patchWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/leave";

export function getTeamLeaveList(searchText, pageNumber, pageSize, sort,fromDate, toDate,branchId, departmentId, jobTitleId) {
    let path = `${servicePath}/team?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += `&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}`;
    return getWithAuthDashboard(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function updateSelectedStatus(paySlipIds, status) {
    let path = servicePath + "/status?status=" + status;
    return patchWithAuth(path, paySlipIds).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}