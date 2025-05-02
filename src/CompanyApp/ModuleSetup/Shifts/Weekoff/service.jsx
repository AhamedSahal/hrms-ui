
import { getPaginationQueryString } from '../../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../../HttpRequest';

const servicePath = "/weekoffsetup";

export function getWeekoffList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveWeekoff(weekoff) {
    let post = weekoff.id == 0 ? postWithAuth(servicePath, weekoff)
    : putWithAuth(`${servicePath}?id=${weekoff.id}`, weekoff); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
} 
export function deleteWeekoff(weekoffId) {
    let path = servicePath + "?id=" + encodeURIComponent(weekoffId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}