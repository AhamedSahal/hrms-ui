import { getWithAuth } from "../../../HttpRequest";

const servicePath = "/report";

export function getOfferLetterReport(q,fromDate,toDate,companyId) {
    let path = `${servicePath}/offerletter?fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function getCandidateInfoReport(q,fromDate,toDate,companyId) {
    let path = `${servicePath}/candidateinfo?fromDate=${fromDate}&toDate=${toDate}&q=${q}&companyId=${companyId}`;
   
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}



 


