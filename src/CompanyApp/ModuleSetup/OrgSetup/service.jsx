import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/orgsetup/orgconfig";

export function getOrgSettings() {
    return getWithAuth(servicePath).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

export function updateOrgSettings(orgsetups) {  
    let post = putWithAuth(`${servicePath}?id=${orgsetups.id}`, orgsetups);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
 