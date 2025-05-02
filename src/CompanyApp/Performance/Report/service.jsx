
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/employee-performance";

export function getPerformanceReportReviewList(searchText, pageNumber, pageSize, sort,self) {
    let path = `${servicePath}/report?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    
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

export function getOverallScoreList() {
    let path = `${"/performance-overall-score"}?${getPaginationQueryString("", 0, 100, "id,desc")}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

 