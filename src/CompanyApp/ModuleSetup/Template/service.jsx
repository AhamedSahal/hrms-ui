import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/template";

export function getTemplateList(templateType, searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&type=${templateType}`;

    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveTemplate(template) {
    let post = template.id == 0 ? postWithAuth(servicePath, template)
        : putWithAuth(`${servicePath}?id=${template.id}`, template);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function deleteTemplate(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id);
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}