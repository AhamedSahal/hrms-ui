
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, getWithAuthDashboard, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/policiesDocument";

export function getPoliciesDocumentList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuthDashboard(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function savePoliciesDocument(policiesdocument) {
    let post = policiesdocument.id == 0 ? postWithAuth(servicePath, policiesdocument, true)
        : putWithAuth(`${servicePath}?id=${policiesdocument.id}`, policiesdocument, true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function deletepoliciesdocuments(policiesdocumentId) {
    let path = servicePath + "?id=" + encodeURIComponent(policiesdocumentId);
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}