import { getPaginationQueryString } from '../../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth,patchWithAuth } from '../../../../HttpRequest';

const servicePath = "/employee-performance/one-on-one-meeting";
const servicePath1 =  "/employee-performance/one-on-one-meeting/evaluvation";

export function getOneOnOneMeeting(searchText, pageNumber, pageSize, sort,self,branchId,departmentId,jobTitleId,fromDate,toDate,oneOnOneStatus) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path=path+`&self=${self?1:0}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&oneOnOneStatus=${oneOnOneStatus}`;

    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// get view list
export function get1On1ViewList(meetingId) {
    let path = `${servicePath}/view?&meetingId=${meetingId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getMissingCountByEmployee() {
    let path = `${servicePath}/missingcount`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function createOneOnOneScheduleMeeting(data,id) {
    // let post = postWithAuth(servicePath, data);
    let post = id == 0 ? postWithAuth(servicePath, data)
    : putWithAuth(`${servicePath}?id=${id}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
} 

// save evaluvation form
export function createOneOnOneEvaluvationForm(data,evaluvationId) {
    // let post = postWithAuth(servicePath1, data);
     let post = evaluvationId == 0 ? postWithAuth(servicePath1, data)
            : putWithAuth(`${servicePath1}?id=${evaluvationId}`, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
} 


// update status
export function updateStatus(id, status) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}