
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/shiftssetup";

export function getShiftSetupList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveShifts(shifts) {
    let post = shifts.id == 0 ? postWithAuth(servicePath, shifts)
    : putWithAuth(`${servicePath}?id=${shifts.id}`, shifts); 
    return post.then(res => { 
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
} 
export function deleteShifts(shiftsId) {
    let path = servicePath + "?id=" + encodeURIComponent(shiftsId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}