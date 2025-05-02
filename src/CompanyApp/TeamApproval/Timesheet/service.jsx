

import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth, patchWithAuth, getWithAuthDashboard } from '../../../HttpRequest';


const servicePath = "/timesheet";

export function getTeamTimesheet(searchText, pageNumber, pageSize, sort,fromDate, toDate,branchId, departmentId, jobTitleId) {
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
