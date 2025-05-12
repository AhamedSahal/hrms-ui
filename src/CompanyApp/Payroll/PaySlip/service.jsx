import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from "../../../utility";

const servicePath = '/payslip';

export function getPayslips(salaryMonth, searchText, pageNumber, pageSize, sort,branchId,defaultCurrencyId,employeeId,entityId) {
    let path = `${servicePath}?salaryMonth=${salaryMonth}&branchId=${branchId}&defaultCurrencyId=${defaultCurrencyId}&employeeId=${employeeId}&entityId=${entityId}&${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function generatePayslips(salaryMonth) {
    let path = `${servicePath}?salaryMonth=${salaryMonth}`;
    return postWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function deletePayslip(payslipId) {
    let path = servicePath + "?id=" + encodeURIComponent(payslipId);
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updatePayslipStatus(paySlipIds, status) {
    let path = servicePath + "/status?status=" + status;
    return patchWithAuth(path, paySlipIds).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function updateAllPayslipStatus(monthYear, status,location,defaultCurrencyId) {
    let path = servicePath + "/status/all?monthYear=" + monthYear + "&status=" + status + "&location=" +location + "&currency=" +defaultCurrencyId;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}


export function getPayrollCloseMonths(closeYear) {
    let path = `${servicePath}/closed?year=${closeYear}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function closePayrollMonth(monthYear) {
    let path = `${servicePath}/close?monthYear=${monthYear}`;
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getMonthlyData(salaryMonth, q) {
    let path = `${servicePath}/monthly-data?salaryMonth=${salaryMonth}&q=${q}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getComparisonData() {
    let path = `${servicePath}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getDeparmentChart() {
    let path = `${servicePath}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}
export function getUAE02Payslip(employeeId, salaryMonth) {
    let path = `${servicePath}/get-uae02?salaryMonth=${salaryMonth}&employeeId=${employeeId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}



export function generatePayslipsPdf(salaryMonth) {
    let path = `${servicePath}/generatepdf?salaryMonth=${salaryMonth}`;
    return postWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// get payslip generated month
export function getPayslipsGeneratedMonth(year,employeeId) {
    let path = `${servicePath}/payslipMonth?year=${year}&employeeId=${employeeId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// month salary scale
export function getMonthSalaryScale(year) {
    let path = `${servicePath}/payslipMonthSalary?year=${year}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getPayslipPercentageInfo(year,status) {
    let path = `${servicePath}/payslipPercentage?year=${year}&status=${status}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// get admin deparment salary info
export function getSalaryInfoByDepartment(year,defaultCurrencyId,branchId,entityId) {
    let path = `${servicePath}/payslipsalarybydepartment?year=${year}&defaultCurrencyId=${defaultCurrencyId}&branchId=${branchId}&entityId=${entityId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

  // get admin net salary and gross salary info
  export function getOrganizationSalary(year,defaultCurrencyId,branchId,status,entityId) {
    let path = `${servicePath}/payslipsalaryForOrganization?year=${year}&defaultCurrencyId=${defaultCurrencyId}&branchId=${branchId}&status=${status}&entityId=${entityId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

// get organization dashboard info
export function getOrganizationDashboardInfo(year,defaultCurrencyId,branchId,entityId) {
    let path = `${servicePath}/payslipsalarydashboardInfo?year=${year}&defaultCurrencyId=${defaultCurrencyId}&branchId=${branchId}&entityId=${entityId}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getYearlyData(year) {
    let path = `${servicePath}/self-year?year=${year}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}