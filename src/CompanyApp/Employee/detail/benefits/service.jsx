import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../utility";


const servicePath = "/BenefitsType/BenefitsDetail";
const servicePath1 = "/BenefitsType/BenefitsGradeDetail";
const servicePath2 = "/BenefitsType/BenefitsActionList";

export function getBenefitSelfList(employeeId, searchText, pageNumber, pageSize, sort,status) {
    let get = getWithAuth(`${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}&status=${status}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getGradeEmployeelist(gradesId, year, searchText, pageNumber, pageSize, sort) {
    let get = getWithAuth(`${servicePath1}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&gradesId=${gradesId}&year=${year}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getBenefitSelfActionList(employeeId, searchText, pageNumber, pageSize, sort,benefitListId) {
    let get = getWithAuth(`${servicePath2}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}&benefitListId=${benefitListId}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


