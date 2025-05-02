
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/expensecategories";

export function getExpenseCategoryList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveExpenses(expensecategories) {
    let post = expensecategories.id == 0 ? postWithAuth(servicePath, expensecategories)
    : putWithAuth(`${servicePath}?id=${expensecategories.id}`, expensecategories);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteExpense(expensecategoriesId) {
    let path = servicePath + "?id=" + encodeURIComponent(expensecategoriesId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}