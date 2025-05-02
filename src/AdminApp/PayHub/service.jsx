import { postWithAuth, putWithAuth } from "../../HttpRequest";


const servicePath = '/pay-hub-Bulk'

export function savePayHubBulk(bulk) {
    let post = bulk.id == 0 ? postWithAuth(servicePath, bulk)
    : putWithAuth(`${servicePath}?id=${bulk.id}`, bulk);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
