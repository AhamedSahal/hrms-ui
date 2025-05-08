import { deleteWithAuth, getWithAuth, getWithAuthDashboard, patchWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../utility";

const servicePath = "/regularization";
const servicePath1 = "/regularization/submit";
const servicePath2 = "/regularization/statusUpdate";

export function getRegularizationList(searchText, regularizedDate, pageNumber, pageSize, sort, self, fromDate, toDate,status) {
    let path = `${servicePath}/All?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&self=${self}`;
    path += `&regularizedDate=${regularizedDate}&fromDate=${fromDate}&toDate=${toDate}&status=${status}`;
    console.log(path);
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateRegularizeData(id, firHalf, secHalf, Reason, status) {
    let path = servicePath1 + "?id=" + encodeURIComponent(id) + "&firHalf=" + firHalf + "&secHalf=" + secHalf + "&Reason=" + Reason + "&status=" + status;
    console.log(path);
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// action on rm side
export function updateRegularizeStatus(id, firHalf, secHalf, Reason, status,editValidation) {
    let path = servicePath2 + "?id=" + encodeURIComponent(id) + "&firHalf=" + firHalf + "&secHalf=" + secHalf + "&Reason=" + Reason + "&status=" + status + "&editValidation=" + editValidation;
    console.log(path);
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// status 
export function updateSelectedStatus(regularizationId, status) {
    let path = servicePath + "/status?status=" + status;
    return patchWithAuth(path, regularizationId).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}