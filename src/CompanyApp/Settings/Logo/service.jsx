import { putWithAuth } from '../../../HttpRequest';

const servicePath = "/settings";

export function updateLogo(logo) {  
    let post = putWithAuth(`${servicePath}/logo`, logo,true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
export function updateFavicon(favicon) {  
    let post = putWithAuth(`${servicePath}/favicon`, favicon,true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}