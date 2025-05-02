import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/signature";

export function getSignatureList(employeeId,searchText,pageNumber, pageSize, sort) {
    let path=`${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}`;
    
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveSignature(signature) {
    let post = signature.id == 0 ? postWithAuth(servicePath, signature)
        : putWithAuth(`${servicePath}?id=${signature.id}`, signature);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteSignature(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}