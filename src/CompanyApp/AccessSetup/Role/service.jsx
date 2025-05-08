import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';
import { getPaginationQueryString } from '../../../utility';

const servicePath = "/role";

export function getRoleList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveRole(role) {
    let post = role.id == 0 ? postWithAuth(servicePath, role)
        : putWithAuth(`${servicePath}?id=${role.id}`, role);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}


export function updateRoleActions(role, IsActionAllowed) {
    let patch = undefined;
    if (IsActionAllowed) {
        patch = patchWithAuth(`${servicePath}/remove-action`, role);
    } else {
        patch = patchWithAuth(`${servicePath}/assign-action`, role)
    }
    return patch.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function getActionList() {

    let path = `/action?${getPaginationQueryString('', 0, 99999, '')}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}