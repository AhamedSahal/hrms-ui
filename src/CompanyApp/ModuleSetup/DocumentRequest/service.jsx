import { deleteWithAuth, getBlobWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/document-request";

export function getDocumentRequestList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;

    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getDocumentById(id) {
    let path = `${servicePath}/id?id=${id}`;

    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveDocumentRequest(documentrequest) {
    let post = documentrequest.id == 0 ? postWithAuth(servicePath, documentrequest)
        : putWithAuth(`${servicePath}?id=${documentrequest.id}`, documentrequest);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function cancelDocumentRequest(id) {
    let path = servicePath + "/cancel?id=" + encodeURIComponent(id);
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateDocumentRequestStatus(documentRequestStatus) {
    let path = servicePath + "/status";
    return patchWithAuth(path, documentRequestStatus).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function downloadDocument(id) {
    let path = `${servicePath}/download?id=${id}`;

    return getBlobWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}