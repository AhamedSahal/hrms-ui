
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/employee-performance";

export function getPerformanceReviewList(searchText, pageNumber, pageSize, sort,self,branchId,departmentId,jobTitleId,fromDate,toDate) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path=path+`&self=${self?1:0}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}`;

    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getPerformanceById(id) {
    let path = `${servicePath}/${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function createNew(data) {
    let post = postWithAuth(servicePath, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}  
export function manageObjectives(data,performanceId,objectiveGroupId) {
    let post = postWithAuth(servicePath+"/objective?performanceId="+performanceId+"&objectiveGroupId="+objectiveGroupId, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
} 

export function saveRating(data,performanceId) {
    let post = postWithAuth(servicePath+"/rating?performanceId="+performanceId, data);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}  

export function deletePerformanceReview(templateId) {
    let path = servicePath + "?id=" + encodeURIComponent(templateId); 
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
} 