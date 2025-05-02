import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";

const servicePath = "/payvariance";

export function getPayVarianceList(employeeId) {
    let path = `${servicePath}?employeeId=${employeeId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function savePayVariance(payVariance) {

    let post = !payVariance.id || payVariance.id == 0 ? postWithAuth(servicePath, payVariance)
        : putWithAuth(`${servicePath}?id=${payVariance.id}`, payVariance);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function deletePayVariance(payVarianceId) {
    let path = servicePath + "?id=" + encodeURIComponent(payVarianceId);
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}