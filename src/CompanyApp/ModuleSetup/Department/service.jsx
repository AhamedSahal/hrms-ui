
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/department";

export function getDepartmentList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// DeparmentInfo Information
export function getDepartmentInformation(id) {
    let path = `${servicePath}/department-info?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveDepartment(department) {
    let post = department.id == 0 ? postWithAuth(servicePath, department)
    : putWithAuth(`${servicePath}?id=${department.id}`, department);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteDepartment(departmentId) {
    let path = servicePath + "?id=" + encodeURIComponent(departmentId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}