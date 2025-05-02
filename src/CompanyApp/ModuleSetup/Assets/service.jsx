
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/assetsetup/assets"; 

export function getAssetsList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
 

export function saveAssetsSetup(AssetsSetup) {
    let post = AssetsSetup.id == 0 ? postWithAuth(servicePath, AssetsSetup)
    : putWithAuth(`${servicePath}?id=${AssetsSetup.id}`, AssetsSetup);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
