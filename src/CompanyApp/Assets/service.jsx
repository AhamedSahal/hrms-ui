
import { getPaginationQueryString } from '../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth,patchWithAuth } from '../../HttpRequest';

const servicePath = "/assets"; 
const servicePath1 = "/assets/action"; 
const servicePath2 = "/assets/active"; 
const servicePath3 = "/assets/returnAsset";
const servicePath4 = "/assets/acceptAsset";

/*Employee list*/
export function getEmployeeList() {
    let path = `${servicePath}/employee` 
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAsset(assetCategoryId, assetSetupId, serialNo) {
    let path = `${servicePath}/getAsset?assetCategoryId=${assetCategoryId}&assetSetupId=${assetSetupId}&serialNo=${serialNo}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAssetSerials(assetCategory, assetName, currentlocation, AssetAvailableStatus) {
  
    
    let path = `${servicePath}/serialNo?assetCategory=${assetCategory}&assetName=${assetName}&currentlocation=${currentlocation}&AssetAvailableStatus=${AssetAvailableStatus}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAssetList(searchText, pageNumber, pageSize, sort,statusId,self,Team,empId) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`
    path +=  '&statusId=' + statusId +'&self=' + self + '&Team=' + Team + '&employeeId=' + empId ; 
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

export function getAssetLatestHistory(categoryName,assetName,serialno) {
    let path = `${servicePath}/AssetLatestHistory?categoryName=${categoryName}&assetName=${assetName}&serialno=${serialno}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getEmpEntity(empId) {
    let path = `${servicePath}/getEmpEntity?empId=${empId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}




export function acceptReturn(id, confidentiality,integrity,availability) {
    let path = `${servicePath}/acceptReturn?assetId=${id}&confidentiality=${confidentiality}&integrity=${integrity}&availability=${availability}`;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function cancelReturn(id) {
    let path = `${servicePath}/cancelReturn?assetId=${id}`;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function cancelAllocation(id) {
    let path = `${servicePath}/cancelAllocation?assetId=${id}`;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function acceptAsset(id) {
    let path =`${servicePath4}?id=${id}`
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
 
//creating asset through new asset
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

export function getPreviousOwner(serialNo) {
    let path = `${servicePath}/getAssetPreviousOwner?serialNo=${serialNo}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
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
    
export function returnAsset(id, returnDate,reasonOfReturn,remarks) {
    let path = servicePath3 + "?id=" + encodeURIComponent(id) + "&returnDate=" + returnDate + "&reasonOfReturn=" + reasonOfReturn + "&remarks=" + remarks; 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });

     
}  