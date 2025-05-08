import { getWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = "/pension-settings";



export function savePensionType(PensionType) {
    let post = PensionType.id == 0 ? postWithAuth(servicePath, PensionType)
    : putWithAuth(`${servicePath}?id=${PensionType.id}`, PensionType);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}


export function getPensionTypeList(branchId) {
    let path = `${servicePath}?&locationId=${branchId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}