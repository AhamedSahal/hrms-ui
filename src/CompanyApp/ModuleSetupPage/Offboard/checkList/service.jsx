import { getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";


const servicePath = "Offboard-mstaskList";
const servicePath1 = "Offboard-mssubtaskList";
const servicePath2 = "Offboard-mschecklist";


export function getOffboardMSCheckList() {
    let path = `${servicePath2}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOffboardMSTaskList(id) {
    let path = `${servicePath}?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function getOffboardSubtaskList(id) {
    let path = `${servicePath1}?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function saveOffboardMSChecklist(checklist) {
    let post = checklist.id == 0 ? postWithAuth(servicePath, checklist)
    : putWithAuth(`${servicePath2}?id=${checklist.id}`, checklist);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
export function saveOffboardMSSubTask(subtask) {
    let post = subtask.id == 0 ? postWithAuth(servicePath1, subtask)
    : putWithAuth(`${servicePath1}?id=${subtask.id}`, subtask);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}



export function saveOffboardMSTask(task) {
    let post = task.id == 0 ? postWithAuth(servicePath1, task)
    : putWithAuth(`${servicePath}?id=${task.id}`, task);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
