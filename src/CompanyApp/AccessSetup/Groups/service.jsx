import { getWithAuth, postWithAuth, putWithAuth,deleteWithAuth } from '../../../HttpRequest';
import { getPaginationQueryString } from '../../../utility';

const servicePath = "/user-groups";
const userGroupUser = "/user-groups-user";

export function saveGroups(groups) {
    let post = (groups.id == 0 || !groups.id) ? postWithAuth(servicePath, groups)
    : putWithAuth(`${servicePath}?id=${groups.id}`, groups);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function getGroupList() {
    return getWithAuth(servicePath).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getEmployeeList(searchText, pageNumber, pageSize, sort,groupId, branchId, departmentId,divisionId) {
    let path = `${userGroupUser}/employee-list?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += `&groupId=${groupId}&branchId=${branchId}&departmentId=${departmentId}&divisionId=${divisionId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getUserGroupEmployeeList(searchText, pageNumber, pageSize, sort,groupId, branchId, departmentId,divisionId) {
    let path = `${userGroupUser}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += `&groupId=${groupId}&branchId=${branchId}&departmentId=${departmentId}&divisionId=${divisionId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function addUserIntoGroup(groupUser) {
    let post = postWithAuth(userGroupUser, groupUser)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
export function deleteUserFromGroup(groupUser) {
    let post = deleteWithAuth(userGroupUser, groupUser)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
export function deleteGroup(groupId) {
    let path = servicePath + "?id=" + encodeURIComponent(groupId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}