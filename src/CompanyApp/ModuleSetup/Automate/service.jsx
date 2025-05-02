
import { getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';
import { getPaginationQueryString } from '../../../utility';


const servicePath = "/workflow";

export function getWorkflow(searchText, pageNumber, pageSize, sort,id) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += '&id=' + id;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getDropdownInfo() {
    let path = `${servicePath}/select`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}



export function saveWorkflow(workflowObj) {
    let post = workflowObj.id == 0 ? postWithAuth(`${servicePath}`, workflowObj)
        : putWithAuth(`${servicePath}?id=${workflowObj.id}`, workflowObj); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}