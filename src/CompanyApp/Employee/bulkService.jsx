
import { getBlobWithAuth, postWithAuth } from '../../HttpRequest';

const servicePath = "/employee-bulk";

export function getEmployeeBulkTemplate() {
    return getBlobWithAuth(servicePath + "/template").then(response => {
        return Promise.resolve(response);
    }).catch(error => {
        return Promise.reject(error);
    });
}


export function saveBulkEmployee(employee) {
    let post = postWithAuth(servicePath, employee);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}