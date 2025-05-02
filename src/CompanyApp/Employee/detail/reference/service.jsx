import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../utility";



const servicePath = "/employee-professional-reference";

export function getProfessionalReferenceList(employeeId,searchText, pageNumber, pageSize, sort) {
    let get=getWithAuth(`${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveProfessionalReference(professionalReference) {
    let post = professionalReference.id == 0 ? postWithAuth(servicePath, professionalReference)
        : putWithAuth(`${servicePath}?id=${professionalReference.id}`, professionalReference);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteProfessionalReference(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}