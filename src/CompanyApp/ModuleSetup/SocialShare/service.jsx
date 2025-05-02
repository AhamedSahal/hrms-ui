import { deleteWithAuth, getWithAuth, patchWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";
import { toast } from 'react-toastify';

const servicePath = "/social-share";

export function getSocialShareList(searchText, pageNumber, pageSize, sort) {
    let get = getWithAuth(`${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function approvePost(id, status) {
    let path = servicePath + "/approve?id=" + encodeURIComponent(id) + "&status=" + status;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function deleteSocialShare(socialShareId) {
    let path = `/social-share?id=${socialShareId}`;
    return deleteWithAuth(path).then(res => {
        toast.success(res.message);
        return Promise.resolve(res.data);
    }).catch(err => {
        toast.err(err.message);
        return Promise.reject(err);
    });
}

// put social share
export function putSocialShare(socialShare) {
    return putWithAuth(`/social-share?id=${socialShare.id}`, socialShare).then(res => {
        toast.success(res.message);
        return Promise.resolve(res.data);
    }).catch(err => {
        toast.err(err.message);
        return Promise.reject(err);
    });
}