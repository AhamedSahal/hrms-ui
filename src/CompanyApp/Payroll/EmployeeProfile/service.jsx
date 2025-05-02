import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth } from "../../../HttpRequest";


const servicePath = '/my-paysummary';

export function getPaySummaryData() {
    let path = `${servicePath}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}