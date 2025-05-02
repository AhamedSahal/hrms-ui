import { getWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/settings/updateExpiryAlert";

export function saveExpiryDocumentAlert(xDays) {
    let post = putWithAuth(`${servicePath}?xDays=${xDays}`);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
export function getDocumentExpiryAlertDays(){
    return getWithAuth(`/settings/expiryAlert`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}