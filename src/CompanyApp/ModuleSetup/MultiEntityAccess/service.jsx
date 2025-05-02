import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";


const servicePath = "/multi-entity-access";
export function getList() {
    return getWithAuth(servicePath).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function save(multiEntity) {
    let post = multiEntity.id == 0 ? postWithAuth(servicePath, multiEntity)
        : putWithAuth(`${servicePath}?id=${multiEntity.id}`, multiEntity);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function deleteMultiEntity(multiEntityId) {
    let path = servicePath + "?id=" + encodeURIComponent(multiEntityId);
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getCompanyList(companyId,allCompany) {
    return getWithAuth(`/company/select-multiCompany?companyId=${companyId}&allCompany=${allCompany}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}