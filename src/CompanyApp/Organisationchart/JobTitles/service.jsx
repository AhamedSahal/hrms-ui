
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/jobTitles";

export function getJobTitlesList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveJobTitles(jobTitles) {
    let post = jobTitles.id == 0 ? postWithAuth(servicePath, jobTitles)
    : putWithAuth(`${servicePath}?id=${jobTitles.id}`, jobTitles); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deletejobTitles(jobTitlesId) {
    let path = servicePath + "?id=" + encodeURIComponent(jobTitlesId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}