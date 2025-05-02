import { getWithAuth } from '../../../HttpRequest';
import { getPaginationQueryString } from '../../../utility';

const servicePath = "/log/audit";

export function getLoginLogList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => { 
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}