
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

 

const servicePath = "/forecast";

export function getForecastList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`; 
    return getWithAuth(path).then(res => { 
        return Promise.resolve(res.data);
     
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveForecast(forecast) { 
    let post = forecast.id == 0 ? postWithAuth(servicePath, forecast)
     : putWithAuth(`${servicePath}?id=${forecast.id}`, forecast);    
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
/* 
export function deleteForecast(ForecastId) {
    let path = servicePath + "?id=" + encodeURIComponent(branchId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
} */

export function updateStatus(id, status,budgetstatus,appnoofresources) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status + "&budgetstatus=" + budgetstatus +"&appnoofresources=" + appnoofresources;  
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}