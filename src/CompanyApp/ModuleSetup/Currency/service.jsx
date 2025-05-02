
import { deleteWithAuth, postWithAuth, putWithAuth,getWithAuth,patchWithAuth } from '../../../HttpRequest';

const servicePath = "/currencies";

export function saveCurrencies(currency) {
    let post = currency.id == 0 ? postWithAuth(servicePath, currency)
    : putWithAuth(`${servicePath}?id=${currency.id}`, currency);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function getCurrencyList() {
    let path = `${servicePath}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// status update
export function updateStatus(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id); 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}  

export function deleteCurrency(currencyId) {
    // let path = `${servicePath}=${encodeURIComponent(currencyId)}`;
    let path = servicePath + "?id=" + encodeURIComponent(currencyId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}