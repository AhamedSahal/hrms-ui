import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

import { getPaginationQueryString } from '../../../utility';

const servicePath = "/compensationReward";

export function getGradingStructureList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getPayRangeList() {
    const servicePath1 = "/compensationReward/payRange";
    return getWithAuth(servicePath1).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

export function getPayCompositeList(searchText, pageNumber, pageSize, sort) {
    const servicePath1 = "/compensationReward/composite";
    let path = `${servicePath1}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(response => {
        return Promise.resolve(response.data);
    }).catch(error => {
        return Promise.reject(error);
    });
}

export function getPayFixedList(searchText, pageNumber, pageSize, sort) {
    const servicePath1 = "/compensationReward/Fixed";
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


export function saveGradingStructure(grades) {
    let post = grades.id == 0 ? postWithAuth(servicePath, grades)
        : putWithAuth(`${servicePath}?id=${grades.id}`, grades);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function saveCompositePayscale(data) {
    const servicePath1 = "/compensationReward/composite";
    let post = putWithAuth(`${servicePath1}`, data, false);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function savePayRange(data) {
    const servicePath1 = "/compensationReward/payRange";
    let post = putWithAuth(`${servicePath1}`, data, false);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function saveFixedAllowancePayscale(data) {
    const servicePath1 = "/compensationReward/fixed";
    let post = putWithAuth(`${servicePath1}`, data, false);
    console.log(post);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });

}