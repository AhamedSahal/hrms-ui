
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/recognition";

export function getRecognitionSetupList(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveRecognition(recognition) {
    let post = recognition.id == 0 ? postWithAuth(servicePath, recognition, true)
        : putWithAuth(`${servicePath}?id=${recognition.id}`, recognition, true);
    console.log(post);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function deleteRecognition(recognitionId) {
    let path = servicePath + "?id=" + encodeURIComponent(recognitionId);
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}