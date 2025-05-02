import {getWithAuth, putWithAuth } from '../../../HttpRequest';
import { getPaginationQueryString } from '../../../utility';

const servicePath = "/settings/theme";
const service="/settings";

export function updateTheme(theme) { 
    let post = putWithAuth(`${servicePath}`, theme,false);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
export function getByCompanyId(companyId) {
    let path = `${service}/select?companyId=${companyId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);    
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getDefaultRolePermission(searchText, pageNumber, pageSize, sort,companyId) {
    let path = `${service}/default-permission?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&companyId=${companyId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function updateDefaultRolePermission(companyId) { 
    let post = putWithAuth(`${service}/update-default-permission?companyId=${companyId}`);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

 