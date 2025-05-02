import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../utility";



const servicePath = "/employee-skill";

export function getSkillList(employeeId,searchText, pageNumber, pageSize, sort) {
    let get=getWithAuth(`${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveSkill(skill) {
    let post = skill.id == 0 ? postWithAuth(servicePath, skill)
        : putWithAuth(`${servicePath}?id=${skill.id}`, skill);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteSkill(id) {
    let path = servicePath + "?id=" + encodeURIComponent(id); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}