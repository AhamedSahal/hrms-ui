import { toast } from "react-toastify";
import { getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";

const servicePath = "/performanceCycle";

export function getBranchLists() {
    return getWithAuth("/branch/select").then(response => {
        return Promise.resolve(response.data);
    }).catch(err => {
        toast.error(err.message) //"Something went wrong");
    });
}
export function getDepartmentLists() {
    return getWithAuth("/department/select").then(response => {
        return Promise.resolve(response.data);
    }).catch(err => {
        toast.error(err.message) //"Something went wrong");
    });;
}
export function getFunctionLists() {
    return getWithAuth("/functions/select").then(response => {
        return Promise.resolve(response.data);
    }).catch(err => {
        toast.error(err.message) //"Something went wrong");
    });;
}

export function savePerformanceCycle(cycleForm) {
    let post = cycleForm.id == 0 ? postWithAuth(`${servicePath}`, cycleForm)
        : putWithAuth(`${servicePath}?id=${cycleForm.id}`, cycleForm); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

