
import { getWithAuth, putWithAuth } from '../../HttpRequest';

const servicePath = "/plan";

export function getPlanList() {

    return getWithAuth(servicePath).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updatePlan(plan) {
    let path = `${servicePath}?id=${plan.id}`;
    return putWithAuth(path, plan).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
