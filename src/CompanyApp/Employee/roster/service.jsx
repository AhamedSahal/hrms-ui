import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';
import { getPaginationQueryString } from '../../../utility';

const servicePath = "/roster";

export function getRepeatByRoster(rosterId,searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&rosterId=${rosterId}`;
    return getWithAuth(path).then(res => { 
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getRosterList(employeeId, searchText, pageNumber, pageSize, sort,fromDate, toDate) {
    let path = `${servicePath}/rosterlist?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}&fromDate=${fromDate}&toDate=${toDate}`; 
    return getWithAuth(path).then(res => { 
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getRosterSelf( searchText, pageNumber, pageSize, sort,fromDate, toDate) {
    let path = `${servicePath}/rosterSelf?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&fromDate=${fromDate}&toDate=${toDate}`; 
    return getWithAuth(path).then(res => { 
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
 
export function saveRoster(Roster) { 
    let post = Roster.id == 0 ? postWithAuth(servicePath, Roster)
        : putWithAuth(`${servicePath}?id=${Roster.id}`, Roster);     
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
