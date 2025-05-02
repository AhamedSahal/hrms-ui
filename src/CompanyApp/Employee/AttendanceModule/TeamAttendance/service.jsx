import { getWithAuth } from "../../../../HttpRequest";


const servicePath = "/attendanceTeam";

export function getTeamAttendanceDashDetails() {
    let path = servicePath + '/average';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTeamAttendanceTrend() {
    let path = servicePath + '/trend';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTeamAttendanceOntimeChart() {
    let path = servicePath + '/onTimeChart';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getTeamAttendanceOvertimeChart() {
    let path = servicePath + '/overtimeChart';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTeamAttendanceRate() {
    let path = servicePath + '/teamRate';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTeamAttendanceMonthlyEarlyBird() {
    let path = servicePath + '/earlyBird';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTeamAttendanceMonthlyLateComers() {
    let path = servicePath + '/lateComers';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getTeamAttendanceMonthlyAbsences() {
    let path = servicePath + '/absence';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTeamMonthlyPerfectAttendance() {
    let path = servicePath + '/perfect';
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


export function getEmployeeWeeklyCalenderList(branchId, departmentId, jobTitleId, fromDate, toDate ,employeeId) {
   let path = `/teamAttendance-weekly/calender?employeeId=${employeeId}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&self=${self}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}



export function getEmployeeAttendanceCardView(branchId, departmentId, jobTitleId, fromDate, toDate ,employeeId) {
    let path = `/teamAttendance-cardView/calender?employeeId=${employeeId}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&self=${self}`;
     return getWithAuth(path).then(res => {
         return Promise.resolve(res.data);
     }).catch(err => {
         return Promise.reject(err);
     });
 }

export function getEmployeeCalender(employeeId, firstDayOfMonth) {
    let path = `/attendance/calender?employeeId=${employeeId}&date=${firstDayOfMonth}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
