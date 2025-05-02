
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/payment-mode";

export function getPaymentModeList( ) {
    let path = `${servicePath}?${getPaginationQueryString()}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function savePaymentMode(paymentMode) {
    let post = paymentMode.id == 0 ? postWithAuth(servicePath, paymentMode)
    : putWithAuth(`${servicePath}?id=${paymentMode.id}`, paymentMode);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deletePaymentMode(paymentModeId) {
    let path = servicePath + "?id=" + encodeURIComponent(paymentModeId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getPaymentModeSelectList(){
    let path =`${servicePath}/select`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}