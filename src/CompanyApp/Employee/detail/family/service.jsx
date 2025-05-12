import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../utility";


const servicePath = "/employee-family";

export function getFamilyList(employeeId, searchText, pageNumber, pageSize, sort) {
    let get = getWithAuth(`${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function saveFamily(family) { 
    let post = family.id == 0 ? postWithAuth(`${servicePath}?id=${family.id}&employeeId=${family.employeeId}&name=${family.name}&jobTitleOrCompany=${family.jobTitleOrCompany}&contactNo=${family.contactNo}&relation=${family.relation}&significantDate=${family.significantDate}`, { file: family.file }, true)
        : putWithAuth(`${servicePath}?id=${family.id}&employeeId=${family.employeeId}&name=${family.name}&jobTitleOrCompany=${family.jobTitleOrCompany}&contactNo=${family.contactNo}&relation=${family.relation}&significantDate=${family.significantDate}`, { file: family.file }, true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function deleteFamily(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id);
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}