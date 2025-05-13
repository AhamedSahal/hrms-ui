import { postWithAuth, putWithAuth } from "../../../../../HttpRequest";

const servicePath = "/successionPlanInfo"; 

export function saveSuccessionInfo(planInfo) {
    // let post = planInfo.id == 0 ? postWithAuth(servicePath, planInfo)
    // : putWithAuth(`${servicePath}?id=${planInfo.id}`, planInfo);
    // return post.then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     console.log({err})
    //     return Promise.reject(err);
    // });
}