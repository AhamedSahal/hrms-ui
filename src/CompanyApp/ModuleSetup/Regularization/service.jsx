
import { getPaginationQueryString } from '../../../utility';
import { getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/regularization/settings";

export function getList() {
    let path = `${servicePath}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateRegularizationSettings(RegularizationSettings) {
    let post = putWithAuth(`${servicePath}`, RegularizationSettings, false);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}


