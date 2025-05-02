import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";


const servicePath = "/talentPool"; 
const empServicePath = "/employee";

export function saveTalentPool(poolData) {
    // let post = poolData.id == 0 ? postWithAuth(servicePath, poolData)
    // : putWithAuth(`${servicePath}?id=${poolData.id}`, poolData);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({err})
    //     return Promise.reject(err);
    // });
}

export function getEmployeeList(searchText, pageNumber,  sort, status, branchId, departmentId,jobTitlesId) {
    let path = `${empServicePath}?${getPaginationQueryString(searchText, pageNumber, sort)}`;
    path += `&branchId=${branchId}&departmentId=${departmentId}&jobTitlesId=${jobTitlesId}`;
    if (status != null && status != undefined && status != '') {
        path += '&status=' + status;
    }
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTalentPoolList(searchText, pageNumber, pageSize, sort) {
    // let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    // return getWithAuth(path).then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     return Promise.reject(err);
    // });
}



export function deleteTalentPool(poolId) {
    // let path = servicePath + "?id=" + encodeURIComponent(poolId); 
    // return deleteWithAuth(path).then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     return Promise.reject(err);
    // });
}