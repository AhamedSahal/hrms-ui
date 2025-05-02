import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/location-config";

export function saveLocationConfig(locationConfig) {
    let post = locationConfig.id == 0 ? postWithAuth(servicePath, locationConfig)
        : putWithAuth(`${servicePath}?id=${locationConfig.id}`, locationConfig);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function getLocationConfigList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function deleteLocation(locationId) {
    let path = servicePath + "?id=" + encodeURIComponent(locationId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getGoogleMapKey(){
    let path = servicePath + '/google-map-key';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err =>{
        return Promise.reject(err)
    });
}