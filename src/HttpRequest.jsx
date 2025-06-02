import axios, { Axios } from "axios";
import { getCompanyIdCookie, getTokenCookie, permissionCheck } from './utility';
import { trackPromise } from 'react-promise-tracker';
import { toast } from "react-toastify";

const token = getTokenCookie();
const companyId = getCompanyIdCookie();
const headers = {
    "Authorization": `Bearer ${token}`,
    "CompanyId": companyId || ""
};
let config = {
    headers: {
        'Content-Type': 'application/json'
    }
};
export const getAPIUrl = () => {
    return "https://demo-service.workplus-hrms.com/service-1"
}
const http = axios.create({
    baseURL: getAPIUrl(),
});
const surveyHttp = axios.create({
    baseURL: "https://demo-service.workplus-hrms.com/survey-service-1",
    headers: headers
});

http.interceptors.request.use(config => {
    config.headers["Authorization"] = `Bearer ${getTokenCookie()}`;
    config.headers["CompanyId"] = getCompanyIdCookie() || "";
    return config;
}, error => {
    return Promise.reject(error);
});

export const getWithAuth = (path) => {
    return trackPromise(http.get(path).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }).catch(err => {
        console.log({ err })
        if (err.response.status == 403)
            window.location.href = "/login";
        else
            toast.error(err.message);
    }));
}
export const getWithAuthDashboard = (path) => {
    return (http.get(path).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }).catch(err => {
        console.log({ err })
        if (err.response.status == 403)
            window.location.href = "/login";
        else
            toast.error(err.message);
    }));
}
export const getWithAuthSurvey = (path) => {
    return trackPromise(surveyHttp.get(path).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }).catch(err => {
        console.log({ err })
        if (err.response.status == 403)
            window.location.href = "/login";
        else
            toast.error(err.message);
    }));
}

export const getBlobWithAuth = (path) => {
    return trackPromise(http.get(path, {
        responseType: 'blob'
    }).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }).catch(err => {
        if (err.response.status == 403)
            window.location.href = "/login";
        else
            toast.error(err.message);
    }));
}

export const postWithAuth = (path, body, isMultipart = false) => {
    let data = body;
    if (isMultipart) {
        config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        data = new FormData();
        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });
    } else {
        config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    return trackPromise(http.post(path, data, config).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }));
}
export const postWithAuthSurvey = (path, body, isMultipart = false) => {
    let data = body;
    if (isMultipart) {
        config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        data = new FormData();
        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });
    } else {
        config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    return trackPromise(surveyHttp.post(path, data, config).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }));
}
export const putWithAuth = (path, body, isMultipart = false) => {
    let data = body;
    if (isMultipart) {
        config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        data = new FormData();
        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });
    } else {
        config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    return trackPromise(http.put(path, data, config).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }));
}

export const putWithAuthSurvey = (path, body, isMultipart = false) => {
    let data = body;
    if (isMultipart) {
        config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }

        data = new FormData();
        Object.keys(body).forEach(key => {
            data.append(key, body[key]);
        });
    } else {
        config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    }
    return trackPromise(surveyHttp.put(path, data, config).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }));
}
export const deleteWithAuth = (path, body) => {
    return trackPromise(http.delete(path, { data: body }).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }));
}
export const deleteWithAuthSurvey = (path, body) => {
    return trackPromise(surveyHttp.delete(path, { data: body }).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }));
}

export const patchWithAuth = (path, body) => {
    return trackPromise(http.patch(path, body).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }));
}

export const patchWithAuthSurvey = (path, body) => {
    return trackPromise(surveyHttp.patch(path, body).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }));
}

export const fileDownload = (downloadId, referenceId, type, fileName) => {

    http.get(`/download?downloadId=${downloadId}&referenceId=${referenceId}&type=${type}`, { responseType: 'blob' })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
        });
}
export const downloadPayslipCsv = (salaryMonth,entityId, entityName, month) => {
    http.get(`/payslip/download-csv?salaryMonth=${salaryMonth}&entityId=${entityId}`, { responseType: 'blob' })
        .then((response) => {
            let filename = `${entityName}_${month}_${salaryMonth.split("-")[0]}.csv`; 
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        });
};

export const getPayslipsPdf = (salaryMonth) => {
    http.get(`/payslip/download-payslippdf?salaryMonth=${salaryMonth}&employeeId=${0}`, { responseType: 'blob' })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));

            const link = document.createElement('a');
            link.href = url;

            link.setAttribute('download', `${salaryMonth}_payslip.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
};

// export const getPayslipsPdfView = (salaryMonth,employeeId) => {
//     http.get(`/payslip/download-payslippdf?salaryMonth=${salaryMonth}&employeeId=${employeeId}`, { responseType: 'blob' })
//         .then((response) => {
//             const file = new Blob([response.data], { type: "application/pdf" });
//             const fileUrl = URL.createObjectURL(file);
//             return fileUrl;
//         })
// };

export const getPayslipsPdfView = (salaryMonth,employeeId) => {
    return new Promise((resolve, reject) => {
       
        http
        .get(`/payslip/download-payslippdf?salaryMonth=${salaryMonth}&employeeId=${employeeId}`, { responseType: 'blob' })
            .then((response) => {
                const file = new Blob([response.data], { type: "application/pdf" });
                const fileUrl = URL.createObjectURL(file);
                resolve(fileUrl);
            })
            .catch((error) => {
                console.log("No Profile Photo: ");
                reject(error);
            });
    });
};

export const downloadPayslipSif = (salaryMonth,entityId, entityName, month) => {
    http.get(`/payslip/download-sif?salaryMonth=${salaryMonth}&entityId=${entityId}`, { responseType: 'blob' })
        .then((response) => {
            let filename = `${entityName}_${month}_${salaryMonth.split("-")[0]}.sif`; 
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        });
};
export const employeeProfilePhotoURL = (id) => {
    return new Promise((resolve, reject) => {
        const cacheBuster = getTokenCookie() ? "" : getTokenCookie().slice(-5);
        http
            .get(`/media/employee-profile?id=${id}&cache=${cacheBuster}`, { responseType: 'blob' })
            .then((response) => {
                const imageURL = URL.createObjectURL(response.data);
                resolve(imageURL);
            })
            .catch((error) => {
                console.log("No Profile Photo: " + id);
                reject(error);
            });
    });
};

export const companyLogoURL = (id) => {
    return new Promise((resolve, reject) => {
        const cacheBuster = getTokenCookie() ? "" : getTokenCookie().slice(-5);
        http
            .get(`/media/company-logo?id=${id}&cache=${cacheBuster}`, { responseType: 'blob' })
            .then((response) => {
                const imageURL = URL.createObjectURL(response.data);
                resolve(imageURL);
            })
            .catch((error) => {
                console.log("No Profile Photo: " + id);
                reject(error);
            });
    });
};

export const downloadAttendanceTemplate = (fileName) => {
    return new Promise((resolve, reject) => {
        http.get(`/import-job/template?fileName=${fileName}`, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                resolve();
            })
            .catch((error) => {
                console.error('Error downloading template:', error);
                reject(error);
            });
    });
};
export const postSSO = (path, token) => {

    config = {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        }
    }
    return trackPromise(http.post(path, null, config).then(res => {
        if (permissionCheck(res.data)) {
            return Promise.resolve(res);
        }
    }));
}