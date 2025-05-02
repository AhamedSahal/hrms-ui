import { getWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/settings/overtime-settings";

export function getOvertimeSettings() {
    return getWithAuth(servicePath).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

export function updateOvertimeSettings(overtime) { 
    let post = putWithAuth(`${servicePath}`, overtime,false);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
 