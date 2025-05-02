import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

import { getPaginationQueryString } from '../../../utility';

const servicePath = "/compositePayscale";

export function saveCompositePayscale(grades) {
    let post = grades.id == 0 ? postWithAuth(servicePath, grades)
        : putWithAuth(`${servicePath}?id=${grades.id}`, grades);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function savePayscaleType(datas) {
    let post = datas.id == 0 ? postWithAuth(servicePath, datas)
        : putWithAuth(`${servicePath}?id=${datas.id}`, datas);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}


export function getRewardCompositeList(searchText, pageNumber, pageSize, sort) {
    const servicePath1 = "/compensationReward/PayScaleComposite";
    let path = `${servicePath1}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

export function getRewardFixedList(searchText, pageNumber, pageSize, sort) {
    const servicePath1 = "/compensationReward/PayScaleFixed";
    let path = `${servicePath1}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

// PayScale type
export function getPayScaleType(searchText, pageNumber, pageSize, sort) {
    const servicePath1 = "/compensationReward/payScaleTypeList";
    let path = `${servicePath1}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

// export function getPayFixedList(searchText, pageNumber, pageSize, sort) {
//     const servicePath1 = "/compensationReward/Fixed";
//     let path = `${servicePath1}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
//     return getWithAuth(path).then(response => {
//         return Promise.resolve(response.data);
//     }).catch(error => {
//         return Promise.reject(error);
//     });
// }