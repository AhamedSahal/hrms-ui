import { toast } from "react-toastify";
import { getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";
import {getPaginationQueryString} from '../../../../utility';

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
    });
}

export function savePerformanceCycle(cycleForm) {
    let post = cycleForm.id == 0 ? postWithAuth(`${servicePath}`, cycleForm)
        : putWithAuth(`${servicePath}`, cycleForm); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function getPerformanceCycle(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

