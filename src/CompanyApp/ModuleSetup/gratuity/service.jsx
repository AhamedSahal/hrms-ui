import { getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/settings/gratuity";

export function getgratuitySettings(branchId) {
    let path = `${servicePath}?&locationId=${branchId}`;
    return getWithAuth(path).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

// export function updategratuitySettings(gratuity) { 
//     let post = putWithAuth(`${servicePath}`, gratuity,false);
//     return post.then(res => {
//         return Promise.resolve(res.data);
//     }).catch(err => {
//         console.log({err})
//         return Promise.reject(err);
//     });
// }

export function updategratuitySettings(gratuity) {
    let post = gratuity.id == 0 ? postWithAuth(servicePath, gratuity)
    : putWithAuth(`${servicePath}?id=${gratuity.id}`, gratuity);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
 