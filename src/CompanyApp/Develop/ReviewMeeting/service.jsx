import { deleteWithAuth, getWithAuth, patchWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = '/talentReviewMeeting'

export function getEmployeeList(searchText, pageNumber, pageSize, sort, status, branchId, departmentId, designationId) {
    let path = `/employee?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
   
    if (status != null && status != undefined && status != '') {
        path += '&status=' + status;
    }
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function deleteTalentReviewMeeting(meetingId) {
    // let path = servicePath + "?id=" + encodeURIComponent(meetingId); 
    // return deleteWithAuth(path).then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     return Promise.reject(err);
    // });
}

export function getTalentReviewMeetingList(searchText, pageNumber, pageSize, sort) {
    // let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    // return getWithAuth(path).then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     return Promise.reject(err);
    // });
}

export function updateReviewMeetingStatus(meetingId, status) {
    // let path = servicePath + "/status?status=" + status;
    // return patchWithAuth(path, meetingId).then(res => {
    //     return Promise.resolve(res.data);
    // }).catch(err => {
    //     return Promise.reject(err);
    // });
}