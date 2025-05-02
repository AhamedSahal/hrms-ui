import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth, patchWithAuth } from "../../../../HttpRequest";
import { getPaginationQueryString } from "../../../../utility";

const servicePath = "/FinalSettlement";
const servicePath1 = "/FinalSettlement/Settlement";

export function getFFList(searchText, pageNumber, pageSize, sort, employeeId) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path += '&employeeId=' + employeeId;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);

    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveFF(FinalSettlement) {
    let post = postWithAuth(servicePath, FinalSettlement)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function updateStatus(id, status) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function updateSettlement(id, pendingsalary, currMonthSalary, noticePeriod, pendingsalarydays, currMonthSalarydays,
    noticePaydays, otherPayments, otherPaymentsRemarks, otherDeductions, otherDeductionsRemarks, pendingsalaryRemarks, currMonthSalaryRemarks,
    noticePeriodRemarks) {
    let path = servicePath1 + "?id=" + encodeURIComponent(id) + "&pendingsalary=" + pendingsalary + "&currMonthSalary=" + currMonthSalary + "&noticePeriod=" + noticePeriod +
        "&pendingsalarydays=" + pendingsalarydays + "&currMonthSalarydays=" + currMonthSalarydays + "&noticePaydays=" + noticePaydays + "&otherPayments=" + otherPayments + "&otherPaymentsRemarks=" + otherPaymentsRemarks +
        "&otherDeductions=" + otherDeductions + "&otherDeductionsRemarks=" + otherDeductionsRemarks + "&pendingsalaryRemarks=" + pendingsalaryRemarks +
        "&currMonthSalaryRemarks=" + currMonthSalaryRemarks + "&noticePeriodRemarks=" + noticePeriodRemarks;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}