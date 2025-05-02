import { getWithAuth } from "../../../../HttpRequest";


const servicePath = "/attendanceOrg";

export function getOrgAttendanceDashDetails() {
    let path = servicePath + '/average';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOrgAttendanceTrend() {
    let path = servicePath + '/trend';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOrgAttendanceMonthlyEarlyBird() {
    let path = servicePath + '/earlyBird';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOrgAttendanceMonthlyLateComers() {
    let path = servicePath + '/lateComers';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getOrgAttendanceMonthlyAbsences() {
    let path = servicePath + '/absence';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOrgMonthlyPerfectAttendance() {
    let path = servicePath + '/perfect';
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOrgAttendanceOntimeChart() {
    let path = servicePath + "/ontimeChart";
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOrgAttendanceRate() {
    let path = servicePath + "/orgRate";
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getOrgAttendanceOvertimeChart() {
    let path = servicePath + "/overTimeChart";
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
    let path = `/orgAttendance-weekly/calender?employeeId=${employeeId}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&self=${self}`;
     return getWithAuth(path).then(res => {
         return Promise.resolve(res.data);
     }).catch(err => {
         return Promise.reject(err);
     });
 }
 
 
 export function getEmployeeAttendanceCardView(branchId, departmentId, jobTitleId, fromDate, toDate ,employeeId) {
     let path = `/orgAttendance-cardView/calender?employeeId=${employeeId}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&self=${self}`;
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

