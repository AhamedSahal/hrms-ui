
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth,patchWithAuth } from '../../../HttpRequest';

const servicePath = "/workexpenses";

export function getWorkExpenses(searchText, pageNumber, pageSize, sort, status,self) {
    let path = `${servicePath}/pending?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += '&status=' + status;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveWorkExpenses(workExpenses) {
    let post = workExpenses.id == 0 ? postWithAuth(servicePath, workExpenses, true)
    : putWithAuth(`${servicePath}?id=${workExpenses.id}`, workExpenses, true); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

// export function deleteExpense(expensecategoriesId) {
//     let path = servicePath + "?id=" + encodeURIComponent(expensecategoriesId); 
//     return deleteWithAuth(path).then(res => {
//         return Promise.resolve(res.data);
//     }).catch(err => {
//         return Promise.reject(err);
//     });
// }


export function updateStatus(id, status) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}