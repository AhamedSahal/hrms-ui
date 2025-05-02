import { getWithAuth, postWithAuth, putWithAuth } from "../../../HttpRequest";
import { getPaginationQueryString } from '../../../utility';

const servicePath = "/employee";

// Personal Information
export function getPersonalInformation(id) {
    let path = `${servicePath}/personal-info?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getCountryList(id) {
    let path = `${servicePath}/country-list?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updatePersonalInformation(employee) {
    let post = putWithAuth(`${servicePath}?id=${employee.id}`, employee)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}


//Address

export function getAddressInformation(id) {
    let path = `${servicePath}/address?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateAddressInformation(address) {
    let post = putWithAuth(`${servicePath}/address?id=${address.employeeId}`, address)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}



//Bank

export function getBankInformation(id) {
    let path = `${servicePath}/bank?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateBankInformation(bank) {
    let post = putWithAuth(`${servicePath}/bank?id=${bank.employeeId}`, bank)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}


//Company

export function getCompanyInformation(id) {
    let path = `${servicePath}/company?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateCompanyInformation(company) {
    console.log(company);
    let post = putWithAuth(`${servicePath}/company?id=${company.id}`, company)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}


//Salary

export function getSalaryInformation(id) {
    let path = `${servicePath}/salary-setting?employeeId=${id}`;
    return getWithAuth(path).then(res => {
        console.log(res.data);
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateSalaryInformation(salary) {
    let post = putWithAuth(`${servicePath}/salary-setting?employeeId=${salary.employeeId}`, salary)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

//Status

export function getStatusInformation(id) {
    let path = `${servicePath}/status?id=${id}`
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateStatusInformation(status) {
    let post = putWithAuth(`${servicePath}/status?id=${status.employeeId}`, status)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function getDocumentInformation(id) {
    let path = `${servicePath}/document?id=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateDocumentInformation(document) {
    let post = putWithAuth(`${servicePath}/document?documentNo=${document.documentNo}&documentTypeId=${document.documentTypeId}&expireOn=${document.expireOn}&issuedOn=${document.issuedOn}&id=${document.employeeId}`, { file: document.file }, true)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

//allowance
export function getAllowanceInformation(id) {
    let path = `${servicePath}/allowance?employeeId=${id}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function updateAllowanceInformation(id, allowance) {
    let post = postWithAuth(`${servicePath}/allowance?employeeId=${id}`, allowance)
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

//salaryTimesheet

export function updateSalaryEmploymentStatusIdInformation(salary,employeeId) {
    let post = postWithAuth(`${servicePath}/salary-salarySetting-timesheet?employeeId=${employeeId}`, salary)
    
    return post.then(res => {
       
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}

export function getSalaryEmploymentStatusIdInformation(id) {
    let path = `${servicePath}/salary-salarySetting-timesheet?employeeId=${id}`;
    return getWithAuth(path).then(res => {
       
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getEmployementStatusById(id) {
    let path = `${servicePath}/employment-list?employeeId=${id}`;
    return getWithAuth(path).then(res => {
     
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

