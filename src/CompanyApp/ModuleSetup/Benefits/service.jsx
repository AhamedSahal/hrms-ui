
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/BenefitsType";

export function getBenefitsTypeList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveBenefitsType(Benefits) {
    let post = Benefits.id == 0 ? postWithAuth(servicePath, Benefits)
        : putWithAuth(`${servicePath}?id=${Benefits.id}`, Benefits);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

// export function deleteAnnouncement(announcementId) {
//     let path = servicePath + "?id=" + encodeURIComponent(announcementId);
//     return deleteWithAuth(path).then(res => {
//         return Promise.resolve(res.data);
//     }).catch(err => {
//         return Promise.reject(err);
//     });
// }