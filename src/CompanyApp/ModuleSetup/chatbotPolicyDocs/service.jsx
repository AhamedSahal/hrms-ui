
import { getPaginationQueryString } from '../../../utility';
import { deleteWithAuth, getWithAuthDashboard, postWithAuth, putWithAuth } from '../../../HttpRequest';

const servicePath = "/chatbot-document";

export function getChatbotDocs(searchText, pageNumber, pageSize, sort) {
    let path = `${servicePath}?${getPaginationQueryString(searchText, pageNumber, pageSize, sort)}`;
    return getWithAuthDashboard(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}

export function saveChatbotDocs(chatbotDocument) {
    let post = chatbotDocument.id == 0 ? postWithAuth(servicePath, chatbotDocument, true)
        : putWithAuth(`${servicePath}?id=${chatbotDocument.id}`, chatbotDocument, true);
    return post.then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        console.log({ err })
        return Promise.reject(err);
    });
}
export function deleteChatbotDocs(chatbotDocumentId) {
    let path = servicePath + "?id=" + encodeURIComponent(chatbotDocumentId);
    return deleteWithAuth(path).then(res => {
        return Promise.resolve(res.data);
    }).catch(err => {
        return Promise.reject(err);
    });
}