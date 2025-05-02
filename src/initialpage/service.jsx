import { getWithAuth, putWithAuth } from "../HttpRequest";
import { postWithAuth } from './../HttpRequest';

export function getHeaderNotifications(searchText, pageNumber, pageSize, sort) {
    let path = `/notification/header`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function forgotPasswordRequest(email) {
    let path = `/forgot-password?email=${email}`;
    return postWithAuth(path, null).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function validateToken(token) {
    let path = `/forgot-password/validate?token=${token}`;
    return postWithAuth(path, null).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function forgotPasswordReset(resetPassword) {
    let path = `forgot-password/reset`;
    return putWithAuth(path, resetPassword).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getChangeCompany(companyId) {
    let path = `/company/change`;
    return postWithAuth(path, { value: companyId }).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}