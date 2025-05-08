import { toast } from "react-toastify";
import { deleteWithAuth, getWithAuth, getWithAuthDashboard, patchWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePathV2 = "/timesheet-v2";

export function getEmployeeDashboardDetail(date) {
    return getWithAuthDashboard(`/dashboard/employee?date=${date}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

// Post attendance api
export function postAttendance() {
    return postWithAuth('/attendance-v2/web').then(res => {
        toast.success(res.message);
        return Promise.resolve(res.data);
    }).catch(err => {
        toast.err(err.message);
        return Promise.reject(err);
    });
}

export function getCompanyAdminDashboardDetail() {
    return getWithAuthDashboard('/dashboard/company-admin').then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getSocialShareList(searchText, pageNumber, pageSize, sort) {
    let path = `/social-share/listing?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuthDashboard(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getSocialShare(searchText, pageNumber, pageSize, sort) {
    let path = `/social-share?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getSocialPostReaction(id) {
    return getWithAuth(`/social-share/reaction?id=${id}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getRoles() {
        return getWithAuth("/role/select").then(response => {
                return Promise.resolve(response.data);
            }).catch(err => {
                return Promise.reject(err);
            });
}

export function postSocialShare(socialShare) {
    return postWithAuth('/social-share', socialShare, true).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
// put social share comment
export function putSocialShareComment(id,comment) {
    return putWithAuth(`/social-share/comment?id=${id}&comment=${comment}`, null).then(res => {
        toast.success(res.message);
        return Promise.resolve(res.data);
    }).catch(err => {
        toast.err(err.message);
        return Promise.reject(err);
    });
}
//delete social share comment
export function deleteSocialShareComment(socialShareCommentId) {
    let path = `/social-share/comment?id=${socialShareCommentId}`;
    return deleteWithAuth(path).then(res => {
        toast.success(res.message);
        return Promise.resolve(res.data);
    }).catch(err => {
        toast.err(err.message);
        return Promise.reject(err);
    });
}
// put social share like 
export function putSocialShareLike(socialShareId) {
    return putWithAuth(`/social-share/like?id=${socialShareId}`, null).then(res => {
        toast.success(res.data.message);
        return Promise.resolve(res.data);
    }).catch(err => {
        toast.err(err.message);
        return Promise.reject(err);
    });
}
export function putSocialShareReactions(id,iconId) {
    return putWithAuth(`/social-share/reactions?id=${id}&iconId=${iconId}`, null).then(res => {
        toast.success(res.data.message);
        return Promise.resolve(res.data);
    }).catch(err => {
        toast.err(err.message);
        return Promise.reject(err);
    });
}

//put Recognition Like
export function putRecognitionLike(RecognitionMainId) {
    return putWithAuth(`/social-share/Recognitionlike?id=${RecognitionMainId}`, null).then(res => {
        toast.success(res.data.message);
        return Promise.resolve(res.data);
    }).catch(err => {
        toast.err(err.message);
        return Promise.reject(err);
    });
}
//put Recognition Comment 
export function putRecognitionComment(id,comment) {
    return putWithAuth(`/social-share/Recognitioncomment?id=${id}&comment=${comment}`, null).then(res => {
        toast.success(res.message);
        return Promise.resolve(res.data);
    }).catch(err => {
        toast.err(err.message);
        return Promise.reject(err);
    });
}

export function getAttendanceCount(date,permission) {
    return getWithAuthDashboard(`/attendance/today?date=${date}&permission=${permission}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getEmployeeLateDashboardDetail(date,permission) {
    return getWithAuthDashboard(`/attendance/late?date=${date}&permission=${permission}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

// absent list
export function getEmployeeAbsentDashboardDetail(date,permission) {
    return getWithAuthDashboard(`/attendance/absent?date=${date}&permission=${permission}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getEmployeeOntimeDashboardDetail(date,permission) {
    return getWithAuthDashboard(`/attendance/ontime?date=${date}&permission=${permission}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getAttendanceCountMonth(monthYear) {
    return getWithAuth(`/attendance/month?monthYear=${monthYear}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getUpComingHolidays() {
    return getWithAuthDashboard(`/holiday/upcoming-holidays`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}
export function getUpComingAnnouncements() {
    return getWithAuthDashboard(`/announcement/upcoming-announcement`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}
export function getUpComingCelebration() {
    return getWithAuthDashboard(`/employee/upcoming-celebration`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}
export function getUpComingHire() {
    return getWithAuthDashboard(`/employee/upcoming-hire`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}
export function getUpComingLeaving() {
    return getWithAuthDashboard(`/employee/upcoming-leaving`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}
export function getUpComingDocumentExpiry() {
    return getWithAuthDashboard(`/employee-document/upcoming-document`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}
export function getDocumentExpiryByMonth(monthYear) {
    return getWithAuthDashboard(`/employee-document/documentexpiry-month?monthYear=${monthYear}`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}
export function getDocumentExpiry() {
    return getWithAuth(`/employee-document/documentexpiry-list`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}
export function getEmployeeMissingInfoCount() {
    return getWithAuthDashboard(`/employee-document/missingInfo-count`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getEmployeeMissingInfoList() {
    return getWithAuth(`/employee-document/missingInfo-list`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getMissingDocumentList(){
    return getWithAuth(`/employee-document/missingdocument-list`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function getMissingDocumentCount(){
    return getWithAuthDashboard(`/employee-document/missingdocument-count`).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    })
}

export function deleteSocialPost(data) {
    let path = `/social-share?id=${data.id}`; 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateLeaveStatus(id, status,remark) {
    let path = "/leave" + "?id=" + encodeURIComponent(id) + "&status=" + status + "&remark=" + remark;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getTimesheet(searchText,fromDate,toDate, pageNumber, pageSize, sort, self) {
    let path = `${servicePathV2}?`;
    path+=`page=${pageNumber}&pageSize=${pageSize}&fromDate=${fromDate}&toDate=${toDate}&q=${searchText}&self=${self}&sort=${sort}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateTimesheetStatus(id, approvedHours, status) {
    let path = "/timesheet" + "?id=" + encodeURIComponent(id) + "&approvedHours=" + approvedHours + "&status=" + status; 
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}