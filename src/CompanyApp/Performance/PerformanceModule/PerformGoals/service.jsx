import { deleteWithAuth, getWithAuth, getWithAuthDashboard, patchWithAuth, postWithAuth, putWithAuth } from "../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../utility";

const servicePath = "/employee-performance/PerformGoals";
const servicePath1 = "/employee-performance/PerformSubGoals";

// get Goal List
export function getPerformanceGoalsList(searchText, pageNumber, pageSize, sort,self,branchId,departmentId,jobTitleId,fromDate,toDate,status) {
    let path = `${servicePath}/list?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path=path+`&self=${self?1:0}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&status=${status}`;

    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// get Goal List by employee
export function getPerformanceGoalsListByEmployee(searchText, pageNumber, pageSize, sort,branchId,departmentId,jobTitleId,fromDate,toDate,self,status) {
    let path = `${servicePath}/employee?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path=path+`&self=${self?1:0}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&status=${status}`;

    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getEmployeeGoalsList(searchText, pageNumber, pageSize, sort,self,branchId,departmentId,jobTitleId,fromDate,toDate,status) {
    let path = `${servicePath}/list?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path=path+`&self=${self?1:0}&branchId=${branchId}&departmentId=${departmentId}&jobTitleId=${jobTitleId}&fromDate=${fromDate}&toDate=${toDate}&status=${status}`;

    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

//get Sub Goals List
export function getSubGoalsList(searchText, pageNumber, pageSize, sort, id) {
    let path = `${servicePath1}/list?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += '&id=' + id;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// dashboard
export function getDashboardData(status) {
    let path = `${servicePath}/dashboard?status=${status}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getDashboardProgressBarData(status) {
    let path = `${servicePath}/dashboardprogressbar?status=${status}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// get sub goals acticon status api
export function getSubGoalsActionList(statusId,subGoalValidationStatus) {
    let path = `${servicePath1}/actionstatus?statusId=${statusId}&subGoalValidationStatus=${subGoalValidationStatus}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getGoalsActionList(statusId) {
    let path = `${servicePath1}/actionGoalsstatus?statusId=${statusId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


// get Weightage
export function getSubGoalWeightage(goalsId) {
    let path = `${servicePath}/subgoalweightage?goalsId=${goalsId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// get  Goals View History
export function getgoalsViewHistory(subgoalsId) {
    let path = `${servicePath1}/goalviewhistory?goalsId=${subgoalsId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// get Sub Goals View History
export function getsubgoalsViewHistory(subgoalsId) {
    let path = `${servicePath1}/subgoalviewhistory?subgoalsId=${subgoalsId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveGoals(Goals) {
    // let post = postWithAuth(servicePath, Goals);
        let post = Goals.id == 0 ? postWithAuth(servicePath, Goals)
    : putWithAuth(`${servicePath}?id=${Goals.id}`, Goals);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function saveSubGoals(subGoals) {
    // let post = postWithAuth(servicePath1, subGoals);
    let post = subGoals.id == 0 ? postWithAuth(servicePath1, subGoals)
    : putWithAuth(`${servicePath1}?id=${subGoals.id}`, subGoals);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

// patch
export function updateWeightData(id, weigthage, priority, deadline,issubGoalWeightage) {
    let path = servicePath1 + "?id=" + id + "&goalWeightage=" + weigthage + "&priority=" + priority + "&deadline=" + deadline + "&issubGoalWeightage=" + issubGoalWeightage;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateSubGoalStatus(id, file,achievement,comments) {
    
    let post = postWithAuth(`${servicePath1}/Status?subGoalsId=${id}&achievement=${achievement}&comments=${comments}`, { file: file }, true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => { 
        return Promise.reject(err);
    });
}

//  GOALS STATUS UPDATE
export function updateGoalStatus(id, file,achievement,comments) {
    
    let post = postWithAuth(`${servicePath}/Status?subGoalsId=${id}&achievement=${achievement}&comments=${comments}`, { file: file }, true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => { 
        return Promise.reject(err);
    });
}
