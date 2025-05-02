import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth,patchWithAuth } from "../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../utility";

const servicePath = "/LeaveSettlement";

export function getLeaveList(searchText, pageNumber, pageSize, sort,employeeId) { 
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path+='&employeeId='+employeeId;  
    return getWithAuth(path).then(res => { 
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
 
export function saveLeaveList(employeeId) { 
   
    let post =postWithAuth(servicePath, employeeId)  
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function updateStatus(id, status) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status;  
    console.log(path);
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}