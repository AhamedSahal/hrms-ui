import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';
import { getPaginationQueryString } from '../../../utility';

const servicePath = "entitlement/leave";

export function getEntitlementLeaveList(employeeId, searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveLeave(leave) {
    let post = leave.id == 0 ? postWithAuth(servicePath, leave)
        : putWithAuth(`${servicePath}?id=${leave.id}`, leave);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function saveOpeningBalance(openingBalance) {
    let post = postWithAuth('leave/manage-opening-balance', openingBalance);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function getLeaveBalance(employeeId ,year,calendar ) {
    console.log({ employeeId, year, "cell ---": calendar });
    
    let path = `${'leave/balance'}?&employeeId=${employeeId}&year=${year}&calendar=${calendar}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getLeaveBalanceShowOnDashboard(employeeId,year) {
    let path = `${'leave/dashboardleavebalance'}?&employeeId=${employeeId}&year=${year}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}



