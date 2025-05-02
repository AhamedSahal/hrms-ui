import { getWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/settings/gratuity";

export function getgratuitySettings() {
    return getWithAuth(servicePath).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

export function updategratuitySettings(gratuity) { 
    let post = putWithAuth(`${servicePath}`, gratuity,false);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
 