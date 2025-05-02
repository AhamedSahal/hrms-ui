import { getWithAuth,putWithAuth } from "../../HttpRequest";
import { getPaginationQueryString } from '../../utility';


const servicePath = '/employee-working-days';

export function getList( page, pageSize,salaryMonth ) {
    let path = `${servicePath}?page=${page}&pageSize=${pageSize}&salaryMonth=${salaryMonth}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function save(data) {
    let post = putWithAuth(`${servicePath}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}