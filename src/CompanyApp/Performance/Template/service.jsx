
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/performance-template";

export function getPerformanceTemplateList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getPerformanceTemplateById(id) {
    let path = `${servicePath}/${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function savePerformanceTemplate(template) {
    let post = template.id == 0 ? postWithAuth(servicePath, template)
    : putWithAuth(`${servicePath}?id=${template.id}`, template);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
export function savePerformanceTemplateConfig(template) {
    let post = postWithAuth(servicePath +`/save`, template);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}



export function deletePerformanceTemplate(templateId) {
    let path = servicePath + "?id=" + encodeURIComponent(templateId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getObjectiveGroups() {    
    return getWithAuth("/performance-objective-group/select").then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
 
}