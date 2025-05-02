
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../../../HttpRequest';
import { getPaginationQueryString } from '../../../../../utility';

const servicePath = "/addOwner";

export function getAddOwnerList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function saveAddOwner(ownersData) {
    let post = ownersData.id == 0 ? postWithAuth(servicePath, ownersData)
    : putWithAuth(`${servicePath}?id=${ownersData.id}`, ownersData);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteAddOwner(ownersId) {
    let path = servicePath + "?id=" + encodeURIComponent(ownersId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}