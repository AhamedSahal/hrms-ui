import axios from "axios";
import { getCompanyIdCookie, getTokenCookie, permissionCheck } from './utility';
import { trackPromise } from 'react-promise-tracker';
import { toast } from "react-toastify";

// Helper to create auth headers dynamically
const getAuthConfig = (isMultipart = false) => {
    const token = getTokenCookie();
    const companyId = getCompanyIdCookie();

    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'CompanyId': companyId || '',
            'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json'
        },
        withCredentials: true
    };
};

export const getAPIUrl = () => {
    return "https://demo-service.workplus-hrms.com/service-1";
};

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

const surveyHttp = axios.create({
    baseURL: import.meta.env.VITE_SURVEY_API_URL,
    withCredentials: true
});

http.interceptors.request.use(config => {
    config.headers["Authorization"] = `Bearer ${getTokenCookie()}`;
    config.headers["CompanyId"] = getCompanyIdCookie() || "";
    return config;
}, error => Promise.reject(error));

const handleError = (err) => {
    console.log(err);
    if (err?.response?.status === 403) {
        window.location.href = "/login";
    } else {
        toast.error(err.message || "An error occurred");
    }
};

// ------------------------- GET -------------------------
export const getWithAuth = (path) => trackPromise(
    http.get(path).then(res => permissionCheck(res.data) && res).catch(handleError)
);

export const getWithAuthDashboard = (path) => http.get(path).then(res => permissionCheck(res.data) && res).catch(handleError);

export const getWithAuthSurvey = (path) => trackPromise(
    surveyHttp.get(path).then(res => permissionCheck(res.data) && res).catch(handleError)
);

export const getBlobWithAuth = (path) => trackPromise(
    http.get(path, { responseType: 'blob' }).then(res => permissionCheck(res.data) && res).catch(handleError)
);

// ------------------------- POST -------------------------
export const postWithAuth = (path, body, isMultipart = false) => {
    const data = isMultipart ? createFormData(body) : body;
    return trackPromise(http.post(path, data, getAuthConfig(isMultipart)).then(res => permissionCheck(res.data) && res).catch(handleError));
};

export const postWithAuthSurvey = (path, body, isMultipart = false) => {
    const data = isMultipart ? createFormData(body) : body;
    return trackPromise(surveyHttp.post(path, data, getAuthConfig(isMultipart)).then(res => permissionCheck(res.data) && res).catch(handleError));
};

export const postSSO = (path, token) => {
    return trackPromise(http.post(path, null, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
        },
        withCredentials: true
    }).then(res => permissionCheck(res.data) && res).catch(handleError));
};

// ------------------------- PUT -------------------------
export const putWithAuth = (path, body, isMultipart = false) => {
    const data = isMultipart ? createFormData(body) : body;
    return trackPromise(http.put(path, data, getAuthConfig(isMultipart)).then(res => permissionCheck(res.data) && res).catch(handleError));
};

export const putWithAuthSurvey = (path, body, isMultipart = false) => {
    const data = isMultipart ? createFormData(body) : body;
    return trackPromise(surveyHttp.put(path, data, getAuthConfig(isMultipart)).then(res => permissionCheck(res.data) && res).catch(handleError));
};

// ------------------------- DELETE -------------------------
export const deleteWithAuth = (path, body) => {
    return trackPromise(http.delete(path, { data: body, ...getAuthConfig() }).then(res => permissionCheck(res.data) && res).catch(handleError));
};

export const deleteWithAuthSurvey = (path, body) => {
    return trackPromise(surveyHttp.delete(path, { data: body, ...getAuthConfig() }).then(res => permissionCheck(res.data) && res).catch(handleError));
};

// ------------------------- PATCH -------------------------
export const patchWithAuth = (path, body) => {
    return trackPromise(http.patch(path, body, getAuthConfig()).then(res => permissionCheck(res.data) && res).catch(handleError));
};

export const patchWithAuthSurvey = (path, body) => {
    return trackPromise(surveyHttp.patch(path, body, getAuthConfig()).then(res => permissionCheck(res.data) && res).catch(handleError));
};

// ------------------------- File Downloads -------------------------
export const fileDownload = (downloadId, referenceId, type, fileName) => {
    http.get(`/download?downloadId=${downloadId}&referenceId=${referenceId}&type=${type}`, { responseType: 'blob' })
        .then((response) => triggerDownload(response.data, fileName));
};

export const downloadPayslipCsv = (salaryMonth, entityId) => {
    http.get(`/payslip/download-csv?salaryMonth=${salaryMonth}&entityId=${entityId}`, { responseType: 'blob' })
        .then((response) => triggerDownload(response.data, `${salaryMonth}paylisp.csv`));
};

export const getPayslipsPdf = (salaryMonth) => {
    http.get(`/payslip/download-payslippdf?salaryMonth=${salaryMonth}&employeeId=0`, { responseType: 'blob' })
        .then((response) => triggerDownload(response.data, `${salaryMonth}_payslip.pdf`, 'application/pdf'));
};

export const getPayslipsPdfView = (salaryMonth, employeeId) => {
    return new Promise((resolve, reject) => {
        http.get(`/payslip/download-payslippdf?salaryMonth=${salaryMonth}&employeeId=${employeeId}`, { responseType: 'blob' })
            .then((response) => resolve(URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }))))
            .catch(reject);
    });
};

export const downloadPayslipSif = (salaryMonth, entityId) => {
    http.get(`/payslip/download-sif?salaryMonth=${salaryMonth}&entityId=${entityId}`, { responseType: 'blob' })
        .then((response) => triggerDownload(response.data, `${salaryMonth}paylisp.sif`));
};

export const employeeProfilePhotoURL = (id) => {
    return new Promise((resolve, reject) => {
        const cacheBuster = getTokenCookie()?.slice(-5) || "";
        http.get(`/media/employee-profile?id=${id}&cache=${cacheBuster}`, { responseType: 'blob' })
            .then((response) => resolve(URL.createObjectURL(response.data)))
            .catch(reject);
    });
};

export const companyLogoURL = (id) => {
    return new Promise((resolve, reject) => {
        const cacheBuster = getTokenCookie()?.slice(-5) || "";
        http.get(`/media/company-logo?id=${id}&cache=${cacheBuster}`, { responseType: 'blob' })
            .then((response) => resolve(URL.createObjectURL(response.data)))
            .catch(reject);
    });
};

export const downloadAttendanceTemplate = (fileName) => {
    return new Promise((resolve, reject) => {
        http.get(`/import-job/template?fileName=${fileName}`, { responseType: 'blob' })
            .then((response) => {
                triggerDownload(response.data, fileName);
                resolve();
            }).catch(reject);
    });
};

// ------------------------- Helpers -------------------------
const createFormData = (body) => {
    const formData = new FormData();
    Object.keys(body).forEach(key => {
        formData.append(key, body[key]);
    });
    return formData;
};

const triggerDownload = (data, filename, type = undefined) => {
    const blob = type ? new Blob([data], { type }) : new Blob([data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};
