import { getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";


const servicePath = "/jobDescriptionByEmployee";

export function getJobDescriptionById(id) {
    let path = `${servicePath}/jobtitleid?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveJobDescriptionById(JobDescription) {
    let post = JobDescription.id == 0 ? postWithAuth(servicePath, JobDescription)
    : putWithAuth(`${servicePath}?id=${JobDescription.id}`, JobDescription);  
    return post.then(res => { 
        return Promise.resolve(res.data);
        
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}