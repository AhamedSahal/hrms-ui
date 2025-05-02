
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/holiday";
export function getHolidayist(searchText, pageNumber, pageSize, sort,id,year) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&locationId=${id}&year=${year}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveHoliday(holiday) {
    let post = holiday.id == 0 ? postWithAuth(servicePath, holiday)
    : putWithAuth(`${servicePath}?id=${holiday.id}`, holiday);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteHoliday(holidayId) {
    let path = servicePath + "?id=" + encodeURIComponent(holidayId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}