import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/workflow"; 
 
export function getActionList(searchText, pageNumber, pageSize, sort,workflowId,status) {
    let path = `${servicePath}/actionList?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`; 
    path += `&workflowId=`+ workflowId+ `&status=`+status;    
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getWorkFlowList(searchText, pageNumber, pageSize, sort,status,completed) {
    let path = `${servicePath}/workflowList?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`; 
    path += `&status= ${status}&completed=${completed}`;  
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getWorkFlowStepList(workflowId) {
    let path = `${servicePath}/selectt?workflowId=${workflowId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
 