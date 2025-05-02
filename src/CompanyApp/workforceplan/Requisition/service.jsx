
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/requisition";

export function getRequisitionList(searchText, pageNumber, pageSize, sort,status,requisitionprocess) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path+='&status='+status + '&requisitionprocess=' + requisitionprocess; 
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveRequisition(requisition) { 
   
    let post = requisition.id == 0 ? postWithAuth(servicePath, requisition)
     : putWithAuth(`${servicePath}?id=${requisition.id}`, requisition);   
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
 
export function updateStatus(id, status) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status ; 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}  