import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/candidateinfoexternal";


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