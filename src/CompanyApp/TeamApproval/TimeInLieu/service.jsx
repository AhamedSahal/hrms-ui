import { getWithAuth,getWithAuthDashboard,patchWithAuth } from '../../../HttpRequest';
import { getPaginationQueryString } from '../../../utility';

const servicePath = "entitlement/timeinlieu";

export function getTeamEntitlementTimeinlieuList(searchText, pageNumber, pageSize, sort,fromDate, toDate,branchId, departmentId, jobTitleId) {
    let path = `${servicePath}/team?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += `&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}`;
    return getWithAuthDashboard(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function updateStatus(id, approvedHours, status, employeeId) {
    let path = servicePath + "?timeinliueId=" + encodeURIComponent(id) + "&approvedHours=" + approvedHours + "&status=" + status + "&employeeId=" + employeeId;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateSelectedStatus(selected, status) {
    let path = servicePath + "/status?status=" + status;
    return patchWithAuth(path, selected).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

