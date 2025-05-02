import { getWithAuth } from "../../../../HttpRequest";


const servicePath = "/attendanceDashboard";

export function getAttendanceStatitics() {
    let path = servicePath + "/statitics";
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAttendanceBreakdown() {
    let path = servicePath + "/breakDown";
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getAttendanceDetails() {
    let path = servicePath + "/average";
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function getEmployeeAttendanceList( fromDate, toDate,self) {
    let path = `/attendance`;
    path += `&fromDate=${fromDate}&toDate=${toDate}&self=${self}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

