import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/employment_Status";

export function getEmploymentStatusList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveEmploymentStatus(employmentstatus) {
    let post = employmentstatus.id == 0 ? postWithAuth(servicePath, employmentstatus)
    : putWithAuth(`${servicePath}?id=${employmentstatus.id}`, employmentstatus); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteEmploymentStatus(employmentStatusId) {
    let path = servicePath + "?id=" + encodeURIComponent(employmentStatusId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}