import { toast } from "react-toastify";
import { getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";

const servicePath = "onboard-mstaskList";
const servicePath1 = "onboard-mssubtaskList";
const servicePath2 = "onboard-mschecklist";


export function getOnboardMSCheckList() {
    let path = `${servicePath2}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOnboardMSTaskList(id) {
    let path = `${servicePath}?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getJobTitles() {
    return getWithAuth('/jobTitles/select').then(response => {
        return Promise.resolve(response.data);
    }).catch(err => {
        toast.error(err.message) //"Something went wrong");
    });;

}


export function getOnboardSubtaskList(id) {
    let path = `${servicePath1}?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function saveMSChecklist(checklist) {
    let post = checklist.id == 0 ? postWithAuth(servicePath, checklist)
        : putWithAuth(`${servicePath2}?id=${checklist.id}`, checklist);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function saveOnboardMSSubTask(subtask) {
    let post = subtask.id == 0 ? postWithAuth(servicePath1, subtask)
        : putWithAuth(`${servicePath1}?id=${subtask.id}`, subtask);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function saveOnboardMSTask(task) {
    let post = task.id == 0 ? postWithAuth(servicePath1, task)
        : putWithAuth(`${servicePath}?id=${task.id}`, task);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}