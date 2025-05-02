import { getWithAuth, putWithAuth } from "../../HttpRequest";

const servicePath = "/attendance-configuration";

export function updateConfiguration(config) {
    let post = putWithAuth(`${servicePath}?id=${config.id}`, config);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function getConfiguration() {
    return getWithAuth(servicePath).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getConfigurationByGroupId(id) {
    return getWithAuth(`${servicePath}/user-group?groupId=${id}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function updateUserGroupConfiguration(config) {
    let post = putWithAuth(`${servicePath}/groups?id=${config.id}`, config);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}