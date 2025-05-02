
import { getPaginationQueryString } from '../../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../../HttpRequest';

const servicePath = "/assetsetup/category";
const servicePath1 = "/assetsetup/category1";

export function getAssetsCategoryList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
 

export function saveAssetsCategory(Assetscategory) {
    let post = Assetscategory.id == 0 ? postWithAuth(servicePath1, Assetscategory)
    : putWithAuth(`${servicePath1}?id=${Assetscategory.id}`, Assetscategory);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
 