
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, patchWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/offerLetter";

export function getOfferLetterList(searchText, pageNumber, pageSize, sort,status,requisitionprocess) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`; 
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveOfferLetterNotification(offerletter) { 
   let path = `${servicePath}/offerNotification`
    let post = postWithAuth(path, offerletter) 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

export function saveOfferLetter(offerletter) { 
   
    let post = offerletter.id == 0 ? postWithAuth(servicePath, offerletter)
     : putWithAuth(`${servicePath}?id=${offerletter.id}`, offerletter);   
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}
  