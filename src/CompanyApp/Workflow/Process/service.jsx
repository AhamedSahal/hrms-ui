import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/workflow";
const servicepathh = "/workflow/workflowMain";
const servicepathh1 = "/workflow//workflowMainAction";


export function getProcessList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}/processList?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`; 
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getcheckassignee(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}/checkassignee?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAssigneeDetails(searchText, pageNumber, pageSize, sort,workflowStepId) {
    let path = `${servicePath}/assigneeDetail?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += '&workflowStepId=' + workflowStepId; 
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveWorkflowProcess(process) {
    let post = process.id == 0 ? postWithAuth(servicepathh, process, true)
        : putWithAuth(`${servicepathh}?id=${process.id}`, process, true);
        console.log(post);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function saveWorkflowAction(workflow) {
    let post = workflow.id == 0 ? postWithAuth(servicepathh1, workflow, true)
        : putWithAuth(`${servicepathh1}?id=${workflow.id}`, workflow, true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function deleteWorkflow(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id);
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function updateWorkflowStatus(id, status) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
