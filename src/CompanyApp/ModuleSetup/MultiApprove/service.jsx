import { getWithAuth, putWithAuth } from '../../../HttpRequest';

const service="/settings";
const companyMenuService = "/company-menu/multiApproval"

//  company setting
export function getMultiApprovalPermission(){
    return getWithAuth(`/settings/get-multi-approval`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

//  company menu
export function getMultiApprovalcompanyMenu(){
    return getWithAuth(companyMenuService).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function updateMultiApprovalPermission(multiApproval) { 
    let post = putWithAuth(`${service}/update-multi-approval?multiApproval=${multiApproval}`);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}