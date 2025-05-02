
import { postWithAuth,getWithAuth } from "../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../utility";


const servicePath = "/employeeChangeStatus";

export function saveChangeStatus(data) {
    let post = postWithAuth(servicePath, data);
    

    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function getChangeStatusDetails(searchText, pageNumber, pageSize, sort,employeeId) {
    let get=getWithAuth(`${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}&employeeId=${employeeId}`)
    return get.then(res => {
        return Promise.resolve(res.data);

    }).catch(err => {
        return Promise.reject(err);
    });
}

    export function getGradeInfo(employeeId,grade) {
        let path = `${servicePath}/grade?employeeId=${employeeId}&gradeId=${grade}`;
        return getWithAuth(path).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
}

