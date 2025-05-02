import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';
import { getPaginationQueryString } from '../../../utility';

const servicePath = "entitlement/gratuity";

export function getEntitlementGratuityList(employeeId,searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function saveGratuity(entity) {
    let post = entity.id == 0 ? postWithAuth(servicePath, entity)
        : putWithAuth(`${servicePath}?id=${entity.id}`, entity);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
