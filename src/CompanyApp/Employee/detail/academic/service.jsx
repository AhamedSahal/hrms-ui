import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../utility";



const servicePath = "/employee-academic";

export function getAcademicList(employeeId,searchText, pageNumber, pageSize, sort) {
    let get=getWithAuth(`${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveAcademic(academic) {
    let post = academic.id == 0 ? postWithAuth(servicePath, academic,true)
        : putWithAuth(`${servicePath}?id=${academic.id}`, academic,true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteAcademic(academicId) {
    let path = servicePath + "?id=" + encodeURIComponent(academicId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}