
import { getPaginationQueryString } from '../../utility';
import { deleteWithAuth, getWithAuth, getWithAuthDashboard, patchWithAuth, postWithAuth, putWithAuth } from '../../HttpRequest';

const servicePath = "/recognitionMain";

export function getRecognitionList(searchText, pageNumber, pageSize, sort,Receive,Given) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    path+='&Receive='+Receive + '&Given='+Given; 
    return getWithAuthDashboard(path).then(res => { 
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}



export function saveRecognition(RecognitionMain) {
    let post = RecognitionMain.id == 0 ? postWithAuth(servicePath, RecognitionMain)
        : putWithAuth(`${servicePath}?id=${RecognitionMain.id}`, RecognitionMain); 
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({err})
        return Promise.reject(err);
    });
}

 


 
  