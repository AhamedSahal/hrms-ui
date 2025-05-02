
import { getPaginationQueryString } from '../../../utility';
import { getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/project";

export function getList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function save(project) {
    let post = project.id == 0 ? postWithAuth(servicePath, project)
        : putWithAuth(`${servicePath}?id=${project.id}`, project);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}