
import { getPaginationQueryString } from '../../../../utility';
import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from '../../../../HttpRequest';

const servicePath = "/jobDescription";

export function getJobDescriptionList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveJobDescription(JobDescription) {
    let post = JobDescription.id == 0 ? postWithAuth(servicePath, JobDescription)
    : putWithAuth(`${servicePath}?id=${JobDescription.id}`, JobDescription); 
    console.log(JobDescription);
    return post.then(res => { 
        return Promise.resolve(res.data);
        
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteJobDescription(JobDescriptionId) {
    let path = servicePath + "?id=" + encodeURIComponent(JobDescriptionId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateStatus(id, status,remarks) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status   +"&remarks=" + remarks;  
    console.log(path); 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}