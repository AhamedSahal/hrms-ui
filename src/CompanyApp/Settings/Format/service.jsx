import { getWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/settings/format";

export function getFormat() {
    return getWithAuth(servicePath).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

export function updateFormat(format) { 
    let post = putWithAuth(`${servicePath}`, format,false);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
 