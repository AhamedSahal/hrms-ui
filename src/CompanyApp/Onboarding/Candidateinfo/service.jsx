
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/candidateInfo";

export function getcandidateinfoList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
 
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}



export function saveCandidateInfo(CandidateInfoForm) {
    let post = CandidateInfoForm.id == 0 ? postWithAuth(servicePath, CandidateInfoForm,true)
        : putWithAuth(`${servicePath}?id=${CandidateInfoForm.id}`, CandidateInfoForm,true); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}


export function updateStatus(id, status,password,comments,docVerify,email) {
    let path = servicePath + "?id=" + encodeURIComponent(id) + "&status=" + status + "&password=" + password + "&comments=" + comments+ "&docVerify=" + docVerify+ "&email=" + email;   
    return patchWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}  


 
  