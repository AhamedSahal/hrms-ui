import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/ip-config";

export function saveIPConfig(ipConfig) {
    let post = ipConfig.id == 0 ? postWithAuth(servicePath, ipConfig)
        : putWithAuth(`${servicePath}?id=${ipConfig.id}`, ipConfig);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function getIPConfigList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function deleteIP(ipId) {
    let path = servicePath + "?id=" + encodeURIComponent(ipId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}