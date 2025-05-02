
import { getPaginationQueryString } from '../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../HttpRequest';

const servicePath = "/company";
const companySettingPath = "/settings";
const companyMenu = "company-menu";
const companyModuleSetUp ="company-modulesetup-list";
const CompanyReportList = "company-reports-list";

export function getCompanyList() {
    return getWithAuth(servicePath).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveCompany(company) {
    let post = company.id == 0 ? postWithAuth(servicePath, company)
        : putWithAuth(`${servicePath}?id=${company.id}`, company);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
 

export function deleteCompany(companyId) {
    let path = servicePath + "?id=" + encodeURIComponent(companyId);
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveCompanySetting(company) {
    let post = company.id == 0 ? postWithAuth(companySettingPath, company)
        : putWithAuth(`${companySettingPath}/company-settings`, company);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

    export function getCompanyAdminModuleAccess(){
        return getWithAuth(`/role/company-admin/module`).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    export function saveCompanyMenu(company){
        let post = company.id == 0 ? postWithAuth(companyMenu, company)
        : putWithAuth(`${companyMenu}`, company);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
    }
    export function getStatus(companyId){
        return getWithAuth(`${companyMenu}?companyId=${companyId}`).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        })
    }
    export function saveCompanySettingChatBot(chatbot,companyId) {
        let post = putWithAuth(`${companySettingPath}/updateChatbot?chatbot=${chatbot}&companyId=${companyId}`);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            console.log({err})
            return Promise.reject(err);
        });
    }

    export function getChatbotIsEnabled(companyId){
        return getWithAuth(`${companySettingPath}/chatbot-isenabled?companyId=${companyId}`).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        })
    }
    export function saveCompanySSOKey(ssoKeyEnabled,companyId) {
        let post = putWithAuth(`${companySettingPath}/ssoKeyEnabled?ssoKeyEnabled=${ssoKeyEnabled}&companyId=${companyId}`);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    export function saveAdmin(data) {
        let post = data.id == 0 ? postWithAuth(`${servicePath}/admins`,data)
            :putWithAuth(`${servicePath}/admins`,data);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }
    export function getAdmin(companyId){
        return getWithAuth(`${servicePath}/company-admins?companyId=${companyId}`).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        })
    }
    export function deleteAdmin(employeeId,companyId) {
        let path = `${servicePath}/admin-delete?employeeId=${employeeId}&companyId=${companyId}`; 
        return deleteWithAuth(path).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }
    export function getActiveUsersByCompanyId(currentDate,companyId){
        return getWithAuth(`${servicePath}/active-user?date=${currentDate}&companyId=${companyId}`).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    export function updatePayrollCycle(company) {
        let post = putWithAuth(`${companySettingPath}/payroll-cycle`,company);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    export function getModuleSetupByCompanyId(companyId){
        return getWithAuth(`${companyModuleSetUp}?companyId=${companyId}`).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    //  reports
    export function getReportAccessByCompanyId(companyId){
        return getWithAuth(`${CompanyReportList}?companyId=${companyId}`).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        })
    }

    export function updateReportModuleAccess(company) {
        let post = putWithAuth(`${CompanyReportList}`, company);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    export function updateModuleSetup(company) {
        let post = putWithAuth(`${companyModuleSetUp}`, company);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    export function getChildCompanyList(companyId) {
        return getWithAuth(`${servicePath}/child?companyId=${companyId}`).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }
    export function updateMultiEntity(companyId,multiEntity) {
        let post = putWithAuth(`${servicePath}/multiEntity?companyId=${companyId}&multiEntity=${multiEntity}`);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }
    export function removeChild(parentCompanyId,childCompanyId) {
        let post = deleteWithAuth(`${servicePath}/remove-child?parentCompanyId=${parentCompanyId}&childCompanyId=${childCompanyId}`);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }
    export function addChild(parentCompanyId,childCompanyId) {
        let post = putWithAuth(`${servicePath}/add-child?parentCompanyId=${parentCompanyId}&childCompanyId=${childCompanyId}`);
        return post.then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }
    export function getCompanyDetails(companyId) {
        let path = `company/company-name?companyId=${companyId}`;
        return getWithAuth(path).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    export function getMultiEntityCompanyList() {
        let path = `company/org-multi-entity`;
        return getWithAuth(path).then(res => {
            return Promise.resolve(res.data);
        }).catch(err => {
            return Promise.reject(err);
        });
    }