import { getWithAuth } from "../../../../HttpRequest";



const servicePath = "/successionPlan";

export function getSuccessionPlanList() {
    return getWithAuth(servicePath).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
