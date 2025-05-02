import { deleteWithAuthSurvey, getWithAuthSurvey, patchWithAuthSurvey, postWithAuthSurvey, putWithAuthSurvey } from "../../../HttpRequest";
import { getPaginationQueryString, getCompanyId } from "../../../utility";

const servicePath = "/category";

export function getSurveyCategoryList(searchText, pageNumber, pageSize, sort, status) {

    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&status=${status}&companyId=${getCompanyId()}`;
    return getWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveCategory(category) {
    category.companyId = getCompanyId();
    let post = category.id == 0 ? postWithAuthSurvey(`${servicePath}`,category)
        : putWithAuthSurvey(`${servicePath}`,category);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function deleteCategory(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id);
    return deleteWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateCategory(id, name) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&name=" + name;
    return patchWithAuthSurvey(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
