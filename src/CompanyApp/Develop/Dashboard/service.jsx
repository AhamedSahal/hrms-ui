
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/candidate-review";

export function getReviewDashboardList(reviewId) {
    let get=getWithAuth(`${servicePath}?&reviewId=${reviewId}`)
    return get.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}