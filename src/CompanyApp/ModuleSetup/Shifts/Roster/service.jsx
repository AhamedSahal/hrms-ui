
import { getPaginationQueryString } from '../../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../../HttpRequest';

const servicePath = "/rostersetup";

export function getRosterList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveRoster(Roster) {
    let post = Roster.id == 0 ? postWithAuth(servicePath, Roster)
    : putWithAuth(`${servicePath}?id=${Roster.id}`, Roster); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
} 
export function deleteRoster(rosterId) {
    let path = servicePath + "?id=" + encodeURIComponent(rosterId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}