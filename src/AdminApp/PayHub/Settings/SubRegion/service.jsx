import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../utility";

const servicePath = "/payHub-subRegion";


export function getSubRegionList(searchText, pageNumber, pageSize, sort) {
    // let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    // return getWithAuth(path).then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     return Promise.reject(err);
    // });
}


export function saveSubRegion(region) {
    // let post = region.id == 0 ? postWithAuth(servicePath, region)
    // : putWithAuth(`${servicePath}?id=${region.id}`, region);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({err})
    //     return Promise.reject(err);
    // });
}


export function deleteSubRegion(regionId) {
    // let path = servicePath + "?id=" + encodeURIComponent(regionId); 
    // return deleteWithAuth(path).then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     return Promise.reject(err);
    // });
}