import { deleteWithAuth, getWithAuth, postWithAuth } from "../../../../HttpRequest";

const webAttendanceIpPath = "/webattendance-config-ip";
const mobileAttendanceLocPath = "/mobile-attendance-config-location";
const mobileAttendanceIPPath = "/mobile-attendance-config-ip";

export function getIPList(groupId,configId) {
    return getWithAuth(`${webAttendanceIpPath}/list?groupId=${groupId}&configId=${configId}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function addIPIntoGroup(ipConfig) {
    let post = postWithAuth(webAttendanceIpPath, ipConfig)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteFromWebIp(groupUser) {
    let post = deleteWithAuth(webAttendanceIpPath, groupUser)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
export function getIPs(groupId,configId) {
    return getWithAuth(`${webAttendanceIpPath}?groupId=${groupId}&configId=${configId}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
//  Mobile locations

export function getLocationList(groupId,configId) {
    return getWithAuth(`${mobileAttendanceLocPath}/list?groupId=${groupId}&configId=${configId}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function addLocationIntoGroup(locConfig) {
    let post = postWithAuth(mobileAttendanceLocPath, locConfig)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteFromMobileLoc(groupUser) {
    let post = deleteWithAuth(mobileAttendanceLocPath, groupUser)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
export function getLocations(groupId,configId) {
    return getWithAuth(`${mobileAttendanceLocPath}?groupId=${groupId}&configId=${configId}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// Mobile IP

export function getMobileIPsList(groupId,configId) {
    return getWithAuth(`${mobileAttendanceIPPath}/list?groupId=${groupId}&configId=${configId}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function addMobileIPsIntoGroup(locConfig) {
    let post = postWithAuth(mobileAttendanceIPPath, locConfig)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function deleteFromMobileIPs(groupUser) {
    let post = deleteWithAuth(mobileAttendanceIPPath, groupUser)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
export function getMobileIPs(groupId,configId) {
    return getWithAuth(`${mobileAttendanceIPPath}?groupId=${groupId}&configId=${configId}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}