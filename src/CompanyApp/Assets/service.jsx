
import { getPaginationQueryString } from '../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth,patchWithAuth } from '../../HttpRequest';

const servicePath = "/assets"; 
const servicePath1 = "/assets/action"; 
const servicePath2 = "/assets/active"; 

/*Employee list*/
export function getEmployeeList() {
    let path = `${servicePath}/employee` 
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAssetList(searchText, pageNumber, pageSize, sort,statusId,self,Team) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`
    path +=  '&statusId=' + statusId +'&self=' + self + '&Team=' + Team ; 
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
 
export function getAssetHistory(searchText, pageNumber, pageSize, sort,categoryId,assetId,serialNo,id) {
    let path = `${servicePath}/AssetHistory?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += '&categoryId=' + categoryId +'&assetId=' + assetId  + '&serialNo=' + serialNo+ '&id=' + id ;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveAssets(Assets) {
    let post = Assets.id == 0 ? postWithAuth(servicePath, Assets)
    : putWithAuth(`${servicePath}?id=${Assets.id}`, Assets);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function saveAssetActive(Assets) {
    let post = postWithAuth(servicePath2, Assets); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
 

export function updateStatus(id, status) {
    let path = servicePath1 + "?id=" + encodeURIComponent(id) + "&status=" + status ; 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}  

export function updateAsset(id, returnDate,confidentiality,integrity,availability,remarks) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&returnDate=" + returnDate + "&confidentiality=" + confidentiality + "&integrity=" + integrity + "&availability=" + availability + "&remarks=" + remarks; 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}  